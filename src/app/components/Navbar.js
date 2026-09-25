"use client"; // Enable hooks usage

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    // Get total cart items
    const { totalItems } = useCart();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <nav className="bg-[#EEEBD3] shadow-xl sticky top-0 z-50">
            <div className="w-full px-6 md:px-12 lg:px-20">
                <div className="flex justify-between h-24 items-center">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center">
                        <img src="/logo.png" alt="Slickbucks Logo" className="h-28 w-auto object-contain mix-blend-multiply" />
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex space-x-8 items-center">
                        <Link href="/" className="text-[#2C1810] hover:text-[#D4AF37] transition-colors font-bold tracking-wide">Home</Link>
                        <Link href="/outlets" className="text-[#2C1810] hover:text-[#D4AF37] transition-colors font-bold tracking-wide">Outlets</Link>

                        {/* 🛒 CART LINK WITH INDICATOR */}
                        <Link href="/cart" className="text-[#2C1810] hover:text-[#D4AF37] transition-colors font-bold tracking-wide flex items-center gap-1">
                            Cart
                            {/* Show badge only if cart has items */}
                            {totalItems > 0 && (
                                <span className="bg-[#1A0F0A] text-[#B68D40] text-xs font-black px-2 py-0.5 rounded-full animate-in zoom-in duration-300">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 ml-2">
                                <Link href="/rewards" className="text-[#2C1810] hover:text-[#D4AF37] font-bold tracking-wide flex items-center gap-1">
                                    ⭐ <span className="hidden sm:inline">Rewards</span>
                                </Link>
                                <div className="h-6 w-px bg-[#2C1810]/20 mx-1"></div>
                                <Link href="/profile" className="text-[#2C1810] font-black hover:text-[#B68D40] transition-colors underline decoration-2 underline-offset-4">Hi, {user.name.split(' ')[0]}</Link>
                                <button onClick={handleLogout} className="bg-transparent border-2 border-[#2C1810] text-[#2C1810] px-5 py-1.5 rounded-full font-bold hover:bg-[#2C1810] hover:text-[#EEEBD3] transition-all text-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="bg-[#B68D40] text-[#2C1810] px-7 py-2.5 rounded-full font-bold hover:bg-[#b8952b] hover:text-white hover:scale-105 transition-all shadow-md">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
