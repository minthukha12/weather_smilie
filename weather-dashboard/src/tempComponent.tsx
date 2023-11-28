import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import weatherService from './WeatherService';

const WeatherComponent: React.FC = () => {
  const temperatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

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
            if (chartInstance) {
              chartInstance.destroy();
              chartInstance = null;
            }

            chartInstance = new Chart(ctx, {
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
      
      <div>
        <h2 className="font-semibold">Line Chart: Temperature Variation</h2>
        <canvas ref={temperatureCanvasRef} width={400} height={300} />
      </div>
    </div>
  );
};

export default WeatherComponent;
