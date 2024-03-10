import { ISendRecoveryPasswordEmail } from "../interfaces/recovery-password-email.interface";
import { ISenderEmailServiceInterface } from "../interfaces/send-email-service.interface";
import { transport } from "./index";
import * as  path from 'path'
import * as  pug from 'pug'


export default class NodeMailerSenderService implements ISenderEmailServiceInterface {

    private fromAddress: String

    constructor() {
        this.fromAddress = `${process.env.EMAIL_FROM_ADDRESS}`
    }

    async sendEMail(mailData: any): Promise<boolean> {
        try {
            const message = {
                from: this.fromAddress,
                subject: mailData.subject,
                to: mailData.to,
                html: mailData.body,
            }
            const result = await transport.sendMail(message)
            if (!result)
                return false

            return true
        }
        catch (err) {
            return false
        }
    }
    async sendRecoverPasswordEmail(params: ISendRecoveryPasswordEmail): Promise<boolean> {
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
                body: compiledFunction({ code: params.code }),
            };
            return this.sendEMail(mailData);
        } catch (error) {
            console.error('Mailchimp error:', error);
            return false;
        }
    }
    async sendUpdatePasswordConfirmation(to: string): Promise<boolean> {
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
            return false
        }
        catch (err) {
            return false
        }
    }
    sendUpdateEmail(params: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}