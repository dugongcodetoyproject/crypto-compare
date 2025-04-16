'use client';

import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Spinner from './components/Spinner';
import Head from 'next/head';
import PCView from './components/PCView';
import MobileView from './components/MobileView';
import useMediaQuery from './hooks/useMediaQuery';

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

  // 환율 가져오기
  const fetchExchangeRate = async () => {
    try {
      const res = await fetch('/api/exchangeRate');
      const data = await res.json();
      if (data && data.success) setExchangeRate(data.rate);
    } catch (err) {
      console.error('환율 요청 실패', err);
    }
  };

  // 코인 가격 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      if (!exchangeRate) return;
      try {
        const [upbitResponse, binanceResponse] = await Promise.all([
          fetch(`https://api.upbit.com/v1/ticker?markets=${COINS.map(coin => `KRW-${coin.symbol}`).join(',')}`),
          fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(COINS.map(coin => `${coin.symbol}USDT`))}`)
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
            priceDifference: priceDifference.toLocaleString(),
          };
        });

        setPrices(combinedData);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    // 초기 데이터 로드
    if (prices.length === 0) {
      setLoading(true);
      fetchPrices().finally(() => setLoading(false));
    }

    // 주기적인 업데이트
    const interval = setInterval(() => {
      fetchPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, [exchangeRate]);

  // 환율은 하루 세 번 갱신
  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>김치프리미엄 실시간 확인 - KimpCoin</title>
        <meta
          name="description"
          content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
        />
        <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래, Bitcoin Premium, 암호화폐 프리미엄, 암호화폐 시세, 암호화폐 차익거래, BTC 프리미엄, 비트코인 프리미엄, 한국 비트코인 시세, 암호화폐 차이, 코인 시세 비교, 한국 거래소 프리미엄, Binance 가격, 업비트 가격, 암호화폐 환율, 비트코인 김프, 암호화폐 김프" />
        <meta name="author" content="KimpCoin Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="min-h-screen p-2 bg-gray-50">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center mb-4 pl-4">
            <img
              src="/images/kimchi-icon.png"
              alt="김치프리미엄 아이콘"
              className="w-12 h-12 mr-2 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">김치프리미엄</h1>
              <p className="text-sm text-gray-500">현재 환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]"><Spinner /></div>
          ) : isMobile ? (
            <MobileView
              prices={prices}
              loading={loading}
              lastUpdate={lastUpdate}
              exchangeRate={exchangeRate}
              coins={COINS}
            />
          ) : (
            <PCView
              prices={prices}
              loading={loading}
              lastUpdate={lastUpdate}
              exchangeRate={exchangeRate}
              coins={COINS}
            />
          )}
        </div>
      </main>
    </>
  );
}
