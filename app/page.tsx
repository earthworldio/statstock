"use client";

import MainLayout from "./components/layout/main-layout";
import StockCard from "./components/stock-card";
import Calculator from "./components/calculator";
import Card from "./components/ui/card";
import StockSearch from "./components/stock-search";
import WelcomeMessage from "./components/welcome-message";
import StockInfo from "./components/stock-info";
import RecentStocks from "./components/recent-stocks";
import { recentStocks, currentStock } from "./data/stocks";
import { formatCurrency, formatPercentage } from "./lib/utils";
import { Stock } from "./types";
import { useState } from "react";

export default function Home() {
  const [selectedStock, setSelectedStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);
  const [chartImage, setChartImage] = useState<string | null>(null);

  const handleSearchResults = (stocks: Stock[]) => {};

  const handleStockSelect = async (symbol: string, companyName: string) => {
    setSelectedStock((prev) => ({
      ...prev,
      symbol: symbol,
      name: companyName,
      companyName: companyName,
    }));

    setLoading(true);

    try {
      const response = await fetch("/api/puppeteer/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol }),
      });

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setSelectedStock((prev) => ({
          ...prev,
          price: parseFloat(data.data.currentPrice) || 0,
          change: parseFloat(data.data.priceChange) || 0,
          changePercent:
            parseFloat(data.data.priceChangePercent?.replace(/[()%]/g, "")) ||
            0,
          currentPrice: data.data.currentPrice || "",
          priceChange: data.data.priceChange || "",
          priceChangePercent: data.data.priceChangePercent || "",
          enterpriseValue: data.data.enterpriseValue || "",
          beta: data.data.beta || "",
          fcfm: data.data.fcfm || "",
          totalCash: data.data.totalCash || "",
          totalDebt: data.data.totalDebt || "",
          operatingCashFlow: data.data.operatingCashFlow || "",
          profitMargin: data.data.profitMargin || "",
          returnOnEquity: data.data.returnOnEquity || "",
        }));
      }

      setLoading(false);

      try {
        const chartResponse = await fetch("/api/puppeteer/chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol }),
        });

        const chartData = await chartResponse.json();
        if (chartData.status === "success" && chartData.chartScreenshot) {
          setChartImage(chartData.chartScreenshot);
        }
      } catch (chartError) {
        console.error("Error fetching chart:", chartError);
      }
    } catch (error) {
      console.error("Error calling Puppeteer:", error);
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col px-10 py-6">
        {/* Search Bar */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <StockSearch
            onSearchResults={handleSearchResults}
            onStockSelect={handleStockSelect}
            className="max-w-2xl"
            placeholder="Search -> ( e.g. AAPL , Tesla )"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-10 min-h-0">
          {/* Stock Info & Calculator Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[6.5fr_3.5fr] gap-6 md:gap-8 lg:gap-10">
            {/* Stock Info */}
            <div className="h-full">
              <Card className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
                <div className="flex-1 prose prose-invert max-w-none">
                  {selectedStock.symbol ? (
                    <>
                      <StockInfo
                        selectedStock={selectedStock}
                        loading={loading}
                        chartImage={chartImage}
                      />
                    </>
                  ) : (
                    <WelcomeMessage />
                  )}
                </div>
              </Card>
            </div>

            {/* Calculator */}
            <div className="h-full">
              <Calculator
                enterpriseValue={selectedStock.enterpriseValue}
                beta={selectedStock.beta}
                fcfm={selectedStock.fcfm}
              />
            </div>
          </div>

          {/* Recent Viewed Stocks - Horizontal Scroll */}
          <RecentStocks recentStocks={recentStocks} />
        </div>
      </div>
    </MainLayout>
  );
}
