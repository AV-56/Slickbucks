"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RewardsPage() {
    const [points, setPoints] = useState(0);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true); // New loading state

    useEffect(() => {
        const fetchLivePoints = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setIsLoading(false);
                return;
            }

            const localUser = JSON.parse(userStr);
            setUserName(localUser.name.split(' ')[0]);

            try {
                // Fetch live data from DB
                const res = await fetch(`/api/users/${localUser.id}`);
                if (res.ok) {
                    const dbUser = await res.json();
                    setPoints(dbUser.loyaltyPoints || 0);

                    // Sync with localStorage
                    localUser.loyaltyPoints = dbUser.loyaltyPoints;
                    localStorage.setItem("user", JSON.stringify(localUser));
                } else {
                    setPoints(localUser.loyaltyPoints || 0); // Show old data on fail
                }
            } catch (err) {
                setPoints(localUser.loyaltyPoints || 0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLivePoints();
    }, []);

    // 100 points = 1 Free Coffee
    const targetPoints = 100;
    const progress = Math.min((points % targetPoints) / targetPoints * 100, 100);
    const coffeesEarned = Math.floor(points / targetPoints);
    const pointsToNext = targetPoints - (points % targetPoints);

    if (isLoading) {
        return <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-[#1A0F0A] text-[#B68D40] text-xl font-bold animate-pulse">Loading Rewards...</div>;
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-[#1A0F0A] to-[#0a0604] py-16 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#EEEBD3] mb-4">
                        Hello, {userName || 'Coffee Lover'}! 👋
                    </h1>
                    <p className="text-xl text-[#B68D40] font-medium">Welcome to your Slickbucks Rewards</p>
                </div>

                {/* Rewards Card */}
                <div className="bg-[#120a07] border border-[#B68D40]/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

                    {/* Background glowing decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B68D40] opacity-5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">

                        {/* Points Circle */}
                        <div className="relative flex-shrink-0 w-48 h-48 flex items-center justify-center rounded-full border-[10px] border-[#1A0F0A] shadow-[0_0_30px_rgba(182,141,64,0.15)] bg-[#120a07]">
                            <div className="text-center">
                                <span className="block text-6xl font-black text-[#EEEBD3] mb-1">{points}</span>
                                <span className="block text-sm text-[#B68D40] font-bold uppercase tracking-wider">Points</span>
                            </div>
                        </div>

                        {/* Status Text & Progress Bar */}
                        <div className="flex-1 text-center md:text-left w-full">
                            {coffeesEarned > 0 ? (
                                <div className="mb-6">
                                    <h2 className="text-3xl font-black text-[#EEEBD3] mb-2">🎉 You've earned {coffeesEarned} Free Coffee{coffeesEarned > 1 ? 's' : ''}!</h2>
                                    <p className="text-gray-400">Show this to the barista at any outlet to redeem.</p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <h2 className="text-3xl font-black text-[#EEEBD3] mb-2">You're getting closer!</h2>
                                    <p className="text-gray-400">Earn <span className="text-[#B68D40] font-bold">{pointsToNext}</span> more points to get a free coffee.</p>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="w-full bg-[#1A0F0A] rounded-full h-4 mb-3 overflow-hidden border border-[#B68D40]/20 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-[#B68D40] to-[#D4AF37] h-full rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span>0</span>
                                <span>100 Points</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/menu" className="inline-block px-10 py-4 bg-[#B68D40] text-[#1A0F0A] rounded-full font-black text-lg hover:bg-[#EEEBD3] hover:-translate-y-1 transition-all shadow-xl">
                        Order More & Earn Points
                    </Link>
                </div>

            </div>
        </div>
    );
}
