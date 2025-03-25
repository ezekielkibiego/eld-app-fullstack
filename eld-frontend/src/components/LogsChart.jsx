import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function LogsChart({ logs }) {
  const drivingLogs = logs.filter(log => log.activity_type === 'Driving');
  const restingLogs = logs.filter(log => log.activity_type === 'Resting');

  const labels = drivingLogs.map(log => `Day ${log.day}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Driving Hours',
        data: drivingLogs.map(log => log.hours),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Resting Hours',
        data: restingLogs.map(log => log.hours),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Driving vs Resting Hours Per Day' }
    }
  };

  return <Bar data={data} options={options} />;
}

export default LogsChart;
