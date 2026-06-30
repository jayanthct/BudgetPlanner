import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR } from '../lib/formatters';
import { InvestmentBarChart } from './charts/InvestmentBarChart';
import { ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getCategoryTotal } from '../lib/allocationEngine';

export const InvestmentsPanel: React.FC = () => {
  const { profile, monthlyIncome, updateSubAllocation } = useBudgetStore();
  const categoryData = profile.investments;
  const investmentTotalPercentage = getCategoryTotal(categoryData);
  const investmentAmount = (investmentTotalPercentage / 100) * monthlyIncome;

  if (monthlyIncome <= 0) return null;

  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <ChartBarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">Investment Strategy</h2>
            <p className="text-xs text-gray-500 font-medium">{investmentTotalPercentage.toFixed(1)}% of Income</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 block">{formatINR(investmentAmount)}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Portfolio Split</h3>
          <div className="flex-1 min-h-[160px]">
            <InvestmentBarChart />
          </div>
          
          <div className="mt-6 space-y-4">
            {Object.entries(categoryData.subAllocations).map(([subKey, subPct]) => {
              const subAmount = (subPct / 100) * monthlyIncome;
              const labels: Record<string, string> = { equity: 'Equity (SIP/Stocks)', debt: 'Debt (PPF/EPF/FD)', gold: 'Gold (SGB/ETF)' };
              return (
                <div key={subKey} className="group">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{labels[subKey] || subKey}</span>
                    <span className="text-xs font-semibold text-gray-900">{formatINR(subAmount)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range"
                      min="0"
                      max="50"
                      step="0.1"
                      value={subPct}
                      onChange={(e) => updateSubAllocation('investments', subKey, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 transition-shadow accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 font-medium w-10 text-right">{subPct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <InformationCircleIcon className="w-4 h-4 text-gray-400" />
            CA Guidance Note
          </h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            The standard recommendation is ~60% Equity for growth, ~25% Debt for stability, and ~15% Gold as a hedge. 
          </p>
          
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Equity Mutual Funds</span>
              <span className="font-medium text-gray-900">High Risk</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">PPF (Tax-free debt)</span>
              <span className="font-medium text-gray-900">Zero Risk</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">NPS (Sec 80CCD)</span>
              <span className="font-medium text-gray-900">Hybrid</span>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 leading-tight">
              * Note: EPF is automatic via your employer. If you haven't exhausted Section 80C, substitute some Equity MF with ELSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
