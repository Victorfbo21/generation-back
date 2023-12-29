
export interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    profile_imagem: string,
    whatsapp: string,
    type: string,
    function?: string,
    isDeleted: boolean
}