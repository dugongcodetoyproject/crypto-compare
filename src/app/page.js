'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const COINS = [
    { symbol: 'BTC', korName: '비트코인' },
    { symbol: 'ETH', korName: '이더리움' },
    { symbol: 'BCH', korName: '비트코인캐시' },
    { symbol: 'XRP', korName: '리플' },
    { symbol: 'LINK', korName: '체인링크' },
    { symbol: 'DOT', korName: '폴카닷' },
    { symbol: 'ADA', korName: '에이다' },
    { symbol: 'TRX', korName: '트론' },
    { symbol: 'XLM', korName: '스텔라루멘' },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // 실시간 환율 조회
        const exchangeResponse = await fetch('/api/exchange-rate');
        const exchangeData = await exchangeResponse.json();
        const usdKrwRate = exchangeData.rate;
        setExchangeRate(usdKrwRate);

        // 업비트 가격 조회
        const upbitMarkets = COINS.map(coin => `KRW-${coin.symbol}`).join(',');
        const upbitResponse = await fetch(
          `https://api.upbit.com/v1/ticker?markets=${upbitMarkets}`
        );
        const upbitData = await upbitResponse.json();

        // 바이낸스 가격 조회
        const binanceSymbols = JSON.stringify(
          COINS.map(coin => `${coin.symbol}USDT`)
        );
        const binanceResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbols=${binanceSymbols}`
        );
        const binanceData = await binanceResponse.json();

        const combinedData = COINS.map(coin => {
          const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
          const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);
          
          // 바이낸스 가격을 원화로 변환
          const binancePrice = parseFloat(binanceItem?.price || 0);
          const binanceKrwPrice = Math.floor(binancePrice * usdKrwRate);
          
          // 업비트 가격
          const upbitPrice = upbitItem?.trade_price || 0;
          
          // 김치프리미엄 계산
          const priceDifference = upbitPrice - binanceKrwPrice;
          const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);
          
          return {
            symbol: coin.symbol,
            korName: coin.korName,
            binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
            binanceKrwPrice: binanceKrwPrice.toLocaleString(),
            upbitPrice: upbitPrice.toLocaleString(),
            upbitPriceUsd: (upbitPrice / usdKrwRate).toFixed(2),
            change: (upbitItem?.change_rate * 100).toFixed(2),
            volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
            premium,
            priceDifference: priceDifference.toLocaleString(),
          };
        });

        setPrices(combinedData);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">실시간 김치프리미엄</h1>
            <p className="text-sm text-gray-500">현재 환율: {exchangeRate?.toFixed(2)}원/USD</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {lastUpdate}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4 border-b">
            <div className="flex items-center">
            </div>
            <div className="flex items-center">
         
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">코인</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Binance($)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Upbit(₩)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">등락(%)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">거래량(억)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">김치프리미엄</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">데이터 로딩중...</td>
                  </tr>
                ) : (
                  prices.map((item) => (
                    <tr key={item.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <div>
                            <div className="font-medium">{item.symbol}</div>
                            <div className="text-sm text-gray-500">{item.korName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div>${item.binancePrice}</div>
                        <div className="text-sm text-gray-500">₩{item.binanceKrwPrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div>₩{item.upbitPrice}</div>
                        <div className="text-sm text-gray-500">${item.upbitPriceUsd}</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right ${
                        parseFloat(item.change) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {parseFloat(item.change) >= 0 ? '+' : ''}{item.change}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-blue-500">
                          {parseFloat(item.premium) > 0 ? '+' : ''}{item.premium}%
                        </div>
                        <div className="text-sm text-blue-500">
                          {parseFloat(item.priceDifference) > 0 ? '+' : ''}₩{item.priceDifference}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}