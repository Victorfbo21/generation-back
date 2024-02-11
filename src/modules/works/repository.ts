import WorksSchema from "./schema";
import { IWorkInterface } from "./interfaces/work.interface";
import { IDisableWorkInterface } from "./interfaces/disable-work.interface";
export default class WorkRepository {


    async getActiveWorks(owner: string) {
        try {
            const activedWors = await WorksSchema.find({
                $and: [{
                    isActive: true,
                    isDeleted: false,
                    owner: owner
                }]
            })

            return activedWors
        }
        catch (err) {
            return null
        }
    }

    async getIsSaleWorks(owner: string) {
        try {
            const promotionWorks = await WorksSchema.find({
                $and: [{
                    isActive: true,
                    isDeleted: false,
                    owner: owner,
                    isSale: true
                }]
            })

            return promotionWorks
        }
        catch (err) {
            console.error(err)
            return null
        }
    }

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

    async disableWork(disableData: IDisableWorkInterface): Promise<boolean> {
        try {
            const disabledWork = await WorksSchema.findByIdAndUpdate(disableData.workId,
                {
                    $set: {
                        isActive: false,
                        disableBy: disableData.owner
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