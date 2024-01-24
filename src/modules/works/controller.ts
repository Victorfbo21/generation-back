import { Request, Response } from "express";
import WorksService from "./service";

export default class WorksController {

    private worksService: WorksService

    constructor() {
        this.worksService = new WorksService()
    }

    async createWork(req: any, res: Response) {
        const { workName, workPrice, category } = req.body

        const data = {
            workName: workName,
            workPrice: workPrice,
            category: category
        }

        const result = await this.worksService.createWork(data)

        return res.status(result.statusCode).json(result)
    }

    async updateWork(req: any, res: Response) {
        const { payload, workId } = req.body

        const data = {
            payload,
            workId
        }

        const result = await this.worksService.updateWork(data)

        return res.status(result.statusCode).json(result)
    }

    async disableWork(req: Request, res: Response) {
        const { workId } = req.body

        const result = await this.worksService.disabledWork(workId)

        return res.status(result.statusCode).json(result)
    }

    async activeWork(req: Request, res: Response) {

    }

    async deleteWork(req: Request, res: Response) {
        const { workId } = req.body

        const result = await this.worksService.deleteWork(workId)

        return res.status(result.statusCode).json(result)
    }
}