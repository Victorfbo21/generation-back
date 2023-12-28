import PasswordRecovery from "./schema";

export default class PasswordRecoveryRepository {

    constructor() {
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

    async disabledRecovery(userId: string) {
        try {
            const result = await PasswordRecovery.findOneAndUpdate({
                user_id: userId
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