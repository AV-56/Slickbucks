"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OutletsPage() {
    const router = useRouter();
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    const checkIfOpen = (timingsStr, isActive) => {
        if (!isActive) return false;
        if (!timingsStr || timingsStr.toLowerCase() === "24 hours") return true;

        try {
            const [startStr, endStr] = timingsStr.split(" - ");

            const parseTime = (timeStr) => {
                const parts = timeStr.trim().split(" ");
                let [hours, minutes] = parts[0].split(":");
                hours = parseInt(hours, 10);
                const modifier = parts[1]?.toUpperCase();

                if (hours === 12 && modifier === "AM") hours = 0;
                if (modifier === "PM" && hours < 12) hours += 12;

                const d = new Date();
                d.setHours(hours, parseInt(minutes || 0, 10), 0, 0);
                return d;
            };

            const now = new Date();
            const startTime = parseTime(startStr);
            const endTime = parseTime(endStr);

            if (endTime < startTime) {
                if (now < startTime && now < endTime) {
                    startTime.setDate(startTime.getDate() - 1);
                } else {
                    endTime.setDate(endTime.getDate() + 1);
                }
            }
            return now >= startTime && now <= endTime;
        } catch (e) {
            return true;
        }
    };

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await fetch("/api/outlets");
                const data = await res.json();
                setOutlets(data);
            } catch (error) {
                console.error("Failed to fetch outlets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlets();
    }, []);

    const handleSelectOutlet = (outlet) => {
        // Set ID for Menu page fetching
        localStorage.setItem("selectedOutlet", JSON.stringify(outlet));
        router.push("/menu");
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#1A0F0A] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-[#EEEBD3] mb-4">
                        Select Your <span className="text-[#B68D40]">Outlet</span>
                    </h1>
                    <p className="text-lg text-gray-400">Choose where you want to pick up your freshly brewed coffee today.</p>
                </div>

                {loading ? (
                    <div className="text-center text-2xl text-[#B68D40] font-bold animate-pulse">
                        Loading Premium Outlets...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {outlets.map((outlet) => {
                            const isOpen = checkIfOpen(outlet.timings, outlet.isActive);
                            return (
                                <div
                                    key={outlet._id}
                                    className={`bg-[#EEEBD3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col border-2 
                                        ${isOpen ? 'cursor-pointer border-transparent hover:border-[#B68D40] hover:-translate-y-2' : 'opacity-70 grayscale-[50%] cursor-not-allowed border-gray-400'}`}
                                    onClick={() => isOpen && handleSelectOutlet(outlet)}
                                >
                                    {/* Image fetched from DB */}
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={outlet.imageURL} alt={outlet.name} className={`w-full h-full object-cover transition-transform duration-700 ${isOpen ? 'hover:scale-110' : ''}`} />
                                        <div className="absolute top-4 right-4 bg-[#1A0F0A] text-[#B68D40] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            Prep: {outlet.prepTime} mins
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className={`text-2xl font-black ${isOpen ? 'text-[#1A0F0A]' : 'text-gray-600'}`}>{outlet.name}</h2>
                                                {isOpen ? (
                                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">Open</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full uppercase">Closed</span>
                                                )}
                                            </div>
                                            <p className={`font-medium mb-6 flex items-start gap-2 ${isOpen ? 'text-[#3E200B]' : 'text-gray-500'}`}>
                                                <span className={isOpen ? 'text-[#B68D40] mt-1' : 'text-gray-400 mt-1'}>📍</span>
                                                {outlet.address}
                                            </p>
                                        </div>

                                        <div className={`rounded-xl p-4 mb-6 border ${isOpen ? 'bg-[#B68D40]/10 border-[#B68D40]/20' : 'bg-gray-200 border-gray-300'}`}>
                                            <p className={`text-sm font-bold mb-1 flex items-center gap-2 ${isOpen ? 'text-[#1A0F0A]' : 'text-gray-600'}`}>
                                                <span className={isOpen ? 'text-[#B68D40]' : 'text-gray-500'}>⏰</span> Timings: {outlet.timings}
                                            </p>
                                        </div>

                                        <button
                                            disabled={!isOpen}
                                            className={`w-full py-4 rounded-xl font-black transition-colors shadow-xl 
                                                ${isOpen ? 'bg-[#1A0F0A] text-[#B68D40] hover:bg-[#3E200B]' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                                        >
                                            {isOpen ? 'Select & View Menu' : 'Currently Closed'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
