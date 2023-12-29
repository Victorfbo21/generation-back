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
import googleDrive from './google.json'


export default class GoogleDriveService implements IUploadService {

    private google_api_folder: string

    constructor() {
        this.google_api_folder = process.env.GOOGLE_API_FOLDER || ""
    }

    async uploadFile(params: IUploadFileParams): Promise<IUploadFileResponse> {
        try {

            const auth = new google.auth.GoogleAuth({
                credentials: googleDrive,
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