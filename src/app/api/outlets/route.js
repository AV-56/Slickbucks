import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Outlet from "@/app/models/Outlet";

export async function GET() {
    try {
        await connectToDatabase();
        const outlets = await Outlet.find({});
        return NextResponse.json(outlets, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch outlets" }, { status: 500 });
    }
}
