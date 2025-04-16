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
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // 환율 가져오기
  const fetchExchangeRate = async () => {
    try {
      const res = await fetch('/api/exchangeRate');
      const data = await res.json();
      if (data?.success) setExchangeRate(data.rate);
    } catch (err) {
      console.error('환율 요청 실패', err);
    }
  };

  // 코인 가격 가져오기
  const fetchPrices = async () => {
    if (!exchangeRate) return;
    try {
      setLoading(true);
      const upbitUrl = `https://api.upbit.com/v1/ticker?markets=${COINS.map(c => `KRW-${c.symbol}`).join(',')}`;
      const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(COINS.map(c => `${c.symbol}USDT`))}`;

      const [upbitRes, binanceRes] = await Promise.all([fetch(upbitUrl), fetch(binanceUrl)]);
      const [upbitData, binanceData] = await Promise.all([upbitRes.json(), binanceRes.json()]);

      const combined = COINS.map((coin) => {
        const up = upbitData.find(d => d.market === `KRW-${coin.symbol}`);
        const bn = binanceData.find(d => d.symbol === `${coin.symbol}USDT`);
        const bnPrice = parseFloat(bn?.price || '0');
        const upPrice = up?.trade_price || 0;
        const bnKrw = Math.floor(bnPrice * exchangeRate);
        const diff = upPrice - bnKrw;
        const premium = ((diff / bnKrw) * 100).toFixed(2);

        return {
          ...coin,
          binancePrice: bnPrice.toFixed(bnPrice < 1 ? 4 : 2),
          upbitPrice: upPrice.toLocaleString(),
          binanceKrwPrice: bnKrw.toLocaleString(),
          upbitPriceUsd: (upPrice / exchangeRate).toFixed(2),
          change: up?.change === 'FALL' ? (-up.change_rate * 100).toFixed(2) : (up.change_rate * 100).toFixed(2),
          volume: Math.floor((up?.acc_trade_price_24h || 0) / 100000000),
          premium,
          priceDifference: diff.toLocaleString(),
        };
      });

      setPrices(combined);
    } catch (err) {
      console.error('가격 데이터 가져오기 실패', err);
    } finally {
      setLoading(false);
    }
  };

  // 환율은 하루 세 번 갱신
  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 가격은 5초마다 갱신
  useEffect(() => {
    if (!exchangeRate) return;
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [exchangeRate]);

  return (
    <>
      <Head>
        <title>김치프리미엄 실시간 확인 - KimpCoin</title>
        <meta name="description" content="실시간으로 김치프리미엄 데이터를 확인하세요!" />
        <meta name="keywords" content="김치프리미엄, 암호화폐, 비트코인, 실시간 프리미엄" />
      </Head>

      <main className="min-h-screen p-2 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]"><Spinner /></div>
        ) : isMobile ? (
          <MobileView prices={prices} exchangeRate={exchangeRate} coins={COINS} />
        ) : (
          <PCView prices={prices} exchangeRate={exchangeRate} coins={COINS} />
        )}
      </main>
    </>
  );
}
