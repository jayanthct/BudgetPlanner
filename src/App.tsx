import React from 'react';
import { useBudgetStore } from './store/useBudgetStore';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { AllocationDonutChart } from './components/charts/AllocationDonutChart';
import { LifestyleRadarChart } from './components/charts/LifestyleRadarChart';
import { SavingsProjectionChart } from './components/charts/SavingsProjectionChart';
import { CategoryCard } from './components/CategoryCard';
import { InvestmentsPanel } from './components/InvestmentsPanel';
import { EmergencyFund } from './components/EmergencyFund';

import { 
  HomeIcon, 
  ShoppingBagIcon, 
  PlayIcon, 
  PaperAirplaneIcon, 
  ShieldCheckIcon, 
  BanknotesIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const { monthlyIncome } = useBudgetStore();
  const hasIncome = monthlyIncome > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-20 font-sans">
      <Header />
      
      {!hasIncome ? (
        <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center py-20 px-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <BanknotesIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Smart Budget Allocator</h2>
          <p className="text-gray-500 leading-relaxed">
            Enter your monthly take-home salary above. This tool acts as a financial advisor, calculating an optimal budget allocation based on standard CA principles for salaried professionals in Bangalore.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          <Summary />
          
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Bento Dashboard</h2>
            <p className="text-sm text-gray-500">Adjust the deep sliders below to customize your sub-allocations.</p>
          </div>

          {/* Bento Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Top Row: Main Charts */}
            <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2">
                <ChartPieIcon className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-sm">Macro Allocation</h3>
              </div>
              <AllocationDonutChart />
            </div>

            <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-gray-50 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-sm">Lifestyle Balance</h3>
              </div>
              <div className="p-4 flex-1">
                <LifestyleRadarChart />
              </div>
            </div>

            <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-gray-50 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-sm">Wealth Projection (1Y)</h3>
              </div>
              <div className="p-4 flex-1">
                <SavingsProjectionChart />
              </div>
            </div>

            {/* Middle Row: Sub-Category Cards */}
            <div className="xl:col-span-1">
              <CategoryCard 
                categoryKey="needs"
                title="Needs (Fixed Costs)"
                colorCode="#006FEE"
                icon={<HomeIcon className="w-6 h-6" />}
                subItemLabels={{
                  rent: "Rent (Shared/PG)",
                  groceries: "Groceries & Food",
                  utilities: "Utilities & Bills",
                  commute: "Commute & Fuel"
                }}
              />
            </div>

            <div className="xl:col-span-1">
              <CategoryCard 
                categoryKey="wants"
                title="Wants (Lifestyle)"
                colorCode="#17C964"
                icon={<ShoppingBagIcon className="w-6 h-6" />}
                subItemLabels={{
                  dining: "Dining & Delivery",
                  shopping: "Shopping",
                  hobbies: "Hobbies & Fitness"
                }}
              />
            </div>

            <div className="xl:col-span-1 flex flex-col gap-6">
              <div className="flex-1">
                <CategoryCard 
                  categoryKey="subscriptions"
                  title="Subscriptions"
                  colorCode="#F5A524"
                  icon={<PlayIcon className="w-6 h-6" />}
                  subItemLabels={{
                    ott: "OTT & Entertainment",
                    music_cloud: "Music & Cloud"
                  }}
                />
              </div>
              <div className="flex-1">
                <CategoryCard 
                  categoryKey="goals"
                  title="Goals & Travel"
                  colorCode="#F31260"
                  icon={<PaperAirplaneIcon className="w-6 h-6" />}
                  subItemLabels={{
                    travel: "Annual Travel",
                    short_term: "Short-term Goals"
                  }}
                />
              </div>
            </div>

            {/* Bottom Row: Investments & Insurance & Buffer */}
            <div className="xl:col-span-2">
              <InvestmentsPanel />
            </div>

            <div className="xl:col-span-1 flex flex-col gap-6">
              <CategoryCard 
                categoryKey="insurance"
                title="Insurance"
                colorCode="#18181B"
                icon={<ShieldCheckIcon className="w-6 h-6" />}
                subItemLabels={{
                  term: "Term Life",
                  health: "Health Insurance"
                }}
              />
              <EmergencyFund />
            </div>
            
          </div>

          <div className="mt-16 text-center pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
              <strong>Disclaimer:</strong> This tool provides general educational budgeting guidance based on common financial planning principles for salaried individuals in India, and is not personalized investment, tax, or legal advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
