import { IUpdateImageInterface } from './Interfaces/update-image.interface';
import CreateUserInterface from "./Interfaces/create-user.interface";
import UserRepository from "./repository";
import UserSchema from "./schema"
import encodePassword from "../../infra/utils/encodePassword";
import ResendSenderService from "../../infra/providers/emails/resend/service";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
import PasswordRecoveryRepository from "../password-recovery/repository";
import { IPromiseInterface } from "./Interfaces/promises.interface";
import GoogleDriveService from '../../infra/providers/uploads/google-drive/service';

export default class UserService {

    private userRepository: UserRepository
    private resendSenderService: ResendSenderService
    private passwordRecoveryRepository: PasswordRecoveryRepository
    private googleDriveService: GoogleDriveService

    constructor() {
        this.userRepository = new UserRepository();
        this.resendSenderService = new ResendSenderService()
        this.passwordRecoveryRepository = new PasswordRecoveryRepository()
        this.googleDriveService = new GoogleDriveService()
    }

    async upSert(user: CreateUserInterface) {

        const userExists = await UserSchema.findOne({ email: user.email })

        if (!userExists) {

            const isWorker = user.type === 'worker'

            const commonData = {
                name: user.name,
                email: user.email,
                password: encodePassword(user.password),
                whatsapp: user.whatsapp,
                type: user.type
            }

            let userToCreate

            isWorker ? userToCreate = { ...commonData, function: user.function } : userToCreate = { ...commonData }

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

    async passwordRecovery(email: string): Promise<IPromiseInterface> {

        const user = await this.userRepository.getUserByEmail(email)

        if (!user)
            return {
                data: null,
                error: true,
                message: "Usuário não encontrado na base de dados"
            }

        const today = new Date();
        today.setMinutes(today.getMinutes() + 40);
        const limit = today.toISOString();

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

        return {
            data: recovery,
            error: false,
            message: "Recuperação Criada Com Sucesso!"
        }
    }

    async updateProfileImage(updateData: IUpdateImageInterface) {

        if (!updateData.file) {
            return {
                data: null,
                error: true,
                message: "Imagem não enviada"
            }
        }

        const uploadImageData = {
            filename: updateData.file.name,
            fileData: updateData.file
        }

        const uploadImageResponse = await this.googleDriveService.uploadFile(uploadImageData)

        if (uploadImageResponse.error) {
            return {
                data: null,
                error: true,
                message: "Erro ao Fazer Upload Da Imagem"
            }
        }

        const saveProfileImage = await UserSchema.findByIdAndUpdate(updateData.userId, { profile_image: uploadImageResponse.fileURL })

        if (!saveProfileImage)
            return {
                data: null,
                error: true,
                message: "Problemas Ao Salvar Imagem de Perfil"
            }

        return {
            data: null,
            error: false,
            message: "Imagem Salva com Sucesso!"
        }

    }


}

