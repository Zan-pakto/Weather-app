"use client";
import { useState } from "react";
export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f140528a7044af55706aae100072fde4`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Weather App</h1>
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />
        <button
          onClick={fetchWeather}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Get Weather
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {weather && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-lg">{weather.weather[0].description}</p>
            <p className="text-lg">🌡 {weather.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
}
