import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR } from '../lib/formatters';
import type { DeepAllocationProfile } from '../lib/allocationEngine';
import { getCategoryTotal } from '../lib/allocationEngine';

interface CategoryCardProps {
  categoryKey: keyof DeepAllocationProfile;
  title: string;
  colorCode: string;
  icon: React.ReactNode;
  subItemLabels: { [key: string]: string };
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ categoryKey, title, colorCode, icon, subItemLabels }) => {
  const { profile, updateSubAllocation, monthlyIncome } = useBudgetStore();

  const categoryData = profile[categoryKey];
  const totalPercentage = getCategoryTotal(categoryData);
  const totalAmount = (totalPercentage / 100) * monthlyIncome;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${colorCode}15`, color: colorCode }}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 font-medium">{totalPercentage.toFixed(1)}% of Income</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 block">{formatINR(totalAmount)}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {Object.entries(categoryData.subAllocations).map(([subKey, subPct]) => {
          const subAmount = (subPct / 100) * monthlyIncome;
          return (
            <div key={subKey} className="group">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-medium text-gray-700">{subItemLabels[subKey] || subKey}</span>
                <span className="text-xs font-semibold text-gray-900">{formatINR(subAmount)}</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={subPct}
                  onChange={(e) => updateSubAllocation(categoryKey, subKey, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow"
                  style={{ accentColor: colorCode }}
                />
                <span className="text-xs text-gray-400 font-medium w-10 text-right">{subPct.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
