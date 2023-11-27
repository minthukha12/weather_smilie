import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  hourly: {
    relativehumidity_2m: number[];
    direct_radiation: number[];
    
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    
  };
  
}

const WeatherComponent: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<WeatherData>(
          'https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2023-10-01&end_date=2023-10-10'
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold underline">Weather Dashboard</h1>
      {weatherData && (
        <div>
          <h2>Date: {weatherData.daily.time[0]}</h2>
          <p>Max Temperature: {weatherData.daily.temperature_2m_max[0]}°C</p>
          <p>Min Temperature: {weatherData.daily.temperature_2m_min[0]}°C</p>
          <p>Relative Humidity: {weatherData.hourly.relativehumidity_2m[0]}%</p>
          <p>Direct Radiation: {weatherData.hourly.direct_radiation[0]} W/m²</p>
          {/*  other data points similarly */}
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
