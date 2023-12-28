import { Router } from "express"
import { UsersController } from "./controller"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";

const UsersRouter = Router();

const usersController = new UsersController();

UsersRouter.post('/create', (req, res) => {
    return usersController.upSert(req, res)
})
UsersRouter.put('/update', (req, res) => {
    return usersController.upSert(req, res)
})

UsersRouter.post('/passsword-recovery', (req, res) => {
    return usersController.recoveryPassword(req, res)
})

UsersRouter.get('/:id', authMiddleware, (req, res) => {
    return usersController.getUserById(req, res)
})

export default UsersRouter;