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

// 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
const MAIN_COINS = [
  { symbol: 'BTC', korName: '비트코인' },
  { symbol: 'ETH', korName: '이더리움' },
  { symbol: 'SOL', korName: '솔라나' },
  { symbol: 'XRP', korName: '리플' },
];

const SECONDARY_COINS = [
  { symbol: 'DOGE', korName: '도지코인' },
  { symbol: 'BCH', korName: '비트코인캐시' },
  { symbol: 'LINK', korName: '체인링크' },
  { symbol: 'DOT', korName: '폴카닷' },
  { symbol: 'ADA', korName: '에이다' },
  { symbol: 'TRX', korName: '트론' },
  { symbol: 'XLM', korName: '스텔라루멘' },
];

// 모든 코인 데이터
const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

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

// 개선된 헤더 컴포넌트
const Header = ({ exchangeRate, lastUpdate }) => {
  return (
    <>
      <style jsx>{`
        .header-container {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-image: linear-gradient(to right, #3b82f6, #4f46e5);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 0.75rem;
          color: white;
        }
      
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
      
        .logo-container {
          display: flex;
          align-items: center;
        }
      
        .logo-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
      
        .header-title {
          font-size: 1rem;
          font-weight: 700;
          margin-left: 0.5rem;
          white-space: nowrap;
        }
      
        .header-subtitle {
          font-size: 0.7rem;
          color: white;
          max-width: 100%;
          margin-top: 0.25rem;
        }
      
        .exchange-rate-container {
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          text-align: right;
          margin-top: 0.5rem;
        }
      
        .rate-label {
          font-size: 0.7rem;
          font-weight: 500;
          color: #ef4444;
        }
      
        .rate-value {
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
        }
      
        .update-time {
          font-size: 0.65rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }
      
        @media (min-width: 640px) {
          .header-container {
            padding: 1.25rem;
          }
          
          .header-title {
            font-size: 1.5rem;
          }
          
          .header-subtitle {
            font-size: 0.875rem;
          }
          
          .logo-icon {
            width: 3rem;
            height: 3rem;
          }
          
          .exchange-rate-container {
            padding: 0.75rem 1rem;
            margin-top: 0;
          }
          
          .rate-label {
            font-size: 0.75rem;
          }
          
          .rate-value {
            font-size: 1.125rem;
          }
        }
      
        @media (min-width: 768px) {
          .header-container {
            flex-direction: row;
            padding: 1.5rem;
          }
          
          .header-content {
            flex: 1;
          }
          
          .exchange-rate-container {
            margin-left: 1.5rem;
            min-width: 180px;
            align-self: center;
            margin-top: 0;
          }
          
          .header-top {
            margin-bottom: 0;
          }
          
          .header-title {
            font-size: 1.75rem;
          }
        }
      
        @media (max-width: 480px) {
          .header-subtitle {
            max-width: 200px;
          }
        }
      `}</style>
      <div className="header-container">
        <div className="header-content">
          <div className="header-top">
            <div className="logo-container">
              <img
                src="/images/kimchi-icon.png"
                alt="김치프리미엄 아이콘"
                className="logo-icon"
              />
              <h1 className="header-title">실시간 김치프리미엄</h1>
            </div>
          </div>
          <p className="header-subtitle text-white">
            한국과 글로벌 암호화폐 시장의 가격 차이
          </p>
        </div>
        <div className="exchange-rate-container">
          <div className="rate-label">현재 환율</div>
          <div className="rate-value">
            {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '-'}
          </div>
          <div className="update-time">
            마지막 업데이트: {lastUpdate || '-'}
          </div>
        </div>
      </div>
    </>
  );
};

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4 sm:py-6">
    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-blue-200 border-t-blue-600"></div>
    <span className="ml-2 sm:ml-3 text-sm sm:text-base text-blue-600 font-medium">데이터를 불러오는 중...</span>
  </div>
);

