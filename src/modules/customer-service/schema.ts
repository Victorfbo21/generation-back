import mongoose from "mongoose";

const CustomerServiceSchema = new mongoose.Schema({
    client: { type: String, require: true },
    worker: { type: String, require: true },
    initialHour: { type: String, require: true },
    finalHour: { type: String, require: true },
    amout: { type: String, require: true },
    isStarted: { type: Boolean, require: true, default: false },
    isFinished: { type: Boolean, require: true, default: false },
}, {
    timestamps: true
})

const CustomerService = mongoose.model('CustomerService', CustomerServiceSchema)

export default CustomerService