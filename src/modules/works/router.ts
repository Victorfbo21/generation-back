import { Router } from "express"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import { Request, Response } from "express";
import WorksController from "./controller";

const WorkRouter = Router();

const worksController = new WorksController();

WorkRouter.post('/create', authMiddleware, (req: Request, res: Response) => {
    return worksController.createWork(req, res)
})

WorkRouter.patch('/update', authMiddleware, (req: Request, res: Response) => {
    return worksController.updateWork(req, res)
})

WorkRouter.patch('/disable', authMiddleware, (req: Request, res: Response) => {
    return worksController.disableWork(req, res)
})

export default WorkRouter;