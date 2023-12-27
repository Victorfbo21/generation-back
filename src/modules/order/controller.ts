import OrderServices from "./service";
import { Request, Response } from "express";

export default class OrderController {

    private orderServices: OrderServices

    constructor() {
        this.orderServices = new OrderServices()
    }

    async createOrder(req: Request, res: Response) {

        const {
            client,
            restaurant,
            whatsapp,
            description,
            details,
            hash,
            formOfPayment,
            moneyChangeValue
        } = req.body

        const order = {
            client: client,
            restaurant: restaurant,
            whatsapp: whatsapp,
            description: description,
            formOfPayment: formOfPayment,
            moneyChange: moneyChangeValue,
            details: details,
            hash: hash
        }

        const result = await this.orderServices.createOrder(order)

        if (!result)
            res.status(500).json({ message: "Error on create Order" })

        res.status(201).json(result)

    }

    async listOrdersByHash(req: Request, res: Response) {

        const { hash } = req.body

        const result = await this.orderServices.listOrdersByHash(hash)

        if (!result)
            res.status(500).json({ message: "Error on find Orders" })

        res.status(200).json(result)
    }

}