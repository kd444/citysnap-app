"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CityFormProps {
    isLoading?: boolean;
}

export default function CityForm({ isLoading = false }: CityFormProps) {
    const [city, setCity] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (city.trim()) {
            router.push(`/?q=${encodeURIComponent(city.trim())}`);
        }
    };

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className="relative flex flex-col sm:flex-row gap-4 items-center"
            >
                {/* Search Input with Icon */}
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                            className={`h-5 w-5 transition-colors duration-200 ${
                                isFocused ? "text-blue-500" : "text-gray-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-0 ${
                            isFocused
                                ? "border-blue-400 shadow-lg shadow-blue-100"
                                : "border-gray-200 hover:border-gray-300"
                        } bg-white/80 backdrop-blur-sm placeholder-gray-500`}
                        placeholder="Search any city worldwide..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isLoading}
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isLoading || !city.trim()}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:transform-none disabled:shadow-none min-w-[140px]"
                >
                    <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Searching...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Explore City
                            </>
                        )}
                    </span>
                </button>
            </form>

            {/* Popular Cities Quick Access */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-500">Try:</span>
                {["Tokyo", "Paris", "New York", "London", "Sydney"].map(
                    (popularCity) => (
                        <button
                            key={popularCity}
                            onClick={() =>
                                router.push(
                                    `/?q=${encodeURIComponent(popularCity)}`
                                )
                            }
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 hover:scale-105 transform"
                        >
                            {popularCity}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
