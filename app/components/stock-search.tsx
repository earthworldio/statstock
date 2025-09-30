'use client'

import React, { useState, useEffect } from 'react'
import { Search, Loader2 , ArrowBigRightDash } from 'lucide-react'
import { Stock } from '@/app/types'

interface StockSearchProps {
  onSearchResults?: (stocks: Stock[]) => void
  onStockSelect?: (symbol: string, companyName: string) => void
  placeholder?: string
  className?: string
}

export default function StockSearch({
  onSearchResults,
  onStockSelect,
  placeholder = "Search -> ( e.g. AAPL , Tesla)",
  className = ""
}: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Stock[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searchPosition, setSearchPosition] = useState({ top: 0, left: 0, width: 0 })

  /* Fix the position of the search results dropdown */
  useEffect(() => {
    const updatePosition = () => {
      const searchElement = document.querySelector('.search-input-container')
      if (searchElement) {
        const rect = searchElement.getBoundingClientRect()
        setSearchPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [])

  /* Search data stocks */
  useEffect(() => {
    const searchStocks = async (searchQuery: string) => {
      
      if (searchQuery.length < 2) {
        setResults([])
        setShowResults(false)
        onSearchResults?.([])
        return
      }

      setLoading(true)

      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
        const data = await response.json()

        if (data.success && data.stocks) {
          setResults(data.stocks)
          setShowResults(true)
          onSearchResults?.(data.stocks)
        } else {
          setResults([])
          setShowResults(false)
          onSearchResults?.([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setShowResults(false)
        onSearchResults?.([])
      } finally {
        setLoading(false)
      }
    }


    const timeoutId = setTimeout(() => {
      searchStocks(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, onSearchResults])

  return (
    <div className={`relative stock-search-container ${className}`}>
      <div className="relative search-input-container">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-md text-white placeholder:text-gray-400 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
        />

        {/* Loading Spinner */}
        {loading && (
          <div 
            className="absolute right-4 top-1/2 w-5 h-5 border-2 border-green-400 border-b-transparent rounded-full"
            style={{ 
              transform: 'translateY(-50%)',
              animation: 'rotation 1s linear infinite'
            }} 
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div 
          className="fixed bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-[9999] search-results-dropdown"
          style={{
            position: 'fixed',
            top: `${searchPosition.top}px`,
            left: `${searchPosition.left}px`,
            width: `${searchPosition.width}px`,
            zIndex: 9999
          }}
        >
            <div className="max-h-80 overflow-y-auto search-results-dropdown">
              {results.map((stock, index) => (
                <div
                  key={`${stock.symbol}-${index}`}
                  className="p-4 hover:bg-gray-800/50 transition-all duration-200 border-b border-gray-700/20 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-green-400 text-lg">{stock.symbol}</span>
                        <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md font-medium">
                          {stock.exchange}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-600/30 text-blue-300 rounded-md font-medium">
                          {stock.type}
                        </span>
                        {stock.active && (
                          <span className="px-2 py-1 text-xs bg-green-600/30 text-green-300 rounded-md font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{stock.name}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>Market: {stock.market}</span>
                        <span>Currency: {stock.currency?.toUpperCase()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onStockSelect?.(stock.symbol, stock.name)
                        setShowResults(false)
                        setQuery('')
                      }}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <ArrowBigRightDash className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  )
}