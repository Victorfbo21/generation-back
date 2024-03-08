import { google } from "googleapis";
import {
    IDownloadFileResponse,
    IListFilesResponse,
    IUploadFileParams,
    IUploadFileResponse,
    IUploadService
} from "../interfaces/IUploadService.interface";
import { Readable } from "stream";

import {
    getViewIdFromImageIdGoogleDrive
} from "./utils/publicURL"

export default class GoogleDriveService implements IUploadService {

    private google_api_folder: string
    private google_api_client_email: string
    private google_api_private_key: string
    private google_api_universe_domain: string


    constructor() {
        this.google_api_folder = process.env.GOOGLE_API_FOLDER || ""
        this.google_api_client_email = process.env.GOOGLE_API_CLIENT_EMAIL || ""
        this.google_api_private_key = process.env.GOOGLE_API_PRIVATE_KEY || ""
        this.google_api_universe_domain = process.env.GOOGLE_API_UNIVERSE_DOMAIN || ""
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
                mimeType: params.fileData.mimetype,
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

            const newVieweID = await getViewIdFromImageIdGoogleDrive(response?.data?.id ?? "")

            return {
                error: false,
                fileURL: `${process.env.GOOGLE_API_DRIVE_VIEWER}${newVieweID}`
            }
        }
        catch (err) {
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