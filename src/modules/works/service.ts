import { ICreateWorkInterface } from "./interfaces/create-works.interface";
import WorksSchema from "./schema";

export default class WorksService {

    constructor() {

    }

    async createWork(createWorkData: ICreateWorkInterface) {
        const work = await WorksSchema.findOne({ workName: createWorkData.workName })

        //TODO 
    }

    async updateWork() {

    }

    async disabledWork() {

    }

}