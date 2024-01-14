import { Router } from "express"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import { Request, Response } from "express";
import WorksController from "./controller";

const UsersRouter = Router();

const worksController = new WorksController();

UsersRouter.post('/create', (req: Request, res: Response) => {
    return worksController.createWork(req, res)
})

export default UsersRouter;