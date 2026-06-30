import React from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR, parseINR } from '../lib/formatters';

export const Header: React.FC = () => {
  const { monthlyIncome, setMonthlyIncome } = useBudgetStore();
  const [inputValue, setInputValue] = React.useState(monthlyIncome > 0 ? formatINR(monthlyIncome) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseINR(rawVal);
    
    // Update local string state
    if (parsed > 0) {
      setInputValue(formatINR(parsed));
      setMonthlyIncome(parsed);
    } else {
      setInputValue('');
      setMonthlyIncome(0);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 bg-white border-b border-gray-100">
      <h1 className="text-xl font-medium text-gray-500 mb-2">Monthly Take-Home Income</h1>
      <input 
        type="text" 
        value={inputValue}
        onChange={handleChange}
        placeholder="₹0"
        className="text-5xl md:text-7xl font-semibold text-center outline-none bg-transparent text-gray-900 w-full px-4"
      />
    </div>
  );
};
