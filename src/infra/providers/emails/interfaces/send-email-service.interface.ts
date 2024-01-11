

export interface ISenderEmailServiceInterface {
    sendEMail(mailData: any): Promise<boolean>
    sendRecoverPasswordEmail(params: any): Promise<any>
    sendUpdatePasswordConfirmation(to: string): Promise<boolean>
    sendUpdateEmail(params: any): Promise<any>
}