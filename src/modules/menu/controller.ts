import MenuServices from "./service";
import { Request, Response } from "express";

export default class MenuController {

    private menuServices: MenuServices

    constructor() {
        this.menuServices = new MenuServices()
    }

    async createMenu(req: any, res: Response) {

        const {
            owner,
            ownerAddress,
            ownerPhone,
            name,
            price,
            initialHour,
            finalHour } = req.body

        const { files } = req

        const item = {
            name: name,
            price: price,
            dishImage: files,
            description: "Descriçao Padrao"
        }

        const menu = {
            owner: owner,
            ownerAddress: ownerAddress,
            ownerPhone: ownerPhone,
            item: item,
            initialHour: initialHour,
            finalHour: finalHour
        }

        const result = await this.menuServices.createMenu(menu)


        if (!result)
            res.status(500).json({ message: "Erro ao criar Menu" })

        res.status(201).json(result)
    }

    async insertItem(req: any, res: Response) {

        const hash = req.body.hash

        const { files } = req

        const items = {
            name: req.body.name,
            price: req.body.price,
            dishImage: files,
            description: req.body.description
        }

        const result = await this.menuServices.insertItem(hash, items)

        if (result.error) {
            res.status(500).json({ error: result.message })
        }
        res.status(201).json(result.inserted)
    }

    async getMenuByHash(req: Request, res: Response) {
        const { hash } = req.body

        const result = await this.menuServices.getMenuByHash(hash)

        if (!result)
            res.status(500).json({ message: "Error on get result" })

        res.status(200).json(result)
    }

    async disabledMenu(req: Request, res: Response) {

        const { hash } = req.body

        const result = await this.menuServices.disabledMenu(hash)

        if (!result)
            res.status(500).json({ message: "Falha ao Desabilitar Menu" })

        return res.status(200).json(result)
    }

}