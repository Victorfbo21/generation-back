import { ITokenRequestInterface } from './interfaces/token-request.interface';
import jwt, { Secret } from 'jsonwebtoken'

export default class TokenService {

    private secret: Secret;
    private tokenLife: string | undefined
    private refreshTokenLife: string | undefined

    constructor() {
        this.secret = process.env.TOKEN_APP_SECRET || ""
        this.tokenLife = process.env.TOKEN_EXPIRATION
        this.refreshTokenLife = process.env.TOKEN_EXPIRATION
    }

    async getToken(tokenData: ITokenRequestInterface) {

        const accessToken = jwt.sign(tokenData, this.secret, { expiresIn: this.tokenLife })

        const refreshToken = jwt.sign(tokenData, this.secret, { expiresIn: this.refreshTokenLife })

        return {
            accessToken,
            refreshToken
        }
    }


}