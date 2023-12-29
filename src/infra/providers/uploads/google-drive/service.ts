import { google } from "googleapis";
import {
    IDownloadFileResponse,
    IListFilesResponse,
    IUploadFileParams,
    IUploadFileResponse,
    IUploadService
} from "../interfaces/IUploadService.interface";
import { Readable } from "stream";
import './google.json'
import GoogleDrive from './google.json'

export default class GoogleDriveService implements IUploadService {

    private google_api_folder: string
    private google_api_client_email: string
    private google_api_private_key: string
    private google_api_universe_domain: string
    private google_api_type: string
    private google_api_projectid: string
    private google_api_clientid: string
    private google_api_token_url: string

    constructor() {
        this.google_api_folder = process.env.GOOGLE_API_FOLDER || ""
        this.google_api_client_email = process.env.GOOGLE_API_CLIENT_EMAIL || ""
        this.google_api_private_key = process.env.GOOGLE_API_PRIVATE_KEY || ""
        this.google_api_universe_domain = process.env.GOOGLE_API_UNIVERSE_DOMAIN || ""
        this.google_api_type = process.env.GOOGLE_API_TYPE || ""
        this.google_api_projectid = process.env.GOOGLE_API_PROJECTID || ""
        this.google_api_clientid = process.env.GOOGLE_API_CLIENTID || ""
        this.google_api_token_url = process.env.GOOGLE_API_TOKEN_URL || ""
    }

    async uploadFile(params: IUploadFileParams): Promise<IUploadFileResponse> {
        try {
            const authBody =
            {
                "private_key": this.google_api_private_key,
                "client_email": this.google_api_client_email,
                "universe_domain": this.google_api_universe_domain
            }

            const auth = new google.auth.GoogleAuth({
                credentials: authBody,
                scopes: [process.env.GOOGLE_API_AUTH || ""]
            })

            const driveService = google.drive({
                version: 'v3',
                auth
            })

            const fileMetaData = {
                'name': params.fileData.name,
                'parents': [this.google_api_folder]
            }

            const media = {
                mimeType: params.fileData.mimeType,
                body: Readable.from(params.fileData.data)
            }
            const requestBody = {
                resource: fileMetaData,
                media: media,
                fields: 'id'
            }
            const response = await driveService.files.create(requestBody)

            if (response.status != 200) {
                return {
                    error: true,
                    fileURL: null
                }
            }
            return {
                error: false,
                fileURL: `${process.env.GOOGLE_EXPORT_URL}${response.data.id}`
            }
        }
        catch (err) {
            console.log(err)
            return {
                error: true,
                fileURL: null
            }
        }
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