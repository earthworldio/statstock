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
    rf: 4.5,
    erp: 4.5,
    g: 3,
    beta: 0,
    fcfm: 25
  })

  const [showResults, setShowResults] = useState(false)
  const [calculationResults, setCalculationResults] = useState<any>(null)


  useEffect(() => {
    if (enterpriseValue) {
      let evValue = 0
      

      if (enterpriseValue.includes('T')) {
        const trillionValue = parseFloat(enterpriseValue.replace('T', ''))
        evValue = trillionValue * 1000 
      } else if (enterpriseValue.includes('B')) {
        evValue = parseFloat(enterpriseValue.replace('B', ''))
      } else {
        evValue = parseFloat(enterpriseValue)
      }
      
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

  const calculateReverseDCF = () => {

    const coe = data.rf + (data.beta * data.erp)
    const wacc = coe 

    const fcf1 = data.ev * ((wacc/100) - (data.g/100))

    const steadyStateRevenue = fcf1 / (data.fcfm / 100)

    const results = {
      assumptions: {
        ev: data.ev,
        rf: data.rf,
        erp: data.erp,
        beta: data.beta,
        g: data.g,
        fcfm: data.fcfm
      },
      calculations: {
        coe: coe,
        wacc: wacc,
        fcf1: fcf1,
        steadyStateRevenue: steadyStateRevenue
      }
    }

    setCalculationResults(results)
    setShowResults(true)
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
    <>
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
          
          {/* Show Results in Calculator Type Section */}
          {showResults && calculationResults && (
            <div className="mt-3 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-400">Reverse DCF Results</h4>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-green-400 hover:text-white transition-colors text-lg"
                >
                  ←
                </button>
              </div>
              
              {/* Assumptions */}
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-300 mb-1">Assumptions</h5>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-gray-400">EV: ${calculationResults.assumptions.ev}B</div>
                  <div className="text-gray-400">RF: {calculationResults.assumptions.rf}%</div>
                  <div className="text-gray-400">ERP: {calculationResults.assumptions.erp}%</div>
                  <div className="text-gray-400">β: {calculationResults.assumptions.beta}</div>
                  <div className="text-gray-400">g: {calculationResults.assumptions.g}%</div>
                  <div className="text-gray-400">FCF: {calculationResults.assumptions.fcfm}%</div>
                </div>
              </div>

              {/* Calculations */}
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-300 mb-1">Calculations</h5>
                <div className="space-y-2">
                  {/* Step 1: WACC */}
                  <div className="bg-gray-900 p-2 rounded text-xs">
                    <div className="text-gray-400 mb-1">1) WACC</div>
                    <div className="text-gray-300">
                      CoE = RF + β * ERP = {calculationResults.assumptions.rf}% + {calculationResults.assumptions.beta} × {calculationResults.assumptions.erp}% = {calculationResults.calculations.wacc.toFixed(2)}%
                    </div>
                    <div className="text-green-400 mt-1">⇒ WACC ≈ {calculationResults.calculations.wacc.toFixed(2)}%</div>
                  </div>

                  {/* Step 2: Gordon Growth */}
                  <div className="bg-gray-900 p-2 rounded text-xs">
                    <div className="text-gray-400 mb-1">2) Gordon growth</div>
                    <div className="text-gray-300 mb-1">Formula: EV = FCF₁ / (R − g) ⇒ FCF₁ = EV × (R − g)</div>
                    <div className="text-green-400">
                    ⇒ FCF₁ = {calculationResults.assumptions.ev} × ({calculationResults.calculations.wacc.toFixed(2)/100} - {calculationResults.assumptions.g/100}) = ${calculationResults.calculations.fcf1.toFixed(1)}B
                    </div>
                  </div>

                  {/* Step 3: Steady-state Revenue */}
                  <div className="bg-gray-900 p-2 rounded text-xs">
                    <div className="text-gray-400 mb-1">3) Steady-state revenue</div>
                    <div className="text-gray-300 mb-1">REV₍steady₎ = FCF₁ / FCF margin</div>
                     <div className="text-green-400">
                     ⇒ REV₍steady₎ = {calculationResults.calculations.fcf1.toFixed(1)} / {(calculationResults.assumptions.fcfm/100).toFixed(2)} = ${calculationResults.calculations.steadyStateRevenue.toFixed(1)}B/year
                     </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-gray-700">
                <p className="text-gray-300 text-xs leading-relaxed flex flex-col">
                  EV ~${calculationResults.assumptions.ev}B, market expects steady-state revenue of approximately 
                  <span className="text-green-400 font-semibold"> ${calculationResults.calculations.steadyStateRevenue.toFixed(1)} B / year</span>
                  (FCF margin {calculationResults.assumptions.fcfm}%, growth {calculationResults.assumptions.g}%, WACC ~{calculationResults.calculations.wacc.toFixed(2)}%) to justify valuation.
                  
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Section */}
        {!showResults && (
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
            <Button 
              className="w-full" 
              size="md"
              onClick={calculateReverseDCF}
            >
              Calculate {calculationTypes[0].label}
            </Button>
          </div>
        </div>
        )}
        </div>
      </Card>
    </>
  )
}


export default Calculator
