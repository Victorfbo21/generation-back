import mongoose from "mongoose";

const paymentEnum = ["money", "pix", "debit", "credit"]

const OrderSchema = new mongoose.Schema({

    client: { type: String, required: true },
    restaurant: { type: String, required: true },
    whatsapp: { type: String, required: true },
    description: { type: String, required: false },
    totalValue: { type: Number, required: true },
    formOfPayment: { type: String, enum: paymentEnum, require: true },
    moneyChange: { type: Number },
    details: [
        {
            item: { type: String, required: true },
            quantity: { type: Number, required: true },
            itemValue: { type: Number }
        }
    ],
    isActive: { type: Boolean, default: true },
    hash: { type: String }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', OrderSchema)

export default Order