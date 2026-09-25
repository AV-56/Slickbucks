import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String },
        basePrice: { type: Number, required: true },
        imageURL: { type: String },
        isAvailable: { type: Boolean, default: true },
        availableOutlets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' }],


        customisations: [
            {
                type: { type: String },
                options: [
                    {
                        name: { type: String },
                        priceDelta: { type: Number, default: 0 },

                    }
                ]
            }
        ]

    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;