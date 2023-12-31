import { ILoginRequestDto } from './interfaces/login-request.interface';
import UserSchema from '../users/schema';
import TokenService from './tokens.service';
import bcrypt from "bcrypt"

export default class AuthService {

    private tokenService: TokenService

    constructor() {
        this.tokenService = new TokenService()
    }

    async login(loginData: ILoginRequestDto) {


        const user = await UserSchema.findOne({ email: loginData.email })

        if (!user) {
            return {
                data: null,
                error: true,
                status: 401,
                message: "Usuário não Encontrado na Base de Dados"
            }
        }

        if (user.isDeleted) {
            return {
                data: null,
                error: true,
                status: 401,
                message: "Usuário Já Deletado"
            }
        }

        const verifyPassword = await bcrypt.compare(loginData.password, user.password ?? "")

        if (!verifyPassword) {
            return {
                data: null,
                error: true,
                status: 401,
                message: "Senha Inválida"
            }
        }

        const tokenData = {
            userId: user._id.valueOf(),
            type: user.type
        }

        const tokens = await this.tokenService.getToken(tokenData)

        if (!tokens) {
            return {
                data: null,
                error: true,
                status: 500,
                message: "Erro ao Gerar Tokens de Autenticação"
            }
        }

        const today = new Date();
        const toHour = (Number(process.env.TOKEN_EXPIRATION) / 3600)
        const validDate = new Date(today.getTime());
        validDate.setHours(validDate.getHours() + toHour);

        const userToReturn = {
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            type: user.type,
            isDeleted: user.type,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            function: user.function,
            profile_image: user.profile_image
        }

        return {
            data: {
                user: userToReturn,
                status: 'Logged in',
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                valid_at: validDate
            },
            error: false,
            status: 201,
            message: "Usuário Logado com Sucesso!"

        }

    }
}