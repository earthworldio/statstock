import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { symbol } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    const url = `https://finance.yahoo.com/quote/${symbol}/`;
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      
      const fiveDayTab = await page.$("#tab-5d-qsp");
      
      if (fiveDayTab) {
        await fiveDayTab.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log("Failed to click 5D tab:", error);
    }

    await page.addStyleTag({
      content: `
        /* Chart background to match our dark theme */
        .lead.yf-1vfq1p5 {
          background: #1f2937 !important;
          border-radius: 8px !important;
        }
      `,
    });

    await page.evaluate(() => {
      const elementsToHide = [
        ".tooltip",
        ".hu-tooltip",
        ".stx_sticky",
        ".stx_crosshair",
        ".stx_chart_controls",
        ".stx_jump_today",
        ".stx-float-date",
        ".stx_notification_tray",
        ".eventQuoteContainer",
        ".loadingOverlay",
        "header",
        ".search-bar",
        ".header",
        ".nav",
        ".navigation",
        ".top-nav",
        ".main-header",
        ".site-header",
        ".global-header",
        ".header-container",
        ".search-container",
        ".search-input",
        ".search-form",
      ];

      elementsToHide.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = "none";
          }
        });
      });

      const chartContainer = document.querySelector(".lead.yf-1vfq1p5");
      if (chartContainer instanceof HTMLElement) {
        chartContainer.style.width = "60vw";
        chartContainer.style.margin = "0";
        chartContainer.style.padding = "0";
        chartContainer.style.maxWidth = "none";
        chartContainer.style.backgroundColor = "#0f0f0f";
        chartContainer.style.borderRadius = "8px";
      }

      const parentContainers = document.querySelectorAll(
        ".container, .wrapper, .content, .main"
      );
      parentContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.maxWidth = "none";
          container.style.width = "100%";
        }
      });
    });

    const chartElement = await page.$(".lead.yf-1vfq1p5");

    let chartScreenshot = null;
    if (chartElement) {
      
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const boundingBox = await chartElement.boundingBox();

      if (boundingBox) {
        chartScreenshot = await page.screenshot({
          encoding: "base64",
          type: "png",
          clip: {
            x: boundingBox.x + 15,
            y: boundingBox.y + 15,
            width: boundingBox.width - 30,
            height: boundingBox.height - 20,
          },
        });
      } else {
        chartScreenshot = await chartElement.screenshot({
          encoding: "base64",
          type: "png",
          fullPage: false,
        });
      }
    }

    const chartData = await page.evaluate(() => {
      const chartScripts = document.querySelectorAll("script");
      let data = null;

      for (const script of chartScripts) {
        if (
          script.textContent &&
          (script.textContent.includes("chartData") ||
            script.textContent.includes("priceData"))
        ) {
          try {
            const match = script.textContent.match(
              /(?:chartData|priceData)\s*[:=]\s*({.*?})/
            );
            if (match) {
              data = JSON.parse(match[1]);
              break;
            }
          } catch (e) {
            console.log("Failed to parse chart data:", e);
          }
        }
      }

      return data;
    });

    const result = {
      symbol,
      url,
      status: "success",
      chartScreenshot: chartScreenshot
        ? `data:image/png;base64,${chartScreenshot}`
        : null,
      chartData,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chart API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to scrape chart data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
