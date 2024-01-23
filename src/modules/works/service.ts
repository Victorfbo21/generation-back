import { ICreateWorkInterface } from "./interfaces/create-works.interface";
import WorksSchema from "./schema";
import AppResponse from "../../infra/http/httpresponse/appresponse";
import { IUpdateWorkInterface } from "./interfaces/update-work.interface";
import { generateRandomCode } from "../../infra/utils/generateRandomCode";
export default class WorksService {

    constructor() {

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

        const workUpdated = await WorksSchema.findByIdAndUpdate(workToUpdate._id,
            {
                $set: updateData.payload
            },
            { new: true }
        )

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

        const disabledWork = await WorksSchema.findByIdAndUpdate(workToDisable._id, {
            $set: { isActive: false }
        }, { new: true })


        if (!disabledWork) {
            return new AppResponse({
                data: null,
                error: true,
                statusCode: 500,
                message: "Erro ao Desabilitar Serviço"
            })
        }

        return new AppResponse({
            data: disabledWork.workCode,
            error: false,
            statusCode: 200,
            message: "Serviço Desabilitado com Sucesso!"
        })

    }

}