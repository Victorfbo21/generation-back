import mongoose from "mongoose";

const type = ["user", "owner", "admin"]

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    whatsapp: { type: String },
    type: { type: String, enum: type, default: "user" },
    site: { type: String }
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema)

export default User