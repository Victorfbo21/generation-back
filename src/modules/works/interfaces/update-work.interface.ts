import { IWorkInterface } from "./work.interface";
export interface IUpdateWorkInterface {
    workId: string,
    payload: Partial<IWorkInterface>
}