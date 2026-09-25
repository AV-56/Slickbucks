import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, password } = await req.json();

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
        }

        // 2. Hash password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({
            message: "Account created successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
