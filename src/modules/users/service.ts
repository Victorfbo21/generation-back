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
import { IUpdatePasswordInterface } from './Interfaces/update-password.interface';
import bcrypt from "bcrypt"
import AppResponse from '../../infra/http/httpresponse/errors';

export default class UserService {

    private userRepository: UserRepository
    private resendSenderService: ResendSenderService
    private passwordRecoveryRepository: PasswordRecoveryRepository
    private googleDriveService: GoogleDriveService
    private allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

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

    async updatePassword(updatePasswordData: IUpdatePasswordInterface) {

        const recovery = await this.passwordRecoveryRepository.getPasswordRecoveryByCode(updatePasswordData.code)

        if (!recovery)
            return {
                data: null,
                error: true,
                status: 404,
                message: "Requisição de Recuperação Não Encontrada"
            }

        const user = await this.userRepository.getUserById(recovery.user_id)

        const isEqual = await bcrypt.compare(updatePasswordData.password, user?.password ?? "")

        if (isEqual)
            return {
                data: null,
                error: true,
                status: 400,
                message: "A nova Senha devera ser diferente da anterior"
            }

        const updatePassword = await UserSchema.findByIdAndUpdate(user?._id,
            {
                passaword: encodePassword(updatePasswordData.password)
            })

        if (!updatePassword)
            return {
                data: null,
                error: true,
                status: 500,
                message: "Erro ao Atualiza Senha"
            }

        const disabledRecovery = await this.passwordRecoveryRepository.disabledRecovery(user?._id.toHexString() ?? "", recovery._id, updatePasswordData.code)

        if (!disabledRecovery)
            return {
                data: null,
                error: true,
                status: 500,
                message: "Erro Ao Desabilitar Recuperação de Senha"
            }

        return {
            data: null,
            error: false,
            status: 200,
            message: "Senha Atualziada com Sucesso"
        }
    }

    async passwordRecovery(email: string): Promise<IPromiseInterface> {

        const user = await this.userRepository.getUserByEmail(email)

        if (!user)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Usuário não encontrado na base de dados"
            })

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
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Enviar Email de Recuperação"
            }) 
        const recoveryData = {
            user_id: user._id,
            recovery_code: randomCode,
            active: true,
            valid_at: limit
        }

        const recovery = await this.passwordRecoveryRepository.createPasswordRecovery(recoveryData)


        if (!recovery)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Gerar Recuperação de Senha"
            })

        return new AppResponse({
            data: recovery,
            error: false,
            statusCode: 200,
            message: "Recuperação Criada Com Sucesso!"
        })
    }

    async updateProfileImage(updateData: IUpdateImageInterface) {

        if (!updateData.file) {
            return {
                data: null,
                error: true,
                status: 400,
                message: "Imagem não enviada"
            }
        }

        if (!this.allowedTypes.includes(updateData.file.mimetype))
            return {
                data: null,
                error: true,
                status: 400,
                message: "Tipo de Imagem não Suportado"
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
                status: 500,
                message: "Erro ao Fazer Upload Da Imagem"
            }
        }

        const saveProfileImage = await UserSchema.findByIdAndUpdate(updateData.userId, { profile_image: uploadImageResponse.fileURL })

        if (!saveProfileImage)
            return {
                data: null,
                error: true,
                status: 500,
                message: "Problemas Ao Salvar Imagem de Perfil"
            }

        return {
            data: null,
            error: false,
            status: 200,
            message: "Imagem Salva com Sucesso!"
        }

    }


}

