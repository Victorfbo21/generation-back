export interface IFileInterface {
    name: string,
    data: Buffer,
    size: number,
    encoding: string,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,
    md5: string,
    mv: void
}