// 코인 테이블 Row 컴포넌트
const CoinRow = ({ coin, priceData, isMobile }) => {
  const paddingClass = isMobile ? "px-1 py-2" : "px-4 sm:px-6 py-4";
  
  // JSDelivr CDN의 cryptocurrency-icons 패키지 사용
  const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`;
  
  return (
    <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
      <td className={`${paddingClass}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-6 w-6 sm:h-10 sm:w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={iconUrl} 
              alt={coin.symbol}
              className="h-4 w-4 sm:h-6 sm:w-6"
              onError={(e) => {
                // 이미지 로드 실패 시 코인 심볼 텍스트로 대체
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span class="font-bold text-xs text-gray-700">${coin.symbol}</span>`;
              }}
            />
          </div>
          <div className="ml-1 sm:ml-3">
            <div className="font-medium text-xs sm:text-base text-gray-900 truncate max-w-[60px] sm:max-w-full">{coin.symbol}</div>
            {!isMobile && <div className="text-sm text-gray-500">{coin.korName}</div>}
          </div>
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-mono font-medium text-xs sm:text-base whitespace-nowrap">
          {priceData.binancePrice ? `$${priceData.binancePrice}` : '-'}
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-mono font-medium text-xs sm:text-base whitespace-nowrap">
          {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '-'}
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        {priceData.change !== undefined ? (
          <div className={`inline-flex items-center px-1 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            parseFloat(priceData.change) >= 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}`}>
            {parseFloat(priceData.change) >= 0 ? `+${priceData.change}%` : `${priceData.change}%`}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-medium text-xs sm:text-base text-gray-900 whitespace-nowrap">{priceData.volume !== undefined ? `${priceData.volume}억` : '-'}</div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-medium text-xs sm:text-lg text-red-600 whitespace-nowrap">
          {priceData.premium !== undefined ? `${priceData.premium}%` : '-'}
        </div>
        <div className={`text-xs text-red-500 whitespace-nowrap`}>
          {priceData.priceDifference ? `₩${priceData.priceDifference}` : '-'}
        </div>
      </td>
    </tr>
  );
};

// 코인 테이블 헤더 컴포넌트
const TableHeader = ({ isMobile }) => {
  const textSizeClass = isMobile ? "text-xs" : "text-sm";
  const paddingClass = isMobile ? "px-1 py-2" : "px-4 sm:px-6 py-4";
  
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg w-[80px] sm:w-auto`}>코인</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider w-[70px] sm:w-auto`}>
          <span className="whitespace-nowrap">Binance</span>
        </th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider w-[70px] sm:w-auto`}>
          <span className="whitespace-nowrap">Upbit</span>
        </th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider w-[50px] sm:w-auto`}>등락</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider w-[50px] sm:w-auto`}>거래량</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg w-[80px] sm:w-auto`}>
          <span className="whitespace-nowrap">김치프리미엄</span>
        </th>
      </tr>
    </thead>
  );
};

// 코인 테이블 컴포넌트
const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      <table className="w-full divide-y divide-gray-200 table-fixed sm:table-auto">
        <TableHeader isMobile={isMobile} />
        <tbody className="bg-white divide-y divide-gray-100">
          {coins.map((coin) => {
            const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
            return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
          })}
        </tbody>
      </table>
    </div>
    {loadingSecondary && <LoadingSpinner />}
  </div>
);

// 통계 요약 컴포넌트
const StatsSummary = ({ prices }) => {
  const pricesWithPremium = prices.filter(coin => coin.premium !== undefined && !isNaN(parseFloat(coin.premium)));
  
  // 평균 김치프리미엄 계산
  const avgPremium = pricesWithPremium.length > 0 
    ? (pricesWithPremium.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / pricesWithPremium.length).toFixed(2)
    : '-';
  
  // 최대 김치프리미엄 코인 찾기
  const maxPremiumCoin = pricesWithPremium.length > 0
    ? pricesWithPremium.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, pricesWithPremium[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-6">
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-l-4 border-blue-500">
        <div className="text-xs sm:text-sm font-medium text-gray-500">평균 김치프리미엄</div>
        <div className="mt-1 text-lg md:text-2xl font-bold text-gray-900">{avgPremium}%</div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-l-4 border-green-500">
        <div className="text-xs sm:text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
        <div className="mt-1 text-lg md:text-2xl font-bold text-gray-900 truncate">
          {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : '-'}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-l-4 border-purple-500 sm:col-span-2 md:col-span-1">
        <div className="text-xs sm:text-sm font-medium text-gray-500">추적 중인 코인</div>
        <div className="mt-1 text-lg md:text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
      </div>
    </div>
  );
};

// PC 뷰 컴포넌트
const PCView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
  return (
    <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row lg:space-x-6">
      <div className="flex-1">
        <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
        
        <div className="mt-6">
          <StatsSummary prices={prices} />
          
          <CoinTable 
            prices={prices} 
            coins={ALL_COINS} 
            isMobile={false}
            loadingSecondary={loadingSecondary}
          />
        </div>
      </div>
      <div className="w-full lg:w-[400px] mt-6 lg:mt-0">
        <div className="lg:sticky lg:top-4">
          <Chat />
        </div>
      </div>
    </div>
  );
};

// 모바일 뷰 컴포넌트
const MobileView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
  return (
    <div className="w-full mx-auto px-1">
      <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
      <div className="mt-3">
        <StatsSummary prices={prices} />
        
        <CoinTable 
          prices={prices} 
          coins={ALL_COINS} 
          isMobile={true}
          loadingSecondary={loadingSecondary}
        />
        
        <div className="mt-4">
          <Chat />
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
export default function Home() {
  const isMobile = useMediaQuery(768);
  const [prices, setPrices] = useState([]);
  const [loadingPrimary, setLoadingPrimary] = useState(true);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [priceMap, setPriceMap] = useState({});  // 코인별 가격 데이터 맵
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상) - 가장 먼저 실행
  useEffect(() => {
    const loadCachedData = () => {
      const cachedData = localStorage.getItem('kimp_coin_data');
      if (cachedData) {
        try {
          const { data, timestamp, cachedExchangeRate } = JSON.parse(cachedData);
          // 30분 이내의 캐시 데이터만 사용
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            // 캐시된 데이터를 priceMap으로 변환
            const cachedPriceMap = {};
            data.forEach(item => {
              cachedPriceMap[item.symbol] = item;
            });
            setPriceMap(cachedPriceMap);
            setPrices(data);
            setLastUpdate(new Date(timestamp).toLocaleTimeString());
            
            // 캐시된 환율 데이터가 있으면 사용
            if (cachedExchangeRate) {
              setExchangeRate(cachedExchangeRate);
            }
            
            setLoadingPrimary(false);  // 캐시 데이터로 로딩 상태 제거
            setIsDataInitialized(true);
          }
        } catch (err) {
          console.error('Error parsing cached data:', err);
        }
      }
    };
    
    loadCachedData();
  }, []);

  // 환율 정보 가져오기
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('/api/exchangeRate');
        const data = await response.json();
        if (data && data.success) {
          setExchangeRate(data.rate);
          // 환율 정보 캐싱
          try {
            const cachedData = localStorage.getItem('kimp_coin_data');
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              parsedData.cachedExchangeRate = data.rate;
              localStorage.setItem('kimp_coin_data', JSON.stringify(parsedData));
            }
          } catch (err) {
            console.error('Error updating cache with exchange rate:', err);
          }
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

  // 코인 가격 데이터 처리 및 병합 함수
  const processCoinData = (coinsToProcess, upbitData, binanceData) => {
    // 기존 priceMap 복사
    const updatedPriceMap = { ...priceMap };
    
    coinsToProcess.forEach(coin => {
      const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
      const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);
      
      // 이전 데이터가 있으면 유지, 없으면 새로 생성
      const existingData = updatedPriceMap[coin.symbol] || { symbol: coin.symbol, korName: coin.korName };
      
      // 바이낸스 가격 데이터 처리
      if (binanceItem?.price) {
        const binancePrice = parseFloat(binanceItem.price);
        existingData.binancePrice = binancePrice.toFixed(binancePrice < 1 ? 4 : 2);
        
        if (exchangeRate) {
          const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
          existingData.binanceKrwPrice = binanceKrwPrice.toLocaleString();
          
          // 업비트 가격 데이터가 있을 경우 프리미엄 계산
          if (upbitItem?.trade_price) {
            const upbitPrice = upbitItem.trade_price;
            const priceDifference = upbitPrice - binanceKrwPrice;
            existingData.premium = binanceKrwPrice > 0 ? 
              ((priceDifference / binanceKrwPrice) * 100).toFixed(2) : '0';
            existingData.priceDifference = priceDifference.toLocaleString();
          }
        }
      }
      
      // 업비트 가격 데이터 처리
      if (upbitItem) {
        existingData.upbitPrice = upbitItem.trade_price.toLocaleString();
        
        if (exchangeRate) {
          existingData.upbitPriceUsd = (upbitItem.trade_price / exchangeRate).toFixed(2);
        }
        
        existingData.change = upbitItem.change === 'FALL' ? 
          (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
          (upbitItem.change_rate * 100).toFixed(2);
          
        existingData.volume = Math.floor((upbitItem.acc_trade_price_24h || 0) / 100000000);
      }
      
      // 업데이트된 데이터를 맵에 저장
      updatedPriceMap[coin.symbol] = existingData;
    });
    
    // 상태 업데이트
    setPriceMap(updatedPriceMap);
    
    // priceMap을 배열로 변환하여 반환
    return Object.values(updatedPriceMap);
  };

  // 코인 데이터 가져오기 함수 - 에러 처리 강화
  const fetchCoinData = async (coinList) => {
    if (!exchangeRate) return Object.values(priceMap); // 환율 없을 경우 기존 데이터 반환
    
    try {
      const [upbitResponse, binanceResponse] = await Promise.all([
        fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
        fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
      ]);

      if (!upbitResponse.ok || !binanceResponse.ok) {
        console.error('API 응답 오류:', { 
          upbit: upbitResponse.status, 
          binance: binanceResponse.status 
        });
        return Object.values(priceMap); // API 오류 시 기존 데이터 유지
      }

      const [upbitData, binanceData] = await Promise.all([
        upbitResponse.json(),
        binanceResponse.json(),
      ]);

      // 에러 응답 처리
      if (!Array.isArray(upbitData) || !Array.isArray(binanceData)) {
        console.error('Invalid API response format');
        return Object.values(priceMap);
      }

      return processCoinData(coinList, upbitData, binanceData);
    } catch (error) {
      console.error(`Error fetching coin data:`, error);
      return Object.values(priceMap); // 에러 발생 시 기존 데이터 유지
    }
  };

  // 코인 데이터를 가져오는 함수 - 최적화된 버전
  const fetchAllCoinsOptimized = async () => {
    if (!exchangeRate) return;
    
    try {
      // 모든 코인 한번에 로드
      const allData = await fetchCoinData(ALL_COINS);
      setPrices(allData);
      setLastUpdate(new Date().toLocaleTimeString());
      
      // 캐시에 저장
      try {
        localStorage.setItem('kimp_coin_data', JSON.stringify({
          data: allData,
          timestamp: Date.now(),
          cachedExchangeRate: exchangeRate
        }));
      } catch (err) {
        console.error('Error saving data to cache:', err);
      }
      
      return allData;
    } catch (err) {
      console.error('Error fetching all coin data:', err);
      return null;
    }
  };

  // 주요 코인 데이터 초기 로드
  useEffect(() => {
    if (isDataInitialized || !exchangeRate) return;
    
    const initializeData = async () => {
      try {
        await fetchAllCoinsOptimized();
        setLoadingPrimary(false);
        setIsDataInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoadingPrimary(false);
      }
    };
    
    initializeData();
  }, [exchangeRate, isDataInitialized]);

  // 정기적인 데이터 업데이트
  useEffect(() => {
    if (!exchangeRate) return;
    
    // 페이지 포커스 상태 감지 - 백그라운드에서 불필요한 API 호출 방지
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAllCoinsOptimized();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 3초마다 모든 코인 데이터 업데이트
    const interval = setInterval(fetchAllCoinsOptimized, 3000);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [exchangeRate]);

  // 데이터를 캐시에 저장
  useEffect(() => {
    if (prices.length > 0 && exchangeRate) {
      try {
        localStorage.setItem('kimp_coin_data', JSON.stringify({
          data: prices,
          timestamp: Date.now(),
          cachedExchangeRate: exchangeRate
        }));
      } catch (err) {
        console.error('Error saving data to cache:', err);
      }
    }
  }, [prices, exchangeRate]);

  return (
    <>
      <SEO />
      <main className="min-h-screen p-2 sm:p-3 md:p-4 bg-gray-50">
        {loadingPrimary ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">코인 데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        ) : isMobile ? (
          <MobileView
            prices={prices}
            exchangeRate={exchangeRate}
            loadingSecondary={loadingSecondary}
            lastUpdate={lastUpdate}
          />
        ) : (
          <PCView
            prices={prices}
            exchangeRate={exchangeRate}
            loadingSecondary={loadingSecondary}
            lastUpdate={lastUpdate}
          />
        )}
      </main>
    </>
  );
}