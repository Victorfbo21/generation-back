import mongoose from "mongoose";

const type = ["owner", "admin", "worker"]

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, require: true },
    profile_image: { type: String },
    whatsapp: { type: String },
    type: { type: String, enum: type, default: "owner" },
    function: { type: String },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema)

export default User