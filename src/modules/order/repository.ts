import OrderSchema from "./schema"
import CreateOrderInterface from "./interfaces/create-order.interface"

export default class OrderRepository {

    async createOrder(order: CreateOrderInterface) {
        try {
            const orderCreated = await OrderSchema.create(order)

            return orderCreated
        }
        catch (err) {
            return err
        }
    }

    async getOrderById(id: string) {
        try {
            const orderFound = await OrderSchema.findById(id)

            return orderFound
        }
        catch (err) {
            return err
        }
    }

    async getListOrdersByHash(hash: string) {
        try {
            const orders = await OrderSchema.find({ hash: hash })

            return orders
        }
        catch (err) {
            return err
        }
    }

}