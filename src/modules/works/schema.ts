import mongoose from "mongoose";

const WorksSchema = new mongoose.Schema({
    workName: { type: String },
    workCode: { type: String },
    workPrice: { type: Number, require: true },
    owner: { type: String, require: true },
    category: { type: String, require: false },
    isActive: { type: Boolean, require: true, default: true },
    isSale: { type: Boolean, require: false, default: false },
    salePrice: { type: Number, require: false },
    disableBy: { type: String, require: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Works = mongoose.model('Works', WorksSchema)

export default Works