import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // 3. Generate JWT Token for login
        const secret = process.env.JWT_SECRET || "slickbucks_super_secret_key_12345";
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            secret,
            { expiresIn: "7d" } // Token 7 din tak valid rahega
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
