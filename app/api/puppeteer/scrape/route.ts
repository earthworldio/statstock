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
      timeout: 30000 
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

    const data = await page.evaluate(() => {
      
      const stats: any = {}
      
      const mainContainer = document.querySelector('.container.yf-4vs57a[data-testid="quote-hdr"]')
      
      if (!mainContainer) {
        console.log('Main container not found')
        return stats
      }
      
      const nameElement = mainContainer.querySelector('h1')
      if (nameElement) {
        stats.companyName = nameElement.textContent?.trim()
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
