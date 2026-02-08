import { defaultUnexpectedError } from "../decorators/defaultUnexpectedError";
import { Storage } from "../storage";
import { UserCollection } from "../storage/types/user";
import { ApiResponse, CustomRequest } from "../request";

class UserController {
  
  @defaultUnexpectedError("Cannot get profile")
  async getProfile(req: CustomRequest): Promise<ApiResponse<Partial<UserCollection>>> {
    const userId = req.userId!;

    const user = await Storage.instance.user.getById(userId);
    if (!user) {
      return { status: 'failed', message: 'User not found' };
    }

    return {
      status: 'ok',
      data: {
        id: user.id,
        username: user.username,
      },
    };
  }
}

export const userControllerInstance = new UserController();
