"use client";
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CartPage() {
    const { cartItems, updateQuantity, cartTotal, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Loyalty points state
    const [userPoints, setUserPoints] = useState(0);
    const [usePoints, setUsePoints] = useState(false);

    // Check points on load
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUserPoints(JSON.parse(user).loyaltyPoints || 0);
        }
    }, []);

    // Bill calculation with discount logic
    const hasEnoughPoints = userPoints >= 100;
    // Apply discount if using points
    const discountAmount = usePoints && cartItems.length > 0 ? cartItems[0].price : 0;

    const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
    const tax = subtotalAfterDiscount * 0.05;
    const grandTotal = subtotalAfterDiscount + tax;

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success
    const [pickupType, setPickupType] = useState("immediate");
    const [pickupTime, setPickupTime] = useState("");

    const handleCheckout = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Please login to place your order!");
            router.push("/login");
            return;
        }
        if (pickupType === "later" && !pickupTime) {
            alert("Please select a pickup time!");
            return;
        }
        setShowPaymentModal(true);
    };

    const confirmPayment = async () => {
        const user = localStorage.getItem("user");
        const parsedUser = JSON.parse(user);

        setPaymentStatus("processing");
        setIsProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: parsedUser.id,
                    items: cartItems,
                    subtotal: subtotalAfterDiscount,
                    tax: tax,
                    grandTotal: grandTotal,
                    pointsRedeemed: usePoints ? 100 : 0,
                    pickupType,
                    pickupTime
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to place order");

            setPaymentStatus("success");
            await new Promise(resolve => setTimeout(resolve, 1000));

            clearCart();
            setShowPaymentModal(false);
            setOrderSuccess(true);

            parsedUser.loyaltyPoints = userPoints - (data.pointsRedeemed || 0);
            localStorage.setItem("user", JSON.stringify(parsedUser));

        } catch (error) {
            alert(error.message);
            setPaymentStatus("idle");
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] flex flex-col justify-center items-center px-4 py-16">
                <div className="bg-[#EEEBD3] border border-[#B68D40]/30 rounded-3xl p-10 text-center shadow-2xl max-w-md w-full animate-in zoom-in duration-500">
                    <div className="text-6xl mb-6">🎉☕</div>
                    <h1 className="text-3xl font-black text-[#1A0F0A] mb-4">Order Placed!</h1>
                    <p className="text-[#3E200B] mb-8 font-medium">
                        Your coffee is being prepared. It will be ready {pickupType === "immediate" ? "in 15 minutes." : `at ${pickupTime}.`}
                    </p>
                    <Link href="/menu" className="block w-full py-3.5 bg-[#B68D40] text-[#1A0F0A] rounded-xl font-bold hover:bg-[#1A0F0A] hover:text-[#EEEBD3] transition-colors shadow-lg">
                        Order More
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[calc(100vh-6rem)] py-12 px-4 flex flex-col items-center justify-center">
                <div className="text-8xl mb-6 opacity-50">🛒</div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#EEEBD3] mb-4">Your Cart is Empty</h1>
                <p className="text-gray-400 mb-8">Looks like you haven't added any coffee yet.</p>
                <Link href="/menu" className="px-8 py-4 bg-[#B68D40] text-[#1A0F0A] font-bold text-lg rounded-full hover:bg-[#EEEBD3] hover:-translate-y-1 transition-all shadow-xl">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#EEEBD3] mb-12">
                Your <span className="text-[#B68D40]">Cart</span> ({totalItems} items)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CART ITEMS LIST */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.cartId} className="bg-[#EEEBD3] rounded-3xl p-6 shadow-xl flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 bg-black rounded-2xl border border-[#B68D40]/20 flex-shrink-0 overflow-hidden shadow-md">
                                    {item.imageURL ? (
                                        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">☕</div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#1A0F0A]">{item.name}</h2>
                                    {item.size && (
                                        <p className="text-sm font-bold text-[#B68D40] uppercase tracking-wider mt-1">Size: {item.size}</p>
                                    )}
                                    <p className="text-[#3E200B] font-medium mt-1">₹{item.price} x {item.quantity}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <span className="text-2xl font-black text-[#1A0F0A]">₹{item.price * item.quantity}</span>
                                <div className="flex items-center bg-[#1A0F0A] rounded-xl overflow-hidden shadow-md w-28 justify-between">
                                    <button onClick={() => updateQuantity(item.cartId, -1)} className="px-3 py-1 text-[#B68D40] font-black text-2xl hover:bg-black/50 transition-colors">-</button>
                                    <span className="font-black text-lg text-[#EEEBD3]">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartId, 1)} className="px-3 py-1 text-[#B68D40] font-black text-2xl hover:bg-black/50 transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ORDER SUMMARY */}
                <div className="bg-[#1A0F0A] border-2 border-[#B68D40]/30 rounded-3xl p-8 h-fit shadow-2xl sticky top-32">
                    <h2 className="text-2xl font-black text-[#EEEBD3] mb-6 border-b border-gray-600 pb-4">Order Summary</h2>

                    {/* REDEEM POINTS BOX */}
                    {hasEnoughPoints && (
                        <div className="bg-[#B68D40]/10 border border-[#B68D40]/50 rounded-xl p-4 mb-6 cursor-pointer hover:bg-[#B68D40]/20 transition-all" onClick={() => setUsePoints(!usePoints)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-[#EEEBD3] block text-lg">🎁 Redeem Free Coffee</span>
                                    <span className="text-xs text-gray-400">Use 100 points for a free item</span>
                                </div>
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${usePoints ? 'bg-[#B68D40] border-[#B68D40]' : 'border-gray-500'}`}>
                                    {usePoints && <span className="text-[#1A0F0A] font-black text-sm">✓</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PICKUP TIME SELECTION */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Pickup Time</label>
                        <select
                            value={pickupType}
                            onChange={(e) => setPickupType(e.target.value)}
                            className="w-full bg-[#1A0F0A] border border-[#B68D40]/30 text-[#EEEBD3] rounded-xl px-4 py-3 outline-none focus:border-[#B68D40] transition-colors mb-3"
                        >
                            <option value="immediate">Immediate (in 15 mins)</option>
                            <option value="later">Schedule Later</option>
                        </select>

                        {pickupType === "later" && (
                            <div>
                                <input
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    className="w-full bg-[#1A0F0A] border border-[#B68D40]/30 text-[#EEEBD3] rounded-xl px-4 py-3 outline-none focus:border-[#B68D40] transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2 font-medium">
                                    * Format: 24-hour (e.g. 14:30 for 2:30 PM). Times in the past will auto-schedule for tomorrow.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 mb-6 text-[#EEEBD3]">
                        <div className="flex justify-between">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                        </div>

                        {usePoints && (
                            <div className="flex justify-between text-[#B68D40] font-bold">
                                <span>Free Coffee Discount</span>
                                <span>- ₹{discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="font-medium text-gray-400">Taxes (5% GST)</span>
                            <span className="font-bold text-gray-400">₹{tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#B68D40]/30 pt-6 mb-8">
                        <span className="text-xl font-medium text-[#EEEBD3]">Total Amount</span>
                        <span className="text-3xl font-black text-[#B68D40]">₹{grandTotal.toFixed(2)}</span>
                    </div>

                    <button onClick={handleCheckout} disabled={isProcessing} className="w-full py-4 bg-[#B68D40] text-[#1A0F0A] rounded-xl font-black text-xl hover:bg-[#EEEBD3] hover:-translate-y-1 transition-all shadow-lg disabled:opacity-50">
                        {isProcessing ? "Processing..." : "Proceed to Checkout"}
                    </button>

                    <div className="mt-4 text-center">
                        <span className="text-xs text-[#B68D40] uppercase tracking-widest font-bold">
                            ⭐ Earn {Math.floor(grandTotal / 10)} Loyalty Points
                        </span>
                    </div>
                </div>
            </div>

            {/* SIMULATED PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-[#EEEBD3] rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-[#1A0F0A] mb-2">Simulated Checkout</h2>
                            <p className="text-[#3E200B] font-medium">Test Payment Gateway</p>
                        </div>

                        <div className="bg-white/50 border border-[#B68D40]/30 rounded-2xl p-6 mb-8 text-center shadow-inner">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Amount to Pay</p>
                            <p className="text-5xl font-black text-[#1A0F0A]">₹{grandTotal.toFixed(2)}</p>
                        </div>

                        {paymentStatus === "idle" && (
                            <div className="space-y-4">
                                <button
                                    onClick={confirmPayment}
                                    className="w-full py-4 bg-[#B68D40] text-[#1A0F0A] rounded-xl font-black text-xl hover:bg-[#1A0F0A] hover:text-[#EEEBD3] transition-colors shadow-lg flex items-center justify-center gap-3"
                                >
                                    💳 Pay with Dummy Card
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-full py-3 bg-transparent text-gray-500 font-bold hover:text-[#1A0F0A] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {paymentStatus === "processing" && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-16 h-16 border-4 border-[#B68D40]/30 border-t-[#B68D40] rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-[#1A0F0A]">Processing Payment...</h3>
                                <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
                            </div>
                        )}

                        {paymentStatus === "success" && (
                            <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-green-500/30">
                                    ✓
                                </div>
                                <h3 className="text-2xl font-black text-green-600">Payment Successful!</h3>
                                <p className="text-sm text-gray-500 mt-2">Redirecting to confirmation...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
