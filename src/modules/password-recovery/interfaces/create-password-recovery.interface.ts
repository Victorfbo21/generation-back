export interface ICreatePasswordRecovery {
    user_id: string
    recovery_code: string,
    active: boolean,
    valid_at: string
}