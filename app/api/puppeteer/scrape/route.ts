import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

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

    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    const url = `https://finance.yahoo.com/quote/${symbol}/key-statistics/`
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 50000 
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

       const data = await page.evaluate(() => {
         console.log('Starting data extraction...')
      
      const stats: any = {}
      
      const mainContainer = document.querySelector('.container.yf-4vs57a[data-testid="quote-hdr"]')
      
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
      

  
      const allRows = document.querySelectorAll('tr.yf-kbx2lo')
      for (const row of allRows) {
        const firstCell = row.querySelector('td.yf-kbx2lo')
        if (firstCell && firstCell.textContent?.includes('Enterprise Value')) {
          const cells = row.querySelectorAll('td.yf-kbx2lo')
          if (cells.length >= 2) {
            let enterpriseValueText = cells[1].textContent?.trim() || ''
          
            if (enterpriseValueText.includes('T')) {
              const numericValue = parseFloat(enterpriseValueText.replace('T', ''))
              const billionValue = numericValue * 1000 // Convert T to B
              enterpriseValueText = `${billionValue.toFixed(2)}B`
            }
            
            stats.enterpriseValue = enterpriseValueText
            break
          }
        }
      }

       const betaRow = document.querySelectorAll('tr.row.yf-vaowmx')
       for (const row of betaRow) {
         
        const labelCell = row.querySelector('td.label.yf-vaowmx')
        const valueCell = row.querySelector('td.value.yf-vaowmx')
         
         if (labelCell && valueCell && labelCell.textContent?.includes('Beta (5Y Monthly)')) {
           stats.beta = valueCell.textContent?.trim()
           break
         }
       }



       let revenue = 0
       let freeCashFlow = 0
       
       const statsHighlight = document.querySelector('[data-testid="stats-highlight"]')
       if (statsHighlight) {
         const allRows = statsHighlight.querySelectorAll('tr.yf-vaowmx')
         
         for (const row of allRows) {
           const labelCell = row.querySelector('td.label.yf-vaowmx')
           const valueCell = row.querySelector('td.value.yf-vaowmx')
           
           if (labelCell && valueCell) {
             const labelText = labelCell.textContent?.trim()
             const valueText = valueCell.textContent?.trim()
             
             if (labelText?.match(/Revenue\s+\(ttm\)/)) {
               const revenueValue = parseFloat(valueText?.replace('B', '') || '0')
               revenue = revenueValue
               stats.revenue = revenueValue
             }
             
             if (labelText?.match(/Levered Free Cash Flow\s+\(ttm\)/)) {
               const fcfValue = parseFloat(valueText?.replace('B', '') || '0')
               freeCashFlow = fcfValue
             }
           }
         }
       }
       
       if (revenue > 0 && freeCashFlow > 0) {
         const fcfMargin = (freeCashFlow / revenue) * 100
         stats.fcfm = fcfMargin.toFixed(2) 
         console.log('Calculated FCF Margin:', stats.fcfm)
       } else {
         stats.fcfm = '0.00'
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
