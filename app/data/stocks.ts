import { Stock } from '../types'

export const recentStocks: Stock[] = [
  {
    symbol: 'NFLX',
    name: 'Netflix',
    price: 416.03,
    change: 10.87,
    changePercent: 2.67
  },
  {
    symbol: 'META',
    name: 'Meta',
    price: 285.50,
    change: -1.24,
    changePercent: -0.43
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: 178.61,
    change: 24.12,
    changePercent: 13.6
  }
]

export const currentStock = {
  symbol: '',
  name: '',
  price: 0,
  change: 0,
  changePercent: 0,
  companyName: '',
  currentPrice: '',
  priceChange: '',
  priceChangePercent: '',
  enterpriseValue: '',
  beta: '',
  fcfm: ''
}
