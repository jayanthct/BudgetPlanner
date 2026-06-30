import React, { useState } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatINR } from '../lib/formatters';
import { CreditCardIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export const LoansPanel: React.FC = () => {
  const { loans, addLoan, removeLoan } = useBudgetStore();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (title.trim() && !isNaN(num) && num > 0) {
      addLoan(title.trim(), num);
      setTitle('');
      setAmount('');
    }
  };

  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <CreditCardIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Existing / New Loans</h3>
            <p className="text-xs text-gray-500 font-medium">Monthly EMIs</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 block">{formatINR(totalLoans)}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {loans.map(loan => (
          <div key={loan.id} className="flex items-center justify-between group py-1">
            <div>
              <span className="text-sm font-medium text-gray-700 block">{loan.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">{formatINR(loan.amount)}</span>
              <button onClick={() => removeLoan(loan.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {loans.length > 0 && <div className="h-px w-full bg-gray-100 my-2"></div>}

        <div className="flex items-center gap-2 mt-auto pt-2">
          <input 
            type="text" 
            placeholder="Loan Name (e.g. Car)" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
          />
          <input 
            type="number" 
            placeholder="EMI" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
          />
        </div>
        
        <button 
          onClick={handleAdd}
          className="mt-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
};
