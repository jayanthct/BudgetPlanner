import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useBudgetStore } from '../../store/useBudgetStore';
import { getCategoryTotal } from '../../lib/allocationEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const SavingsProjectionChart: React.FC = () => {
  const { profile, monthlyIncome } = useBudgetStore();
  
  if (monthlyIncome <= 0) return null;

  const investmentPct = getCategoryTotal(profile.investments);
  const bufferPct = getCategoryTotal(profile.buffer);
  const excessPct = profile.excess.subAllocations.unallocated;

  // Monthly additions (Investments + Buffer + Excess)
  const monthlyAddition = ((investmentPct + bufferPct + excessPct) / 100) * monthlyIncome;
  
  // Assume a very conservative 6% annual return on investments+buffer combined
  const monthlyRate = 0.06 / 12;
  
  const labels = ['1m', '3m', '6m', '9m', '12m'];
  const dataPoints = [];
  
  let currentBalance = 0;
  const months = [1, 3, 6, 9, 12];
  
  // Compounding calculation
  let monthCursor = 0;
  for (let m of months) {
    while (monthCursor < m) {
      currentBalance = (currentBalance + monthlyAddition) * (1 + monthlyRate);
      monthCursor++;
    }
    dataPoints.push(currentBalance);
  }

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Projected Wealth',
        data: dataPoints,
        borderColor: '#17C964',
        backgroundColor: 'rgba(23, 201, 100, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return ` ₹${Math.round(context.raw).toLocaleString('en-IN')}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-40">
      <Line data={data} options={options} />
    </div>
  );
};
