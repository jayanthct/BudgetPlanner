import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useBudgetStore } from '../../store/useBudgetStore';
import { getCategoryTotal } from '../../lib/allocationEngine';

ChartJS.register(ArcElement, Tooltip, Legend);

export const AllocationDonutChart: React.FC = () => {
  const { profile } = useBudgetStore();

  const labels = [
    'Needs', 
    'Wants', 
    'Subscriptions', 
    'Goals/Travel', 
    'Investments', 
    'Insurance', 
    'Buffer/Savings'
  ];

  const dataValues = [
    getCategoryTotal(profile.needs),
    getCategoryTotal(profile.wants),
    getCategoryTotal(profile.subscriptions),
    getCategoryTotal(profile.goals),
    getCategoryTotal(profile.investments),
    getCategoryTotal(profile.insurance),
    getCategoryTotal(profile.buffer),
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          '#006FEE', // Needs
          '#17C964', // Wants
          '#F5A524', // Subscriptions
          '#F31260', // Goals
          '#7828C8', // Investments
          '#18181B', // Insurance
          '#9353D3', // Buffer
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = Number(context.raw).toFixed(1);
            return ` ${context.label}: ${val}%`;
          }
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
      <div className="w-56 h-56 md:w-64 md:h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
