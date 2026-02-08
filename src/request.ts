import { Request } from "express";

export type ApiResponse<T = unknown> = {
    status: 'ok' | 'failed';
    message?: string;
    data?: T;
};

export interface CustomRequest extends Request {
    userId?: string;
}