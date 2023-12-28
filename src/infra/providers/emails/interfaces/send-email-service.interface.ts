

export interface ISenderEmailService {
    sendEMail(mailData: any): Promise<any>
    sendRecoverPasswordEmail(params: any): Promise<any>
    sendUpdatePassword(params: any): Promise<any>
    sendUpdateEmail(params: any): Promise<any>
}