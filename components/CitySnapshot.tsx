import Card from "./Card";
import { weatherCodes } from "@/lib/apis";

interface CitySnapshotProps {
    data: {
        geo: {
            name: string;
            country: string;
        };
        weather: any;
        sunrise: any;
        holidays: any[];
        wiki: any;
        spacex: any;
    };
}

export default function CitySnapshot({ data }: CitySnapshotProps) {
    const { geo, weather, sunrise, holidays, wiki, spacex } = data;

    // Get current weather description
    const currentWeatherCode = weather?.current?.weather_code;
    const weatherDescription = currentWeatherCode
        ? weatherCodes[currentWeatherCode]
        : "Unknown";

    // Find next upcoming holiday
    const now = new Date();
    const nextHoliday = holidays?.find(
        (holiday) => new Date(holiday.date) > now
    );

    // Format SpaceX launch date
    const launchDate = spacex?.date_utc ? new Date(spacex.date_utc) : null;

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Weather Card */}
            <Card
                title={`Weather — ${geo.name}`}
                className="md:col-span-2"
                gradient={true}
                icon={
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                    </svg>
                }
            >
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {weather?.current?.temperature_2m}°C
                            </p>
                            <p className="text-sm text-gray-500">
                                Feels like{" "}
                                {weather?.current?.apparent_temperature}°C
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">
                                {weatherDescription}
                            </p>
                            <p className="text-xs text-gray-500">
                                Wind: {weather?.current?.wind_speed_10m} km/h
                            </p>
                        </div>
                    </div>

                    {weather?.daily && (
                        <div className="border-t pt-3">
                            <p className="text-sm font-medium mb-2">
                                5-Day Forecast:
                            </p>
                            <div className="grid grid-cols-5 gap-2 text-xs">
                                {weather.daily.time
                                    .slice(0, 5)
                                    .map((date: string, index: number) => (
                                        <div key={date} className="text-center">
                                            <p className="font-medium">
                                                {new Date(
                                                    date
                                                ).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                {
                                                    weather.daily
                                                        .temperature_2m_max[
                                                        index
                                                    ]
                                                }
                                                ° /{" "}
                                                {
                                                    weather.daily
                                                        .temperature_2m_min[
                                                        index
                                                    ]
                                                }
                                                °
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Sunrise/Sunset Card */}
            <Card
                title="Sunrise / Sunset"
                icon={
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                }
            >
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Sunrise:</span>
                        <span className="font-medium">
                            {sunrise?.results?.sunrise
                                ? new Date(
                                      sunrise.results.sunrise
                                  ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Sunset:</span>
                        <span className="font-medium">
                            {sunrise?.results?.sunset
                                ? new Date(
                                      sunrise.results.sunset
                                  ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                            Day Length:
                        </span>
                        <span className="font-medium">
                            {sunrise?.results?.day_length
                                ? `${Math.floor(
                                      sunrise.results.day_length / 3600
                                  )}h ${Math.floor(
                                      (sunrise.results.day_length % 3600) / 60
                                  )}m`
                                : "—"}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Next Holiday Card */}
            <Card
                title={`Next Holiday (${geo.country})`}
                icon={
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                }
            >
                {nextHoliday ? (
                    <div className="space-y-2">
                        <p className="font-medium text-lg">
                            {nextHoliday.localName}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(nextHoliday.date).toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </p>
                        {nextHoliday.global && (
                            <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                                Global Holiday
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No upcoming holidays found</p>
                )}
            </Card>

            {/* Wikipedia Card */}
            <Card
                title="About the City"
                className="md:col-span-2"
                icon={
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                    </svg>
                }
            >
                <div className="space-y-3">
                    {wiki?.extract ? (
                        <>
                            <p className="text-sm leading-relaxed">
                                {wiki.extract.length > 300
                                    ? `${wiki.extract.substring(0, 300)}...`
                                    : wiki.extract}
                            </p>
                            {wiki.content_urls?.desktop?.page && (
                                <a
                                    href={wiki.content_urls.desktop.page}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Read more on Wikipedia →
                                </a>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500">
                            No summary available for this city.
                        </p>
                    )}
                </div>
            </Card>

            {/* SpaceX Launch Card */}
            <Card
                title="SpaceX Next Launch"
                icon={
                    <svg
                        className="h-6 w-6"
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
                }
            >
                {spacex ? (
                    <div className="space-y-2">
                        <p className="font-medium text-lg">
                            {spacex.name || "Upcoming Launch"}
                        </p>
                        {launchDate && (
                            <p className="text-sm text-gray-600">
                                {launchDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        )}
                        {launchDate && (
                            <p className="text-sm text-gray-500">
                                {launchDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZoneName: "short",
                                })}
                            </p>
                        )}
                        {spacex.details && (
                            <p className="text-xs text-gray-500 mt-2">
                                {spacex.details.length > 100
                                    ? `${spacex.details.substring(0, 100)}...`
                                    : spacex.details}
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No upcoming launches found</p>
                )}
            </Card>
        </div>
    );
}
