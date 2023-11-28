import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import weatherService from './WeatherService';

const WeatherComponent: React.FC = () => {
  const radiationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await weatherService.getWeatherData('2023-01-01');
        const directRadiationData = response.hourly.direct_radiation;
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'August', 'September', 'October'];

        if (radiationCanvasRef.current) {
          const ctx = radiationCanvasRef.current.getContext('2d');
          if (ctx) {
            if (chartInstance) {
              chartInstance.destroy();
              chartInstance = null;
            }
            console.log(directRadiationData)

            chartInstance = new Chart(ctx, {
              type: 'line', // Area chart is based on the 'line' type in Chart.js
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Direct Radiation',
                    data: directRadiationData,
                    backgroundColor: 'rgba(255, 206, 86, 0.5)', // Area color with transparency
                    borderColor: 'rgba(255, 206, 86, 1)', // Border color
                    borderWidth: 1.5,
                    fill: true, // Fill area under the line
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Direct Radiation',
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
    <div className="p-4">
      
      <div>
        <h2 className="font-semibold">Area Chart: Direct Radiation</h2>
        <canvas ref={radiationCanvasRef} width={400} height={300} />
      </div>
    </div>
  );
};

export default WeatherComponent;
