import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useBudgetStore } from '../../store/useBudgetStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const InvestmentBarChart: React.FC = () => {
  const { profile, monthlyIncome } = useBudgetStore();
  
  const eq = profile.investments.subAllocations.equity || 0;
  const db = profile.investments.subAllocations.debt || 0;
  const gd = profile.investments.subAllocations.gold || 0;
  const sv = profile.investments.subAllocations.savings || 0;

  const data = {
    labels: ['Equity', 'Debt/PPF', 'Gold', 'Savings'],
    datasets: [
      {
        label: 'Investment Split',
        data: [
          (eq / 100) * monthlyIncome,
          (db / 100) * monthlyIncome,
          (gd / 100) * monthlyIncome,
          (sv / 100) * monthlyIncome,
        ],
        backgroundColor: '#7828C8',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false, beginAtZero: true },
      x: { grid: { display: false } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="w-full h-40">
      <Bar data={data} options={options} />
    </div>
  );
};
