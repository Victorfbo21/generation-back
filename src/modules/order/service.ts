import OrderRepository from "./repository";
import { v4 as uuidv4 } from "uuid";
import DetailsDto from "./interfaces/details.dto";
import OrderDto from "./interfaces/order.dto";
import MenuSchema from "../menu/schema";

export default class OrderServices {

    private orderRepository: OrderRepository

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async createOrder(order: OrderDto) {

        if (!order.client || !order.restaurant || !order.whatsapp)
            throw new Error("Missing Informations")

        const hash = uuidv4()

        const totalValue = await this.amountOrder(order.details)

        const orderToCreate = {
            client: order.client,
            restaurant: order.restaurant,
            whatsapp: order.whatsapp,
            totalValue: totalValue,
            formOfPayment: order.formOfPayment,
            moneyChange: order.moneyChange,
            details: order.details,
            description: order.description,
            orderUrl: `http://donaquentinha.com.br/orders/${hash}`,
            hash: order.hash
        }

        const createdOrder = await this.orderRepository.createOrder(orderToCreate)

        if (!createdOrder)
            throw new Error("Erro ao Criar Pedido!")

        return createdOrder

    }

    async listOrdersByHash(hash: string) {
        const listOrders = await this.orderRepository.getListOrdersByHash(hash)

        if (!listOrders)
            throw new Error("Erro ao encontrar Orders")

        return listOrders
    }

    async validateOrder(orderDetails: DetailsDto[], restaurant: string) {

        const found = await MenuSchema.findOne({ owner: restaurant })

        if (!found)
            throw new Error("Restaurant not found")

        const itemsNotFound = []

        for (const orderItem of orderDetails) {
            const existsItem = found.items.find((i) => i.name === orderItem.item && i.price === orderItem.itemValue)

            if (!existsItem) {
                itemsNotFound.push(orderItem)
            }
        }

        if (itemsNotFound.length > 0) {
            return false
        }

        return true
    }

    async amountOrder(orderDetails: DetailsDto[]) {

        let total = 0

        for (const item of orderDetails) {
            const amount = item.quantity * item.itemValue
            total += amount
        }

        return total
    }

}