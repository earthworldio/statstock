'use client'

import MainLayout from './components/layout/main-layout'
import StockCard from './components/stock-card'
import Calculator from './components/calculator'
import Card from './components/ui/card'
import StockSearch from './components/stock-search'
import { recentStocks, currentStock } from './data/stocks'
import { formatCurrency, formatPercentage } from './lib/utils'
import { Stock } from './types/stock'
import { useState } from 'react'

export default function Home() {
  const [selectedStock, setSelectedStock] = useState(currentStock)
  const [loading, setLoading] = useState(false)
  const [chartImage, setChartImage] = useState<string | null>(null)

  const handleSearchResults = (stocks: Stock[]) => {
    console.log('Search results for Puppeteer:', stocks)
  }

  const handleStockSelect = async (symbol: string, companyName: string) => {
    // อัปเดตชื่อบริษัททันทีจาก search API
    setSelectedStock(prev => ({
      ...prev,
      symbol: symbol,
      name: companyName,
      companyName: companyName
    }))
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/puppeteer/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      })
      
      const data = await response.json()
      
      if (data.status === 'success' && data.data) {
        setSelectedStock(prev => ({
          ...prev,
          price: parseFloat(data.data.currentPrice) || 0,
          change: parseFloat(data.data.priceChange) || 0,
          changePercent: parseFloat(data.data.priceChangePercent?.replace(/[()%]/g, '')) || 0,
          currentPrice: data.data.currentPrice || '',
          priceChange: data.data.priceChange || '',
          priceChangePercent: data.data.priceChangePercent || ''
        }))


        try {
          const chartResponse = await fetch('/api/puppeteer/chart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symbol }),
          })
          
          const chartData = await chartResponse.json()
          if (chartData.status === 'success' && chartData.chartScreenshot) {
            setChartImage(chartData.chartScreenshot)
          }
        } catch (chartError) {
          console.error('Error fetching chart:', chartError)
        }
      }
    } catch (error) {
      console.error('Error calling Puppeteer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col px-10 py-6">
        {/* Search Bar */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <StockSearch
            onSearchResults={handleSearchResults}
            onStockSelect={handleStockSelect}
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

                <div className="flex-1 prose prose-invert max-w-none">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {selectedStock.companyName || selectedStock.name}
                    </h2>
                    {loading ? (
                      <div className="flex items-center space-x-4">
                        <div className="animate-pulse">
                          <div className="h-8 w-32 bg-gray-700 rounded"></div>
                        </div>
                        <div className="animate-pulse">
                          <div className="h-6 w-20 bg-gray-700 rounded"></div>
                        </div>
                        <div className="animate-pulse">
                          <div className="h-6 w-16 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-white">
                          {selectedStock.currentPrice || formatCurrency(selectedStock.price)} $
                        </span>
                        <span className={`text-lg font-semibold ${
                          (selectedStock.priceChange && parseFloat(selectedStock.priceChange) >= 0) || 
                          (!selectedStock.priceChange && selectedStock.change >= 0) 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {selectedStock.priceChange || formatCurrency(selectedStock.change)}
                        </span>
                        <span className={`text-lg font-semibold ${
                          (selectedStock.priceChangePercent && parseFloat(selectedStock.priceChangePercent.replace(/[()%]/g, '')) >= 0) || 
                          (!selectedStock.priceChangePercent && selectedStock.changePercent >= 0) 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {selectedStock.priceChangePercent || formatPercentage(selectedStock.changePercent)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    {chartImage && (
                      <div className="">
                        <div className="w-full">
                          <img 
                            src={chartImage} 
                            alt={`${selectedStock.symbol} Chart`}
                          />
                        </div>
                      </div>
                    )}
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
