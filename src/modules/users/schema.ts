import mongoose from "mongoose";

const type = ["owner", "admin"]

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, require: true },
    profile_imagem: { type: String },
    whatsapp: { type: String },
    type: { type: String, enum: type, default: "owner" },
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema)

export default User