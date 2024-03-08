import { HttpResponseDto } from "./httpresponse.dto";

export class AppResponse {
    public readonly data: any
    public readonly error: boolean
    public readonly statusCode: number
    public readonly message: string

    constructor({ data, error, statusCode, message }: HttpResponseDto) {
        this.data = data,
            this.error = error,
            this.statusCode = statusCode,
            this.message = message

    }
}

