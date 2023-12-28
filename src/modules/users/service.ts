import CreateUserInterface from "./Interfaces/create-user.interface";
import UserRepository from "./repository";
import UserSchema from "./schema"
import encodePassword from "../../infra/utils/encodePassword";
import ResendSenderService from "../../infra/providers/emails/resend/service";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
import PasswordRecovery from "../password-recovery/schema";
import PasswordRecoveryRepository from "../password-recovery/repository";
export default class UserService {

    private userRepository: UserRepository
    private resendSenderService: ResendSenderService
    private passwordRecoveryRepository: PasswordRecoveryRepository

    constructor() {
        this.userRepository = new UserRepository();
        this.resendSenderService = new ResendSenderService()
        this.passwordRecoveryRepository = new PasswordRecoveryRepository()
    }

    async upSert(user: CreateUserInterface) {

        const userExists = await UserSchema.findOne({ email: user.email })

        if (!userExists) {

            const userToCreate = {
                name: user.name,
                email: user.email,
                password: encodePassword(user.password),
                whatsapp: user.whatsapp,
                type: user.type
            }

            const created = await this.userRepository.createUser(userToCreate)
            if (!created)
                throw new Error("Error on Create User")

            return created
        }
        const userId = userExists?._id
        user.password = encodePassword(user.password)
        const updated = await this.userRepository.updateUser(user, userId)

        if (!updated)
            throw new Error("Error on Update User")

        return updated
    }

    async getUserById(id: string) {

        const userFound = await this.userRepository.getUserById(id)

        if (!userFound)
            throw new Error("Error Finding User")

        return userFound
    }

    async getAllUsers() {
        const users = await this.userRepository.getAllUsers()

        if (!users)
            throw new Error("Error Finding Users")


        return users
    }

    async passwordRecovery(email: string) {

        const user = await this.userRepository.getUsers(email, 0, 0)

        const today = new Date();
        today.setMinutes(today.getMinutes() + 40);
        const limit = today.toISOString();

        if (!user)
            throw new Error("Erro ao Encontrar Usuário")

        const randomCode = generateRandomCode()

        const sendEmailParams = {
            to: email,
            code: randomCode
        }

        const sendRecoveryEmail = await this.resendSenderService.sendRecoverPasswordEmail(sendEmailParams)

        if (!sendRecoveryEmail)
            throw new Error("Erro ao Enviar Email de Recuperação de Senha")

        const recoveryData = {
            user_id: user._id,
            recovery_code: randomCode,
            active: true,
            valid_at: limit
        }

        const recovery = await this.passwordRecoveryRepository.createPasswordRecovery(recoveryData)

        if (!recovery)
            throw new Error("Erro ao Criar Recuperação de Senha")

        return recovery
    }


}

