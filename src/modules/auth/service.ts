import { ILoginRequestInterface } from './interfaces/login-request.interface';
import UserSchema from '../users/schema';
import TokenService from './tokens.service';
import bcrypt from "bcrypt"

export default class AuthService {

    private tokenService: TokenService

    constructor() {
        this.tokenService = new TokenService()
    }

    async login(loginData: ILoginRequestInterface) {


        const user = await UserSchema.findOne({ email: loginData.email })

        if (!user) {
            return {
                data: null,
                error: true,
                message: "Usuário não Encontrado na Base de Dados"
            }
        }

        const verifyPassword = await bcrypt.compare(loginData.password, user.password ?? "")

        if (!verifyPassword) {
            return {
                data: null,
                error: true,
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
                message: "Erro ao Gerar Tokens de Autenticação"
            }
        }

        const today = new Date();
        const toHour = (Number(process.env.TOKEN_EXPIRATION) / 3600)
        const validDate = new Date(today.getTime());
        validDate.setHours(validDate.getHours() + toHour);

        return {
            data: {
                user: user,
                status: 'Logged in',
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                valid_at: validDate
            },
            error: true,
            message: "Usuário Logado com Sucesso!"

        }

    }
}