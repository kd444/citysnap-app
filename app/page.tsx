import CityForm from "@/components/CityForm";
import CitySnapshot from "@/components/CitySnapshot";
import {
    geocode,
    getWeather,
    getSunriseSunset,
    getHolidays,
    getWikiSummary,
    getSpaceXNextLaunch,
} from "@/lib/apis";
import { Suspense } from "react";

// Force dynamic rendering because this page depends on searchParams
export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: {
        q?: string;
    };
}

async function getCityData(city: string) {
    try {
        // First, geocode the city to get coordinates and country
        const geo = await geocode(city);

        // Fetch all data in parallel for better performance
        const [weather, sunrise, holidays, wiki, spacex] = await Promise.all([
            getWeather(geo.lat, geo.lon),
            getSunriseSunset(geo.lat, geo.lon),
            getHolidays(geo.country, new Date().getFullYear()),
            getWikiSummary(geo.name),
            getSpaceXNextLaunch(),
        ]);

        return {
            geo,
            weather,
            sunrise,
            holidays,
            wiki,
            spacex,
        };
    } catch (error) {
        console.error("Error fetching city data:", error);
        throw new Error(
            `Failed to fetch data for ${city}. Please try a different city name.`
        );
    }
}

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div
                    className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin"
                    style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                    }}
                ></div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-lg font-medium text-gray-700">
                    Discovering your city...
                </p>
                <p className="text-sm text-gray-500">
                    Gathering weather, culture, and fascinating facts
                </p>
            </div>
            <div className="flex space-x-1">
                <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
        </div>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                            <svg
                                className="h-6 w-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            Oops! Something went wrong
                        </h3>
                        <p className="text-red-700 leading-relaxed">
                            {message}
                        </p>
                        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-red-100">
                            <p className="text-sm text-red-600">
                                💡 <strong>Tip:</strong> Try searching for a
                                major city name or check your spelling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function Page({ searchParams }: PageProps) {
    const cityQuery = searchParams?.q;
    let cityData = null;
    let error = null;

    if (cityQuery) {
        try {
            cityData = await getCityData(cityQuery);
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="relative">
                        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                            City Snap
                        </h1>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Discover the world through data. Get instant insights
                        about any city with weather, cultural information, and
                        fascinating facts - all powered by free public APIs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full font-medium shadow-sm border border-green-200/50">
                            ✨ No API Keys Required
                        </span>
                        <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full font-medium shadow-sm border border-blue-200/50">
                            🌐 Free Public APIs
                        </span>
                        <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full font-medium shadow-sm border border-purple-200/50">
                            ⚡ Real-time Data
                        </span>
                    </div>
                </div>

                {/* Search Form */}
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <CityForm />
                    </div>
                </div>

                {/* Results */}
                {cityQuery && (
                    <div className="space-y-8">
                        {error ? (
                            <ErrorMessage message={error} />
                        ) : (
                            <Suspense fallback={<LoadingSpinner />}>
                                {cityData && <CitySnapshot data={cityData} />}
                            </Suspense>
                        )}
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center space-y-4 pt-16 border-t border-gray-200/50">
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Data sourced from Open-Meteo, Sunrise-Sunset,
                        Nager.Date, Wikipedia, and SpaceX APIs.
                    </p>
                    <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
