import { Router } from "express"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import { Request, Response } from "express";
import WorksController from "./controller";

const WorkRouter = Router();

const worksController = new WorksController();



WorkRouter.get('/active', authMiddleware, (req: Request, res: Response) => {
    return worksController.getActiveWork(req, res)
})

WorkRouter.get('/isSale', authMiddleware, (req: Request, res: Response) => {
    return worksController.getActiveWork(req, res)
})

WorkRouter.post('/create', authMiddleware, (req: Request, res: Response) => {
    return worksController.createWork(req, res)
})

WorkRouter.post('/sale', authMiddleware, (req: Request, res: Response) => {
    return worksController.turnIsSale(req, res)
})

WorkRouter.patch('/update', authMiddleware, (req: Request, res: Response) => {
    return worksController.updateWork(req, res)
})

WorkRouter.patch('/disable', authMiddleware, (req: Request, res: Response) => {
    return worksController.disableWork(req, res)
})

WorkRouter.post('/delete', authMiddleware, (req: Request, res: Response) => {
    return worksController.deleteWork(req, res)
})

WorkRouter.put('/create/csv', (req: Request, res: Response) => {
    return worksController.uploadWorksCSV(req, res)
})

export default WorkRouter;