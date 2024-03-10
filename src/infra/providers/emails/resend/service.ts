import { ISenderEmailServiceInterface } from "../interfaces/send-email-service.interface";
import { ISendRecoveryPasswordEmail } from "../interfaces/recovery-password-email.interface";
import pug from 'pug'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()
import ISendEmailInterface from "../interfaces/send-email.interface";
import { Resend } from "resend";

export default class ResendSenderService implements ISenderEmailServiceInterface {

    private fromAddress: string
    private resend: Resend

    constructor() {
        this.fromAddress = `${process.env.EMAIL_FROM_ADDRESS}`
        this.resend = new Resend(process.env.RESEND_API_KEY)
    }

    async sendEMail(mailData: ISendEmailInterface): Promise<any> {
        try {

            const message = {
                from: this.fromAddress,
                to: mailData.to,
                subject: mailData.subject,
                html: mailData.body
            }

            const { error } = await this.resend.emails.send(message)

            if (error) {
                return false
            }

            return true
        }
        catch (err) {
            return false
        }
    }
    async sendRecoverPasswordEmail(params: ISendRecoveryPasswordEmail): Promise<any> {
        try {
            const templatePath = path.resolve(path.dirname(__dirname),
                "..",
                "..",
                "templates",
                "recover-password.pug"
            );

            const compiledFunction = pug.compileFile(templatePath);


            const mailData = {
                to: params.to,
                subject: 'Recuperação de Senha',
                body: compiledFunction({ code: params.code })
            }

            return this.sendEMail(mailData)
        }
        catch (err) {
            return false
        }
    }
    async sendUpdatePasswordConfirmation(to: string): Promise<any> {
        try {
            const templatePath = path.resolve(path.dirname(__dirname),
                "..",
                "..",
                "templates",
                "update-password-confirmation.pug"
            );

            const compiledFunction = pug.compileFile(templatePath);


            const mailData = {
                to,
                subject: 'Confirmação de Atualização',
                body: compiledFunction()
            }

            return this.sendEMail(mailData)
        }
        catch (err) {
            return false
        }
    }
    async sendUpdateEmail(params: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}