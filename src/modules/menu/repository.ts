import MenuSchema from './schema'
import CreateMenuInterface from './interfaces/create-menu.interface'
import ItemsDto from './interfaces/items.dto'

export default class MenuRepository {

    async createMenu(menu: CreateMenuInterface) {
        try {
            const menuCreated = await MenuSchema.create(menu)

            return menuCreated
        }
        catch (err) {
            throw new Error("Error persisting menu")
        }
    }

    async getMenuById(id: string) {
        try {
            const menuFound = await MenuSchema.findById(id)

            return menuFound

        }
        catch (err) {
            throw new Error("Error on fetching menu")
        }

    }

    async getMenuByHash(hash: string) {
        try {
            const menu = await MenuSchema.findOne({ hash: hash })

            return menu
        }
        catch (err) {
            throw new Error("Error on fetching menu");

        }
    }

    async insertItems(hash: string, items: ItemsDto[]) {
        try {
            const menu = await MenuSchema.findOne({ hash: hash });

            if (!menu) {
                throw new Error("Menu não encontrado");
            }

            const previousItems = menu.items;

            for (const item of items) {
                const verifyExists = menu.items.find((i) => i.name === item.name && i.price === item.price)

                if (!verifyExists) {
                    previousItems.push(item)
                }
            }

            const updated = await MenuSchema.findByIdAndUpdate(menu._id, { items: previousItems });

            return updated;
        } catch (err) {
            throw new Error("Erro ao persistir itens");
        }
    }

    async inserItem(hash: string, item: ItemsDto) {
        try {
            const menu = await MenuSchema.findOne({ hash: hash });

            if (!menu) {
                throw new Error("Menu não encontrado");
            }

            const isItemExists = menu.items.some(
                (i) => i.name === item.name && i.price === item.price
            );

            if (!isItemExists) {
                const updatedMenu = await MenuSchema.findOneAndUpdate(
                    { _id: menu._id },
                    { $push: { items: item } },
                    { new: true, runValidators: true }
                );

                return updatedMenu;
            } else {
                console.log("Item já existe no menu.");
                return menu;
            }
        } catch (err) {
            console.error("Erro ao persistir: ", err);
            throw new Error("Erro ao persistir");
        }
    }

    async disabledMenu(hash: string) {
        try {
            const disabled = await MenuSchema.findOneAndUpdate({ hash: hash }, { isActive: false })

            return disabled
        }
        catch (err) {
            console.log('Erro ao Desabilitar menu')
            return false
        }
    }
}