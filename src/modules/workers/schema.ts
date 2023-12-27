import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, require: true },
    profile_imagem: { type: String },
    whatsapp: { type: String },
    function: { type: String }
}, {
    timestamps: true
})

const Worker = mongoose.model('Worker', WorkerSchema)

export default Worker