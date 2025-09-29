'use client'

import MainLayout from './components/layout/main-layout'
import StockCard from './components/stock-card'
import Calculator from './components/calculator'
import Card from './components/ui/card'
import StockSearch from './components/stock-search'
import { recentStocks, currentStock } from './data/stocks'
import { formatCurrency, formatPercentage } from './lib/utils'
import { Stock } from './types/stock'

export default function Home() {

  const handleSearchResults = (stocks: Stock[]) => {

  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col px-20 py-6">
        {/* Search Bar */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <StockSearch
            onSearchResults={handleSearchResults}
            className="max-w-2xl"
            placeholder="Search -> ( e.g. AAPL , Tesla )"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-10 min-h-0">
          {/* Stock Info & Calculator Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 md:gap-8 lg:gap-10">
            {/* Stock Info */}
            <div className="h-full">
              <Card className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">
                        S T A T S T O C K
                      </h1>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-400"></span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    
                  </p>

                  <div className="mt-6">
                    
                    
                  </div>
                </div>
              </Card>
            </div>

            {/* Calculator */}
            <div className="h-full">
              <Calculator />
            </div>
          </div>

          {/* Recent Viewed Stocks - Horizontal Scroll */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Recent Stocks</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                →
              </button>
            </div>

            <div className="overflow-x-auto recent-stocks-horizontal-scroll">
              <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                {recentStocks.map((stock) => (
                  <div key={stock.symbol} className="flex-shrink-0 w-80">
                    <StockCard
                      stock={stock}
                      showChart={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
