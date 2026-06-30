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

  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col justify-center">
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4 border-b border-gray-50 pb-3">
          <ShieldCheckIcon className="w-5 h-5 text-green-500" />
          Emergency Fund Planner
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Target (6x Lifestyle)</span>
            <span className="font-bold text-gray-900">{formatINR(targetFund)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Contribution</span>
            <span className="font-bold text-green-600">+{formatINR(monthlyContribution)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <span className="text-sm font-medium text-gray-700">Time to reach target</span>
            <span className="text-sm font-bold text-gray-900">{monthsToTarget > 0 ? `${monthsToTarget} Months` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
