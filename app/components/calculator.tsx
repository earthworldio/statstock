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

  const calculateResult = () => {
    // Simple DCF calculation example
    const requiredReturn = data.rf + (data.beta * data.erp)
    const intrinsicValue = data.ev * (1 + data.g / 100) / (requiredReturn / 100 - data.g / 100)
    return intrinsicValue
  }

  const metrics = [
    { label: 'EV', value: `${data.ev} B`, field: 'ev', trend: 'neutral' as const },
    { label: 'RF', value: `${data.rf}%`, field: 'rf', trend: 'up' as const },
    { label: 'ERP', value: `${data.erp}%`, field: 'erp', trend: 'up' as const },
    { label: 'G', value: `${data.g}%`, field: 'g', trend: 'up' as const },
    { label: 'Beta', value: data.beta.toString(), field: 'beta', trend: 'down' as const }
  ]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Calculation Type Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Calculator Type</h3>
          <div className="flex flex-wrap gap-2">
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
        <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium w-12">{metric.label}</span>
                <span className="text-gray-300">{metric.value}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
              {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
              {metric.trend === 'neutral' && <Minus className="h-4 w-4 text-gray-400" />}
              <input
                type="number"
                step="0.1"
                value={data[metric.field as keyof CalculatorData]}
                onChange={(e) => handleInputChange(metric.field as keyof CalculatorData, e.target.value)}
                className="w-20 h-8 px-2 text-sm rounded border border-gray-700 bg-gray-800 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
        
        <div className="pt-2">
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
