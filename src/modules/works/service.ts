import { ICreateWorkInterface } from "./interfaces/create-works.interface";
import WorksSchema from "./schema";
import AppResponse from "../../infra/http/httpresponse/appresponse";
import { IUpdateWorkInterface } from "./interfaces/update-work.interface";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
import WorkRepository from "./repository";
export default class WorksService {

    private workRepository: WorkRepository

    constructor() {
        this.workRepository = new WorkRepository();
    }

    async getActiveWorks() {
        // TODO
    }

    async getDisabledsWorks() {
        // TODO
    }

    async getIsSaleWorks() {
        // TODO
    }

    async createWork(createWorkData: ICreateWorkInterface) {
        const work = await WorksSchema.findOne({ workName: createWorkData.workName, category: createWorkData.category })
        if (work) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço Já Cadastrado na Base de Dados"
            })
        }

        const workCode = generateRandomCode()

        const workCreated = await WorksSchema.create({ ...createWorkData, workCode: workCode })

        if (!workCreated) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 404,
                message: "Erro ao Criar Serviço"
            })
        }

        return new AppResponse({
            data: workCreated,
            error: false,
            statusCode: 201,
            message: "Serviço Criado com Sucesso!"
        })
    }

    async updateWork(updateData: IUpdateWorkInterface) {

        const workToUpdate = await WorksSchema.findOne({ _id: Object(updateData.workId) })

        if (!workToUpdate) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço Não Encontrado na Base de Dados"
            })
        }

        const workUpdated = await this.workRepository.updateWork(updateData.workId, updateData.payload)

        if (!workUpdated) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Falha ao Atualizar Serviço"
            })
        }

        return new AppResponse({
            data: workUpdated,
            error: false,
            statusCode: 200,
            message: "Serviço Atualizado com Sucesso!"
        })

    }

    async disabledWork(workId: string) {

        const workToDisable = await WorksSchema.findOne({ _id: Object(workId) })

        if (!workToDisable) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço Não Encontrado na Base de Dados"
            })
        }

        const disabledWork = this.workRepository.disableWork(workId)

        if (!disabledWork) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Desabilitar Serviço"
            })
        }

        return new AppResponse({
            data: true,
            error: false,
            statusCode: 200,
            message: "Serviço Desabilitado com Sucesso!"
        })

    }

    async activeWork(workId: string) {
        const workToActive = await WorksSchema.findOne({ _id: Object(workId) })

        if (!workToActive) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço a ser Ativado não encontrado"
            })
        }

        const workActived = await WorksSchema.findByIdAndUpdate(workToActive._id, {
            $set: {
                isActive: true
            }
        }, { new: true })

        if (!workActived) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Ativar Serviço"
            })
        }

        return new AppResponse({
            data: workActived,
            error: false,
            statusCode: 200,
            message: "Serviço Ativado com Sucesso!"
        })
    }

    async deleteWork(workId: string) {
        const workToDelete = await WorksSchema.findOne({ _id: Object(workId) })

        if (!workToDelete) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço a ser deletado não encontrado"
            })
        }

        const workDeleted = await WorksSchema.findByIdAndUpdate(workToDelete._id,
            {
                $set: {
                    isDeleted: true,
                    isActive: false
                }
            }, { new: true })


        if (!workDeleted) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Deletar Serviço"
            })
        }

        return new AppResponse({
            data: null,
            error: false,
            statusCode: 200,
            message: "Serviço Deletado com Sucesso!"
        })


    }

    async turnIsSaleWork() {
        // TODO
    }


}