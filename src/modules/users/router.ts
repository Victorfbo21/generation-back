import { Router } from "express"
import { UsersController } from "./controller"

const UsersRouter = Router();

const usersController = new UsersController();

UsersRouter.post('/create', (req, res) => {
    return usersController.upSert(req, res)
})
UsersRouter.put('/update', (req, res) => {
    return usersController.upSert(req, res)
})
UsersRouter.get('/:id', (req, res) => {
    return usersController.getUserById(req, res)
})

export default UsersRouter;