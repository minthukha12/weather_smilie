import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartType } from 'chart.js';
import weatherService from './WeatherService';

interface WeatherData {
  relativehumidity_2m: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  direct_radiation: number[];
}

const WeatherComponent: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    relativehumidity_2m: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    direct_radiation: [],
  });
  const [loading, setLoading] = useState(true);
  const canvasRefs = {
    humidity: useRef<HTMLCanvasElement | null>(null),
    temperature: useRef<HTMLCanvasElement | null>(null),
    radiation: useRef<HTMLCanvasElement | null>(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await weatherService.getWeatherData('2023-01-01');
        
        const { temperature_2m_max, temperature_2m_min } = response.daily;
      const { relativehumidity_2m, direct_radiation } = response.hourly;

      setWeatherData({
        ...weatherData,
        temperature_2m_max,
        temperature_2m_min,
        relativehumidity_2m,
        direct_radiation,
      });
        
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [weatherData]);

  useEffect(() => {
    console.log("hi")
    const createChart = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, data: number[], label: string, chartType: ChartType) => {
      if (data.length > 0 && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          
          new Chart(ctx, {
            type: chartType,
            data: {
              labels: data.map((_, i) => i.toString()),
              datasets: [
                {
                  label,
                  data,
                  backgroundColor: chartType === 'bar' ? 'steelblue' : 'transparent',
                  borderColor: chartType === 'line' ? 'red' : 'blue',
                  borderWidth: 1.5,
                  fill: chartType === 'line' ? true : false,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: label,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      }
    };

    createChart(canvasRefs.humidity, weatherData.relativehumidity_2m, 'Relative Humidity', 'bar');
    createChart(canvasRefs.temperature, weatherData.temperature_2m_max.concat(weatherData.temperature_2m_min), 'Temperature', 'line');
    createChart(canvasRefs.radiation, weatherData.direct_radiation, 'Direct Radiation', 'line');
  }, [weatherData]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold underline">Weather Dashboard</h1>
      <div>
        <h2 className="font-semibold">Column Chart: Relative Humidity</h2>
        <canvas ref={canvasRefs.humidity} width={400} height={300} />
      </div>
      <div>
        <h2 className="font-semibold">Line Chart: Temperature</h2>
        <canvas ref={canvasRefs.temperature} width={400} height={300} />
      </div>
      <div>
        <h2 className="font-semibold">Area Chart: Direct Radiation</h2>
        <canvas ref={canvasRefs.radiation} width={400} height={300} />
      </div>
    </div>
  );
};

export default WeatherComponent;
