import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export async function POST(request: NextRequest) {
  
  let browser = null
  
  try {
    
    const { symbol } = await request.json()

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      )
    }

    // Launch browser with @sparticuz/chromium for production compatibility
    const isLocal = process.env.NODE_ENV === 'development' || !process.env.RAILWAY_ENVIRONMENT;
    
    browser = await puppeteer.launch({
      args: isLocal ? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ] : chromium.args,
      executablePath: isLocal ? undefined : await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })


    page.on('pageerror', (err) => console.error('[pageerror]', err))
    
    const url = `https://finance.yahoo.com/quote/${symbol}/key-statistics/`
    
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    })

    await new Promise(resolve => setTimeout(resolve, 3000))
   
    await page.waitForSelector('[data-testid="quote-hdr"]', { timeout: 15000 }).catch(() => {})
    await page.waitForSelector('[data-testid="stats-highlight"]', { timeout: 15000 }).catch(() => {})

       const data = await page.evaluate(() => {
      
      const stats: any = {}
      
      const mainContainer = document.querySelector('[data-testid="quote-hdr"]')
      
      if (!mainContainer) {
        console.log('Main container not found')
        return stats
      }
      
      const priceElement = mainContainer.querySelector('[data-testid="qsp-price"]')
      if (priceElement) {
        stats.currentPrice = priceElement.textContent?.trim()
      }
      
      const changeElement = mainContainer.querySelector('[data-testid="qsp-price-change"]')
      if (changeElement) {
        stats.priceChange = changeElement.textContent?.trim()
      }
      

      const changePercentElement = mainContainer.querySelector('[data-testid="qsp-price-change-percent"]')
      if (changePercentElement) {
        stats.priceChangePercent = changePercentElement.textContent?.trim()
      }
      

      // Robust function to find value by label text in any table row
      const getValueByLabel = (labelText: string) => {
        const rows = Array.from(document.querySelectorAll('tr'));
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 2) {
            const label = cells[0].textContent?.trim();
            if (label && label.includes(labelText)) {
              return cells[1].textContent?.trim();
            }
          }
        }
        return null;
      };

      const enterpriseValueText = getValueByLabel('Enterprise Value');
      if (enterpriseValueText) {
        let evValue = enterpriseValueText;
        if (evValue.includes('T')) {
          const numericValue = parseFloat(evValue.replace('T', ''));
          const billionValue = numericValue * 1000;
          evValue = `${billionValue.toFixed(2)}B`;
        }
        stats.enterpriseValue = evValue;
      }

      stats.beta = getValueByLabel('Beta (5Y Monthly)');
      
      const revenueText = getValueByLabel('Revenue (ttm)');
      if (revenueText) {
        stats.revenue = revenueText;
      }

      const fcfText = getValueByLabel('Levered Free Cash Flow (ttm)');
      if (fcfText) {
        stats.freeCashFlow = fcfText;
      }

      const cashText = getValueByLabel('Total Cash (mrq)');
      if (cashText) {
        stats.totalCash = cashText;
      }

      const debtText = getValueByLabel('Total Debt (mrq)');
      if (debtText) {
        stats.totalDebt = debtText;
      }

      const ocfText = getValueByLabel('Operating Cash Flow (ttm)');
      if (ocfText) {
        stats.operatingCashFlow = ocfText;
      }

      const profitMarginText = getValueByLabel('Profit Margin');
      if (profitMarginText) {
        stats.profitMargin = profitMarginText;
      }

      const roeText = getValueByLabel('Return on Equity (ttm)');
       if (roeText) {
         stats.returnOnEquity = roeText;
       }

       // Calculate FCF Margin if possible
       if (stats.revenue && stats.freeCashFlow) {
         const parseValue = (text: string) => {
           const num = parseFloat(text.replace(/[A-Z,]/g, ''));
           if (text.includes('T')) return num * 1000000000000;
           if (text.includes('B')) return num * 1000000000;
           if (text.includes('M')) return num * 1000000;
           if (text.includes('K')) return num * 1000;
           return num;
         };

         const rev = parseValue(stats.revenue);
         const fcf = parseValue(stats.freeCashFlow);
         
         if (!isNaN(rev) && !isNaN(fcf) && rev !== 0) {
           stats.fcfm = ((fcf / rev) * 100).toFixed(2);
         }
       }

       

       
      return stats
    })

       const result = {
         symbol,
         url,
         status: 'success',
         data,
         timestamp: new Date().toISOString()
       }


       return NextResponse.json(result)

  } catch (error) {
    console.error('Puppeteer API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to initiate Puppeteer scraping',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
