import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        role: { type: String, enum: ["CUSTOMER", "ADMIN"], default: "CUSTOMER" },
        loyaltyPoints: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;