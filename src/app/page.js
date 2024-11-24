
'use client';

import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Spinner from './components/Spinner'; // 로딩 스피너 컴포넌트 추가
import Head from 'next/head'; // Head 컴포넌트 추가

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

export default function Home() {
  const isMobile = useMediaQuery(768);

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

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

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('/api/exchangeRate'); // 서버에서 환율을 가져오도록 수정
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
    const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 하루에 세 번 갱신
    return () => clearInterval(interval);
  }, []);

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
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [exchangeRate]);

  return (
    <>
      {/* Head 컴포넌트를 추가하여 SEO 태그 작성 */}
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
        {isMobile ? (
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
      </main>
    </>
  );
}


function PCView({ prices, loading, lastUpdate, exchangeRate, coins }) {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-[1920px] mx-auto flex space-x-4">
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="flex flex-col items-start space-y-4">
                <a
                  href="https://accounts.binance.com/register?ref=X4CHQFBV" // 이동할 URL을 설정
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4"
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/innovapic.appspot.com/o/Innovapic_my_ai_created_img%2Fbinace-pee2.png?alt=media&token=0728f69d-1631-4fb7-bf9e-67ef4fd96291"
                    alt="김치프리미엄 이미지"
                    className="w-200 h-auto"
                  />
                </a>
              </h1>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">
                <a
                  href="https://console.firebase.google.com/u/0/project/innovapic/storage/innovapic.appspot.com/files/~2FInnovapic_my_ai_created_img?hl=ko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >

                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/innovapic.appspot.com/o/Innovapic_my_ai_created_img%2Fkimchi_icon.webp?alt=media&token=fa23b1a6-413e-4289-bb19-4bdf3f9e4df2"
                    alt="김치프리미엄 아이콘"
                    className="w-20 h-20 ml-1 rounded-3xl shadow-md"

                  />
                  <span className="ml-2">실시간 김치프리미엄</span>
                </a>
              </h1>
              {/* <h1 className="text-2xl font-bold text-gray-900 mt-4">실시간 김치프리미엄</h1> */}
              {/* <img
      src="https://firebasestorage.googleapis.com/v0/b/innovapic.appspot.com/o/Innovapic_my_ai_created_img%2Fkimchi_icon.webp?alt=media&token=fa23b1a6-413e-4289-bb19-4bdf3f9e4df2"
      alt="김치프리미엄 아이콘"
      className="w-6 h-6"
    /> */}
              <p className="text-sm text-gray-500">현재 환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</p>
            </div>
            {/* <div className="text-sm text-gray-500">마지막 업데이트: {lastUpdate}</div> */}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">

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
                {coins.map((coin) => {
                  const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
                  return (
                    <tr key={coin.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{coin.symbol}</div>
                        <div className="text-sm text-gray-500">{coin.korName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right ${parseFloat(priceData.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {priceData.change ? `${priceData.change}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {priceData.volume ? priceData.volume : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-blue-500">{priceData.premium ? `${priceData.premium}%` : 'N/A'}</div>
                        <div className="text-sm text-blue-500">{priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[400px]">
          <div className="sticky top-4">
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
}

function MobileView({ prices, loading, lastUpdate, exchangeRate, coins }) {
  return (
    <main className="min-h-screen p-2 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2 flex justify-between items-center">
          <div>
            <h1 className="flex flex-col items-start space-y-4">
              <a
                href="https://accounts.binance.com/register?ref=X4CHQFBV" // 이동할 URL을 설정
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/innovapic.appspot.com/o/Innovapic_my_ai_created_img%2Fbinace-pee2.png?alt=media&token=0728f69d-1631-4fb7-bf9e-67ef4fd96291"
                  alt="김치프리미엄 이미지"
                  className="w-400 h-auto"
                />
              </a>
            </h1>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
                <a
                  href="https://console.firebase.google.com/u/0/project/innovapic/storage/innovapic.appspot.com/files/~2FInnovapic_my_ai_created_img?hl=ko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >

                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/innovapic.appspot.com/o/Innovapic_my_ai_created_img%2Fkimchi_icon.webp?alt=media&token=fa23b1a6-413e-4289-bb19-4bdf3f9e4df2"
                    alt="김치프리미엄 아이콘"
                    className="w-20 h-20 ml-1 rounded-3xl shadow-md"
                  />
                  <span className="ml-2">실시간 김치프리미엄</span>
                </a>
              </h1>
            {/* <h1 className="text-2xl font-bold text-gray-900 mt-4">실시간 김치프리미엄</h1> */}

            {/* <h1 className="text-lg font-bold text-gray-900">실시간 김치프리미엄</h1> */}
            <p className="text-xs text-gray-500">환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</p>
          </div>
          {/* <div className="text-xs text-gray-500">업데이트: {lastUpdate}</div> */}
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-[10px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-2 text-left font-medium text-gray-500 whitespace-nowrap">코인</th>
                <th className="px-1 py-2 text-right font-medium text-gray-500 whitespace-nowrap">Binance($)</th>
                <th className="px-1 py-2 text-right font-medium text-gray-500 whitespace-nowrap">Upbit(₩)</th>
                <th className="px-1 py-2 text-right font-medium text-gray-500 whitespace-nowrap">등락(%)</th>
                <th className="px-1 py-2 text-right font-medium text-gray-500 whitespace-nowrap">거래량(억)</th>
                <th className="px-1 py-2 text-right font-medium text-gray-500 whitespace-nowrap">김치프리미엄</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coins.map((coin) => {
                const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
                return (
                  <tr key={coin.symbol} className="hover:bg-gray-50">
                    <td className="px-1 py-2 whitespace-nowrap">
                      <div className="font-medium truncate">{coin.symbol}</div>
                      <div className="text-gray-500 truncate">{coin.korName}</div>
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-right">
                      {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-right">
                      {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
                    </td>
                    <td className={`px-1 py-2 whitespace-nowrap text-right ${parseFloat(priceData.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {priceData.change ? `${priceData.change}%` : 'N/A'}
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-right">
                      {priceData.volume ? priceData.volume : 'N/A'}
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-right">
                      <div className="text-blue-500">{priceData.premium ? `${priceData.premium}%` : 'N/A'}</div>
                      <div className="text-blue-500">{priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Chat />
        </div>
      </div>
    </main>
  );
}
