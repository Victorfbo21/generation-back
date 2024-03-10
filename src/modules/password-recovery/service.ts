import NodeMailerSenderService from "../../infra/providers/emails/nodemailer/service";
import ResendSenderService from "../../infra/providers/emails/resend/service"
import { ISendRecoveryEmail } from "./interfaces/send-recovery-email.interface";



export default class PasswordRecoveryService {

    private resendSenderService: ResendSenderService
    private nodemailerSenderService: NodeMailerSenderService


    constructor() {
        this.resendSenderService = new ResendSenderService();
        this.nodemailerSenderService = new NodeMailerSenderService()
    }



    async sendRecoveryEmail(sendEmailParams: ISendRecoveryEmail) {

        const sendRecoveryEmailResend = await this.resendSenderService.sendRecoverPasswordEmail(sendEmailParams)

        if (!sendRecoveryEmailResend) {
            const sendRecoveryEmailNodemailer = await this.nodemailerSenderService.sendRecoverPasswordEmail(sendEmailParams)
            if (!sendRecoveryEmailNodemailer) {
                return false
            }
            return true
        }
        return true
    }

    async sendUpdatedConfirmation(to: string) {
        const sendRecoveryEmailResend = await this.resendSenderService.sendUpdatePasswordConfirmation(to)


        if (!sendRecoveryEmailResend) {
            const sendRecoveryEmailNodemailer = await this.nodemailerSenderService.sendUpdatePasswordConfirmation(to)

            if (!sendRecoveryEmailNodemailer) {
                return false
            }
        }
        return true
    }


}