import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {

        outletId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);


inventorySchema.index({ outletId: 1, productId: 1 }, { unique: true });

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export default Inventory;
