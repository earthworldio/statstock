export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  exchange?: string
  type?: string
  market?: string
  active?: boolean
  currency?: string
  lastUpdated?: string
}

export interface StockMetric {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
}
export interface CalculatorData {
  ev: number
  rf: number
  erp: number
  g: number
  beta: number
  fcfm: number
}

