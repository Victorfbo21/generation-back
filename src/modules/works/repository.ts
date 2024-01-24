import WorksSchema from "./schema";
import { IWorkInterface } from "./interfaces/work.interface";
export default class WorkRepository {


    async updateWork(workId: string, payload: Partial<IWorkInterface>) {
        try {
            const workUpdated = await WorksSchema.findByIdAndUpdate(workId,
                {
                    $set: payload
                }, { new: true })

            return true
        }
        catch (err) {
            return false
        }
    }

    async disableWork(workId: string): Promise<boolean> {
        try {
            const disabledWork = await WorksSchema.findByIdAndUpdate(workId,
                {
                    $set: {
                        isActive: false
                    }
                }, { new: true })

            return true
        }
        catch (err) {
            return false
        }
    }

    async activeWork(workId: string): Promise<boolean> {
        try {
            const workActived = await WorksSchema.findByIdAndUpdate(workId,
                {
                    $set: {
                        isActive: true
                    }
                })

            return true
        }
        catch (err) {
            return false
        }
    }
}