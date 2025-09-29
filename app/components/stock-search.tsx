'use client'

import React, { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Stock } from '@/app/types/stock'

interface StockSearchProps {
  onSearchResults?: (stocks: Stock[]) => void
  placeholder?: string
  className?: string
}

export default function StockSearch({
  onSearchResults,
  placeholder = "Search -> ( e.g. AAPL , Tesla)",
  className = ""
}: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const searchStocks = async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        onSearchResults?.([])
        return
      }

      setLoading(true)

      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
        const data = await response.json()

        if (data.success && data.stocks) {
          onSearchResults?.(data.stocks)
        } else {
          onSearchResults?.([])
        }
      } catch (error) {
        console.error('Search error:', error)
        onSearchResults?.([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchStocks(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, onSearchResults])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
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
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 animate-spin" />
        )}
      </div>
    </div>
  )
}