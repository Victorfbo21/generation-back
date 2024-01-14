import { Request, Response } from "express";
import WorksService from "./service";

export default class WorksController {

    private worksService: WorksService

    constructor() {
        this.worksService = new WorksService()
    }

    async createWork(req: any, res: Response) {
        const { user } = req
        const { workName, workPrice } = req.body

        const data = {
            user: user,
            workName: workName,
            workPrice: workPrice
        }

        const result = await this.worksService.createWork(data)


    }
}