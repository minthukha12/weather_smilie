import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import weatherService from './WeatherService';

const WeatherComponent: React.FC = () => {
  const humidityCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        // fetch weather data from weatherservice
        const response = await weatherService.getWeatherData('2023-01-01');
        //extract from api
        const relativehumidity_2m = response.hourly.relativehumidity_2m;
        

        if (humidityCanvasRef.current) {
          //get canvas context
          const ctx = humidityCanvasRef.current.getContext('2d');
          if (ctx) {
            //destroy any overlaping existing chart (possible bug in chart.js)
            if (chartInstance.current) {
              chartInstance.current.destroy();
              chartInstance.current = null;
            }
            ///create chart instance
            chartInstance.current = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'August', 'September', 'October'],
                datasets: [
                  {
                    label: 'Relative Humidity',
                    data: relativehumidity_2m,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Relative Humidity',
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
      } catch (error) {
        console.error('Error fetching or rendering weather chart:', error);
      }
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    //responsive layout using tailwind
    <div className="p-4">
      <h1 className="text-2xl font-bold underline">Weather Dashboard</h1>
      <div className="md:flex md:items-center md:justify-between">
        <div className="md:w-1/2">
          <h2 className="font-semibold">Column Chart: Relative Humidity</h2>
          <canvas ref={humidityCanvasRef} className="w-full md:w-auto" height={300} />
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
