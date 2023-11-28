import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import weatherService from './WeatherService';

const WeatherComponent: React.FC = () => {
  const temperatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await weatherService.getWeatherData('2023-01-01');
        const temperaturesMax = response.daily.temperature_2m_max;
        const temperaturesMin = response.daily.temperature_2m_min;
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'August', 'September', 'October'];

        if (temperatureCanvasRef.current) {
          const ctx = temperatureCanvasRef.current.getContext('2d');
          if (ctx) {
            if (chartInstance.current) {
              chartInstance.current.destroy();
              chartInstance.current = null;
            }

            chartInstance.current = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Max Temperature',
                    data: temperaturesMax,
                    borderColor: 'red',
                    borderWidth: 1.5,
                    fill: false,
                  },
                  {
                    label: 'Min Temperature',
                    data: temperaturesMin,
                    borderColor: 'blue',
                    borderWidth: 1.5,
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Temperature Variation',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false, // Change according to your data
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
    <div className="p-4">
      <div className="md:flex md:items-center md:justify-between">
        <div className="md:w-1/2">
        <h2 className="font-semibold">Line Chart: Temperature Variation</h2>
        <canvas ref={temperatureCanvasRef} className="w-full md:w-auto" width={400} height={300} />
      </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
