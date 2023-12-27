import MenuRepository from "./repository";
import { v4 as uuidv4 } from "uuid";
import ItemsDto from "./interfaces/items.dto";
import MenuSchema from "./schema";
import MenuDto from "./interfaces/menu.dto";
import { FileShareService } from "../../../src/infra/providers/uploads/fileshare/service";
import { addHours } from "date-fns";

export default class MenuServices {

    private menuRepository: MenuRepository
    private fileShareService: FileShareService

    constructor() {
        this.menuRepository = new MenuRepository();
        this.fileShareService = new FileShareService();
    }

    async createMenu(menu: MenuDto) {

        if (!menu.owner)
            throw new Error("Owner is Required")


        const hash = uuidv4();

        const currentDate = new Date()

        const valid_at: Date = addHours(currentDate, 24);

        const menuToCreate = {
            owner: menu.owner,
            ownerAddress: menu.ownerAddress,
            ownerPhone: menu.ownerPhone,
            orderUrl: `${process.env.FRONTEND_URL_API}/order/${hash}`,
            listOrdersUrl: `${process.env.FRONTEND_URL_API}/list/orders/${hash}`,
            hash: hash,
            initialHour: menu.initialHour,
            finalHour: menu.finalHour,
            valid_at: valid_at
        }

        const createdMenu = await this.menuRepository.createMenu(menuToCreate)

        if (!createdMenu)
            throw new Error("Error on create menu")

        return createdMenu

    }

    async getMenuByHash(hash: string) {
        const foundMenu = await this.menuRepository.getMenuByHash(hash)

        if (!foundMenu)
            throw new Error("Error finding menu")

        return foundMenu
    }

    async insertItems(hash: string, items: ItemsDto[]) {
        const inserted = await this.menuRepository.insertItems(hash, items)

        if (!inserted)
            throw new Error("Error insert items")

        return inserted
    }

    async disabledMenu(hash: string) {

        const verifyExists = await this.getMenuByHash(hash)

        if (!verifyExists) {
            return console.log("Menu nao encontrado em nossa base")
        }

        const disabled = await this.menuRepository.disabledMenu(hash)

        if (!disabled)
            return console.log('Erro ao Desabilitar Menu')

        return disabled

    }

    async insertItem(hash: string, item: ItemsDto) {

        if (!item.dishImage) {
            return {
                error: true,
                message: "Imagem não enviada"
            }

        }

        const uploadParams = {
            fileData: item.dishImage.files,
            filename: `imagem/${item.name}`
        }

        const uploadImage = await this.fileShareService.uploadFile(uploadParams)

        item.dishImage = uploadImage.fileURL

        const inserted = await this.menuRepository.inserItem(hash, item)

        if (!inserted)
            throw new Error("Erro ao inserir Item")


        return {
            error: false,
            inserted,
            message: "Item Inserido com Sucesso!"
        }

    }

    // async validateItems(items: ItemsDto[]) {
    //     const uniqueItems = new Set();
    //     const duplicates = []

    //     for (const item of items) {
    //         const key = `${item.name} - ${item.description}`

    //         if (uniqueItems.has(key)) {
    //             duplicates.push(key)
    //         }
    //         else {
    //             uniqueItems.add(key)
    //         }
    //     }

    //     if (duplicates.length > 0) {
    //         return false
    //     }

    //     return true
    // }

}