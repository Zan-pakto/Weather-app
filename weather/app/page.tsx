"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [ip, setIp] = useState("");
  const [city, setCity] = useState("");
  interface WeatherData {
    name: string;
    sys: { country: string };
    weather: { description: string }[];
    main: { temp: number };
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchLocation = async () => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      setIp(data.ip);
    } catch (error) {
      console.error("Error fetching IP:", error);
    }
  };

  const fetchIpCity = async () => {
    try {
      const response = await fetch(
        `https://ipinfo.io/json?token=b28527eb6fc130`
      );
      const data = await response.json();
      setCity(data.city);
      fetchWeather(data.city);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const fetchWeather = async (cityName: string) => {
    if (!cityName) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=f140528a7044af55706aae100072fde4`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setWeather(null);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (ip) fetchIpCity();
  }, [ip]);

  return (
    <div
      className={`min-h-screen flex flex-col p-6 pt-10 items-center bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-[#2dd4bf]  to-[#1f2937]`}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-md w-full max-w-md text-center p-6">
        <h1 className="font-bold text-3xl text-gray-900">
          Weather in Your City
        </h1>
        <p className="mt-2 text-gray-700">
          Detected City: {city || "Fetching..."}
        </p>

        <input
          type="search"
          id="search"
          onChange={(e) => {
            if (e.target.value === "") {
              fetchIpCity();
            }
            setCity(e.target.value);
          }}
          className="mt-4 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg w-full"
          placeholder="Enter city..."
        />

        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-lg"
          onClick={() => fetchWeather(city)}
        >
          Get Weather
        </button>

        {weather && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-slate-950 font-b">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-lg text-slate-950 font-medium">
              {weather.weather[0].description}
            </p>
            <p className="text-lg text-slate-950 font-mono">
              🌡 {weather.main.temp}°C
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
