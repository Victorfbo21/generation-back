import { Request, Response } from "express"
import UsersService from "./service"

class UsersController {
    private usersService: UsersService

    constructor() {
        this.usersService = new UsersService()
    }

    async me(req: any, res: Response) {
        const { user } = req

        const result = await this.usersService.me(user)

        return res.status(result.statusCode).json(result)

    }

    async workersByowner(req: any, res: Response) {
        const { user } = req

        const result = await this.usersService.getWorkersByOwner(user.id)

        return res.status(result.statusCode).json(result)
    }

    async createUser(req: any, res: Response) {

        const { body } = req

        const result = await this.usersService.createUser(body)

        return res.status(result.statusCode).json(result)
    }

    async updateUser(req: any, res: Response) {
        const { user } = req
        const { payload } = req.body

        const result = await this.usersService.updateUser(user.id, payload)

        return res.status(result.statusCode).json(result)
    }

    async getUserById(req: Request, res: Response) {

        const { id } = req.params

        const result = await this.usersService.getUserById(id)

        if (!result)
            res.status(500).json({ message: "Error Finding User" })

        res.status(200).json(result)
    }

    async recoveryPassword(req: any, res: Response) {
        const { email } = req.body

        const result = await this.usersService.passwordRecovery(email)

        return res.status(result.statusCode).json(result)
    }

    async updatePassword(req: any, res: Response) {
        const { password, code, confirmPassword, email } = req.body

        const updatePasswordData = {
            password: password,
            confirmPassword: confirmPassword,
            email: email,
            code: code
        }

        const result = await this.usersService.updatePassword(updatePasswordData)

        return res.status(result.statusCode).json(result)

    }

    async updateProfileImage(req: any, res: Response) {
        const { user, files } = req

        const updateData = {
            userId: user.id,
        }

        const filter = Array.isArray(files.profile) ? { ...updateData, file: files.profile } : { ...updateData, file: [files.profile] }

        const result = await this.usersService.updateProfileImage(filter)

        return res.status(result.statusCode).json(result)
    }

    async updatePDFs(req: any, res: Response) {
        const { user, files } = req

        const updateData = {
            userId: user.id,
        }

        const filter = Array.isArray(files.images) ? { ...updateData, file: files.images } : { ...updateData, file: [files.images] }

        const result = await this.usersService.updatePDFs(filter)

        return res.status(result.statusCode).json(result)
    }
}

export { UsersController }