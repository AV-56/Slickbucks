"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("orders"); // orders or menu
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "/login";
            return;
        }
        const parsedUser = JSON.parse(user);
        if (parsedUser.role !== "ADMIN" && parsedUser.role !== "OUTLET_MANAGER") {
            alert("🛑 Access Denied! Only Cafe Staff can view this page.");
            window.location.href = "/";
            return;
        }

        fetchOrders();
        fetchProducts();

        const interval = setInterval(() => {
            if (activeTab === "orders") fetchOrders();
        }, 10000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus })
            });
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const toggleProductAvailability = async (productId, currentStatus) => {
        try {
            setProducts(prev => prev.map(p => p._id === productId ? { ...p, isAvailable: !currentStatus } : p));
            await fetch("/api/products", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, isAvailable: !currentStatus })
            });
        } catch (error) {
            alert("Failed to update availability");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "RECEIVED": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "PREPARING": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "READY": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "COMPLETED": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            default: return "bg-red-500/20 text-red-400 border-red-500/30";
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0a0604] flex items-center justify-center text-[#B68D40] text-2xl font-bold animate-pulse">Loading Dashboard...</div>;

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#0a0604] p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-[#B68D40]/30 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-[#EEEBD3] mb-2">Cafe Dashboard 👨‍🍳</h1>
                        <p className="text-gray-400">Manage incoming coffee orders and menu availability</p>
                    </div>
                    <div className="flex bg-[#120a07] rounded-xl p-1 border border-[#B68D40]/20">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === "orders" ? "bg-[#B68D40] text-[#1A0F0A]" : "text-gray-400 hover:text-[#EEEBD3]"}`}
                        >
                            Orders ({orders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("menu")}
                            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === "menu" ? "bg-[#B68D40] text-[#1A0F0A]" : "text-gray-400 hover:text-[#EEEBD3]"}`}
                        >
                            Menu Items
                        </button>
                    </div>
                </div>

                {activeTab === "orders" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-[#120a07] border border-[#B68D40]/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#B68D40]/50 transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-gray-400 font-mono bg-black px-3 py-1.5 rounded-md border border-gray-800 w-fit">
                                                ID: {order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className="text-sm font-bold text-[#EEEBD3]">
                                                {order.userId?.name || "Customer"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-[#B68D40] font-bold bg-[#B68D40]/10 px-2 py-1 rounded border border-[#B68D40]/20">
                                                Pickup: {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {order.paymentStatus === "PAID" && (
                                                <span className="text-[10px] text-green-400 font-bold tracking-wider uppercase">PAID ✓</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-[#EEEBD3]">
                                                <span className="font-medium">
                                                    <span className="text-[#B68D40] mr-2 font-black">{item.quantity}x</span>
                                                    {item.name}
                                                    {item.appliedCustomisations?.length > 0 && (
                                                        <span className="block text-xs text-gray-500 ml-7 uppercase tracking-wider mt-1">{item.appliedCustomisations[0]}</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-[#B68D40]/10">
                                    <div className="flex justify-between items-center mb-5">
                                        <span className="text-gray-400 font-medium">Total Amount:</span>
                                        <span className="text-xl font-black text-[#EEEBD3]">₹{(order.totalAmount || 0).toFixed(2)}</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Status</span>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`w-full appearance-none outline-none font-bold text-sm rounded-xl px-4 py-3 border-2 cursor-pointer text-center transition-colors ${getStatusColor(order.status)}`}
                                        >
                                            <option value="RECEIVED" className="bg-[#1A0F0A] text-white">☕ RECEIVED</option>
                                            <option value="PREPARING" className="bg-[#1A0F0A] text-white">🔄 PREPARING</option>
                                            <option value="READY" className="bg-[#1A0F0A] text-white">✅ READY</option>
                                            <option value="COMPLETED" className="bg-[#1A0F0A] text-white">🎉 COMPLETED</option>
                                            <option value="CANCELLED" className="bg-[#1A0F0A] text-white">❌ CANCELLED</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {orders.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-[#120a07] rounded-3xl border border-dashed border-[#B68D40]/30">
                                <div className="text-6xl mb-4 opacity-50">😴</div>
                                <h2 className="text-2xl text-gray-400 font-medium">No orders yet. Waiting for customers...</h2>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "menu" && (
                    <div className="bg-[#120a07] border border-[#B68D40]/20 rounded-2xl overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1A0F0A] border-b border-[#B68D40]/30">
                                    <th className="p-4 text-[#B68D40] font-black uppercase tracking-wider text-sm">Product Name</th>
                                    <th className="p-4 text-[#B68D40] font-black uppercase tracking-wider text-sm">Category</th>
                                    <th className="p-4 text-[#B68D40] font-black uppercase tracking-wider text-sm">Base Price</th>
                                    <th className="p-4 text-[#B68D40] font-black uppercase tracking-wider text-sm text-center">Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id} className="border-b border-[#B68D40]/10 hover:bg-[#1A0F0A]/50 transition-colors">
                                        <td className="p-4 text-[#EEEBD3] font-bold">{product.name}</td>
                                        <td className="p-4 text-gray-400">{product.category}</td>
                                        <td className="p-4 text-[#EEEBD3]">₹{product.basePrice}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleProductAvailability(product._id, product.isAvailable)}
                                                className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all border-2 ${product.isAvailable
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                                                        : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                                                    }`}
                                            >
                                                {product.isAvailable ? 'Available' : 'Disabled'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
