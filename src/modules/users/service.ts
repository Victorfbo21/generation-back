import { IUpdateImageInterface } from './Interfaces/update-image.interface';
import CreateUserInterface from "./Interfaces/create-user.interface";
import UserRepository from "./repository";
import UserSchema from "./schema"
import encodePassword from "../../infra/utils/encodePassword";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
import PasswordRecoveryRepository from "../password-recovery/repository";
import { IPromiseInterface } from "./Interfaces/promises.interface";
import GoogleDriveService from '../../infra/providers/uploads/google-drive/service';
import { IUpdatePasswordInterface } from './Interfaces/update-password.interface';
import bcrypt from "bcrypt"
import { AppResponse } from '../../infra/http/httpresponse/appResponse';
import { IUser } from './Interfaces/user.interface';
import PasswordRecoveryService from '../password-recovery/service';
import { ICreateWorkerInterface } from "./Interfaces/create-worker.interface"
export default class UserService {

    private userRepository: UserRepository
    private passwordRecoveryRepository: PasswordRecoveryRepository
    private passwordRecoveryService: PasswordRecoveryService
    private googleDriveService: GoogleDriveService
    private allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

    constructor() {
        this.userRepository = new UserRepository();
        this.passwordRecoveryRepository = new PasswordRecoveryRepository()
        this.googleDriveService = new GoogleDriveService()
        this.passwordRecoveryService = new PasswordRecoveryService()
    }

    async me(user: { type: string, id: string }) {

        const findedUser = await this.userRepository.getUserById(user.id)

        if (!findedUser) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: 'Erro ao Encontrar Usuário'
            })
        }

        return new AppResponse({
            data: {
                user: findedUser
            },
            error: false,
            statusCode: 200,
            message: 'Usuário Encontrado com Sucesso!'
        })
    }

    async createUser(user: CreateUserInterface) {

        const userExists = await UserSchema.findOne({ email: user.email, isDeleted: false })

        if (userExists) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Usuário Já Cadastrado"
            })
        }

        const userToCreate = {
                name: user.name,
                email: user.email,
                whatsapp: user.whatsapp,
            password: encodePassword(user.password ?? ""),
                type: user.type
        }

        const created = await this.userRepository.createUser(userToCreate)


        if (!created)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Criar Usuário"
            })

        return new AppResponse({
            data: created,
            error: false,
            statusCode: 201,
            message: "Usuário Criado com Sucesso!"
        })

    }

    async createWorker(worker: ICreateWorkerInterface) {

        const workerExists = await UserSchema.findOne(
            {
                worker: worker.email,
                isDeleted: false
            })

        if (workerExists) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Usuário Já Cadastrado"
            })
        }

        const userToCreate = {
            name: worker.name,
            email: worker.email,
            whatsapp: worker.whatsapp,
            password: encodePassword(worker.password ?? ""),
            type: worker.type
        }

        const created = await this.userRepository.createUser(userToCreate)


        if (!created)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Criar Usuário"
            })

        return new AppResponse({
            data: created,
            error: false,
            statusCode: 201,
            message: "Usuário Criado com Sucesso!"
        })

    }

    async updateUser(userId: string, payload: Partial<IUser>) {


        const updated = await this.userRepository.updateUser(payload, userId)

        if (!updated)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Falha ao Atualizar Usuário!"
            })

        return new AppResponse({
            data: updated,
            error: false,
            statusCode: 200,
            message: "Usuário atualizado com Sucesso!"
        })
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

    async getWorkersByOwner(ownerId: string) {

        const workers = await this.userRepository.getWorkersByOwner(ownerId)

        if (!workers) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Recuperar Funcionários"
            })
        }

        return new AppResponse({
            data: workers,
            error: false,
            statusCode: 200,
            message: "Funcionários Recuperados com Sucesso!"
        })
    }

    async updatePassword(updatePasswordData: IUpdatePasswordInterface) {

        const recovery = await this.passwordRecoveryRepository.getPasswordRecoveryByCode(updatePasswordData.code)

        if (!recovery)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 404,
                message: "Requisição de Recuperação Não Encontrada"
            })

        if (updatePasswordData.password != updatePasswordData.confirmPassword) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 404,
                message: "Senha e Confirmação de Senha devem ser Iguais"
            })
        }

        const user = await this.userRepository.getUserById(recovery.user_id)

        const isEqual = await bcrypt.compare(updatePasswordData.password, user?.password ?? "")

        if (isEqual)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "A nova Senha devera ser diferente da anterior"
            })

        const updatePassword = await UserSchema.findOneAndUpdate(
            { email: user?.email },
            {
                password: encodePassword(updatePasswordData?.password)
            })

        if (!updatePassword)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Atualiza Senha"
            })

        const disabledRecovery = await this.passwordRecoveryRepository.disabledRecovery(user?._id.toHexString() ?? "",
            recovery._id,
            updatePasswordData.code)

        if (!disabledRecovery)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro Ao Desabilitar Recuperação de Senha"
            })

        const sendedEmailConfirmation = await this.passwordRecoveryService.sendUpdatedConfirmation(user?.email ?? "")

        if (!sendedEmailConfirmation)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Enviar Email de Confirmação"
            })

        return new AppResponse({
            data: null,
            error: false,
            statusCode: 200,
            message: "Senha Atualizada com Sucesso"
        })
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

        const verifIsActiveRecovery = await this.passwordRecoveryRepository.getLastRecoveryByUserId(user._id)

        if (verifIsActiveRecovery)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 404,
                message: "Usuário já possui outra solicitação em processamento"
            })

        const today = new Date();
        today.setMinutes(today.getMinutes() + 40);
        const limit = today.toISOString();

        const randomCode = generateRandomCode()

        const sendEmailParams = {
            to: email,
            code: randomCode
        }


        const sendRecoveryEmail = await this.passwordRecoveryService.sendRecoveryEmail(sendEmailParams)

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
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Imagem não enviada"
            })
        }

        if (!this.allowedTypes.includes(updateData.file.mimetype))
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Tipo de Imagem não Suportado"
            })

        const uploadImageData = {
            filename: updateData.file.name,
            fileData: updateData.file
        }

        const uploadImageResponse = await this.googleDriveService.uploadFile(uploadImageData)

        if (uploadImageResponse.error) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Fazer Upload Da Imagem"
            })
        }

        const saveProfileImage = await UserSchema.findByIdAndUpdate(updateData.userId, { profile_image: uploadImageResponse.fileURL })

        if (!saveProfileImage)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Problemas Ao Salvar Imagem de Perfil"
            })

        return new AppResponse({
            data: null,
            error: false,
            statusCode: 200,
            message: "Imagem Salva com Sucesso!"
        })

    }


}

