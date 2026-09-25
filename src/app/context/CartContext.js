"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from storage
    useEffect(() => {
        const savedCart = localStorage.getItem('slickbucks_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('slickbucks_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const addToCart = (product, quantity, size, price) => {

        const uniqueCartId = `${product.id}-${size || 'regular'}`;

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.cartId === uniqueCartId);

            if (existingItem) {

                return prevItems.map(item =>
                    item.cartId === uniqueCartId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {

                return [...prevItems, {
                    cartId: uniqueCartId,
                    productId: product.id,
                    name: product.name,
                    imageIcon: product.imageIcon,
                    imageURL: product.imageURL,
                    size: size,
                    price: price,
                    quantity: quantity
                }];
            }
        });
    };

    // Decrease by 1 using Product ID
    const removeOneProduct = (productId) => {
        setCartItems((prevItems) => {
            const itemIndex = prevItems.findIndex(item => item.productId === productId);

            if (itemIndex >= 0) {
                // Clone item correctly
                const currentItem = { ...prevItems[itemIndex] };

                if (currentItem.quantity > 1) {
                    // Decrease quantity if > 1
                    currentItem.quantity -= 1;
                    const newItems = [...prevItems];
                    newItems[itemIndex] = currentItem;
                    return newItems;
                } else {
                    // Remove if quantity is 1
                    const newItems = [...prevItems];
                    newItems.splice(itemIndex, 1);
                    return newItems;
                }
            }
            return prevItems;
        });
    };

    // Update custom item quantity
    const updateQuantity = (cartId, delta) => {
        setCartItems((prevItems) => {
            const itemIndex = prevItems.findIndex(item => item.cartId === cartId);

            if (itemIndex >= 0) {
                const currentItem = { ...prevItems[itemIndex] };
                const newQuantity = currentItem.quantity + delta;

                if (newQuantity > 0) {
                    currentItem.quantity = newQuantity;
                    const newItems = [...prevItems];
                    newItems[itemIndex] = currentItem;
                    return newItems;
                } else {
                    // Remove if quantity reaches 0
                    const newItems = [...prevItems];
                    newItems.splice(itemIndex, 1);
                    return newItems;
                }
            }
            return prevItems;
        });
    };

    const removeFromCart = (cartId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCartItems([]);
    };


    return (
        <CartContext.Provider value={{ cartItems, clearCart, addToCart, updateQuantity, removeFromCart, removeOneProduct, cartTotal, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {
    return useContext(CartContext);
}
