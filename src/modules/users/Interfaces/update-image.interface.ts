import { IFileInterface } from '../../../infra/providers/uploads/interfaces/IFile.interface'
export interface IUpdateImageInterface {
    userId: string,
    file: IFileInterface
}