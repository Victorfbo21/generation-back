export default interface CreateUserInterface {
    name: string,
    whatsapp?: string,
    email: string,
    password?: string,
    owner?: string,
    type: string,
    function?: string | null
}