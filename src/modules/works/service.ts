import { ICreateWorkInterface } from "./interfaces/create-works.interface";
import WorksSchema from "./schema";
import { AppResponse } from "../../infra/http/httpresponse/appResponse";
import { IUpdateWorkInterface } from "./interfaces/update-work.interface";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
import WorkRepository from "./repository";
import { IDisableWorkInterface } from "./interfaces/disable-work.interface";
import { NIL } from "uuid";
import { IActiveWorkInterface } from "./interfaces/active-work.interface";
export default class WorksService {

    private workRepository: WorkRepository

    constructor() {
        this.workRepository = new WorkRepository();
    }

    async getWorks(owner: string) {

        const activedWorks = await this.workRepository.getActiveWorks(owner)

        if (!activedWorks)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Encontrar Serviços Ativos"
            })

        return new AppResponse({
            data: activedWorks,
            error: false,
            statusCode: 200,
            message: "Serviços Encontrados com Sucesso!"
        })
    }

    async getIsSaleWorks(owner: string) {

        const saleWorks = await this.workRepository.getIsSaleWorks(owner)

        if (!saleWorks)
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Encontrar Serviços Em Promoção"
            })

        return new AppResponse({
            data: saleWorks,
            error: false,
            statusCode: 200,
            message: "Serviços Encontrados com Sucesso!"
        })
    }

    async getDisabledsWorks() {
        // TODO
    }

    async createWork(createWorkData: ICreateWorkInterface) {
        const work = await WorksSchema.findOne(
            {
                workName: createWorkData.workName,
                category: createWorkData.category,
                owner: createWorkData.owner
            })

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

    async disabledWork(data: IDisableWorkInterface) {

        const workToDisable = await WorksSchema.findOne({ _id: Object(data.toDisableId) })

        if (!workToDisable) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço Não Encontrado na Base de Dados"
            })
        }

        const disabledWork = this.workRepository.disableWork(data)

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
    async activeWork(data: IActiveWorkInterface) {

        const workToActive = await WorksSchema.findOne({ _id: data.toActiveId })

        if (!workToActive) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: "Serviço Não Encontrado na Base de Dados"
            })
        }

        const activedWork = this.workRepository.activeWork(data)

        if (!activedWork) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Ativar Serviço"
            })
        }

        return new AppResponse({
            data: true,
            error: false,
            statusCode: 200,
            message: "Serviço Ativado com Sucesso!"
        })

    }

    async activeWorks(workId: string) {
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

    async turnIsSaleWork(workId: string, salePrice: string) {

        const workToUpdate = await WorksSchema.findOne({ _id: workId })

        if (!workToUpdate) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 400,
                message: 'Serviço para realizar promoção Não encontrado'
            })
        }

        const updated = await WorksSchema.findByIdAndUpdate(workId, {
            $set: {
                isSale: true,
                salePrice: salePrice
            }
        }, { new: true })

        if (!updated) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 402,
                message: 'Erro ao Atualizar Serviço'
            })
        }

        return new AppResponse({
            data: updated._id,
            error: false,
            statusCode: 200,
            message: 'Serviço Atualizado com Sucesso!'
        })
    }


}