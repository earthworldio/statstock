'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './ui/card'
import Button from './ui/button'
import Input from './ui/input'
import { CalculatorData } from '../types'

interface CalculatorProps {
  enterpriseValue?: string
  beta?: string
  fcfm?: string
}

const Calculator: React.FC<CalculatorProps> = ({ enterpriseValue, beta, fcfm }) => {
  
  
  const [data, setData] = useState<CalculatorData>({
    ev: 0,
    rf: 0,
    erp: 0,
    g: 0,
    beta: 0,
    fcfm: 0
  })


  useEffect(() => {
    if (enterpriseValue) {
      const evValue = parseFloat(enterpriseValue.replace('B', ''))
      if (!isNaN(evValue)) {
        setData(prev => ({
          ...prev,
          ev: parseFloat(evValue.toFixed(2))
        }))
      }
    }
    
    if (beta) {
      const betaValue = parseFloat(beta)
      if (!isNaN(betaValue)) {
        setData(prev => ({
          ...prev,
          beta: parseFloat(betaValue.toFixed(2))
        }))
      }
    }
    
    if (fcfm) {
      const fcfmValue = parseFloat(fcfm)
      if (!isNaN(fcfmValue)) {
        setData(prev => ({
          ...prev,
          fcfm: parseFloat(fcfmValue.toFixed(2))
        }))
      }
    }
  }, [enterpriseValue, beta, fcfm])

  const calculationTypes = [
    { id: 'dcf', label: 'Reverse DCF' }
  ]

  const handleInputChange = (field: keyof CalculatorData, value: string) => {
    const numValue = parseFloat(value) || 0
    setData(prev => ({
      ...prev,
      [field]: parseFloat(numValue.toFixed(2))
    }))
  }

  const metrics = [
    { label: 'EV', value: `${data.ev} B`, field: 'ev', trend: 'neutral' as const },
    { label: 'RF', value: `${data.rf}%`, field: 'rf', trend: 'up' as const },
    { label: 'ERP', value: `${data.erp}%`, field: 'erp', trend: 'up' as const },
    { label: 'G', value: `${data.g}%`, field: 'g', trend: 'up' as const },
    { label: 'Beta', value: data.beta.toString(), field: 'beta', trend: 'down' as const },
    { label: 'FCFM', value: `${data.fcfm}%`, field: 'fcfm', trend: 'up' as const }
  ]

  return (
    <Card className="p-4 md:p-6 lg:p-4 h-full flex flex-col">
      <div className="flex-1 flex flex-col space-y-4 md:space-y-6 lg:space-y-2">
        {/* Calculation Type Selector */}
        <div className="space-y-4 lg:space-y-4">
          <h3 className="text-xl font-semibold text-white">Calculator Type</h3>
          <div className="flex flex-wrap gap-2 lg:gap-4">
            {calculationTypes.map((type) => (
              <button
                key={type.id}  
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  type.id === 'dcf'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="flex-1 space-y-4 lg:space-y-1">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="flex items-center justify-between py-2 lg:py-2">
            <div className="flex items-center space-x-4 lg:space-x-4">
              <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gray-800 text-white text-sm  font-medium">
                {index + 1}
              </div>
              <div className="flex items-center space-x-3 lg:space-x-2">
                <span className="text-white font-medium w-12 lg:w-16 text-sm ">{metric.label}</span>
                <span className="text-gray-300 lg:text-base">{metric.value}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-2">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const currentValue = data[metric.field as keyof CalculatorData]
                    const newValue = Math.max(0, parseFloat((currentValue - 0.1).toFixed(2)))
                    handleInputChange(metric.field as keyof CalculatorData, newValue.toString())
                  }}
                  className="w-6 h-8 lg:w-8 lg:h-10 flex items-center justify-center rounded-l border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  <TrendingDown className="h-3 w-3 text-red-400" />
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={data[metric.field as keyof CalculatorData]}
                  onChange={(e) => handleInputChange(metric.field as keyof CalculatorData, e.target.value)}
                  className="w-24 h-8 lg:w-18 lg:h-10 px-2 text-center
                  text-sm lg:text-sm rounded-none border-t border-b border-gray-700 bg-gray-800 text-white focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const currentValue = data[metric.field as keyof CalculatorData]
                    const newValue = parseFloat((currentValue + 0.1).toFixed(2))
                    handleInputChange(metric.field as keyof CalculatorData, newValue.toString())
                  }}
                  className="w-6 h-8 lg:w-8 lg:h-10 flex items-center justify-center rounded-r border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex-shrink-0 pt-4 lg:pt-1">
          <Button className="w-full" size="md">
            {calculationTypes[0].label}
          </Button>
        </div>
      </div>
    </div>
    </Card>
  )
}


export default Calculator
