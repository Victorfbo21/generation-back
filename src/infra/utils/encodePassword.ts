import bcrypt from 'bcrypt'

const encodePassword = (password: string) => {
    const hashpassword = bcrypt.hashSync(password, 8)
    return hashpassword
}

export default encodePassword