/**
 * TypeScript types for Stock-related data
 * Essential types only for current implementation
 */

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  market: string;
  active: boolean;
  currency: string;
  lastUpdated?: string;
}

