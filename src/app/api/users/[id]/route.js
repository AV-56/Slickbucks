import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        // Await params for latest Next.js
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Find user without password
        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error("Fetch User Error:", error);
        return NextResponse.json({ message: "Server error while fetching user" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const { name, phone } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phone },
            { new: true } // Return updated document
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated!", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Update User Error:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
