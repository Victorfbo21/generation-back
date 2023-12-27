import { Router } from "express";
import OrderController from "./controller";

const OrderRouter = Router();

const orderController = new OrderController();

OrderRouter.post('/create', (req, res) => {
    return orderController.createOrder(req, res)
})

OrderRouter.post('/list-orders', (req, res) => {
    return orderController.listOrdersByHash(req, res)
})

export default OrderRouter;