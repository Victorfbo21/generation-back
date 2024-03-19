import WorksSchema from "./schema";
import { IWorkInterface } from "./interfaces/work.interface";
import { IDisableWorkInterface } from "./interfaces/disable-work.interface";
import { IActiveWorkInterface } from "./interfaces/active-work.interface";
export default class WorkRepository {


    async getActiveWorks(owner: string) {
        try {
            const activedWors = await WorksSchema.find({
                $and: [{
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

    async getDisablesWorks() {
        try {
            const works = await WorksSchema.find({
                isActive: false
            })

            return works
        }
        catch (error) {
            return null
        }
    }

    async getIsSaleWorks(ownerId: string) {
        try {
            const works = await WorksSchema.find({
                $and: [{
                    owner: ownerId,
                    isActive: false
                }]
            })

            return works
        }
        catch (error) {
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
            const disabledWork = await WorksSchema.findByIdAndUpdate(disableData.toDisableId,
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

    async activeWork(activeData: IActiveWorkInterface): Promise<boolean> {
        try {
            await WorksSchema.findByIdAndUpdate(activeData.toActiveId,
                {
                    $set: {
                        isActive: true,
                    },
                    $unset: { disableBy: '' }
                }, { new: true })

            return true
        }
        catch (err) {
            return false
        }
    }

    async activeWorks(workId: string): Promise<boolean> {
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