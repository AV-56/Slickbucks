import mongoose from "mongoose";

const outletSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        timings: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        prepTime: { type: Number, default: 15 },
        imageURL: { type: String },
    },
    { timestamps: true }
);

const Outlet = mongoose.models.Outlet || mongoose.model("Outlet", outletSchema);

export default Outlet;
