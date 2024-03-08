import { IDownloadFileResponse, IListFilesResponse, IUploadFileParams, IUploadFileResponse, IUploadService } from "../interfaces/IUploadService.interface";
import * as AWS from 'aws-sdk'


export default class S3Service implements IUploadService {

    private s3: AWS.S3

    constructor() {
        this.s3 = new AWS.S3({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
            }
        })
    }


    async uploadFile(params: IUploadFileParams): Promise<IUploadFileResponse> {

        const uploaded = await this.upload(params?.filename ?? "", params.fileData.data, "base64", params.fileData.mimetype)

        if (!uploaded.ETag) {
            return {
                error: true,
                fileURL: ''
            }
        }

        return {
            error: false,
            fileURL: uploaded.Location
        }

    }
    async deleteFile(filename: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async downloadFile(filename: string): Promise<IDownloadFileResponse> {
        throw new Error("Method not implemented.");
    }
    async listFiles(filename: string): Promise<IListFilesResponse> {
        throw new Error("Method not implemented.");
    }
    async isExistFile(filename: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    private async upload(
        key: string,
        body: Buffer,
        content_encoding: string,
        content_type: string,
        acl = "public-read") {

        const params = {
            Bucket: process.env.AWS_BUCKET ?? "",
            Key: key,
            Body: body,
            // ACL: acl,
            ContentEncoding: content_encoding,
            ContentType: content_type,
        };

        const { Location, ETag } = await this.s3.upload(params).promise()

        return {
            Location,
            ETag
        }
    }

    async getPublicURL(key: string) {

        const publicURL = await this.s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_BUCKET ?? "",
            Key: key,
            Expires: null
        })

        return publicURL
    }


}