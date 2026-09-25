"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isLogin) {
                // Save token to LocalStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // Redirecting to home and refreshing to update navbar
                window.location.href = "/";
            } else {
                alert("Account Created! You can now login.");
                setIsLogin(true);
                setFormData({ name: "", email: "", password: "" });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-[#0a0604] px-4 py-12 relative overflow-hidden">

            {/* Background Glow Effect (Luxury Touch) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B68D40] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative w-full max-w-md bg-[#120a07] border border-[#B68D40]/20 rounded-3xl p-8 shadow-2xl shadow-black/50 z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <img src="/logo.png" alt="Slickbucks Logo" className="h-12 w-auto mix-blend-screen mx-auto" />
                    </Link>
                    <h2 className="text-3xl font-black text-[#EEEBD3]">
                        {isLogin ? "Welcome Back" : "Join the Club"}
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        {isLogin ? "Login to access your loyalty points" : "Sign up for exclusive coffee rewards"}
                    </p>
                </div>

                {/* Error Message Box */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {!isLogin && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#EEEBD3] text-sm font-bold ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full bg-[#0a0604] border border-[#B68D40]/30 rounded-xl px-4 py-3.5 text-[#EEEBD3] outline-none focus:border-[#B68D40] transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#EEEBD3] text-sm font-bold ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#0a0604] border border-[#B68D40]/30 rounded-xl px-4 py-3.5 text-[#EEEBD3] outline-none focus:border-[#B68D40] transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#EEEBD3] text-sm font-bold ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#0a0604] border border-[#B68D40]/30 rounded-xl px-4 py-3.5 text-[#EEEBD3] outline-none focus:border-[#B68D40] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#B68D40] text-[#1A0F0A] font-bold text-lg py-3.5 rounded-xl hover:bg-[#EEEBD3] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="text-[#B68D40] font-bold hover:underline ml-1"
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </div>

            </div>
        </div>
    );
}
