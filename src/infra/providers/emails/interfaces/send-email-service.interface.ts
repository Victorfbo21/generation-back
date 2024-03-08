

export interface ISenderEmailServiceInterface {
    sendEMail(mailData: any): Promise<boolean>
    sendRecoverPasswordEmail(params: any): Promise<boolean>
    sendUpdatePasswordConfirmation(to: string): Promise<boolean>
    sendUpdateEmail(params: any): Promise<boolean>
}