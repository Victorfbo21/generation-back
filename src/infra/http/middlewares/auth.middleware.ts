
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserTypeEnum } from "../../../modules/users/Interfaces/user-type.enum";
import UserService from "../../../modules/users/service";
import { JwtPayload } from "jsonwebtoken";

const userService = new UserService();

async function authMiddleware(
    request: any,
    response: Response,
    next: NextFunction
): Promise<any> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        response.status(401).json({ message: "Token missing" })
    }

    const [, token] = authHeader?.split(" ");

    try {
        const decoded = jwt.verify(token as string, process.env.TOKEN_APP_SECRET ?? "")

        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            return response.status(401).json({
                error: true,
                code: "token.invalid",
                message: "Invalid token format or missing userId.",
            });
        }

        const userId = decoded.userId

        const user = await userService.getUserById(userId);

        if (user.type === UserTypeEnum.owner) {
            return {
                message: "Forbidden",
                status: 403
            }
        }

        request.user = {
            id: user.id,
            type: user.type
        };

        return next();
    } catch (err) {
        return response
            .status(401)
            .json({ error: true, code: "token.expired", message: "Token invalid." });
    }
}

export { authMiddleware };

