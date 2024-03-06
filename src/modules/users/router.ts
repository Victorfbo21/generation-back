import { Router } from "express"
import { UsersController } from "./controller"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import { Request, Response } from "express";

const UsersRouter = Router();

const usersController = new UsersController();

UsersRouter.get('/workers', authMiddleware, (req, res) => {
    return usersController.workersByowner(req, res)
})

UsersRouter.post('/create', (req, res) => {
    return usersController.createUser(req, res)
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

UsersRouter.put('/upload-images', authMiddleware, (req: Request, res: Response) => {
    return usersController.updatePDFs(req, res)
})


UsersRouter.get('/me', authMiddleware, (req, res) => {
    return usersController.me(req, res)
})

export default UsersRouter;