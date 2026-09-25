import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import Outlet from "@/app/models/Outlet";

export async function GET() {
    try {
        await connectToDatabase();
        await Product.deleteMany({});
        await Outlet.deleteMany({});

        // 1. Outlets Creation
        const outlets = await Outlet.insertMany([
            { name: "Slickbucks Connaught Place", address: "B-Block, Inner Circle, New Delhi", timings: "08:00 AM - 11:00 PM", prepTime: 10, imageURL: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80" },
            { name: "Slickbucks Bandra", address: "Linking Road, Bandra West, Mumbai", timings: "07:30 AM - 11:30 PM", prepTime: 15, imageURL: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80" },
            { name: "Slickbucks Koramangala", address: "1st Block, Koramangala, Bengaluru", timings: "24 Hours", prepTime: 5, imageURL: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80" }
        ]);

        const [cpId, bandraId, koraId] = [outlets[0]._id, outlets[1]._id, outlets[2]._id];
        const ALL_OUTLETS = [cpId, bandraId, koraId];


        const products = await Product.insertMany([
            {
                name: "Caramel Macchiato", category: "Hot coffee", basePrice: 280, imageURL: "/caramel_macchiato.png", isAvailable: true,
                description: "Freshly steamed milk with vanilla-flavored syrup, espresso and caramel drizzle.",
                availableOutlets: ALL_OUTLETS,
                customisations: [
                    { type: "Size", options: [{ name: "Tall", priceDelta: 0 }, { name: "Grande", priceDelta: 40 }, { name: "Venti", priceDelta: 80 }] },
                    { type: "Milk preference", options: [{ name: "Regular", priceDelta: 0 }, { name: "Soy Milk", priceDelta: 30 }, { name: "Oat Milk", priceDelta: 50 }] },
                    { type: "Sugar level", options: [{ name: "Normal", priceDelta: 0 }, { name: "Less Sugar", priceDelta: 0 }, { name: "No Sugar", priceDelta: 0 }] },
                    { type: "Extra shots", options: [{ name: "None", priceDelta: 0 }, { name: "+1 Shot", priceDelta: 30 }, { name: "+2 Shots", priceDelta: 60 }] }
                ]
            },
            {
                name: "Iced Hazelnut Latte", category: "Cold coffee", basePrice: 240, imageURL: "/iced_hazelnut_latte.png", isAvailable: true,
                description: "Espresso, cold milk, and hazelnut syrup served over ice.",
                availableOutlets: ALL_OUTLETS,
                customisations: [
                    { type: "Size", options: [{ name: "Tall", priceDelta: 0 }, { name: "Grande", priceDelta: 30 }, { name: "Venti", priceDelta: 60 }] },
                    { type: "Milk preference", options: [{ name: "Regular", priceDelta: 0 }, { name: "Oat Milk", priceDelta: 50 }] },
                    { type: "Add-ons", options: [{ name: "None", priceDelta: 0 }, { name: "Whipped Cream", priceDelta: 30 }, { name: "Extra Caramel", priceDelta: 20 }] }
                ]
            },
            {
                name: "Matcha Green Tea Latte", category: "Matcha", basePrice: 290, isAvailable: true,
                imageURL: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800&q=80",
                description: "Smooth and creamy matcha sweetened just right.",
                availableOutlets: ALL_OUTLETS,
                customisations: [
                    { type: "Size", options: [{ name: "Tall", priceDelta: 0 }, { name: "Grande", priceDelta: 40 }] },
                    { type: "Milk preference", options: [{ name: "Regular", priceDelta: 0 }, { name: "Almond Milk", priceDelta: 40 }] },
                    { type: "Sugar level", options: [{ name: "Normal", priceDelta: 0 }, { name: "Less Sugar", priceDelta: 0 }] }
                ]
            },
            {
                name: "Classic Cold Brew", category: "Cold coffee", basePrice: 260, isAvailable: true,
                imageURL: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
                description: "Slow-steeped for 20 hours for a super smooth flavor.",
                availableOutlets: [koraId],
                customisations: [
                    { type: "Size", options: [{ name: "Tall", priceDelta: 0 }, { name: "Grande", priceDelta: 30 }] },
                    { type: "Extra shots", options: [{ name: "None", priceDelta: 0 }, { name: "+1 Espresso Shot", priceDelta: 30 }] }
                ]
            },
            {
                name: "Chocolate Croissant", category: "Food", basePrice: 180, isAvailable: true,
                imageURL: "https://images.unsplash.com/photo-1649019937955-9687640aaaab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description: "Buttery, flaky pastry filled with rich dark chocolate.",
                availableOutlets: ALL_OUTLETS,
                customisations: [{ type: "Warming", options: [{ name: "Normal", priceDelta: 0 }, { name: "Warm", priceDelta: 0 }] }]
            },
            {
                name: "Chocolate Chip Cookie", category: "Add-ons", basePrice: 90, isAvailable: true,
                imageURL: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
                description: "Chewy, warm chocolate chip cookie perfect with coffee.",
                availableOutlets: ALL_OUTLETS,
                customisations: [{ type: "Warming", options: [{ name: "Normal", priceDelta: 0 }, { name: "Warm", priceDelta: 0 }] }]
            }
        ]);

        return NextResponse.json({ message: "DB me aag laga di!🔥 Successfully Seeded with Exclusive items!", outletsCount: outlets.length, productsCount: products.length }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
