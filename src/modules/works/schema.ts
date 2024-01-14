import mongoose from "mongoose";

const WorksSchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
    price: { type: String, require: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Works = mongoose.model('Works', WorksSchema)

export default Works