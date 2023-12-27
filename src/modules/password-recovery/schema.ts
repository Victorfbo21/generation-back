import mongoose from "mongoose";

const PasswordRecoverySchema = new mongoose.Schema({
    user_id: { type: String },
    recovery_code: { type: String },
    active: { type: String, require: true },
    valid_at: { type: String },
}, {
    timestamps: true
})

const PasswordRecovery = mongoose.model('PasswordRecovery', PasswordRecoverySchema)

export default PasswordRecovery