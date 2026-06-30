# Smart Budget Allocator

A modern, dynamic budgeting dashboard tailored for salaried IT professionals (specifically modeling Bangalore CA-advised allocations). Built with React, TypeScript, Tailwind CSS (v4), and Chart.js.

## Features

- **CA-Engineered Allocation Model**: Dynamically shifts budget percentages (Needs, Wants, Investments, etc.) based on standard income bracket milestones.
- **Deep Granular Controls**: Mini-sliders for every sub-category (e.g., OTT, Commute, Equity). Adjusting a sub-category proportionately updates your overall budget.
- **Excess/Buffer Math**: Any unallocated or saved funds from shrinking a sub-category directly funnel into an available "Excess Buffer" block.
- **Interactive Visualizations**: 
  - Macro Donut Chart for top-level splits.
  - Radar Chart to map lifestyle balance.
  - Wealth Projection Line Chart (simulating a conservative 6% annual compounding).

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charting**: Chart.js (`react-chartjs-2`)
- **Icons**: Heroicons
- **Fonts**: Poppins (Google Fonts)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/jayanthct/BudgetPlanner.git
   ```
2. Navigate into the directory and install dependencies:
   ```bash
   cd BudgetPlanner
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Design Philosophy

The tool intentionally avoids complex "game-ified" UIs or emoji overload, adopting a precise, restrained "Bento Grid" aesthetic reminiscent of professional financial tools (like Linear or Vercel dashboards). Numbers and actionable sliders are prioritized.
