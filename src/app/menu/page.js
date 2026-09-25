"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
    const { cartItems, addToCart, removeOneProduct } = useCart();
    const router = useRouter();
    const [selectedOutlet, setSelectedOutlet] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    // Popup (Modal) States
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedCustomisations, setSelectedCustomisations] = useState({});

    useEffect(() => {
        const outletData = localStorage.getItem("selectedOutlet");
        if (!outletData) {
            router.push("/outlets");
            return;
        }

        const outlet = JSON.parse(outletData);
        setSelectedOutlet(outlet);

        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/products?outletId=${outlet._id}`);
                const data = await res.json();
                setMenuItems(data);
            } catch (error) {
                console.error("Failed to fetch menu");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [router]);

    const categories = ["All", ...new Set(menuItems.map(item => item.category))];
    const filteredItems = activeCategory === "All" ? menuItems : menuItems.filter(item => item.category === activeCategory);

    // Open popup on Add
    const handleAddClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);

        // Select first option by default
        let initialCustomisations = {};
        if (product.customisations && product.customisations.length > 0) {
            product.customisations.forEach((cust, index) => {
                if (cust.options && cust.options.length > 0) {
                    initialCustomisations[index] = cust.options[0];
                }
            });
        }
        setSelectedCustomisations(initialCustomisations);
    };

    // Calculate base price + customisations
    const currentPrice = selectedProduct
        ? selectedProduct.basePrice + Object.values(selectedCustomisations).reduce((sum, opt) => sum + (opt ? opt.priceDelta : 0), 0)
        : 0;

    if (loading) return <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] flex items-center justify-center text-[#B68D40] text-3xl font-black animate-pulse">Loading Menu...</div>;

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#B68D40]/20 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#EEEBD3] mb-2">Our <span className="text-[#B68D40]">Menu</span></h1>
                        <p className="text-gray-400">Viewing items available at: <span className="text-[#B68D40] font-bold bg-[#B68D40]/10 px-2 py-1 rounded">{selectedOutlet?.name}</span></p>
                    </div>
                    <button onClick={() => router.push('/outlets')} className="text-sm font-bold text-[#1A0F0A] bg-[#B68D40] px-5 py-3 rounded-xl hover:bg-[#EEEBD3] transition-colors shadow-lg">
                        Change Outlet
                    </button>
                </div>

                {/* Categories Tab */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-10 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md
                                ${activeCategory === category ? 'bg-[#B68D40] text-[#1A0F0A]' : 'bg-[#120a07] text-[#B68D40] border border-[#B68D40]/30 hover:bg-[#1A0F0A]'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.map(item => (
                        <div key={item._id} className="bg-[#120a07] border border-[#B68D40]/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-[#B68D40]/50 transition-all">
                            {/* Photo */}
                            <div className="h-56 overflow-hidden relative bg-black">
                                <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 left-4 bg-[#B68D40] text-[#1A0F0A] text-xs font-black px-3 py-1 rounded-full uppercase">
                                    {item.category}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-[#EEEBD3] mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#B68D40]/10 flex items-center justify-between">
                                    <span className="text-2xl font-black text-[#B68D40]">₹{item.basePrice}</span>

                                    {(() => {
                                        const qtyInCart = cartItems.filter(cartItem => cartItem.productId === item._id).reduce((sum, cartItem) => sum + cartItem.quantity, 0);

                                        if (qtyInCart > 0) {
                                            return (
                                                <div className="flex items-center bg-[#1A0F0A] rounded-xl overflow-hidden shadow-md w-32 justify-between border border-[#B68D40]/30">
                                                    <button onClick={() => removeOneProduct(item._id)} className="px-4 py-2 text-[#B68D40] font-black text-2xl hover:bg-white/10 transition-colors">-</button>
                                                    <span className="font-black text-lg text-[#EEEBD3]">{qtyInCart}</span>
                                                    {/* Plus pe popup khulega */}
                                                    <button onClick={() => handleAddClick(item)} className="px-4 py-2 text-[#B68D40] font-black text-2xl hover:bg-white/10 transition-colors">+</button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <button
                                                onClick={() => handleAddClick(item)}
                                                className="px-4 py-2 bg-[#B68D40] text-[#1A0F0A] rounded-xl font-black hover:bg-[#EEEBD3] transition-colors shadow-lg"
                                            >
                                                Add +
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CUSTOMISATION POPUP MODAL (WAPAS AA GAYA!) --- */}
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                        <div className="bg-[#120a07] border border-[#B68D40]/30 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-[#EEEBD3] rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors z-10"
                            >
                                X
                            </button>

                            {/* Popup mein bhi Image */}
                            <div className="h-32 w-full rounded-2xl overflow-hidden mb-4 relative">
                                <img src={selectedProduct.imageURL} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#120a07] to-transparent"></div>
                            </div>

                            <h2 className="text-2xl font-black text-[#EEEBD3] text-center mb-1">{selectedProduct.name}</h2>
                            <p className="text-center text-[#B68D40] font-black text-xl mb-6">₹{currentPrice}</p>

                            {/* Database wali Customisations render karna */}
                            {selectedProduct.customisations && selectedProduct.customisations.length > 0 && (
                                <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                                    {selectedProduct.customisations.map((cust, index) => (
                                        <div key={index} className="bg-[#1A0F0A] p-4 rounded-xl border border-[#B68D40]/20">
                                            <p className="font-bold text-[#EEEBD3] mb-3">Select {cust.type}</p>
                                            <div className="flex flex-wrap gap-3">
                                                {cust.options.map(option => (
                                                    <button
                                                        key={option.name}
                                                        onClick={() => setSelectedCustomisations(prev => ({...prev, [index]: option}))}
                                                        className={`flex-1 py-3 px-2 rounded-xl font-bold transition-all text-sm
                                                            ${selectedCustomisations[index]?.name === option.name
                                                                ? 'border-2 border-[#B68D40] bg-[#B68D40] text-[#1A0F0A]'
                                                                : 'border border-gray-600 bg-transparent text-gray-400 hover:border-[#B68D40]/50 hover:text-[#EEEBD3]'}`}
                                                    >
                                                        {option.name} {option.priceDelta > 0 && <span className="text-xs ml-1">(+₹{option.priceDelta})</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-[#1A0F0A] rounded-xl border border-[#B68D40]/30 overflow-hidden">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-2xl font-black text-[#B68D40] hover:bg-white/5 transition-colors">-</button>
                                    <span className="px-4 font-black text-xl text-[#EEEBD3] w-12 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-2xl font-black text-[#B68D40] hover:bg-white/5 transition-colors">+</button>
                                </div>

                                <button
                                    onClick={() => {
                                        const productForCart = {
                                            id: selectedProduct._id,
                                            name: selectedProduct.name,
                                            imageURL: selectedProduct.imageURL
                                        };
                                        const customisationString = Object.values(selectedCustomisations).map(opt => opt.name).join(", ") || "Regular";
                                        addToCart(productForCart, quantity, customisationString, currentPrice);
                                        setSelectedProduct(null);
                                    }}
                                    className="flex-1 py-4 bg-[#B68D40] text-[#1A0F0A] rounded-xl font-black text-lg hover:bg-[#EEEBD3] transition-colors shadow-lg"
                                >
                                    Add to Cart - ₹{currentPrice * quantity}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
