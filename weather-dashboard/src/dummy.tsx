import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WeatherComponent: React.FC = () => {
  const humidityCanvasRef = useRef<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

  useEffect(() => {
    if (humidityCanvasRef.current) {
      const ctx = humidityCanvasRef.current.getContext('2d');
      if (ctx) {
        // Clear the canvas before rendering the chart
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Destroy the previous chart instance if exists
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Relative Humidity',
                data: [50, 60, 55, 70, 65, 80], // Dummy data for demonstration
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
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold underline">Weather Dashboard</h1>
      <div>
        <h2 className="font-semibold">Line Chart: Relative Humidity</h2>
        <canvas ref={humidityCanvasRef} width={400} height={300} />
      </div>
    </div>
  );
};

export default WeatherComponent;