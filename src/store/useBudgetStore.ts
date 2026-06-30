import { create } from 'zustand';
import type { DeepAllocationProfile } from '../lib/allocationEngine';
import { getDeepAllocationForIncome } from '../lib/allocationEngine';

interface BudgetState {
  monthlyIncome: number;
  profile: DeepAllocationProfile;
  setMonthlyIncome: (income: number) => void;
  updateSubAllocation: (category: keyof DeepAllocationProfile, subKey: string, percentage: number) => void;
  resetToRecommended: () => void;
}

const defaultIncome = 0;
const defaultProfile = getDeepAllocationForIncome(defaultIncome);

export const useBudgetStore = create<BudgetState>((set) => ({
  monthlyIncome: defaultIncome,
  profile: defaultProfile,
  setMonthlyIncome: (income: number) => {
    set({
      monthlyIncome: income,
      profile: getDeepAllocationForIncome(income),
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
  resetToRecommended: () => {
    set((state) => ({
      profile: getDeepAllocationForIncome(state.monthlyIncome),
    }));
  },
}));
