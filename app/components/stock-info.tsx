'use client'

import React from 'react'
import { formatCurrency, formatPercentage } from '../lib/utils'

interface StockInfoProps {
  selectedStock: {
    symbol: string
    companyName: string
    currentPrice: string
    price: number
    priceChange: string
    change: number
    priceChangePercent: string
    changePercent: number
    enterpriseValue: string
    beta: string
    fcfm: string
    totalCash: string
    totalDebt: string
    operatingCashFlow: string
    profitMargin: string
    returnOnEquity: string
  }
  loading: boolean
  chartImage: string | null
}

const StockInfo: React.FC<StockInfoProps> = ({
  selectedStock,
  loading,
  chartImage,
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {selectedStock.companyName} ({selectedStock.symbol})
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
                {selectedStock.currentPrice ||
                  formatCurrency(selectedStock.price)}{" "}
                $
              </span>
              <span
                className={`text-lg font-semibold ${
                  (selectedStock.priceChange &&
                    parseFloat(selectedStock.priceChange) >= 0) ||
                  (!selectedStock.priceChange &&
                    selectedStock.change >= 0)
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {selectedStock.priceChange ||
                  formatCurrency(selectedStock.change)}
              </span>
              <span
                className={`text-lg font-semibold ${
                  (selectedStock.priceChangePercent &&
                    parseFloat(
                      selectedStock.priceChangePercent.replace(
                        /[()%]/g,
                        ""
                      )
                    ) >= 0) ||
                  (!selectedStock.priceChangePercent &&
                    selectedStock.changePercent >= 0)
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {selectedStock.priceChangePercent ||
                  formatPercentage(selectedStock.changePercent)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="w-full">
              <div className="animate-pulse bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-gray-400 text-lg">Loading</div>
              </div>
            </div>
          ) : chartImage ? (
            <div className="">
              <div className="w-full">
                <img
                  src={chartImage}
                  alt={`${selectedStock.symbol} Chart`}
                />
              </div>
            </div>
          ) : null}
          
          {/* Key Statistics */}
          {selectedStock.enterpriseValue && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Enterprise Value</span>
                  <span className="font-semibold">{selectedStock.enterpriseValue}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Beta (5Y Monthly)</span>
                  <span className="font-semibold">{selectedStock.beta || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">FCF Margin</span>
                  <span className="font-semibold">{selectedStock.fcfm ? `${selectedStock.fcfm}%` : 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Total Cash</span>
                  <span className="font-semibold">{selectedStock.totalCash || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Total Debt</span>
                  <span className="font-semibold">{selectedStock.totalDebt || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Operating Cash Flow</span>
                  <span className="font-semibold">{selectedStock.operatingCashFlow || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Profit Margin</span>
                  <span className="font-semibold">{selectedStock.profitMargin || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Return on Equity</span>
                  <span className=" font-semibold">{selectedStock.returnOnEquity || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  )
}

export default StockInfo
