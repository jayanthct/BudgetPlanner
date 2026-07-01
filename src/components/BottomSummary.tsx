import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { getCategoryTotal } from '../lib/allocationEngine';
import { formatINR } from '../lib/formatters';

export const BottomSummary: React.FC = () => {
  const { monthlyIncome, profile, loans, isEmergencyEnabled } = useBudgetStore();
  
  if (monthlyIncome <= 0) return null;

  const getCatAmount = (catKey: keyof typeof profile) => {
    if (catKey === 'excess') return 0;
    if (catKey === 'buffer' && !isEmergencyEnabled) return 0;
    return (getCategoryTotal(profile[catKey]) / 100) * monthlyIncome;
  };

  const needs = getCatAmount('needs');
  const wants = getCatAmount('wants');
  const subs = getCatAmount('subscriptions');
  const goals = getCatAmount('goals');
  const inv = getCatAmount('investments');
  const ins = getCatAmount('insurance');
  const buf = getCatAmount('buffer');
  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);

  const totalAllocated = needs + wants + subs + goals + inv + ins + buf + totalLoans;
  
  const excess = profile.excess.subAllocations.unallocated;
  const excessAmount = ((excess / 100) * monthlyIncome) - totalLoans;
  const isSurplus = excessAmount > 0.5;
  const isDeficit = excessAmount < -0.5;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Total Budget Verification</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm mb-6 pb-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Needs</span>
          <span className="font-semibold text-gray-900">{formatINR(needs)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Wants</span>
          <span className="font-semibold text-gray-900">{formatINR(wants)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Subscriptions</span>
          <span className="font-semibold text-gray-900">{formatINR(subs)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Goals & Travel</span>
          <span className="font-semibold text-gray-900">{formatINR(goals)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Investments</span>
          <span className="font-semibold text-gray-900">{formatINR(inv)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Insurance</span>
          <span className="font-semibold text-gray-900">{formatINR(ins)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Loans / EMIs</span>
          <span className="font-semibold text-gray-900">{formatINR(totalLoans)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Emergency/Buffer</span>
          <span className="font-semibold text-gray-900">{formatINR(buf)}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="text-center md:text-left flex-1">
          <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Assigned Budget</span>
          <span className="text-2xl font-bold text-gray-900">{formatINR(totalAllocated)}</span>
        </div>
        
        <div className="hidden md:block h-12 w-px bg-gray-200"></div>

        <div className="text-center md:text-right flex-1">
          <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Remaining Excess Buffer</span>
          <span className={`text-2xl font-bold ${(isSurplus || Math.abs(excessAmount) < 0.5) ? 'text-green-600' : 'text-red-500'}`}>
            {isSurplus ? '+' : ''}{formatINR(excessAmount)}
          </span>
          {isDeficit && (
             <span className="block text-sm text-red-500 font-medium mt-1">Warning: You are over budget!</span>
          )}
        </div>
      </div>
    </div>
  );
};
