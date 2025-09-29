'use client'

import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './ui/card'
import Button from './ui/button'
import Input from './ui/input'
import { CalculatorData } from '../types'

const Calculator: React.FC = () => {
  
  const [activeCalculation, setActiveCalculation] = useState<'dcf' | 'pe' | 'pb'>('dcf')
  
  const [data, setData] = useState<CalculatorData>({
    ev: 133.25,
    rf: 4.5,
    erp: 4.5,
    g: 3,
    beta: 1.5
  })

  const calculationTypes = [
    { id: 'dcf', label: 'Reverse DCF', active: activeCalculation === 'dcf' },
    { id: 'pe', label: 'P/E Ratio', active: activeCalculation === 'pe' }
  ]

  const handleInputChange = (field: keyof CalculatorData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }


  const metrics = [
    { label: 'EV', value: `${data.ev} B`, field: 'ev', trend: 'neutral' as const },
    { label: 'RF', value: `${data.rf}%`, field: 'rf', trend: 'up' as const },
    { label: 'ERP', value: `${data.erp}%`, field: 'erp', trend: 'up' as const },
    { label: 'G', value: `${data.g}%`, field: 'g', trend: 'up' as const },
    { label: 'Beta', value: data.beta.toString(), field: 'beta', trend: 'down' as const }
  ]

  return (
    <Card className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex-1 flex flex-col space-y-4 md:space-y-6 lg:space-y-2">
        {/* Calculation Type Selector */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-xl font-semibold text-white">Calculator Type</h3>
          <div className="flex flex-wrap gap-2 lg:gap-4">
            {calculationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveCalculation(type.id as 'dcf' | 'pe' | 'pb')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  type.active
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
          <div key={metric.label} className="flex items-center justify-between py-2 lg:py-3">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-800 text-white text-sm lg:text-base font-medium">
                {index + 1}
              </div>
              <div className="flex items-center space-x-3 lg:space-x-4">
                <span className="text-white font-medium w-12 lg:w-16">{metric.label}</span>
                <span className="text-gray-300 lg:text-base">{metric.value}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const currentValue = data[metric.field as keyof CalculatorData]
                    const newValue = Math.max(0, currentValue - 0.1)
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
                  className="w-20 h-8 lg:w-14 lg:h-10 px-2 text-center
                  text-sm lg:text-sm rounded-none border-t border-b border-gray-700 bg-gray-800 text-white focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const currentValue = data[metric.field as keyof CalculatorData]
                    const newValue = currentValue + 0.1
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
            Calculate {activeCalculation.toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
    </Card>
  )
}


export default Calculator
