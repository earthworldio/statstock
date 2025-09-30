import { NextRequest, NextResponse } from 'next/server';
import { polygonService } from '@/app/lib/polygon';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');


    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Query parameter "q" is required',
          message: 'Please provide a search term to look for stocks'
        }, 
        { status: 400 }
      );
    }


    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          error: 'Invalid limit parameter',
          message: 'Limit must be between 1 and 100'
        }, 
        { status: 400 }
      );
    }


    const tickers = await polygonService.searchTickers(query.trim(), limit);

    const stocks = tickers.map(ticker => ({
      symbol: ticker.ticker,
      name: ticker.name,
      exchange: ticker.primary_exchange,
      type: ticker.type,
      market: ticker.market,
      active: ticker.active,
      currency: ticker.currency_name,
      lastUpdated: ticker.last_updated_utc
    }));

    return NextResponse.json({
      success: true,
      query: query.trim(),
      count: stocks.length,
      stocks
    });

  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to search stocks. Please try again later : ' + error
      }, 
      { status: 500 }
    );
  }
}
