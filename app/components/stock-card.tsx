'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from './ui/card'
import { Stock } from '../types'
import { formatCurrency, formatPercentage } from '../lib/utils'

interface StockCardProps {
  stock: Stock
  showChart?: boolean
}

const StockCard: React.FC<StockCardProps> = ({ stock, showChart = false }) => {
  const isPositive = stock.changePercent >= 0

  return (
    <Card hover className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{stock.symbol}</h3>
          <p className="text-sm text-gray-400">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">
            {formatCurrency(stock.price)}
          </p>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(stock.changePercent)}
            </span>
          </div>
        </div>
      </div>
      
      {showChart && (
        <div className="mt-4 h-16 flex items-end space-x-1">
          {/* Simple chart representation */}
        </div>
      )}
    </Card>
  )
}

export default StockCard
