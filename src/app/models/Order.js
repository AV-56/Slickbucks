import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        outletId: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet", required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, default: 1 },
                price: { type: Number, required: true },
                appliedCustomisations: { type: Array, default: [] }
            }
        ],
        totalAmount: { type: Number, required: true },
        pointsEarned: { type: Number, default: 0 },
        pointsRedeemed: { type: Number, default: 0 },
        status: { type: String, enum: ["RECEIVED", "PREPARING", "READY", "COMPLETED", "CANCELLED"], default: "RECEIVED" },
        pickupTime: { type: Date, required: true },
        paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" }
    },
    { timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;