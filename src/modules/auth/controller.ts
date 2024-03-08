import { Request, Response } from "express";
import AuthService from "./service";


export default class AuthController {

    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body

        const result = await this.authService.login({ email, password })

        if (result.error)
            return res.status(result.statusCode).json(result)

        return res.status(result.statusCode).json(result)
    }

    async refrehToken() {

    }
}