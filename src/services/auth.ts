import { LoginRequestData, RegisterRequestData } from "../types/auth";
import { Storage, UserCollection } from "../storage";
import bcryptjs from 'bcryptjs';
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { env } from "..";

export class AuthService {
    static async register(data: RegisterRequestData) {
        const findExists = await Storage.instance.user.getOneByFilter({
            username: data.username
        })

        if (findExists) return {
            status: 'failed',
            message: 'User already exists'
        }

        const hashPassword = bcryptjs.hashSync(data.password, 7);
        const userId = v4();
        const now = Date.now();

        const newUser: UserCollection = {
            id: userId,
            username: data.username,
            passwordHash: hashPassword,
            createdAt: now,
            updatedAt: now,
            lastActivityAt: now,
        };

        await Storage.instance.user.addOrUpdate(newUser);

        const token = this.generateJwt(userId)

        return {
            status: 'ok',
            message: 'ok',
            token: token
        }
    }

    static async login(data: LoginRequestData) {
        const findExists = await Storage.instance.user.getOneByFilter({
            username: data.username
        })

        if (!findExists) return {
            status: 'failed',
            message: 'User not found'
        }

        const isPasswordValid = bcryptjs.compareSync(data.password, findExists.passwordHash)
        if (!isPasswordValid) return {
            status: 'failed',
            message: 'Invalid password'
        }

        const token = this.generateJwt(findExists.id)
        return {
            status: 'ok',
            message: 'ok',
            token: token
        }
    }

    static generateJwt(id: string) {
        const payload = { id }
        return jwt.sign(payload, env.SECRET, { expiresIn: "24Days" })
    }
}