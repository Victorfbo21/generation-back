import { IFileInterface } from "./IFile.interface"

export interface IUploadFileInfo {
    filename: string,
    fileURL: string,
    createdAt: Date
}

export interface IUploadFileParams {
    filename?: string, //path junto com filename ex: id/photo.jpg
    fileData: IFileInterface
}
export interface IUploadFileResponse {
    fileURL: string | null,
    error: boolean
}
export interface IDownloadFileResponse {
    fileData: string,
}

export interface IListFilesResponse {
    files: IUploadFileInfo[]
}

export interface IUploadService {
    uploadFile(params: IUploadFileParams): Promise<IUploadFileResponse>
    deleteFile(filename: string): Promise<boolean>
    downloadFile(filename: string): Promise<IDownloadFileResponse>
    listFiles(filename: string): Promise<IListFilesResponse>
    isExistFile(filename: string): Promise<boolean>
}
