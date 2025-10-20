// Free public APIs - no keys required!

export interface GeocodeResult {
    name: string;
    lat: number;
    lon: number;
    country: string;
}

export async function geocode(city: string): Promise<GeocodeResult> {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", city);
    url.searchParams.set("count", "1");

    const response = await fetch(url.toString(), {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const data = await response.json();
    const result = data?.results?.[0];

    if (!result) {
        throw new Error("City not found");
    }

    return {
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        country: result.country_code,
    };
}

export async function getWeather(lat: number, lon: number) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set(
        "current",
        "temperature_2m,apparent_temperature,wind_speed_10m,weather_code"
    );
    url.searchParams.set("hourly", "temperature_2m");
    url.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min"
    );
    url.searchParams.set("timezone", "auto");

    return fetch(url.toString(), {
        next: { revalidate: 900 }, // Cache for 15 minutes
    }).then((r) => r.json());
}

export async function getSunriseSunset(lat: number, lon: number) {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    return fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    }).then((r) => r.json());
}

export async function getHolidays(
    country: string,
    year: number = new Date().getFullYear()
) {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;
    return fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    }).then((r) => r.json());
}

export async function getWikiSummary(city: string) {
    const title = encodeURIComponent(city);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
    return fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    }).then((r) => r.json());
}

export async function getSpaceXNextLaunch() {
    const url = "https://api.spacexdata.com/v4/launches/next";
    return fetch(url, {
        next: { revalidate: 600 }, // Cache for 10 minutes
    }).then((r) => r.json());
}

// Weather code mapping for better display
export const weatherCodes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
};

