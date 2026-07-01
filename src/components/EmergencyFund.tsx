import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getCategoryTotal } from '../lib/allocationEngine';
import { formatINR } from '../lib/formatters';

export const EmergencyFund: React.FC = () => {
  const { monthlyIncome, profile, isEmergencyEnabled, toggleEmergency } = useBudgetStore();

  const targetFund = monthlyIncome * 6;
  const monthlyContribution = (getCategoryTotal(profile.buffer) / 100) * monthlyIncome;
  const monthsToTarget = monthlyContribution > 0 ? Math.ceil(targetFund / monthlyContribution) : 0;

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden h-full flex flex-col justify-center transition-colors duration-300 ${isEmergencyEnabled ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50'}`}>
      <div className="p-5">
        <div className={`flex items-center justify-between mb-4 pb-3 ${isEmergencyEnabled ? 'border-b border-gray-50' : ''}`}>
          <div className={`flex items-center gap-2 font-semibold ${isEmergencyEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
            <ShieldCheckIcon className={`w-5 h-5 ${isEmergencyEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            Emergency Fund
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isEmergencyEnabled} 
              onChange={(e) => toggleEmergency(e.target.checked)} 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        
        {isEmergencyEnabled ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
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
        ) : (
          <div className="text-sm text-gray-500 text-center py-2 animate-in fade-in duration-300">
            Emergency buffer is disabled. Funds have been moved to your excess pool.
          </div>
        )}
      </div>
    </div>
  );
};
