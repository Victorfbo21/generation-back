import axios from "axios";
import { IDownloadFileResponse, IListFilesResponse, IUploadFileParams, IUploadFileResponse, IUploadService } from "../interfaces/IUploadService.interface";

export class FileShareService implements IUploadService {
    private allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'image/webp'];

    private async getToken(): Promise<string> {
        const loginUrl = `${process.env.UPLOAD_LOGIN_URL}`
        const credentials = {
            username: `${process.env.UPLOAD_USERNAME}`,
            password: `${process.env.UPLOAD_PASSWORD}`
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(loginUrl, credentials, config)
        return data
    }

    async uploadFile(params: IUploadFileParams): Promise<IUploadFileResponse> {


        if (!params?.fileData) {
            throw Error('Parâmetros inválidos: Arquivo inexistente!');
        }
        if (!params?.filename) {
            throw Error('Parâmetros inválidos: Filename inexistente!');
        }
        const fileType = params.fileData.mimetype

        if (!this.allowedTypes.includes(fileType)) {
            throw Error('Tipo de arquivo não suportado');
        }

        const folderPath = params.filename.split('/')[0]
        const filename = params.filename

        const path = `${process.env.BASE_UPLOAD_PATH}/${filename}?override=true`
        const publicPath = `${process.env.SHARE_UPLOAD_PUBLIC}/${filename}?expires=820&unit=days`

        const token = await this.getToken()

        const config = {
            headers: {
                'x-auth': token,
                'Content-Type': 'application/json',
            }
        };

        const createFolderResponse = await axios.post(`${process.env.BASE_UPLOAD_PATH}/${folderPath}/?override=true`, {}, config);

        if (createFolderResponse.status === 200) {

            const headers2 = {
                'x-auth': token,
                'Content-Type': fileType,
            }

            try {
                const request = await axios.request({
                    method: `POST`,
                    url: `${path}`,
                    maxBodyLength: Infinity,
                    headers: headers2,
                    data: params.fileData.data
                });

                const sharedFile = await axios.post(
                    `${publicPath}`,
                    { password: '', expires: '820', unit: 'days' },
                    { headers: { 'x-auth': token } }
                );

                return {
                    error: false,
                    fileURL: (`${process.env.SHARED_UPLOAD_URL_BASE}`).replace("@@HASH@@", sharedFile.data.hash)
                };
            } catch (error) {
                throw Error('Erro ao enviar arquivo para o servidor');
            }


        }
        throw new Error("Method not implemented.");
    }

    deleteFile(filename: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    downloadFile(filename: string): Promise<IDownloadFileResponse> {
        throw new Error("Method not implemented.");
    }

    listFiles(filename: string): Promise<IListFilesResponse> {
        throw new Error("Method not implemented.");
    }

    isExistFile(filename: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
