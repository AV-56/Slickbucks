"use client";

import { CartProvider } from "@/app/context/CartContext";


export default function Providers({ children }) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}
