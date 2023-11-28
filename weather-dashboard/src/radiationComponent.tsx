import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import weatherService from './WeatherService';

const WeatherComponent: React.FC = () => {
  const radiationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await weatherService.getWeatherData('2023-01-01');
        const directRadiation = response.hourly.direct_radiation;
        const labels = Array.from({ length: directRadiation.length }, (_, i) => i + 1);
        const customLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        if (radiationCanvasRef.current) {
          const ctx = radiationCanvasRef.current.getContext('2d');
          if (ctx) {
            if (chartInstance.current) {
              chartInstance.current.destroy();
              chartInstance.current = null;
            }

            chartInstance.current = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels.map((_, i) => customLabels[Math.floor(i / (labels.length / customLabels.length))]),
                datasets: [
                  {
                    label: 'Direct Radiation',
                    data: directRadiation,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Direct Radiation Variation',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Months',
                    },
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
          <h2 className="font-semibold">Area Chart: Direct Radiation Variation</h2>
          <canvas ref={radiationCanvasRef} className="w-full md:w-auto" width={400} height={300} />
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
