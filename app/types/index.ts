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
  companyName?: string
  currentPrice?: string
  priceChange?: string
  priceChangePercent?: string
  enterpriseValue?: string
  beta?: string
  fcfm?: string
  revenue?: string
  freeCashFlow?: string
  totalCash?: string
  totalDebt?: string
  operatingCashFlow?: string
  profitMargin?: string
  returnOnEquity?: string
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

