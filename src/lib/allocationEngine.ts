export type Category = 'needs' | 'wants' | 'subscriptions' | 'goals' | 'investments' | 'insurance' | 'buffer' | 'excess';

export interface CategoryData {
  subAllocations: { [key: string]: number }; // These are now percentages of the TOTAL INCOME
}

export interface DeepAllocationProfile {
  needs: CategoryData;
  wants: CategoryData;
  subscriptions: CategoryData;
  goals: CategoryData;
  investments: CategoryData;
  insurance: CategoryData;
  buffer: CategoryData;
  excess: CategoryData; // New block for buffer excess
}

// Default sub-allocations (they represent the internal split, sum to 1)
const defaultSubSplits = {
  needs: { rent: 0.45, groceries: 0.30, utilities: 0.10, commute: 0.15 },
  wants: { dining: 0.40, shopping: 0.40, hobbies: 0.20 },
  subscriptions: { ott: 0.60, music_cloud: 0.40 },
  goals: { travel: 0.60, short_term: 0.40 },
  investments: { equity: 0.60, debt: 0.25, gold: 0.15 },
  insurance: { term: 0.50, health: 0.50 },
  buffer: { emergency: 0.70, liquid: 0.30 },
  excess: { unallocated: 1.0 }
};

const brackets = [
  { income: 40000, profile: { needs: 55, wants: 10, goals: 5, investments: 15, insurance: 3, buffer: 12 } },
  { income: 75000, profile: { needs: 48, wants: 12, goals: 6, investments: 20, insurance: 4, buffer: 10 } },
  { income: 125000, profile: { needs: 40, wants: 14, goals: 7, investments: 26, insurance: 4, buffer: 9 } },
  { income: 200000, profile: { needs: 32, wants: 15, goals: 8, investments: 33, insurance: 4, buffer: 8 } },
  { income: 350000, profile: { needs: 25, wants: 14, goals: 8, investments: 40, insurance: 4, buffer: 9 } },
  { income: 500000, profile: { needs: 18, wants: 12, goals: 7, investments: 48, insurance: 4, buffer: 11 } },
];

export function getDeepAllocationForIncome(monthlyIncome: number): DeepAllocationProfile {
  let baseProfile;

  if (monthlyIncome <= brackets[0].income) {
    baseProfile = extractProfile(brackets[0].profile);
  } else if (monthlyIncome >= brackets[brackets.length - 1].income) {
    baseProfile = extractProfile(brackets[brackets.length - 1].profile);
  } else {
    for (let i = 0; i < brackets.length - 1; i++) {
      const lower = brackets[i];
      const upper = brackets[i + 1];

      if (monthlyIncome > lower.income && monthlyIncome <= upper.income) {
        const range = upper.income - lower.income;
        const progress = (monthlyIncome - lower.income) / range;

        baseProfile = {
          needs: interpolate(lower.profile.needs, upper.profile.needs, progress),
          wants: interpolate(lower.profile.wants, upper.profile.wants, progress) * 0.7,
          subscriptions: interpolate(lower.profile.wants, upper.profile.wants, progress) * 0.3,
          goals: interpolate(lower.profile.goals, upper.profile.goals, progress),
          investments: interpolate(lower.profile.investments, upper.profile.investments, progress),
          insurance: interpolate(lower.profile.insurance, upper.profile.insurance, progress),
          buffer: interpolate(lower.profile.buffer, upper.profile.buffer, progress),
        };
        break;
      }
    }
  }

  if (!baseProfile) {
    baseProfile = extractProfile(brackets[brackets.length - 1].profile);
  }

  // Convert top-level percentages into absolute sub-category percentages of total income
  return {
    needs: { subAllocations: applySplits(baseProfile.needs, defaultSubSplits.needs) },
    wants: { subAllocations: applySplits(baseProfile.wants, defaultSubSplits.wants) },
    subscriptions: { subAllocations: applySplits(baseProfile.subscriptions, defaultSubSplits.subscriptions) },
    goals: { subAllocations: applySplits(baseProfile.goals, defaultSubSplits.goals) },
    investments: { subAllocations: applySplits(baseProfile.investments, defaultSubSplits.investments) },
    insurance: { subAllocations: applySplits(baseProfile.insurance, defaultSubSplits.insurance) },
    buffer: { subAllocations: applySplits(baseProfile.buffer, defaultSubSplits.buffer) },
    excess: { subAllocations: { unallocated: 0 } },
  };
}

function applySplits(total: number, splits: { [key: string]: number }) {
  const result: { [key: string]: number } = {};
  for (const [key, ratio] of Object.entries(splits)) {
    result[key] = total * ratio;
  }
  return result;
}

function extractProfile(profile: any) {
  return {
    needs: profile.needs,
    wants: profile.wants * 0.7,
    subscriptions: profile.wants * 0.3,
    goals: profile.goals,
    investments: profile.investments,
    insurance: profile.insurance,
    buffer: profile.buffer,
  };
}

function interpolate(lower: number, upper: number, progress: number): number {
  return lower + (upper - lower) * progress;
}

// Helper to get total percentage for a category
export function getCategoryTotal(category: CategoryData): number {
  return Object.values(category.subAllocations).reduce((sum, val) => sum + val, 0);
}
