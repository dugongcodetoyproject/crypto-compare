'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Chat from './components/Chat';

// 커스텀 훅: 미디어 쿼리
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

// 코인 데이터 상수
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

// SEO 컴포넌트
const SEO = () => (
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
);

// 헤더 컴포넌트
const Header = ({ exchangeRate }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mt-4">
      <a href="#" className="inline-flex items-center">
        <img
          src="/images/kimchi-icon.png"
          alt="김치프리미엄 아이콘"
          className="w-20 h-20 ml-1 rounded-3xl shadow-md"
        />
        <span className="ml-2">실시간 김치프리미엄</span>
      </a>
    </h1>
    <p className="text-sm text-gray-500">
      현재 환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}
    </p>
  </div>
);

// 코인 테이블 Row 컴포넌트
const CoinRow = ({ coin, priceData, isMobile }) => {
  const textSizeClass = isMobile ? "text-xs" : "";
  const paddingClass = isMobile ? "px-1 py-2" : "px-6 py-4";
  
  return (
    <tr key={coin.symbol} className="hover:bg-gray-50">
      <td className={`${paddingClass} whitespace-nowrap`}>
        <div className="font-medium">{coin.symbol}</div>
        <div className={`${isMobile ? "" : "text-sm"} text-gray-500`}>{coin.korName}</div>
      </td>
      <td className={`${paddingClass} whitespace-nowrap text-right`}>
        {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
      </td>
      <td className={`${paddingClass} whitespace-nowrap text-right`}>
        {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
      </td>
      <td className={`${paddingClass} whitespace-nowrap text-right ${
        parseFloat(priceData.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'
      }`}>
        {priceData.change ? `${priceData.change}%` : 'N/A'}
      </td>
      <td className={`${paddingClass} whitespace-nowrap text-right`}>
        {priceData.volume || 'N/A'}
      </td>
      <td className={`${paddingClass} whitespace-nowrap text-right`}>
        <div className="text-blue-500">{priceData.premium ? `${priceData.premium}%` : 'N/A'}</div>
        <div className={`${isMobile ? "" : "text-sm"} text-blue-500`}>
          {priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}
        </div>
      </td>
    </tr>
  );
};

// 코인 테이블 헤더 컴포넌트
const TableHeader = ({ isMobile }) => {
  const textSizeClass = isMobile ? "text-[10px]" : "text-xs";
  const paddingClass = isMobile ? "px-1 py-2" : "px-6 py-3";
  
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className={`${paddingClass} text-left ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>코인</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>Binance($)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>Upbit(₩)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>등락(%)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>거래량(억)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>김치프리미엄</th>
      </tr>
    </thead>
  );
};

// 코인 테이블 컴포넌트
const CoinTable = ({ prices, coins, isMobile }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className={`min-w-full ${isMobile ? 'text-[10px]' : ''}`}>
      <TableHeader isMobile={isMobile} />
      <tbody className="bg-white divide-y divide-gray-200">
        {coins.map((coin) => {
          const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
          return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
        })}
      </tbody>
    </table>
  </div>
);

// PC 뷰 컴포넌트
const PCView = ({ prices, exchangeRate, coins }) => (
  <div className="max-w-[1920px] mx-auto flex space-x-4">
    <div className="flex-1">
      <div className="mb-6 flex justify-between items-center">
        <Header exchangeRate={exchangeRate} />
      </div>
      <CoinTable prices={prices} coins={coins} isMobile={false} />
    </div>
    <div className="w-[400px]">
      <div className="sticky top-4">
        <Chat />
      </div>
    </div>
  </div>
);

// 모바일 뷰 컴포넌트
const MobileView = ({ prices, exchangeRate, coins }) => (
  <div className="max-w-7xl mx-auto">
    <div className="mb-2 flex justify-between items-center">
      <Header exchangeRate={exchangeRate} />
    </div>
    <CoinTable prices={prices} coins={coins} isMobile={true} />
    <div className="mt-4">
      <Chat />
    </div>
  </div>
);

// 메인 컴포넌트
export default function Home() {
  const isMobile = useMediaQuery(768);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  // 환율 정보 가져오기
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('/api/exchangeRate');
        const data = await response.json();
        if (data && data.success) {
          setExchangeRate(data.rate);
        } else {
          console.error('Failed to fetch exchange rate:', data);
        }
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
    return () => clearInterval(interval);
  }, []);

  // 가격 정보 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      if (!exchangeRate) return;
      setLoading(true);
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
            change: upbitItem?.change === 'FALL' ? 
              (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
              (upbitItem.change_rate * 100).toFixed(2),
            volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
            premium,
            priceDifference: priceDifference.toLocaleString(),
          };
        });

        setPrices(combinedData);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, [exchangeRate]);

  return (
    <>
      <SEO />
      <main className="min-h-screen p-2 bg-gray-50">
        {isMobile ? (
          <MobileView
            prices={prices}
            exchangeRate={exchangeRate}
            coins={COINS}
          />
        ) : (
          <PCView
            prices={prices}
            exchangeRate={exchangeRate}
            coins={COINS}
          />
        )}
      </main>
    </>
  );
}