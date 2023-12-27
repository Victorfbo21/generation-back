import { Router } from "express"
import MenuController from "./controller";

const MenuRouter = Router();

const menuController = new MenuController();

MenuRouter.post('/create', (req, res) => {
    return menuController.createMenu(req, res)
})

MenuRouter.post('/by-hash', (req, res) => {
    return menuController.getMenuByHash(req, res)
})

MenuRouter.post('/insert-item', (req, res) => {
    return menuController.insertItem(req, res)
})

MenuRouter.post('/disabled', (req, res) => {
    return menuController.disabledMenu(req, res)
})

export default MenuRouter;