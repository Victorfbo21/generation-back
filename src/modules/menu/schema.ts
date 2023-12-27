import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    items: [
        {
            name: { type: String, required: true },
            description: { type: String, required: false },
            price: { type: Number, required: true },
            category: { type: String },
            dishImage: { type: Object, required: false },

        }
    ],
    isActive: { type: Boolean, default: true },
    menuUrl: { type: String },
    orderUrl: { type: String },
    listOrdersUrl: { type: String },
    owner: { type: String },
    ownerPhone: { type: String },
    ownerAddress: { type: String },
    hash: { type: String },
    valid_at: { type: String },
    initialHour: { type: String },
    finalHour: { type: String }
}, {
    timestamps: true
})

const Menu = mongoose.model('Menu', MenuSchema)

export default Menu