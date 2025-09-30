'use client'

import React from 'react'
import StockCard from './stock-card'
import { Stock } from '../types'

interface RecentStocksProps {
  recentStocks: Stock[]
}

const RecentStocks: React.FC<RecentStocksProps> = ({ recentStocks }) => {
  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Recent Stocks
        </h2>
        <button className="text-green-400 hover:text-green-300 transition-colors">
          →
        </button>
      </div>

      <div className="overflow-x-auto recent-stocks-horizontal-scroll">
        <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
          {recentStocks.map((stock) => (
            <div key={stock.symbol} className="flex-shrink-0 w-80">
              <StockCard stock={stock} showChart={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentStocks
