"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("profile"); // "profile" | "orders"
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch user's latest data and their orders
        Promise.all([
            fetch(`/api/users/${parsedUser.id}`).then(res => res.json()),
            fetch(`/api/orders?userId=${parsedUser.id}`).then(res => res.json())
        ])
        .then(([userData, ordersData]) => {
            if (userData.name) {
                setName(userData.name);
                setPhone(userData.phone || "");
                // Update local storage just in case it's stale
                const updatedStorage = { ...parsedUser, name: userData.name, phone: userData.phone };
                localStorage.setItem("user", JSON.stringify(updatedStorage));
                setUser(updatedStorage);
            }
            if (Array.isArray(ordersData)) {
                setOrders(ordersData);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching profile data", err);
            setLoading(false);
        });

    }, [router]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Profile updated successfully! 🎉");
                // Update local storage
                const updatedUser = { ...user, name: data.user.name, phone: data.user.phone };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] flex items-center justify-center text-[#B68D40] text-3xl font-black animate-pulse">Loading Profile...</div>;

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            
            {/* SIDEBAR TABS */}
            <div className="w-full md:w-1/4">
                <div className="bg-[#EEEBD3] rounded-3xl p-6 shadow-xl sticky top-32">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 bg-[#1A0F0A] rounded-full flex items-center justify-center text-2xl font-black text-[#B68D40]">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#1A0F0A]">{user?.name}</h2>
                            <p className="text-sm font-medium text-[#3E200B]">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setActiveTab("profile")}
                            className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-[#1A0F0A] text-[#B68D40]' : 'text-[#3E200B] hover:bg-black/5'}`}
                        >
                            👤 My Profile
                        </button>
                        <button 
                            onClick={() => setActiveTab("orders")}
                            className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#1A0F0A] text-[#B68D40]' : 'text-[#3E200B] hover:bg-black/5'}`}
                        >
                            🛍️ Order History
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="w-full md:w-3/4">
                
                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="bg-[#120a07] rounded-3xl p-8 border border-[#B68D40]/30 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                        <h1 className="text-3xl font-black text-[#EEEBD3] mb-8 border-b border-[#B68D40]/20 pb-4">Personal Details</h1>
                        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-bold text-[#B68D40] mb-2 uppercase tracking-wide">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#1A0F0A] border-2 border-[#B68D40]/30 text-[#EEEBD3] rounded-xl px-4 py-3 focus:outline-none focus:border-[#B68D40] font-medium"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Email (Non-editable)</label>
                                <input 
                                    type="email" 
                                    value={user?.email}
                                    disabled
                                    className="w-full bg-black/50 border-2 border-gray-800 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#B68D40] mb-2 uppercase tracking-wide">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full bg-[#1A0F0A] border-2 border-[#B68D40]/30 text-[#EEEBD3] rounded-xl px-4 py-3 focus:outline-none focus:border-[#B68D40] font-medium"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={saving}
                                className="mt-8 px-8 py-3.5 bg-[#B68D40] text-[#1A0F0A] font-black rounded-xl hover:bg-[#EEEBD3] transition-colors shadow-lg disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="bg-[#120a07] rounded-3xl p-8 border border-[#B68D40]/30 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                        <h1 className="text-3xl font-black text-[#EEEBD3] mb-8 border-b border-[#B68D40]/20 pb-4">Past Orders</h1>
                        
                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <div className="text-6xl mb-4 opacity-50">🛒</div>
                                <p className="font-bold text-xl">You haven't ordered anything yet!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order._id} className="bg-[#1A0F0A] border border-[#B68D40]/30 rounded-2xl p-6 shadow-md hover:border-[#B68D40] transition-colors">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Order ID: {order._id.substring(order._id.length - 6)}</span>
                                                <span className="text-[#EEEBD3] font-black text-xl">₹{order.totalAmount}</span>
                                                <span className="text-[#B68D40] text-sm font-bold ml-3 border border-[#B68D40] px-2 py-0.5 rounded-full">{order.status}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-black/30 rounded-xl p-4 mt-4">
                                            <ul className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between text-sm">
                                                        <span className="text-[#EEEBD3] font-medium"><span className="text-[#B68D40] mr-2">{item.quantity}x</span> {item.name} {item.appliedCustomisations?.length > 0 && `(${item.appliedCustomisations.join(', ')})`}</span>
                                                        <span className="text-gray-400 font-bold">₹{item.price * item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
