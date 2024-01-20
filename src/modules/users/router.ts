import { Router } from "express"
import { UsersController } from "./controller"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import { Request, Response } from "express";

const UsersRouter = Router();

const usersController = new UsersController();

UsersRouter.post('/create', (req, res) => {
    return usersController.upSert(req, res)
})
UsersRouter.put('/update', authMiddleware, (req, res) => {
    return usersController.updateUser(req, res)
})

UsersRouter.post('/passsword-recovery', (req, res) => {
    return usersController.recoveryPassword(req, res)
})

UsersRouter.post('/update-password', (req: Request, res: Response) => {
    return usersController.updatePassword(req, res)
})

UsersRouter.put('/profile-image', authMiddleware, (req: Request, res: Response) => {
    return usersController.updateProfileImage(req, res)
})

UsersRouter.get('/:id', authMiddleware, (req, res) => {
    return usersController.getUserById(req, res)
})

export default UsersRouter;