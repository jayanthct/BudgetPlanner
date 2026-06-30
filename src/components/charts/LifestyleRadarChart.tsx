import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useBudgetStore } from '../../store/useBudgetStore';
import { getCategoryTotal } from '../../lib/allocationEngine';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const LifestyleRadarChart: React.FC = () => {
  const { profile } = useBudgetStore();

  const data = {
    labels: ['Needs', 'Wants & Subs', 'Goals', 'Investments', 'Buffer'],
    datasets: [
      {
        label: 'Current Allocation (%)',
        data: [
          getCategoryTotal(profile.needs),
          getCategoryTotal(profile.wants) + getCategoryTotal(profile.subscriptions),
          getCategoryTotal(profile.goals),
          getCategoryTotal(profile.investments),
          getCategoryTotal(profile.buffer)
        ],
        backgroundColor: 'rgba(0, 111, 238, 0.2)',
        borderColor: 'rgba(0, 111, 238, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="w-full h-48 md:h-64">
      <Radar data={data} options={options} />
    </div>
  );
};
