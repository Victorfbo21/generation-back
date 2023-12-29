import { Request, Response } from "express"
import UsersService from "./service"

class UsersController {
    private usersService: UsersService

    constructor() {
        this.usersService = new UsersService()
    }

    async upSert(req: any, res: Response) {

        const { body } = req

        const result = await this.usersService.upSert(body)

        if (!result)
            res.status(500).json({ message: "Error on create or update user" })

        res.status(200).json(result)
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

        if (result.error)
            return res.status(404).json(result)

        return res.status(200).json(result)
    }

    async updatePassword(req: Request, res: Response) {
        const { password, code } = req.body
    }

    async updateProfileImage(req: any, res: Response) {
        const { user, files } = req

        const updateData = {
            userId: user.id,
            file: files?.profile
        }

        const result = await this.usersService.updateProfileImage(updateData)

        if (result.error) {
            return res.status(500).json(result)
        }

        return res.status(200).json(result)

    }
}

export { UsersController }