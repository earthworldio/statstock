import MainLayout from './components/layout/main-layout'
import StockCard from './components/stock-card'
import Calculator from './components/calculator'
import Card from './components/ui/card'
import { recentStocks, currentStock } from './data/stocks'
import { formatCurrency, formatPercentage } from './lib/utils'
import { SearchCheck } from 'lucide-react'

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Search Bar */}
        <div className="relative max-w-2xl mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-md text-white placeholder:text-gray-400 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Main Stock Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Current Stock Info */}
            <Card className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentStock.name} ({currentStock.symbol})
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold text-white">
                      {formatCurrency(currentStock.price)}
                    </span>
                    <span className={`text-lg font-medium ${currentStock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(currentStock.changePercent)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none mt-8">
                <p className="text-gray-300 leading-relaxed mb-6">
                  PDD Holdings has shown strong performance with a 33% increase year-to-date, 
                  supported by solid revenue growth and a positive earnings outlook. Analysts rate 
                  the stock as a Strong Buy highlighting its valuation metrics and growth strategies, 
                  despite regulatory concerns that could impact future growth.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-4">Key Highlights:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>
                      <strong>Earnings Performance:</strong> PDD's Q2 results exceeded expectations with a 46% 
                      increase in net profit and 6.69% revenue growth year-over-year, highlighting 
                      the company's strong operational performance.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Calculator */}
          <div>
            <Calculator />
          </div>
        </div>

        {/* Recent Viewed Stocks */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent viewed stock</h2>
            <button className="text-green-400 hover:text-green-300 transition-colors">
              →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentStocks.map((stock) => (
              <StockCard 
                key={stock.symbol} 
                stock={stock} 
                showChart={true} 
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
