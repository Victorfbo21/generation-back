import { IPasswordRecoveryInterface } from './interfaces/password-recovery.interface';
import { ICreatePasswordRecovery } from './interfaces/create-password-recovery.interface';
import PasswordRecovery from "./schema";
export default class PasswordRecoveryRepository {

    constructor() {
    }


    async createPasswordRecovery(data: ICreatePasswordRecovery) {
        try {
            const created = await PasswordRecovery.create(data)

            return created
        }
        catch (err) {
            console.log(err)
            return err
        }
    }

    async getPasswordRecoveryByCode(code: string): Promise<IPasswordRecoveryInterface | any> {
        try {
            const result = await PasswordRecovery.findOne(
                {
                    recovery_code: code,
                    active: true
                })
            return result
        }
        catch (err) {
            console.log(err)
            return err
        }
    }

    async getLastRecoveryByUserId(userId: string) {
        try {
            const result = await PasswordRecovery.findOne({
                $and: [{
                    user_id: userId,
                    active: true
                }]
            })

            return result
        }
        catch (err) {
            console.log(err)
            return err
        }
    }

    async disabledRecovery(userId: string, recoveryId: string, code: string) {
        try {
            const result = await PasswordRecovery.findOneAndUpdate({
                $and: [
                    { user_id: userId },
                    { _id: recoveryId },
                    { recovery_code: code }
                ]

            }, {
                active: false
            })

            return result
        }
        catch (err) {
            console.log(err)
            return err
        }

    }

}