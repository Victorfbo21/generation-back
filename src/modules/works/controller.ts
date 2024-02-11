import { Request, Response } from "express";
import WorksService from "./service";

export default class WorksController {

    private worksService: WorksService

    constructor() {
        this.worksService = new WorksService()
    }

    async getActiveWork(req: any, res: Response) {

        const { user } = req
        const result = await this.worksService.getActiveWorks(user.id)

        return res.status(result.statusCode).json(result)
    }

    async getisSaleWorks(req: any, res: Response) {

        const { user } = req
        const result = await this.worksService.getIsSaleWorks(user.id)

        return res.status(result.statusCode).json(result)
    }

    async createWork(req: any, res: Response) {
        const { workName, workPrice, category } = req.body
        const { user } = req

        const data = {
            workName: workName,
            workPrice: workPrice,
            category: category,
            owner: user.id
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

    async turnIsSale(req: Request, res: Response) {

        const { workId, salePrice } = req.body

        const result = await this.worksService.turnIsSaleWork(workId, salePrice)

        return res.status(result.statusCode).json(result)
    }

    async disableWork(req: any, res: Response) {
        const { workId } = req.body
        const { user } = req
        const data = {
            workId,
            owner: user.id
        }
        const result = await this.worksService.disabledWork(data)

        return res.status(result.statusCode).json(result)
    }

    async deleteWork(req: Request, res: Response) {
        const { workId } = req.body

        const result = await this.worksService.deleteWork(workId)

        return res.status(result.statusCode).json(result)
    }
}