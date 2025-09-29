/**
 * Polygon.io API Service
 * Professional service class for handling all Polygon.io API interactions
 */

export interface PolygonTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc?: string;
}

export interface PolygonSearchResponse {
  results: PolygonTicker[];
  status: string;
  request_id: string;
  count: number;
  next_url?: string;
}

export interface PolygonQuote {
  ticker: string;
  name: string;
  market_status: string;
  fmv?: number;
  session?: {
    change: number;
    change_percent: number;
    early_trading_change: number;
    early_trading_change_percent: number;
    close: number;
    high: number;
    low: number;
    open: number;
    previous_close: number;
  };
  last_quote?: {
    price: number;
    size: number;
    timestamp: number;
  };
  last_trade?: {
    price: number;
    size: number;
    timestamp: number;
  };
}

export interface PolygonFinancials {
  ticker: string;
  company_name: string;
  cik: string;
  fiscal_period: string;
  fiscal_year: string;
  end_date: string;
  start_date: string;
  filing_date: string;
  acceptance_datetime: string;
  financials: {
    income_statement?: {
      revenues?: { value: number; unit: string; label: string };
      cost_of_revenue?: { value: number; unit: string; label: string };
      gross_profit?: { value: number; unit: string; label: string };
      operating_expenses?: { value: number; unit: string; label: string };
      operating_income?: { value: number; unit: string; label: string };
      net_income_loss?: { value: number; unit: string; label: string };
      basic_earnings_per_share?: { value: number; unit: string; label: string };
      diluted_earnings_per_share?: { value: number; unit: string; label: string };
    };
    balance_sheet?: {
      assets?: { value: number; unit: string; label: string };
      current_assets?: { value: number; unit: string; label: string };
      noncurrent_assets?: { value: number; unit: string; label: string };
      liabilities?: { value: number; unit: string; label: string };
      current_liabilities?: { value: number; unit: string; label: string };
      noncurrent_liabilities?: { value: number; unit: string; label: string };
      equity?: { value: number; unit: string; label: string };
    };
    cash_flow_statement?: {
      net_cash_flow_from_operating_activities?: { value: number; unit: string; label: string };
      net_cash_flow_from_investing_activities?: { value: number; unit: string; label: string };
      net_cash_flow_from_financing_activities?: { value: number; unit: string; label: string };
      net_cash_flow?: { value: number; unit: string; label: string };
    };
  };
}

class PolygonService {
  private apiKey: string;
  private baseUrl: string = 'https://api.polygon.io';

  constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('POLYGON_API_KEY is required');
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'ERROR') {
        throw new Error(`Polygon API error: ${data.error || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error('Polygon API request failed:', error);
      throw error;
    }
  }

  /**
   * Search for stocks by name or ticker
   */
  async searchTickers(query: string, limit: number = 20): Promise<PolygonTicker[]> {
    const response = await this.makeRequest<PolygonSearchResponse>(
      `/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&market=stocks&limit=${limit}`
    );
    return response.results || [];
  }

  /**
   * Get all active tickers for a specific exchange
   */
  async getTickersByExchange(exchange: string = 'NASDAQ', limit: number = 1000): Promise<PolygonTicker[]> {
    const response = await this.makeRequest<PolygonSearchResponse>(
      `/v3/reference/tickers?active=true&market=stocks&exchange=${exchange}&limit=${limit}`
    );
    return response.results || [];
  }


}

// Export singleton instance
export const polygonService = new PolygonService();
export default PolygonService;
