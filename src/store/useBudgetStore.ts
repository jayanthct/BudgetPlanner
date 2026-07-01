import { create } from 'zustand';
import type { DeepAllocationProfile } from '../lib/allocationEngine';
import { getDeepAllocationForIncome } from '../lib/allocationEngine';

export interface Loan {
  id: string;
  title: string;
  amount: number;
}

interface BudgetState {
  monthlyIncome: number;
  profile: DeepAllocationProfile;
  loans: Loan[];
  isEmergencyEnabled: boolean;
  setMonthlyIncome: (income: number) => void;
  updateSubAllocation: (category: keyof DeepAllocationProfile, subKey: string, percentage: number) => void;
  resetToRecommended: () => void;
  addLoan: (title: string, amount: number) => void;
  removeLoan: (id: string) => void;
  toggleEmergency: (enabled: boolean) => void;
}

const defaultIncome = 0;
const defaultProfile = getDeepAllocationForIncome(defaultIncome);

export const useBudgetStore = create<BudgetState>((set) => ({
  monthlyIncome: defaultIncome,
  profile: defaultProfile,
  loans: [],
  isEmergencyEnabled: true,
  setMonthlyIncome: (income: number) => {
    set({
      monthlyIncome: income,
      profile: getDeepAllocationForIncome(income),
      isEmergencyEnabled: true
    });
  },
  updateSubAllocation: (category: keyof DeepAllocationProfile, subKey: string, newPercentage: number) => {
    set((state) => {
      const newProfile = JSON.parse(JSON.stringify(state.profile)) as DeepAllocationProfile;
      
      const oldPercentage = newProfile[category].subAllocations[subKey];
      const difference = newPercentage - oldPercentage;

      // Allow freely sliding up or down. If sliding up goes beyond available excess, it will just drive excess negative (deficit).
      newProfile[category].subAllocations[subKey] = newPercentage;
      newProfile.excess.subAllocations.unallocated -= difference;

      return { profile: newProfile };
    });
  },
  addLoan: (title: string, amount: number) => {
    set((state) => ({
      loans: [...state.loans, { id: Date.now().toString(), title, amount }]
    }));
  },
  removeLoan: (id: string) => {
    set((state) => ({
      loans: state.loans.filter(l => l.id !== id)
    }));
  },
  resetToRecommended: () => {
    set((state) => ({
      profile: getDeepAllocationForIncome(state.monthlyIncome),
      loans: [],
      isEmergencyEnabled: true
    }));
  },
  toggleEmergency: (enabled: boolean) => {
    set((state) => {
      const newProfile = JSON.parse(JSON.stringify(state.profile)) as DeepAllocationProfile;
      const bufferTotal = Object.values(newProfile.buffer.subAllocations).reduce((sum, val) => sum + val, 0);
      
      if (enabled) {
        newProfile.excess.subAllocations.unallocated -= bufferTotal;
      } else {
        newProfile.excess.subAllocations.unallocated += bufferTotal;
      }
      return { profile: newProfile, isEmergencyEnabled: enabled };
    });
  },
}));
