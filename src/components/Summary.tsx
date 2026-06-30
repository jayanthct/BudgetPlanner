import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR } from '../lib/formatters';
import { getCategoryTotal } from '../lib/allocationEngine';

export const Summary: React.FC = () => {
  const { monthlyIncome, profile } = useBudgetStore();

  if (monthlyIncome <= 0) return null;

  const allocated = Object.entries(profile)
    .filter(([k]) => k !== 'excess')
    .reduce((sum, [_, cat]) => sum + getCategoryTotal(cat), 0);
  
  const excess = profile.excess.subAllocations.unallocated;

  const allocatedAmount = (allocated / 100) * monthlyIncome;
  const excessAmount = (excess / 100) * monthlyIncome;
  const isDeficit = excessAmount < -0.5;
  const isSurplus = excessAmount > 0.5;

  return (
    <div className="w-full py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Income</span>
        <span className="text-2xl font-semibold text-gray-900">{formatINR(monthlyIncome)}</span>
      </div>
      <div className="flex flex-col items-center md:items-end text-right">
        <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Allocated Budget</span>
        <span className="text-2xl font-semibold text-gray-900">{formatINR(allocatedAmount)}</span>
        {(isSurplus || isDeficit) && (
          <span className={`text-sm font-semibold mt-1 ${isSurplus ? 'text-green-600' : 'text-red-500'}`}>
            {isSurplus ? '+' : ''} {formatINR(excessAmount)} {isSurplus ? 'available for buffer' : 'over budget'}
          </span>
        )}
      </div>
    </div>
  );
};
