import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR } from '../lib/formatters';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getCategoryTotal } from '../lib/allocationEngine';

export const EmergencyFund: React.FC = () => {
  const { profile, monthlyIncome } = useBudgetStore();
  
  if (monthlyIncome <= 0) return null;

  const monthlyExpenses = ((getCategoryTotal(profile.needs) + getCategoryTotal(profile.wants) + getCategoryTotal(profile.subscriptions)) / 100) * monthlyIncome;
  const targetFund = monthlyExpenses * 6; // 6 months of expenses
  const monthlyContribution = (getCategoryTotal(profile.buffer) / 100) * monthlyIncome;
  
  const monthsToTarget = monthlyContribution > 0 ? Math.ceil(targetFund / monthlyContribution) : 0;
  const progressPercent = 15; // Mock progress

  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col justify-center">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
            Emergency Target
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatINR(targetFund)}
          </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6x monthly lifestyle costs</span>
          <span>{monthsToTarget > 0 ? `~${monthsToTarget}m to reach` : ''}</span>
        </div>
      </div>
    </div>
  );
};
