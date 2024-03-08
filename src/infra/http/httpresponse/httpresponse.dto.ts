export interface HttpResponseDto {
    message: string;
    statusCode: number;
    data: any;
    error: boolean;
}