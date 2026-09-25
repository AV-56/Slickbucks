import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";

export async function GET(req) {
    try {
        await connectToDatabase();


        const { searchParams } = new URL(req.url);
        const outletId = searchParams.get('outletId');

        let query = {};
        if (outletId) {

            query = { availableOutlets: outletId };
        }

        const products = await Product.find(query);
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { productId, isAvailable } = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { isAvailable },
            { new: true }
        );

        return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
    }
}
