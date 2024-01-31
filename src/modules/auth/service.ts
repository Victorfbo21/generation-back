import { ILoginRequestDto } from './interfaces/login-request.interface';
import UserSchema from '../users/schema';
import TokenService from './tokens.service';
import bcrypt from "bcrypt"
import AppResponse from '../../infra/http/httpresponse/appresponse';

export default class AuthService {

    private tokenService: TokenService

    constructor() {
        this.tokenService = new TokenService()
    }

    async login(loginData: ILoginRequestDto) {


        const user = await UserSchema.findOne({ email: loginData.email })

        if (!user) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Usuário não Encontrado na Base de Dados"
            })

        }

        if (user.isDeleted) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 401,
                message: "Usuário Já Deletado"
            })
        }

        const verifyPassword = await bcrypt.compare(loginData.password, user.password ?? "")

        if (!verifyPassword) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 401,
                message: "Senha Inválida"
            })
        }

        const tokenData = {
            userId: user._id.valueOf(),
            type: user.type
        }

        const tokens = await this.tokenService.getToken(tokenData)

        if (!tokens) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Gerar Tokens de Autenticação"
            })

        }

        const today = new Date();
        const toHour = (Number(process.env.TOKEN_EXPIRATION) / 3600)
        const validDate = new Date(today.getTime());
        validDate.setHours(validDate.getHours() + toHour);

        const userToReturn = {
            name: user.name,
            email: user.email,
            id: user._id,
            whatsapp: user.whatsapp,
            type: user.type,
            isDeleted: user.isDeleted,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            function: user.function,
            profile_image: user.profile_image
        }

        return new AppResponse({
            data: {
                user: userToReturn,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                valid_at: validDate
            },
            error: false,
            statusCode: 200,
            message: "Usuário Logado com Sucesso!"
        })
    }
}