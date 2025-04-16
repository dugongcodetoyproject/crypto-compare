'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';

// SVG 아이콘 컴포넌트들
const ArrowUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowPathIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const updateTarget = () => {
      setTargetReached(window.innerWidth < width);
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);

    return () => window.removeEventListener('resize', updateTarget);
  }, [width]);

  return targetReached;
};


const COINS = [
  { symbol: 'BTC', korName: '비트코인' },
  { symbol: 'SOL', korName: '솔라나' },
  { symbol: 'DOGE', korName: '도지코인' },
  { symbol: 'ETH', korName: '이더리움' },
  { symbol: 'BCH', korName: '비트코인캐시' },
  { symbol: 'XRP', korName: '리플' },
  { symbol: 'LINK', korName: '체인링크' },
  { symbol: 'DOT', korName: '폴카닷' },
  { symbol: 'ADA', korName: '에이다' },
  { symbol: 'TRX', korName: '트론' },
  { symbol: 'XLM', korName: '스텔라루멘' },
];

export default function Home() {
  const isMobile = useMediaQuery(768);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await fetch('/api/exchangeRate', {
        next: { revalidate: 3600 }
      });
      const data = await response.json();
      if (data && data.success) {
        setExchangeRate(data.rate);
      }
    } catch (err) {
      console.error('환율 API 오류:', err);
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    if (!exchangeRate) return;
    
    try {
      const [upbitResponse, binanceResponse] = await Promise.all([
        fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP,KRW-DOGE,KRW-SOL'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","XRPUSDT","DOGEUSDT","SOLUSDT"]')
      ]);

      const [upbitData, binanceData] = await Promise.all([
        upbitResponse.json(),
        binanceResponse.json()
      ]);

      const combinedData = COINS.map(coin => {
        const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
        const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

        const binancePrice = parseFloat(binanceItem?.price || 0);
        const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
        const upbitPrice = upbitItem?.trade_price || 0;

        const priceDifference = upbitPrice - binanceKrwPrice;
        const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);

        return {
          symbol: coin.symbol,
          korName: coin.korName,
          binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
          binanceKrwPrice: binanceKrwPrice.toLocaleString(),
          upbitPrice: upbitPrice.toLocaleString(),
          upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
          change: upbitItem?.change === 'FALL' ? (-1 * (upbitItem.change_rate * 100)).toFixed(2) : (upbitItem.change_rate * 100).toFixed(2),
          volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
          premium,
          priceDifference: priceDifference.toLocaleString()
        };
      });

      setPrices(combinedData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [exchangeRate]);

  useEffect(() => {
    fetchExchangeRate();
    const exchangeRateInterval = setInterval(fetchExchangeRate, 3600000);
    return () => clearInterval(exchangeRateInterval);
  }, [fetchExchangeRate]);

  useEffect(() => {
    if (exchangeRate) {
      fetchPrices();
      const priceInterval = setInterval(fetchPrices, 5000);
      return () => clearInterval(priceInterval);
    }
  }, [exchangeRate, fetchPrices]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchPrices();
  }, [fetchPrices]);

  const filteredPrices = useMemo(() => {
    return prices.filter(price => {
      if (activeTab === 'all') return true;
      if (activeTab === 'positive') return parseFloat(price.premium) > 0;
      if (activeTab === 'negative') return parseFloat(price.premium) < 0;
      return true;
    });
  }, [prices, activeTab]);

  return (
    <>
      <Head>
        <title>김치프리미엄 실시간 확인 - KimpCoin</title>
        <meta
          name="description"
          content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
        />
        <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
        <meta name="author" content="KimpCoin Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {isMobile ? (
          <MobileView
            prices={filteredPrices}
            loading={loading}
            lastUpdate={lastUpdate}
            exchangeRate={exchangeRate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleRefresh={handleRefresh}
          />
        ) : (
          <PCView
            prices={filteredPrices}
            loading={loading}
            lastUpdate={lastUpdate}
            exchangeRate={exchangeRate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleRefresh={handleRefresh}
          />
        )}
      </main>
    </>
  );
}

function PCView({ prices, loading, lastUpdate, exchangeRate, activeTab, setActiveTab, handleRefresh }) {
  return (
    <div className="max-w-[1920px] mx-auto p-6">
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/kimchi-icon.png"
                  alt="김치프리미엄 아이콘"
                  className="w-16 h-16 rounded-full shadow-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    실시간 김치프리미엄
                  </h1>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <span>현재 환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</span>
                    <span className="mx-2">•</span>
                    <span>마지막 업데이트: {lastUpdate || '불러오는 중...'}</span>
                    <button 
                      onClick={handleRefresh} 
                      className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                      disabled={loading}
                    >
                      <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6 mb-4">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                전체 코인
              </button>
              <button 
                onClick={() => setActiveTab('positive')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'positive' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                양수 프리미엄
              </button>
              <button 
                onClick={() => setActiveTab('negative')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'negative' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                음수 프리미엄
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">코인</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Binance($)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Upbit(₩)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">등락(%)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">거래량(억)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">김치프리미엄</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {prices.map((priceData) => (
                      <tr key={priceData.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-lg font-semibold">{priceData.symbol.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{priceData.symbol}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{priceData.korName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          ${priceData.binancePrice}
                          <div className="text-xs text-gray-500 dark:text-gray-400">≈ ₩{priceData.binancePrice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          ₩{priceData.binanceKrwPrice}
                          <div className="text-xs text-gray-500 dark:text-gray-400">≈ ${priceData.upbitPriceUsd}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-semibold flex items-center justify-end ${
                            parseFloat(priceData.change) >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {parseFloat(priceData.change) >= 0 ? (
                              <ArrowUpIcon className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 mr-1" />
                            )}
                            {Math.abs(parseFloat(priceData.change))}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          {priceData.volume}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-semibold ${
                            parseFloat(priceData.premium) >= 0 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-purple-600 dark:text-purple-400'
                          }`}>
                            {priceData.premium}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ₩{priceData.priceDifference}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileView({ prices, loading, lastUpdate, exchangeRate, activeTab, setActiveTab, handleRefresh }) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <img
            src="/images/kimchi-icon.png"
            alt="김치프리미엄 아이콘"
            className="w-12 h-12 rounded-full shadow-lg"
          />
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              실시간 김치프리미엄
            </h1>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span>환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</span>
              <button 
                onClick={handleRefresh} 
                className="ml-2 text-blue-500"
                disabled={loading}
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 mb-3">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            전체
          </button>
          <button 
            onClick={() => setActiveTab('positive')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'positive' 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            양수
          </button>
          <button 
            onClick={() => setActiveTab('negative')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'negative' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            음수
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-3 py-1">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">코인</th>
                  <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Binance</th>
                  <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Upbit</th>
                  <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">등락</th>
                  <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">김프</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {prices.map((priceData) => (
                  <tr key={priceData.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-7 w-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">{priceData.symbol.charAt(0)}</span>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">{priceData.symbol}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{priceData.korName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">${priceData.binancePrice}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">₩{priceData.binanceKrwPrice}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      <div className={`text-xs font-medium flex items-center justify-end ${
                        parseFloat(priceData.change) >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {parseFloat(priceData.change) >= 0 ? (
                          <ArrowUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(parseFloat(priceData.change))}%
                      </div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      <div className={`text-xs font-medium ${
                        parseFloat(priceData.premium) >= 0 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-purple-600 dark:text-purple-400'
                      }`}>
                        {priceData.premium}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ₩{priceData.priceDifference}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
