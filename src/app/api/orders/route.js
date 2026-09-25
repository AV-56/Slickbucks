import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import User from "@/app/models/User";

export async function POST(req) {
    try {
        await connectToDatabase();

        // Handle pointsRedeemed field
        const { userId, outletId, items, subtotal, tax, grandTotal, pointsRedeemed, pickupType, pickupTime } = await req.json();

        if (!userId || !items || items.length === 0) {
            return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
        }

        const safeOutletId = mongoose.Types.ObjectId.isValid(outletId) ? outletId : new mongoose.Types.ObjectId();

        let finalPickupDate = new Date(Date.now() + 15 * 60000); // Default 15 mins
        if (pickupType === "later" && pickupTime) {
            const [hours, minutes] = pickupTime.split(":");
            const d = new Date();
            d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            if (d < new Date()) {
                d.setDate(d.getDate() + 1); // Next day if time has passed
            }
            finalPickupDate = d;
        }

        const newOrder = await Order.create({
            userId: userId,
            outletId: safeOutletId,
            items: items.map(item => ({
                productId: mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : new mongoose.Types.ObjectId(),
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                appliedCustomisations: item.size ? [item.size] : []
            })),
            totalAmount: grandTotal,
            pointsEarned: Math.floor(grandTotal / 10),
            pointsRedeemed: pointsRedeemed || 0,
            status: "RECEIVED",
            pickupTime: finalPickupDate,
            paymentStatus: "PAID"
        });

        const earnedPoints = Math.floor(grandTotal / 10);
        
        // ONLY deduct redeemed points during checkout (earned points are credited when order is COMPLETED)
        if (pointsRedeemed && pointsRedeemed > 0) {
            await User.findByIdAndUpdate(userId, {
                $inc: { loyaltyPoints: -pointsRedeemed }
            });
        }

        return NextResponse.json({
            message: "Order placed successfully!",
            orderId: newOrder._id,
            pointsEarned: earnedPoints,
            pointsRedeemed: pointsRedeemed || 0
        }, { status: 201 });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ message: "Something went wrong while placing order" }, { status: 500 });
    }
}
// Fetch user orders or all orders
export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        let query = {};
        if (userId) {
            query.userId = userId;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
            
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
    }
}

// Update order status
export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { orderId, status } = await req.json();

        const order = await Order.findById(orderId);
        if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

        // Add points on first completion
        if (status === "COMPLETED" && order.status !== "COMPLETED") {
            if (order.pointsEarned > 0) {
                await User.findByIdAndUpdate(order.userId, {
                    $inc: { loyaltyPoints: order.pointsEarned }
                });
            }
        }

        order.status = status;
        const updatedOrder = await order.save();

        return NextResponse.json({ message: "Status updated!", order: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
    }
}

