// 'use client';

// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Chat from './components/Chat';

// // 커스텀 훅: 미디어 쿼리
// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   useEffect(() => {
//     const updateTarget = () => {
//       setTargetReached(window.innerWidth < width);
//     };

//     updateTarget();
//     window.addEventListener('resize', updateTarget);
//     return () => window.removeEventListener('resize', updateTarget);
//   }, [width]);

//   return targetReached;
// };

// // 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
// const MAIN_COINS = [
//   { symbol: 'BTC', korName: '비트코인' },
//   { symbol: 'ETH', korName: '이더리움' },
//   { symbol: 'SOL', korName: '솔라나' },
//   { symbol: 'XRP', korName: '리플' },
// ];

// const SECONDARY_COINS = [
//   { symbol: 'DOGE', korName: '도지코인' },
//   { symbol: 'BCH', korName: '비트코인캐시' },
//   { symbol: 'LINK', korName: '체인링크' },
//   { symbol: 'DOT', korName: '폴카닷' },
//   { symbol: 'ADA', korName: '에이다' },
//   { symbol: 'TRX', korName: '트론' },
//   { symbol: 'XLM', korName: '스텔라루멘' },
// ];

// // 모든 코인 데이터
// const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

// // SEO 컴포넌트
// const SEO = () => (
//   <Head>
//     <title>김치프리미엄 실시간 확인 - KimpCoin</title>
//     <meta
//       name="description"
//       content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
//     />
//     <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
//     <meta name="author" content="KimpCoin Team" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </Head>
// );

// // 헤더 컴포넌트
// const Header = ({ exchangeRate }) => (
//   <div>
//     <h1 className="text-2xl font-bold text-gray-900 mt-4">
//       <a href="#" className="inline-flex items-center">
//         <img
//           src="/images/kimchi-icon.png"
//           alt="김치프리미엄 아이콘"
//           className="w-20 h-20 ml-1 rounded-3xl shadow-md"
//         />
//         <span className="ml-2">실시간 김치프리미엄</span>
//       </a>
//     </h1>
//     <p className="text-sm text-gray-500">
//       현재 환율: {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}
//     </p>
//   </div>
// );

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-4">
//     <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
//     <span className="ml-2 text-sm text-gray-500">로딩 중...</span>
//   </div>
// );

// // 코인 테이블 Row 컴포넌트
// const CoinRow = ({ coin, priceData, isMobile }) => {
//   const textSizeClass = isMobile ? "text-xs" : "";
//   const paddingClass = isMobile ? "px-1 py-2" : "px-6 py-4";
  
//   return (
//     <tr key={coin.symbol} className="hover:bg-gray-50">
//       <td className={`${paddingClass} whitespace-nowrap`}>
//         <div className="font-medium">{coin.symbol}</div>
//         <div className={`${isMobile ? "" : "text-sm"} text-gray-500`}>{coin.korName}</div>
//       </td>
//       <td className={`${paddingClass} whitespace-nowrap text-right`}>
//         {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
//       </td>
//       <td className={`${paddingClass} whitespace-nowrap text-right`}>
//         {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
//       </td>
//       <td className={`${paddingClass} whitespace-nowrap text-right ${
//         parseFloat(priceData.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'
//       }`}>
//         {priceData.change ? `${priceData.change}%` : 'N/A'}
//       </td>
//       <td className={`${paddingClass} whitespace-nowrap text-right`}>
//         {priceData.volume || 'N/A'}
//       </td>
//       <td className={`${paddingClass} whitespace-nowrap text-right`}>
//         <div className="text-blue-500">{priceData.premium ? `${priceData.premium}%` : 'N/A'}</div>
//         <div className={`${isMobile ? "" : "text-sm"} text-blue-500`}>
//           {priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // 코인 테이블 헤더 컴포넌트
// const TableHeader = ({ isMobile }) => {
//   const textSizeClass = isMobile ? "text-[10px]" : "text-xs";
//   const paddingClass = isMobile ? "px-1 py-2" : "px-6 py-3";
  
//   return (
//     <thead className="bg-gray-50">
//       <tr>
//         <th className={`${paddingClass} text-left ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>코인</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>Binance($)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>Upbit(₩)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>등락(%)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>거래량(억)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-medium text-gray-500 uppercase tracking-wider`}>김치프리미엄</th>
//       </tr>
//     </thead>
//   );
// };

// // 코인 테이블 컴포넌트
// const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
//   <div className="bg-white rounded-lg shadow overflow-hidden">
//     <table className={`min-w-full ${isMobile ? 'text-[10px]' : ''}`}>
//       <TableHeader isMobile={isMobile} />
//       <tbody className="bg-white divide-y divide-gray-200">
//         {coins.map((coin) => {
//           const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
//           return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
//         })}
//       </tbody>
//     </table>
//     {loadingSecondary && <LoadingSpinner />}
//   </div>
// );

// // PC 뷰 컴포넌트
// const PCView = ({ prices, exchangeRate, loadingSecondary }) => (
//   <div className="max-w-[1920px] mx-auto flex space-x-4">
//     <div className="flex-1">
//       <div className="mb-6 flex justify-between items-center">
//         <Header exchangeRate={exchangeRate} />
//       </div>
//       <CoinTable 
//         prices={prices} 
//         coins={ALL_COINS} 
//         isMobile={false}
//         loadingSecondary={loadingSecondary}
//       />
//     </div>
//     <div className="w-[400px]">
//       <div className="sticky top-4">
//         <Chat />
//       </div>
//     </div>
//   </div>
// );

// // 모바일 뷰 컴포넌트
// const MobileView = ({ prices, exchangeRate, loadingSecondary }) => (
//   <div className="max-w-7xl mx-auto">
//     <div className="mb-2 flex justify-between items-center">
//       <Header exchangeRate={exchangeRate} />
//     </div>
//     <CoinTable 
//       prices={prices} 
//       coins={ALL_COINS} 
//       isMobile={true}
//       loadingSecondary={loadingSecondary}
//     />
//     <div className="mt-4">
//       <Chat />
//     </div>
//   </div>
// );

// // 메인 컴포넌트
// export default function Home() {
//   const isMobile = useMediaQuery(768);
//   const [prices, setPrices] = useState([]);
//   const [loadingPrimary, setLoadingPrimary] = useState(true);
//   const [loadingSecondary, setLoadingSecondary] = useState(false);
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   // 환율 정보 가져오기
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('/api/exchangeRate');
//         const data = await response.json();
//         if (data && data.success) {
//           setExchangeRate(data.rate);
//         } else {
//           console.error('Failed to fetch exchange rate:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching exchange rate:', err);
//       }
//     };

//     fetchExchangeRate();
//     const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
//     return () => clearInterval(interval);
//   }, []);

//   // 코인 가격 데이터 처리 함수
//   const processCoinData = (coinsToProcess, upbitData, binanceData) => {
//     return coinsToProcess.map(coin => {
//       const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
//       const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

//       const binancePrice = parseFloat(binanceItem?.price || 0);
//       const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
//       const upbitPrice = upbitItem?.trade_price || 0;

//       const priceDifference = upbitPrice - binanceKrwPrice;
//       const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);

//       return {
//         symbol: coin.symbol,
//         korName: coin.korName,
//         binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
//         binanceKrwPrice: binanceKrwPrice.toLocaleString(),
//         upbitPrice: upbitPrice.toLocaleString(),
//         upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
//         change: upbitItem?.change === 'FALL' ? 
//           (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
//           (upbitItem.change_rate * 100).toFixed(2),
//         volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
//         premium,
//         priceDifference: priceDifference.toLocaleString(),
//       };
//     });
//   };

//   // 코인 데이터 가져오기 함수
//   const fetchCoinData = async (coinList) => {
//     if (!exchangeRate) return [];
    
//     try {
//       const [upbitResponse, binanceResponse] = await Promise.all([
//         fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
//         fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
//       ]);

//       const [upbitData, binanceData] = await Promise.all([
//         upbitResponse.json(),
//         binanceResponse.json(),
//       ]);

//       return processCoinData(coinList, upbitData, binanceData);
//     } catch (error) {
//       console.error(`Error fetching coin data:`, error);
//       return [];
//     }
//   };

//   // 주요 코인 데이터 가져오기
//   useEffect(() => {
//     const fetchPrimaryCoins = async () => {
//       if (!exchangeRate) return;
      
//       setLoadingPrimary(true);
//       try {
//         const primaryData = await fetchCoinData(MAIN_COINS);
//         setPrices(primaryData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error fetching primary coins:', err);
//       } finally {
//         setLoadingPrimary(false);
        
//         // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
//         setLoadingSecondary(true);
//         try {
//           const secondaryData = await fetchCoinData(SECONDARY_COINS);
//           setPrices(prev => [...prev, ...secondaryData]);
//           setLastUpdate(new Date().toLocaleTimeString());
//         } catch (err) {
//           console.error('Error fetching secondary coins:', err);
//         } finally {
//           setLoadingSecondary(false);
//         }
//       }
//     };

//     fetchPrimaryCoins();
    
//     // 5초마다 모든 코인 데이터 업데이트
//     const interval = setInterval(async () => {
//       if (!exchangeRate) return;
      
//       try {
//         const allData = await fetchCoinData(ALL_COINS);
//         setPrices(allData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error updating coin data:', err);
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [exchangeRate]);

//   // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
//   useEffect(() => {
//     const loadCachedData = () => {
//       const cachedData = localStorage.getItem('kimp_coin_data');
//       if (cachedData) {
//         const { data, timestamp } = JSON.parse(cachedData);
//         // 5분 이내의 캐시 데이터만 사용
//         if (Date.now() - timestamp < 5 * 60 * 1000) {
//           setPrices(data);
//         }
//       }
//     };
    
//     loadCachedData();
//   }, []);

//   // 데이터를 캐시에 저장
//   useEffect(() => {
//     if (prices.length > 0) {
//       localStorage.setItem('kimp_coin_data', JSON.stringify({
//         data: prices,
//         timestamp: Date.now()
//       }));
//     }
//   }, [prices]);

//   return (
//     <>
//       <SEO />
//       <main className="min-h-screen p-2 bg-gray-50">
//         {loadingPrimary ? (
//           <div className="flex justify-center items-center h-64">
//             <LoadingSpinner />
//           </div>
//         ) : isMobile ? (
//           <MobileView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//           />
//         ) : (
//           <PCView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//           />
//         )}
//       </main>
//     </>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Chat from './components/Chat';

// // 커스텀 훅: 미디어 쿼리
// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   useEffect(() => {
//     const updateTarget = () => {
//       setTargetReached(window.innerWidth < width);
//     };

//     updateTarget();
//     window.addEventListener('resize', updateTarget);
//     return () => window.removeEventListener('resize', updateTarget);
//   }, [width]);

//   return targetReached;
// };

// // 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
// const MAIN_COINS = [
//   { symbol: 'BTC', korName: '비트코인', icon: '/images/coins/btc.png' },
//   { symbol: 'ETH', korName: '이더리움', icon: '/images/coins/eth.png' },
//   { symbol: 'SOL', korName: '솔라나', icon: '/images/coins/sol.png' },
//   { symbol: 'XRP', korName: '리플', icon: '/images/coins/xrp.png' },
// ];

// const SECONDARY_COINS = [
//   { symbol: 'DOGE', korName: '도지코인', icon: '/images/coins/doge.png' },
//   { symbol: 'BCH', korName: '비트코인캐시', icon: '/images/coins/bch.png' },
//   { symbol: 'LINK', korName: '체인링크', icon: '/images/coins/link.png' },
//   { symbol: 'DOT', korName: '폴카닷', icon: '/images/coins/dot.png' },
//   { symbol: 'ADA', korName: '에이다', icon: '/images/coins/ada.png' },
//   { symbol: 'TRX', korName: '트론', icon: '/images/coins/trx.png' },
//   { symbol: 'XLM', korName: '스텔라루멘', icon: '/images/coins/xlm.png' },
// ];

// // 모든 코인 데이터
// const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

// // SEO 컴포넌트
// const SEO = () => (
//   <Head>
//     <title>김치프리미엄 실시간 확인 - KimpCoin</title>
//     <meta
//       name="description"
//       content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
//     />
//     <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
//     <meta name="author" content="KimpCoin Team" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </Head>
// );

// // 헤더 컴포넌트
// const Header = ({ exchangeRate, lastUpdate }) => (
//   <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-lg text-white">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center">
//         <img
//           src="/images/kimchi-icon.png"
//           alt="김치프리미엄 아이콘"
//           className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//         />
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">실시간 김치프리미엄</h1>
//           <p className="text-blue-100 mt-1">한국과 글로벌 암호화폐 시장의 가격 차이를 실시간으로 확인하세요</p>
//         </div>
//       </div>
//       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
//         <div className="text-sm font-medium">현재 환율</div>
//         <div className="text-2xl font-bold">{exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</div>
//         <div className="text-xs opacity-80 mt-1">마지막 업데이트: {lastUpdate || '로딩 중'}</div>
//       </div>
//     </div>
//   </div>
// );

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-6">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
//     <span className="ml-3 text-blue-600 font-medium">데이터를 불러오는 중...</span>
//   </div>
// );

// // 코인 테이블 Row 컴포넌트
// const CoinRow = ({ coin, priceData, isMobile }) => {
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
//   const isPremiumPositive = parseFloat(priceData.premium || 0) > 0;
  
//   return (
//     <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
//       <td className={`${paddingClass}`}>
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
//             {coin.icon ? (
//               <img src={coin.icon} alt={coin.symbol} className="h-6 w-6" />
//             ) : (
//               <span className="font-bold text-sm text-gray-700">{coin.symbol}</span>
//             )}
//           </div>
//           <div className="ml-3">
//             <div className="font-medium text-gray-900">{coin.symbol}</div>
//             <div className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{coin.korName}</div>
//           </div>
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//           parseFloat(priceData.change || 0) >= 0 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'}`}>
//           {priceData.change 
//             ? parseFloat(priceData.change) >= 0 
//               ? `+${priceData.change}%` 
//               : `${priceData.change}%` 
//             : 'N/A'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-medium text-gray-900">{priceData.volume ? `${priceData.volume}억` : 'N/A'}</div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`font-medium text-lg ${isPremiumPositive ? 'text-blue-600' : 'text-purple-600'}`}>
//           {priceData.premium ? `${priceData.premium}%` : 'N/A'}
//         </div>
//         <div className={`${isMobile ? "text-xs" : "text-sm"} ${isPremiumPositive ? 'text-blue-500' : 'text-purple-500'}`}>
//           {priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // 코인 테이블 헤더 컴포넌트
// const TableHeader = ({ isMobile }) => {
//   const textSizeClass = isMobile ? "text-xs" : "text-sm";
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
  
//   return (
//     <thead className="bg-gray-50">
//       <tr>
//         <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg`}>코인</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Binance($)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Upbit(₩)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>등락(%)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>거래량(억)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg`}>김치프리미엄</th>
//       </tr>
//     </thead>
//   );
// };

// // 코인 테이블 컴포넌트
// const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
//   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <TableHeader isMobile={isMobile} />
//         <tbody className="bg-white divide-y divide-gray-100">
//           {coins.map((coin) => {
//             const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
//             return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//     {loadingSecondary && <LoadingSpinner />}
//   </div>
// );

// // 통계 요약 컴포넌트
// const StatsSummary = ({ prices }) => {
//   // 평균 김치프리미엄 계산
//   const avgPremium = prices.length > 0 
//     ? (prices.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / prices.length).toFixed(2)
//     : 'N/A';
  
//   // 최대 김치프리미엄 코인 찾기
//   const maxPremiumCoin = prices.length > 0
//     ? prices.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, prices[0])
//     : null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//         <div className="text-sm font-medium text-gray-500">평균 김치프리미엄</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{avgPremium}%</div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//         <div className="text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">
//           {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : 'N/A'}
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
//         <div className="text-sm font-medium text-gray-500">추적 중인 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
//       </div>
//     </div>
//   );
// };

// // 필터 컴포넌트
// const FilterBar = ({ onShowPremiumOnly, showPremiumOnly }) => (
//   <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
//     <div className="font-medium text-gray-700">필터</div>
//     <div className="flex items-center space-x-4">
//       <label className="inline-flex items-center">
//         <input
//           type="checkbox"
//           className="form-checkbox h-5 w-5 text-blue-600 rounded"
//           checked={showPremiumOnly}
//           onChange={(e) => onShowPremiumOnly(e.target.checked)}
//         />
//         <span className="ml-2 text-sm text-gray-700">프리미엄 코인만 보기</span>
//       </label>
//     </div>
//   </div>
// );

// // PC 뷰 컴포넌트
// const PCView = ({ prices, exchangeRate, loadingSecondary, lastUpdate, showPremiumOnly, setShowPremiumOnly }) => {
//   const filteredCoins = showPremiumOnly 
//     ? ALL_COINS.filter(coin => {
//         const priceData = prices.find(price => price.symbol === coin.symbol);
//         return priceData && parseFloat(priceData.premium || 0) > 0;
//       })
//     : ALL_COINS;

//   return (
//     <div className="max-w-[1920px] mx-auto flex space-x-6">
//       <div className="flex-1">
//         <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
        
//         <div className="mt-6">
//           <StatsSummary prices={prices} />
          
//           <FilterBar 
//             onShowPremiumOnly={setShowPremiumOnly} 
//             showPremiumOnly={showPremiumOnly} 
//           />
          
//           <CoinTable 
//             prices={prices} 
//             coins={filteredCoins} 
//             isMobile={false}
//             loadingSecondary={loadingSecondary}
//           />
//         </div>
//       </div>
//       <div className="w-[400px]">
//         <div className="sticky top-4 mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 모바일 뷰 컴포넌트
// const MobileView = ({ prices, exchangeRate, loadingSecondary, lastUpdate, showPremiumOnly, setShowPremiumOnly }) => {
//   const filteredCoins = showPremiumOnly 
//     ? ALL_COINS.filter(coin => {
//         const priceData = prices.find(price => price.symbol === coin.symbol);
//         return priceData && parseFloat(priceData.premium || 0) > 0;
//       })
//     : ALL_COINS;

//   return (
//     <div className="max-w-7xl mx-auto">
//       <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
//       <div className="mt-4">
//         <StatsSummary prices={prices} />
        
//         <FilterBar 
//           onShowPremiumOnly={setShowPremiumOnly} 
//           showPremiumOnly={showPremiumOnly} 
//         />
        
//         <CoinTable 
//           prices={prices} 
//           coins={filteredCoins} 
//           isMobile={true}
//           loadingSecondary={loadingSecondary}
//         />
        
//         <div className="mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 메인 컴포넌트
// export default function Home() {
//   const isMobile = useMediaQuery(768);
//   const [prices, setPrices] = useState([]);
//   const [loadingPrimary, setLoadingPrimary] = useState(true);
//   const [loadingSecondary, setLoadingSecondary] = useState(false);
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [showPremiumOnly, setShowPremiumOnly] = useState(false);

//   // 환율 정보 가져오기
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('/api/exchangeRate');
//         const data = await response.json();
//         if (data && data.success) {
//           setExchangeRate(data.rate);
//         } else {
//           console.error('Failed to fetch exchange rate:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching exchange rate:', err);
//       }
//     };

//     fetchExchangeRate();
//     const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
//     return () => clearInterval(interval);
//   }, []);

//   // 코인 가격 데이터 처리 함수
//   const processCoinData = (coinsToProcess, upbitData, binanceData) => {
//     return coinsToProcess.map(coin => {
//       const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
//       const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

//       const binancePrice = parseFloat(binanceItem?.price || 0);
//       const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
//       const upbitPrice = upbitItem?.trade_price || 0;

//       const priceDifference = upbitPrice - binanceKrwPrice;
//       const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);

//       return {
//         symbol: coin.symbol,
//         korName: coin.korName,
//         binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
//         binanceKrwPrice: binanceKrwPrice.toLocaleString(),
//         upbitPrice: upbitPrice.toLocaleString(),
//         upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
//         change: upbitItem?.change === 'FALL' ? 
//           (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
//           (upbitItem.change_rate * 100).toFixed(2),
//         volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
//         premium,
//         priceDifference: priceDifference.toLocaleString(),
//       };
//     });
//   };

//   // 코인 데이터 가져오기 함수
//   const fetchCoinData = async (coinList) => {
//     if (!exchangeRate) return [];
    
//     try {
//       const [upbitResponse, binanceResponse] = await Promise.all([
//         fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
//         fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
//       ]);

//       const [upbitData, binanceData] = await Promise.all([
//         upbitResponse.json(),
//         binanceResponse.json(),
//       ]);

//       return processCoinData(coinList, upbitData, binanceData);
//     } catch (error) {
//       console.error(`Error fetching coin data:`, error);
//       return [];
//     }
//   };

//   // 주요 코인 데이터 가져오기
//   useEffect(() => {
//     const fetchPrimaryCoins = async () => {
//       if (!exchangeRate) return;
      
//       setLoadingPrimary(true);
//       try {
//         const primaryData = await fetchCoinData(MAIN_COINS);
//         setPrices(primaryData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error fetching primary coins:', err);
//       } finally {
//         setLoadingPrimary(false);
        
//         // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
//         setLoadingSecondary(true);
//         try {
//           const secondaryData = await fetchCoinData(SECONDARY_COINS);
//           setPrices(prev => [...prev, ...secondaryData]);
//           setLastUpdate(new Date().toLocaleTimeString());
//         } catch (err) {
//           console.error('Error fetching secondary coins:', err);
//         } finally {
//           setLoadingSecondary(false);
//         }
//       }
//     };

//     fetchPrimaryCoins();
    
//     // 5초마다 모든 코인 데이터 업데이트
//     const interval = setInterval(async () => {
//       if (!exchangeRate) return;
      
//       try {
//         const allData = await fetchCoinData(ALL_COINS);
//         setPrices(allData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error updating coin data:', err);
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [exchangeRate]);

//   // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
//   useEffect(() => {
//     const loadCachedData = () => {
//       const cachedData = localStorage.getItem('kimp_coin_data');
//       if (cachedData) {
//         const { data, timestamp } = JSON.parse(cachedData);
//         // 5분 이내의 캐시 데이터만 사용
//         if (Date.now() - timestamp < 5 * 60 * 1000) {
//           setPrices(data);
//         }
//       }
//     };
    
//     loadCachedData();
//   }, []);

//   // 데이터를 캐시에 저장
//   useEffect(() => {
//     if (prices.length > 0) {
//       localStorage.setItem('kimp_coin_data', JSON.stringify({
//         data: prices,
//         timestamp: Date.now()
//       }));
//     }
//   }, [prices]);

//   return (
//     <>
//       <SEO />
//       <main className="min-h-screen p-4 bg-gray-50">
//         {loadingPrimary ? (
//           <div className="flex justify-center items-center h-screen">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
//               <p className="mt-4 text-lg text-gray-600 font-medium">코인 데이터를 불러오는 중입니다...</p>
//             </div>
//           </div>
//         ) : isMobile ? (
//           <MobileView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//             showPremiumOnly={showPremiumOnly}
//             setShowPremiumOnly={setShowPremiumOnly}
//           />
//         ) : (
//           <PCView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//             showPremiumOnly={showPremiumOnly}
//             setShowPremiumOnly={setShowPremiumOnly}
//           />
//         )}
//       </main>
//     </>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Chat from './components/Chat';

// // 커스텀 훅: 미디어 쿼리
// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   useEffect(() => {
//     const updateTarget = () => {
//       setTargetReached(window.innerWidth < width);
//     };

//     updateTarget();
//     window.addEventListener('resize', updateTarget);
//     return () => window.removeEventListener('resize', updateTarget);
//   }, [width]);

//   return targetReached;
// };

// // 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
// const MAIN_COINS = [
//   { symbol: 'BTC', korName: '비트코인' },
//   { symbol: 'ETH', korName: '이더리움' },
//   { symbol: 'SOL', korName: '솔라나' },
//   { symbol: 'XRP', korName: '리플' },
// ];

// const SECONDARY_COINS = [
//   { symbol: 'DOGE', korName: '도지코인' },
//   { symbol: 'BCH', korName: '비트코인캐시' },
//   { symbol: 'LINK', korName: '체인링크' },
//   { symbol: 'DOT', korName: '폴카닷' },
//   { symbol: 'ADA', korName: '에이다' },
//   { symbol: 'TRX', korName: '트론' },
//   { symbol: 'XLM', korName: '스텔라루멘' },
// ];

// // 모든 코인 데이터
// const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

// // SEO 컴포넌트
// const SEO = () => (
//   <Head>
//     <title>김치프리미엄 실시간 확인 - KimpCoin</title>
//     <meta
//       name="description"
//       content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
//     />
//     <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
//     <meta name="author" content="KimpCoin Team" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </Head>
// );

// // 헤더 컴포넌트
// const Header = ({ exchangeRate, lastUpdate }) => (
//   <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-lg text-white">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center">
//         <img
//           src="/images/kimchi-icon.png"
//           alt="김치프리미엄 아이콘"
//           className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//         />
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">실시간 김치프리미엄</h1>
//           <p className="text-blue-100 mt-1">한국과 글로벌 암호화폐 시장의 가격 차이를 실시간으로 확인하세요</p>
//         </div>
//       </div>
//       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
//         <div className="text-sm font-medium">현재 환율</div>
//         <div className="text-2xl font-bold">{exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</div>
//         <div className="text-xs opacity-80 mt-1">마지막 업데이트: {lastUpdate || '로딩 중'}</div>
//       </div>
//     </div>
//   </div>
// );

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-6">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
//     <span className="ml-3 text-blue-600 font-medium">데이터를 불러오는 중...</span>
//   </div>
// );

// // 코인 테이블 Row 컴포넌트
// const CoinRow = ({ coin, priceData, isMobile }) => {
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
//   const isPremiumPositive = parseFloat(priceData.premium || 0) > 0;
  
//   // JSDelivr CDN의 cryptocurrency-icons 패키지 사용
//   const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`;
  
//   return (
//     <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
//       <td className={`${paddingClass}`}>
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
//             <img 
//               src={iconUrl} 
//               alt={coin.symbol}
//               className="h-6 w-6"
//               onError={(e) => {
//                 // 이미지 로드 실패 시 코인 심볼 텍스트로 대체
//                 e.target.onerror = null;
//                 e.target.style.display = 'none';
//                 e.target.parentNode.innerHTML = `<span class="font-bold text-sm text-gray-700">${coin.symbol}</span>`;
//               }}
//             />
//           </div>
//           <div className="ml-3">
//             <div className="font-medium text-gray-900">{coin.symbol}</div>
//             <div className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{coin.korName}</div>
//           </div>
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//           parseFloat(priceData.change || 0) >= 0 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'}`}>
//           {priceData.change 
//             ? parseFloat(priceData.change) >= 0 
//               ? `+${priceData.change}%` 
//               : `${priceData.change}%` 
//             : 'N/A'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-medium text-gray-900">{priceData.volume ? `${priceData.volume}억` : 'N/A'}</div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`font-medium text-lg ${isPremiumPositive ? 'text-blue-600' : 'text-purple-600'}`}>
//           {priceData.premium ? `${priceData.premium}%` : 'N/A'}
//         </div>
//         <div className={`${isMobile ? "text-xs" : "text-sm"} ${isPremiumPositive ? 'text-blue-500' : 'text-purple-500'}`}>
//           {priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // 코인 테이블 헤더 컴포넌트
// const TableHeader = ({ isMobile }) => {
//   const textSizeClass = isMobile ? "text-xs" : "text-sm";
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
  
//   return (
//     <thead className="bg-gray-50">
//       <tr>
//         <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg`}>코인</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Binance($)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Upbit(₩)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>등락(%)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>거래량(억)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg`}>김치프리미엄</th>
//       </tr>
//     </thead>
//   );
// };

// // 코인 테이블 컴포넌트
// const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
//   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <TableHeader isMobile={isMobile} />
//         <tbody className="bg-white divide-y divide-gray-100">
//           {coins.map((coin) => {
//             const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
//             return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//     {loadingSecondary && <LoadingSpinner />}
//   </div>
// );

// // 통계 요약 컴포넌트
// const StatsSummary = ({ prices }) => {
//   // 평균 김치프리미엄 계산
//   const avgPremium = prices.length > 0 
//     ? (prices.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / prices.length).toFixed(2)
//     : 'N/A';
  
//   // 최대 김치프리미엄 코인 찾기
//   const maxPremiumCoin = prices.length > 0
//     ? prices.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, prices[0])
//     : null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//         <div className="text-sm font-medium text-gray-500">평균 김치프리미엄</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{avgPremium}%</div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//         <div className="text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">
//           {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : 'N/A'}
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
//         <div className="text-sm font-medium text-gray-500">추적 중인 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
//       </div>
//     </div>
//   );
// };

// // 필터 컴포넌트
// const FilterBar = ({ onShowPremiumOnly, showPremiumOnly }) => (
//   <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
//     <div className="font-medium text-gray-700">필터</div>
//     <div className="flex items-center space-x-4">
//       <label className="inline-flex items-center">
//         <input
//           type="checkbox"
//           className="form-checkbox h-5 w-5 text-blue-600 rounded"
//           checked={showPremiumOnly}
//           onChange={(e) => onShowPremiumOnly(e.target.checked)}
//         />
//         <span className="ml-2 text-sm text-gray-700">프리미엄 코인만 보기</span>
//       </label>
//     </div>
//   </div>
// );

// // PC 뷰 컴포넌트
// const PCView = ({ prices, exchangeRate, loadingSecondary, lastUpdate, showPremiumOnly, setShowPremiumOnly }) => {
//   const filteredCoins = showPremiumOnly 
//     ? ALL_COINS.filter(coin => {
//         const priceData = prices.find(price => price.symbol === coin.symbol);
//         return priceData && parseFloat(priceData.premium || 0) > 0;
//       })
//     : ALL_COINS;

//   return (
//     <div className="max-w-[1920px] mx-auto flex space-x-6">
//       <div className="flex-1">
//         <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
        
//         <div className="mt-6">
//           <StatsSummary prices={prices} />
          
//           <FilterBar 
//             onShowPremiumOnly={setShowPremiumOnly} 
//             showPremiumOnly={showPremiumOnly} 
//           />
          
//           <CoinTable 
//             prices={prices} 
//             coins={filteredCoins} 
//             isMobile={false}
//             loadingSecondary={loadingSecondary}
//           />
//         </div>
//       </div>
//       <div className="w-[400px]">
//         <div className="sticky top-4 mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 모바일 뷰 컴포넌트
// const MobileView = ({ prices, exchangeRate, loadingSecondary, lastUpdate, showPremiumOnly, setShowPremiumOnly }) => {
//   const filteredCoins = showPremiumOnly 
//     ? ALL_COINS.filter(coin => {
//         const priceData = prices.find(price => price.symbol === coin.symbol);
//         return priceData && parseFloat(priceData.premium || 0) > 0;
//       })
//     : ALL_COINS;

//   return (
//     <div className="max-w-7xl mx-auto">
//       <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
//       <div className="mt-4">
//         <StatsSummary prices={prices} />
        
//         <FilterBar 
//           onShowPremiumOnly={setShowPremiumOnly} 
//           showPremiumOnly={showPremiumOnly} 
//         />
        
//         <CoinTable 
//           prices={prices} 
//           coins={filteredCoins} 
//           isMobile={true}
//           loadingSecondary={loadingSecondary}
//         />
        
//         <div className="mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 메인 컴포넌트
// export default function Home() {
//   const isMobile = useMediaQuery(768);
//   const [prices, setPrices] = useState([]);
//   const [loadingPrimary, setLoadingPrimary] = useState(true);
//   const [loadingSecondary, setLoadingSecondary] = useState(false);
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [showPremiumOnly, setShowPremiumOnly] = useState(false);

//   // 환율 정보 가져오기
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('/api/exchangeRate');
//         const data = await response.json();
//         if (data && data.success) {
//           setExchangeRate(data.rate);
//         } else {
//           console.error('Failed to fetch exchange rate:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching exchange rate:', err);
//       }
//     };

//     fetchExchangeRate();
//     const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
//     return () => clearInterval(interval);
//   }, []);

//   // 코인 가격 데이터 처리 함수
//   const processCoinData = (coinsToProcess, upbitData, binanceData) => {
//     return coinsToProcess.map(coin => {
//       const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
//       const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

//       const binancePrice = parseFloat(binanceItem?.price || 0);
//       const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
//       const upbitPrice = upbitItem?.trade_price || 0;

//       const priceDifference = upbitPrice - binanceKrwPrice;
//       const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);

//       return {
//         symbol: coin.symbol,
//         korName: coin.korName,
//         binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
//         binanceKrwPrice: binanceKrwPrice.toLocaleString(),
//         upbitPrice: upbitPrice.toLocaleString(),
//         upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
//         change: upbitItem?.change === 'FALL' ? 
//           (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
//           (upbitItem.change_rate * 100).toFixed(2),
//         volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
//         premium,
//         priceDifference: priceDifference.toLocaleString(),
//       };
//     });
//   };

//   // 코인 데이터 가져오기 함수
//   const fetchCoinData = async (coinList) => {
//     if (!exchangeRate) return [];
    
//     try {
//       const [upbitResponse, binanceResponse] = await Promise.all([
//         fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
//         fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
//       ]);

//       const [upbitData, binanceData] = await Promise.all([
//         upbitResponse.json(),
//         binanceResponse.json(),
//       ]);

//       return processCoinData(coinList, upbitData, binanceData);
//     } catch (error) {
//       console.error(`Error fetching coin data:`, error);
//       return [];
//     }
//   };

//   // 주요 코인 데이터 가져오기
//   useEffect(() => {
//     const fetchPrimaryCoins = async () => {
//       if (!exchangeRate) return;
      
//       setLoadingPrimary(true);
//       try {
//         const primaryData = await fetchCoinData(MAIN_COINS);
//         setPrices(primaryData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error fetching primary coins:', err);
//       } finally {
//         setLoadingPrimary(false);
        
//         // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
//         setLoadingSecondary(true);
//         try {
//           const secondaryData = await fetchCoinData(SECONDARY_COINS);
//           setPrices(prev => [...prev, ...secondaryData]);
//           setLastUpdate(new Date().toLocaleTimeString());
//         } catch (err) {
//           console.error('Error fetching secondary coins:', err);
//         } finally {
//           setLoadingSecondary(false);
//         }
//       }
//     };

//     fetchPrimaryCoins();
    
//     // 5초마다 모든 코인 데이터 업데이트
//     const interval = setInterval(async () => {
//       if (!exchangeRate) return;
      
//       try {
//         const allData = await fetchCoinData(ALL_COINS);
//         setPrices(allData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error updating coin data:', err);
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [exchangeRate]);

//   // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
//   useEffect(() => {
//     const loadCachedData = () => {
//       const cachedData = localStorage.getItem('kimp_coin_data');
//       if (cachedData) {
//         try {
//           const { data, timestamp } = JSON.parse(cachedData);
//           // 5분 이내의 캐시 데이터만 사용
//           if (Date.now() - timestamp < 5 * 60 * 1000) {
//             setPrices(data);
//           }
//         } catch (err) {
//           console.error('Error parsing cached data:', err);
//         }
//       }
//     };
    
//     loadCachedData();
//   }, []);

//   // 데이터를 캐시에 저장
//   useEffect(() => {
//     if (prices.length > 0) {
//       try {
//         localStorage.setItem('kimp_coin_data', JSON.stringify({
//           data: prices,
//           timestamp: Date.now()
//         }));
//       } catch (err) {
//         console.error('Error saving data to cache:', err);
//       }
//     }
//   }, [prices]);

//   return (
//     <>
//       <SEO />
//       <main className="min-h-screen p-4 bg-gray-50">
//         {loadingPrimary ? (
//           <div className="flex justify-center items-center h-screen">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
//               <p className="mt-4 text-lg text-gray-600 font-medium">코인 데이터를 불러오는 중입니다...</p>
//             </div>
//           </div>
//         ) : isMobile ? (
//           <MobileView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//             showPremiumOnly={showPremiumOnly}
//             setShowPremiumOnly={setShowPremiumOnly}
//           />
//         ) : (
//           <PCView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//             showPremiumOnly={showPremiumOnly}
//             setShowPremiumOnly={setShowPremiumOnly}
//           />
//         )}
//       </main>
//     </>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Chat from './components/Chat';

// // 커스텀 훅: 미디어 쿼리
// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   useEffect(() => {
//     const updateTarget = () => {
//       setTargetReached(window.innerWidth < width);
//     };

//     updateTarget();
//     window.addEventListener('resize', updateTarget);
//     return () => window.removeEventListener('resize', updateTarget);
//   }, [width]);

//   return targetReached;
// };

// // 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
// const MAIN_COINS = [
//   { symbol: 'BTC', korName: '비트코인' },
//   { symbol: 'ETH', korName: '이더리움' },
//   { symbol: 'SOL', korName: '솔라나' },
//   { symbol: 'XRP', korName: '리플' },
// ];

// const SECONDARY_COINS = [
//   { symbol: 'DOGE', korName: '도지코인' },
//   { symbol: 'BCH', korName: '비트코인캐시' },
//   { symbol: 'LINK', korName: '체인링크' },
//   { symbol: 'DOT', korName: '폴카닷' },
//   { symbol: 'ADA', korName: '에이다' },
//   { symbol: 'TRX', korName: '트론' },
//   { symbol: 'XLM', korName: '스텔라루멘' },
// ];

// // 모든 코인 데이터
// const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

// // SEO 컴포넌트
// const SEO = () => (
//   <Head>
//     <title>김치프리미엄 실시간 확인 - KimpCoin</title>
//     <meta
//       name="description"
//       content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
//     />
//     <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
//     <meta name="author" content="KimpCoin Team" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </Head>
// );

// // 헤더 컴포넌트
// const Header = ({ exchangeRate, lastUpdate }) => (
//   <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-lg text-white">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center">
//         <img
//           src="/images/kimchi-icon.png"
//           alt="김치프리미엄 아이콘"
//           className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//         />
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">실시간 김치프리미엄</h1>
//           <p className="text-blue-100 mt-1">한국과 글로벌 암호화폐 시장의 가격 차이를 실시간으로 확인하세요</p>
//         </div>
//       </div>
//       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
//         <div className="text-sm font-medium">현재 환율</div>
//         <div className="text-2xl font-bold">{exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '불러오는 중...'}</div>
//         <div className="text-xs opacity-80 mt-1">마지막 업데이트: {lastUpdate || '로딩 중'}</div>
//       </div>
//     </div>
//   </div>
// );

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-6">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
//     <span className="ml-3 text-blue-600 font-medium">데이터를 불러오는 중...</span>
//   </div>
// );

// // 코인 테이블 Row 컴포넌트
// const CoinRow = ({ coin, priceData, isMobile }) => {
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
//   const isPremiumPositive = parseFloat(priceData.premium || 0) > 0;
  
//   // JSDelivr CDN의 cryptocurrency-icons 패키지 사용
//   const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`;
  
//   return (
//     <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
//       <td className={`${paddingClass}`}>
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
//             <img 
//               src={iconUrl} 
//               alt={coin.symbol}
//               className="h-6 w-6"
//               onError={(e) => {
//                 // 이미지 로드 실패 시 코인 심볼 텍스트로 대체
//                 e.target.onerror = null;
//                 e.target.style.display = 'none';
//                 e.target.parentNode.innerHTML = `<span class="font-bold text-sm text-gray-700">${coin.symbol}</span>`;
//               }}
//             />
//           </div>
//           <div className="ml-3">
//             <div className="font-medium text-gray-900">{coin.symbol}</div>
//             <div className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{coin.korName}</div>
//           </div>
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.binancePrice ? `$${priceData.binancePrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '불러오는 중...'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//           parseFloat(priceData.change || 0) >= 0 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'}`}>
//           {priceData.change 
//             ? parseFloat(priceData.change) >= 0 
//               ? `+${priceData.change}%` 
//               : `${priceData.change}%` 
//             : 'N/A'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-medium text-gray-900">{priceData.volume ? `${priceData.volume}억` : 'N/A'}</div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`font-medium text-lg ${isPremiumPositive ? 'text-blue-600' : 'text-purple-600'}`}>
//           {priceData.premium ? `${priceData.premium}%` : 'N/A'}
//         </div>
//         <div className={`${isMobile ? "text-xs" : "text-sm"} ${isPremiumPositive ? 'text-blue-500' : 'text-purple-500'}`}>
//           {priceData.priceDifference ? `₩${priceData.priceDifference}` : 'N/A'}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // 코인 테이블 헤더 컴포넌트
// const TableHeader = ({ isMobile }) => {
//   const textSizeClass = isMobile ? "text-xs" : "text-sm";
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
  
//   return (
//     <thead className="bg-gray-50">
//       <tr>
//         <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg`}>코인</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Binance($)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Upbit(₩)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>등락(%)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>거래량(억)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg`}>김치프리미엄</th>
//       </tr>
//     </thead>
//   );
// };

// // 코인 테이블 컴포넌트
// const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
//   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <TableHeader isMobile={isMobile} />
//         <tbody className="bg-white divide-y divide-gray-100">
//           {coins.map((coin) => {
//             const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
//             return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//     {loadingSecondary && <LoadingSpinner />}
//   </div>
// );

// // 통계 요약 컴포넌트
// const StatsSummary = ({ prices }) => {
//   // 평균 김치프리미엄 계산
//   const avgPremium = prices.length > 0 
//     ? (prices.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / prices.length).toFixed(2)
//     : 'N/A';
  
//   // 최대 김치프리미엄 코인 찾기
//   const maxPremiumCoin = prices.length > 0
//     ? prices.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, prices[0])
//     : null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//         <div className="text-sm font-medium text-gray-500">평균 김치프리미엄</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{avgPremium}%</div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//         <div className="text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">
//           {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : 'N/A'}
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
//         <div className="text-sm font-medium text-gray-500">추적 중인 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
//       </div>
//     </div>
//   );
// };

// // PC 뷰 컴포넌트
// const PCView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
//   return (
//     <div className="max-w-[1920px] mx-auto flex space-x-6">
//       <div className="flex-1">
//         <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
        
//         <div className="mt-6">
//           <StatsSummary prices={prices} />
          
//           <CoinTable 
//             prices={prices} 
//             coins={ALL_COINS} 
//             isMobile={false}
//             loadingSecondary={loadingSecondary}
//           />
//         </div>
//       </div>
//       <div className="w-[400px]">
//         <div className="sticky top-4 mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 모바일 뷰 컴포넌트
// const MobileView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
//   return (
//     <div className="max-w-7xl mx-auto">
//       <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
//       <div className="mt-4">
//         <StatsSummary prices={prices} />
        
//         <CoinTable 
//           prices={prices} 
//           coins={ALL_COINS} 
//           isMobile={true}
//           loadingSecondary={loadingSecondary}
//         />
        
//         <div className="mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 메인 컴포넌트
// export default function Home() {
//   const isMobile = useMediaQuery(768);
//   const [prices, setPrices] = useState([]);
//   const [loadingPrimary, setLoadingPrimary] = useState(true);
//   const [loadingSecondary, setLoadingSecondary] = useState(false);
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   // 환율 정보 가져오기
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('/api/exchangeRate');
//         const data = await response.json();
//         if (data && data.success) {
//           setExchangeRate(data.rate);
//         } else {
//           console.error('Failed to fetch exchange rate:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching exchange rate:', err);
//       }
//     };

//     fetchExchangeRate();
//     const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
//     return () => clearInterval(interval);
//   }, []);

//   // 코인 가격 데이터 처리 함수
//   const processCoinData = (coinsToProcess, upbitData, binanceData) => {
//     return coinsToProcess.map(coin => {
//       const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
//       const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

//       const binancePrice = parseFloat(binanceItem?.price || 0);
//       const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
//       const upbitPrice = upbitItem?.trade_price || 0;

//       const priceDifference = upbitPrice - binanceKrwPrice;
//       const premium = ((priceDifference / binanceKrwPrice) * 100).toFixed(2);

//       return {
//         symbol: coin.symbol,
//         korName: coin.korName,
//         binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
//         binanceKrwPrice: binanceKrwPrice.toLocaleString(),
//         upbitPrice: upbitPrice.toLocaleString(),
//         upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
//         change: upbitItem?.change === 'FALL' ? 
//           (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
//           (upbitItem.change_rate * 100).toFixed(2),
//         volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
//         premium,
//         priceDifference: priceDifference.toLocaleString(),
//       };
//     });
//   };

//   // 코인 데이터 가져오기 함수
//   const fetchCoinData = async (coinList) => {
//     if (!exchangeRate) return [];
    
//     try {
//       const [upbitResponse, binanceResponse] = await Promise.all([
//         fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
//         fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
//       ]);

//       const [upbitData, binanceData] = await Promise.all([
//         upbitResponse.json(),
//         binanceResponse.json(),
//       ]);

//       return processCoinData(coinList, upbitData, binanceData);
//     } catch (error) {
//       console.error(`Error fetching coin data:`, error);
//       return [];
//     }
//   };

//   // 주요 코인 데이터 가져오기
//   useEffect(() => {
//     const fetchPrimaryCoins = async () => {
//       if (!exchangeRate) return;
      
//       setLoadingPrimary(true);
//       try {
//         const primaryData = await fetchCoinData(MAIN_COINS);
//         setPrices(primaryData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error fetching primary coins:', err);
//       } finally {
//         setLoadingPrimary(false);
        
//         // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
//         setLoadingSecondary(true);
//         try {
//           const secondaryData = await fetchCoinData(SECONDARY_COINS);
//           setPrices(prev => [...prev, ...secondaryData]);
//           setLastUpdate(new Date().toLocaleTimeString());
//         } catch (err) {
//           console.error('Error fetching secondary coins:', err);
//         } finally {
//           setLoadingSecondary(false);
//         }
//       }
//     };

//     fetchPrimaryCoins();
    
//     // 5초마다 모든 코인 데이터 업데이트
//     const interval = setInterval(async () => {
//       if (!exchangeRate) return;
      
//       try {
//         const allData = await fetchCoinData(ALL_COINS);
//         setPrices(allData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error updating coin data:', err);
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [exchangeRate]);

//   // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
//   useEffect(() => {
//     const loadCachedData = () => {
//       const cachedData = localStorage.getItem('kimp_coin_data');
//       if (cachedData) {
//         try {
//           const { data, timestamp } = JSON.parse(cachedData);
//           // 5분 이내의 캐시 데이터만 사용
//           if (Date.now() - timestamp < 5 * 60 * 1000) {
//             setPrices(data);
//           }
//         } catch (err) {
//           console.error('Error parsing cached data:', err);
//         }
//       }
//     };
    
//     loadCachedData();
//   }, []);

//   // 데이터를 캐시에 저장
//   useEffect(() => {
//     if (prices.length > 0) {
//       try {
//         localStorage.setItem('kimp_coin_data', JSON.stringify({
//           data: prices,
//           timestamp: Date.now()
//         }));
//       } catch (err) {
//         console.error('Error saving data to cache:', err);
//       }
//     }
//   }, [prices]);

//   return (
//     <>
//       <SEO />
//       <main className="min-h-screen p-4 bg-gray-50">
//         {loadingPrimary ? (
//           <div className="flex justify-center items-center h-screen">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
//               <p className="mt-4 text-lg text-gray-600 font-medium">코인 데이터를 불러오는 중입니다...</p>
//             </div>
//           </div>
//         ) : isMobile ? (
//           <MobileView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//           />
//         ) : (
//           <PCView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//           />
//         )}
//       </main>
//     </>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Chat from './components/Chat';

// // 커스텀 훅: 미디어 쿼리
// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   useEffect(() => {
//     const updateTarget = () => {
//       setTargetReached(window.innerWidth < width);
//     };

//     updateTarget();
//     window.addEventListener('resize', updateTarget);
//     return () => window.removeEventListener('resize', updateTarget);
//   }, [width]);

//   return targetReached;
// };

// // 코인 데이터 분류 - 주요 코인과 부가 코인으로 분리
// const MAIN_COINS = [
//   { symbol: 'BTC', korName: '비트코인' },
//   { symbol: 'ETH', korName: '이더리움' },
//   { symbol: 'SOL', korName: '솔라나' },
//   { symbol: 'XRP', korName: '리플' },
// ];

// const SECONDARY_COINS = [
//   { symbol: 'DOGE', korName: '도지코인' },
//   { symbol: 'BCH', korName: '비트코인캐시' },
//   { symbol: 'LINK', korName: '체인링크' },
//   { symbol: 'DOT', korName: '폴카닷' },
//   { symbol: 'ADA', korName: '에이다' },
//   { symbol: 'TRX', korName: '트론' },
//   { symbol: 'XLM', korName: '스텔라루멘' },
// ];

// // 모든 코인 데이터
// const ALL_COINS = [...MAIN_COINS, ...SECONDARY_COINS];

// // SEO 컴포넌트
// const SEO = () => (
//   <Head>
//     <title>김치프리미엄 실시간 확인 - KimpCoin</title>
//     <meta
//       name="description"
//       content="실시간으로 김치프리미엄 데이터를 확인하세요! 암호화폐 가격 차이 정보를 한눈에 볼 수 있습니다."
//     />
//     <meta name="keywords" content="김치프리미엄, 암호화폐 가격 비교, 비트코인, 이더리움, 암호화폐, 실시간 김치프리미엄, 차익거래" />
//     <meta name="author" content="KimpCoin Team" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   </Head>
// );

// // 헤더 컴포넌트
// const Header = ({ exchangeRate, lastUpdate }) => (
//   <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-lg text-white">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center">
//         <img
//           src="/images/kimchi-icon.png"
//           alt="김치프리미엄 아이콘"
//           className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//         />
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">실시간 김치프리미엄</h1>
//           <p className="text-blue-100 mt-1">한국과 글로벌 암호화폐 시장의 가격 차이를 실시간으로 확인하세요</p>
//         </div>
//       </div>
//       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
//         <div className="text-sm font-medium">현재 환율</div>
//         <div className="text-2xl font-bold">{exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '-'}</div>
//         <div className="text-xs opacity-80 mt-1">마지막 업데이트: {lastUpdate || '-'}</div>
//       </div>
//     </div>
//   </div>
// );

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-6">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
//     <span className="ml-3 text-blue-600 font-medium">데이터를 불러오는 중...</span>
//   </div>
// );

// // 코인 테이블 Row 컴포넌트
// const CoinRow = ({ coin, priceData, isMobile }) => {
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
//   const isPremiumPositive = parseFloat(priceData.premium || 0) > 0;
  
//   // JSDelivr CDN의 cryptocurrency-icons 패키지 사용
//   const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`;
  
//   return (
//     <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
//       <td className={`${paddingClass}`}>
//         <div className="flex items-center">
//           <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
//             <img 
//               src={iconUrl} 
//               alt={coin.symbol}
//               className="h-6 w-6"
//               onError={(e) => {
//                 // 이미지 로드 실패 시 코인 심볼 텍스트로 대체
//                 e.target.onerror = null;
//                 e.target.style.display = 'none';
//                 e.target.parentNode.innerHTML = `<span class="font-bold text-sm text-gray-700">${coin.symbol}</span>`;
//               }}
//             />
//           </div>
//           <div className="ml-3">
//             <div className="font-medium text-gray-900">{coin.symbol}</div>
//             <div className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{coin.korName}</div>
//           </div>
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.binancePrice ? `$${priceData.binancePrice}` : '-'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-mono font-medium">
//           {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '-'}
//         </div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         {priceData.change ? (
//           <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//             parseFloat(priceData.change) >= 0 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'}`}>
//             {parseFloat(priceData.change) >= 0 ? `+${priceData.change}%` : `${priceData.change}%`}
//           </div>
//         ) : (
//           <span className="text-gray-400">-</span>
//         )}
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className="font-medium text-gray-900">{priceData.volume ? `${priceData.volume}억` : '-'}</div>
//       </td>
//       <td className={`${paddingClass} text-right`}>
//         <div className={`font-medium text-lg ${isPremiumPositive ? 'text-blue-600' : 'text-purple-600'}`}>
//           {priceData.premium ? `${priceData.premium}%` : '-'}
//         </div>
//         <div className={`${isMobile ? "text-xs" : "text-sm"} ${isPremiumPositive ? 'text-blue-500' : 'text-purple-500'}`}>
//           {priceData.priceDifference ? `₩${priceData.priceDifference}` : '-'}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // 코인 테이블 헤더 컴포넌트
// const TableHeader = ({ isMobile }) => {
//   const textSizeClass = isMobile ? "text-xs" : "text-sm";
//   const paddingClass = isMobile ? "px-2 py-3" : "px-6 py-4";
  
//   return (
//     <thead className="bg-gray-50">
//       <tr>
//         <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg`}>코인</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Binance($)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Upbit(₩)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>등락(%)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>거래량(억)</th>
//         <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg`}>김치프리미엄</th>
//       </tr>
//     </thead>
//   );
// };

// // 코인 테이블 컴포넌트
// const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
//   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <TableHeader isMobile={isMobile} />
//         <tbody className="bg-white divide-y divide-gray-100">
//           {coins.map((coin) => {
//             const priceData = prices.find((price) => price.symbol === coin.symbol) || {};
//             return <CoinRow key={coin.symbol} coin={coin} priceData={priceData} isMobile={isMobile} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//     {loadingSecondary && <LoadingSpinner />}
//   </div>
// );

// // 통계 요약 컴포넌트
// const StatsSummary = ({ prices }) => {
//   // 평균 김치프리미엄 계산
//   const avgPremium = prices.length > 0 
//     ? (prices.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / prices.length).toFixed(2)
//     : '-';
  
//   // 최대 김치프리미엄 코인 찾기
//   const maxPremiumCoin = prices.length > 0
//     ? prices.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, prices[0])
//     : null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//         <div className="text-sm font-medium text-gray-500">평균 김치프리미엄</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{avgPremium}%</div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//         <div className="text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">
//           {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : '-'}
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
//         <div className="text-sm font-medium text-gray-500">추적 중인 코인</div>
//         <div className="mt-1 text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
//       </div>
//     </div>
//   );
// };

// // PC 뷰 컴포넌트
// const PCView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
//   return (
//     <div className="max-w-[1920px] mx-auto flex space-x-6">
//       <div className="flex-1">
//         <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
        
//         <div className="mt-6">
//           <StatsSummary prices={prices} />
          
//           <CoinTable 
//             prices={prices} 
//             coins={ALL_COINS} 
//             isMobile={false}
//             loadingSecondary={loadingSecondary}
//           />
//         </div>
//       </div>
//       <div className="w-[400px]">
//         <div className="sticky top-4 mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 모바일 뷰 컴포넌트
// const MobileView = ({ prices, exchangeRate, loadingSecondary, lastUpdate }) => {
//   return (
//     <div className="max-w-7xl mx-auto">
//       <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
//       <div className="mt-4">
//         <StatsSummary prices={prices} />
        
//         <CoinTable 
//           prices={prices} 
//           coins={ALL_COINS} 
//           isMobile={true}
//           loadingSecondary={loadingSecondary}
//         />
        
//         <div className="mt-6">
//           <Chat />
//         </div>
//       </div>
//     </div>
//   );
// };

// // 메인 컴포넌트
// export default function Home() {
//   const isMobile = useMediaQuery(768);
//   const [prices, setPrices] = useState([]);
//   const [loadingPrimary, setLoadingPrimary] = useState(true);
//   const [loadingSecondary, setLoadingSecondary] = useState(false);
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [priceMap, setPriceMap] = useState({});  // 코인별 가격 데이터 맵

//   // 환율 정보 가져오기
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('/api/exchangeRate');
//         const data = await response.json();
//         if (data && data.success) {
//           setExchangeRate(data.rate);
//         } else {
//           console.error('Failed to fetch exchange rate:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching exchange rate:', err);
//       }
//     };

//     fetchExchangeRate();
//     const interval = setInterval(fetchExchangeRate, 8 * 60 * 60 * 1000); // 8시간마다 갱신
//     return () => clearInterval(interval);
//   }, []);

//   // 코인 가격 데이터 처리 및 병합 함수
//   const processCoinData = (coinsToProcess, upbitData, binanceData) => {
//     const newPrices = coinsToProcess.map(coin => {
//       const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
//       const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

//       const binancePrice = parseFloat(binanceItem?.price || 0);
//       const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
//       const upbitPrice = upbitItem?.trade_price || 0;

//       const priceDifference = upbitPrice - binanceKrwPrice;
//       const premium = binanceKrwPrice > 0 ? ((priceDifference / binanceKrwPrice) * 100).toFixed(2) : '0';

//       return {
//         symbol: coin.symbol,
//         korName: coin.korName,
//         binancePrice: binancePrice.toFixed(binancePrice < 1 ? 4 : 2),
//         binanceKrwPrice: binanceKrwPrice.toLocaleString(),
//         upbitPrice: upbitPrice.toLocaleString(),
//         upbitPriceUsd: (upbitPrice / exchangeRate).toFixed(2),
//         change: upbitItem?.change === 'FALL' ? 
//           (-1 * (upbitItem.change_rate * 100)).toFixed(2) : 
//           (upbitItem.change_rate * 100).toFixed(2),
//         volume: Math.floor((upbitItem?.acc_trade_price_24h || 0) / 100000000),
//         premium,
//         priceDifference: priceDifference.toLocaleString(),
//       };
//     });

//     // 새 데이터를 기존 priceMap과 병합
//     const updatedPriceMap = { ...priceMap };
    
//     newPrices.forEach(price => {
//       updatedPriceMap[price.symbol] = price;
//     });
    
//     setPriceMap(updatedPriceMap);
    
//     // priceMap을 배열로 변환하여 prices 상태 업데이트
//     return Object.values(updatedPriceMap);
//   };

//   // 코인 데이터 가져오기 함수
//   const fetchCoinData = async (coinList) => {
//     if (!exchangeRate) return [];
    
//     try {
//       const [upbitResponse, binanceResponse] = await Promise.all([
//         fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
//         fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
//       ]);

//       const [upbitData, binanceData] = await Promise.all([
//         upbitResponse.json(),
//         binanceResponse.json(),
//       ]);

//       return processCoinData(coinList, upbitData, binanceData);
//     } catch (error) {
//       console.error(`Error fetching coin data:`, error);
//       return Object.values(priceMap); // 에러 발생 시 기존 데이터 유지
//     }
//   };

//   // 주요 코인 데이터 가져오기
//   useEffect(() => {
//     const fetchPrimaryCoins = async () => {
//       if (!exchangeRate) return;
      
//       setLoadingPrimary(true);
//       try {
//         const primaryData = await fetchCoinData(MAIN_COINS);
//         setPrices(primaryData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error fetching primary coins:', err);
//       } finally {
//         setLoadingPrimary(false);
        
//         // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
//         setLoadingSecondary(true);
//         try {
//           const secondaryData = await fetchCoinData(SECONDARY_COINS);
//           setPrices(secondaryData);
//           setLastUpdate(new Date().toLocaleTimeString());
//         } catch (err) {
//           console.error('Error fetching secondary coins:', err);
//         } finally {
//           setLoadingSecondary(false);
//         }
//       }
//     };

//     fetchPrimaryCoins();
    
//     // 5초마다 모든 코인 데이터 업데이트
//     const interval = setInterval(async () => {
//       if (!exchangeRate) return;
      
//       try {
//         const allData = await fetchCoinData(ALL_COINS);
//         setPrices(allData);
//         setLastUpdate(new Date().toLocaleTimeString());
//       } catch (err) {
//         console.error('Error updating coin data:', err);
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [exchangeRate]);

//   // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
//   useEffect(() => {
//     const loadCachedData = () => {
//       const cachedData = localStorage.getItem('kimp_coin_data');
//       if (cachedData) {
//         try {
//           const { data, timestamp } = JSON.parse(cachedData);
//           // 5분 이내의 캐시 데이터만 사용
//           if (Date.now() - timestamp < 5 * 60 * 1000) {
//             // 캐시된 데이터를 priceMap으로 변환
//             const cachedPriceMap = {};
//             data.forEach(item => {
//               cachedPriceMap[item.symbol] = item;
//             });
//             setPriceMap(cachedPriceMap);
//             setPrices(data);
//           }
//         } catch (err) {
//           console.error('Error parsing cached data:', err);
//         }
//       }
//     };
    
//     loadCachedData();
//   }, []);

//   // 데이터를 캐시에 저장
//   useEffect(() => {
//     if (prices.length > 0) {
//       try {
//         localStorage.setItem('kimp_coin_data', JSON.stringify({
//           data: prices,
//           timestamp: Date.now()
//         }));
//       } catch (err) {
//         console.error('Error saving data to cache:', err);
//       }
//     }
//   }, [prices]);

//   return (
//     <>
//       <SEO />
//       <main className="min-h-screen p-4 bg-gray-50">
//         {loadingPrimary ? (
//           <div className="flex justify-center items-center h-screen">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
//               <p className="mt-4 text-lg text-gray-600 font-medium">코인 데이터를 불러오는 중입니다...</p>
//             </div>
//           </div>
//         ) : isMobile ? (
//           <MobileView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//           />
//         ) : (
//           <PCView
//             prices={prices}
//             exchangeRate={exchangeRate}
//             loadingSecondary={loadingSecondary}
//             lastUpdate={lastUpdate}
//           />
//         )}
//       </main>
//     </>
//   );
// }

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

// 상단 헤더 스타일을 더 세밀하게 조정하는 CSS 클래스 - 환율 부분도 크기 조정
const mobileHeaderStyles = `
  @media (max-width: 640px) {
    .header-title {
      font-size: 1.25rem !important;
    }
    .header-subtitle {
      font-size: 0.75rem !important; 
      line-height: 1rem !important;
    }
    .rate-value {
      font-size: 1.125rem !important;
    }
    .rate-label {
      font-size: 0.7rem !important;
    }
    .update-time {
      font-size: 0.65rem !important;
    }
  }

  @media (max-width: 480px) {
    .header-title {
      font-size: 1.125rem !important;
    }
    .header-subtitle {
      font-size: 0.7rem !important;
    }
    .rate-value {
      font-size: 1rem !important;
    }
    .exchange-rate-card {
      padding: 0.5rem 0.75rem !important;
    }
  }

  @media (max-width: 375px) {
    .rate-value {
      font-size: 0.875rem !important;
    }
    .rate-label {
      font-size: 0.65rem !important;
    }
    .update-time {
      font-size: 0.6rem !important;
    }
  }
`;

// 헤더 컴포넌트 - 환율 표시 부분 수정
const Header = ({ exchangeRate, lastUpdate }) => {
  return (
    <>
      <style jsx>{mobileHeaderStyles}</style>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-6 rounded-lg shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/images/kimchi-icon.png"
              alt="김치프리미엄 아이콘"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-2 sm:ml-3 md:ml-4">
              <h1 className="header-title text-xl sm:text-2xl md:text-3xl font-bold">실시간 김치프리미엄</h1>
              <p className="header-subtitle text-xs sm:text-sm text-blue-100 mt-1">
                한국과 글로벌 암호화폐 시장의 가격 차이를 실시간으로 확인하세요
              </p>
            </div>
          </div>
          <div className="exchange-rate-card bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 text-white">
            <div className="rate-label text-xs sm:text-sm font-medium">현재 환율</div>
            <div className="rate-value text-sm sm:text-lg md:text-2xl font-bold whitespace-nowrap">
              {exchangeRate ? `${exchangeRate.toFixed(2)}원/USD` : '-'}
            </div>
            <div className="update-time text-xs opacity-80 mt-1">
              마지막 업데이트: {lastUpdate || '-'}
            </div>
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
  const paddingClass = isMobile ? "px-2 py-2 sm:py-3" : "px-4 sm:px-6 py-4";
  const isPremiumPositive = parseFloat(priceData.premium || 0) > 0;
  
  // JSDelivr CDN의 cryptocurrency-icons 패키지 사용
  const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`;
  
  return (
    <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
      <td className={`${paddingClass}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={iconUrl} 
              alt={coin.symbol}
              className="h-5 w-5 sm:h-6 sm:w-6"
              onError={(e) => {
                // 이미지 로드 실패 시 코인 심볼 텍스트로 대체
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span class="font-bold text-xs sm:text-sm text-gray-700">${coin.symbol}</span>`;
              }}
            />
          </div>
          <div className="ml-2 sm:ml-3">
            <div className="font-medium text-sm sm:text-base text-gray-900">{coin.symbol}</div>
            <div className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{coin.korName}</div>
          </div>
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-mono font-medium text-sm sm:text-base">
          {priceData.binancePrice ? `$${priceData.binancePrice}` : '-'}
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className="font-mono font-medium text-sm sm:text-base">
          {priceData.upbitPrice ? `₩${priceData.upbitPrice}` : '-'}
        </div>
      </td>
      <td className={`${paddingClass} text-right`}>
        {priceData.change ? (
          <div className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
        <div className="font-medium text-sm sm:text-base text-gray-900">{priceData.volume ? `${priceData.volume}억` : '-'}</div>
      </td>
      <td className={`${paddingClass} text-right`}>
        <div className={`font-medium text-base sm:text-lg ${isPremiumPositive ? 'text-blue-600' : 'text-purple-600'}`}>
          {priceData.premium ? `${priceData.premium}%` : '-'}
        </div>
        <div className={`${isMobile ? "text-xs" : "text-sm"} ${isPremiumPositive ? 'text-blue-500' : 'text-purple-500'}`}>
          {priceData.priceDifference ? `₩${priceData.priceDifference}` : '-'}
        </div>
      </td>
    </tr>
  );
};

// 코인 테이블 헤더 컴포넌트
const TableHeader = ({ isMobile }) => {
  const textSizeClass = isMobile ? "text-xs" : "text-sm";
  const paddingClass = isMobile ? "px-2 py-2 sm:py-3" : "px-4 sm:px-6 py-4";
  
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className={`${paddingClass} text-left ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tl-lg`}>코인</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Binance($)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>Upbit(₩)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>등락(%)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider`}>거래량(억)</th>
        <th className={`${paddingClass} text-right ${textSizeClass} font-semibold text-gray-600 tracking-wider rounded-tr-lg`}>김치프리미엄</th>
      </tr>
    </thead>
  );
};

// 코인 테이블 컴포넌트
const CoinTable = ({ prices, coins, isMobile, loadingSecondary }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
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
  // 평균 김치프리미엄 계산
  const avgPremium = prices.length > 0 
    ? (prices.reduce((sum, coin) => sum + parseFloat(coin.premium || 0), 0) / prices.length).toFixed(2)
    : '-';
  
  // 최대 김치프리미엄 코인 찾기
  const maxPremiumCoin = prices.length > 0
    ? prices.reduce((max, coin) => parseFloat(coin.premium || 0) > parseFloat(max.premium || 0) ? coin : max, prices[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-blue-500">
        <div className="text-xs sm:text-sm font-medium text-gray-500">평균 김치프리미엄</div>
        <div className="mt-1 text-xl md:text-2xl font-bold text-gray-900">{avgPremium}%</div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-green-500">
        <div className="text-xs sm:text-sm font-medium text-gray-500">최대 프리미엄 코인</div>
        <div className="mt-1 text-xl md:text-2xl font-bold text-gray-900">
          {maxPremiumCoin ? `${maxPremiumCoin.symbol} (${maxPremiumCoin.premium}%)` : '-'}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-purple-500 sm:col-span-2 md:col-span-1">
        <div className="text-xs sm:text-sm font-medium text-gray-500">추적 중인 코인</div>
        <div className="mt-1 text-xl md:text-2xl font-bold text-gray-900">{ALL_COINS.length}개</div>
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
    <div className="max-w-7xl mx-auto">
      <Header exchangeRate={exchangeRate} lastUpdate={lastUpdate} />
      
      <div className="mt-4">
        <StatsSummary prices={prices} />
        
        <CoinTable 
          prices={prices} 
          coins={ALL_COINS} 
          isMobile={true}
          loadingSecondary={loadingSecondary}
        />
        
        <div className="mt-6">
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

  // 코인 가격 데이터 처리 및 병합 함수
  const processCoinData = (coinsToProcess, upbitData, binanceData) => {
    const newPrices = coinsToProcess.map(coin => {
      const upbitItem = upbitData.find(item => item.market === `KRW-${coin.symbol}`);
      const binanceItem = binanceData.find(item => item.symbol === `${coin.symbol}USDT`);

      const binancePrice = parseFloat(binanceItem?.price || 0);
      const binanceKrwPrice = Math.floor(binancePrice * exchangeRate);
      const upbitPrice = upbitItem?.trade_price || 0;

      const priceDifference = upbitPrice - binanceKrwPrice;
      const premium = binanceKrwPrice > 0 ? ((priceDifference / binanceKrwPrice) * 100).toFixed(2) : '0';

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

    // 새 데이터를 기존 priceMap과 병합
    const updatedPriceMap = { ...priceMap };
    
    newPrices.forEach(price => {
      updatedPriceMap[price.symbol] = price;
    });
    
    setPriceMap(updatedPriceMap);
    
    // priceMap을 배열로 변환하여 prices 상태 업데이트
    return Object.values(updatedPriceMap);
  };

  // 코인 데이터 가져오기 함수
  const fetchCoinData = async (coinList) => {
    if (!exchangeRate) return [];
    
    try {
      const [upbitResponse, binanceResponse] = await Promise.all([
        fetch(`https://api.upbit.com/v1/ticker?markets=${coinList.map(coin => `KRW-${coin.symbol}`).join(',')}`),
        fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coinList.map(coin => `${coin.symbol}USDT`))}`),
      ]);

      const [upbitData, binanceData] = await Promise.all([
        upbitResponse.json(),
        binanceResponse.json(),
      ]);

      return processCoinData(coinList, upbitData, binanceData);
    } catch (error) {
      console.error(`Error fetching coin data:`, error);
      return Object.values(priceMap); // 에러 발생 시 기존 데이터 유지
    }
  };

  // 주요 코인 데이터 가져오기
  useEffect(() => {
    const fetchPrimaryCoins = async () => {
      if (!exchangeRate) return;
      
      setLoadingPrimary(true);
      try {
        const primaryData = await fetchCoinData(MAIN_COINS);
        setPrices(primaryData);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error fetching primary coins:', err);
      } finally {
        setLoadingPrimary(false);
        
        // 주요 코인 로딩 후 바로 보조 코인 로딩 시작
        setLoadingSecondary(true);
        try {
          const secondaryData = await fetchCoinData(SECONDARY_COINS);
          setPrices(secondaryData);
          setLastUpdate(new Date().toLocaleTimeString());
        } catch (err) {
          console.error('Error fetching secondary coins:', err);
        } finally {
          setLoadingSecondary(false);
        }
      }
    };

    fetchPrimaryCoins();
    
    // 5초마다 모든 코인 데이터 업데이트
    const interval = setInterval(async () => {
      if (!exchangeRate) return;
      
      try {
        const allData = await fetchCoinData(ALL_COINS);
        setPrices(allData);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error updating coin data:', err);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [exchangeRate]);

  // 캐시에서 이전 데이터 로드 (페이지 초기 로드 성능 향상)
  useEffect(() => {
    const loadCachedData = () => {
      const cachedData = localStorage.getItem('kimp_coin_data');
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          // 5분 이내의 캐시 데이터만 사용
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            // 캐시된 데이터를 priceMap으로 변환
            const cachedPriceMap = {};
            data.forEach(item => {
              cachedPriceMap[item.symbol] = item;
            });
            setPriceMap(cachedPriceMap);
            setPrices(data);
          }
        } catch (err) {
          console.error('Error parsing cached data:', err);
        }
      }
    };
    
    loadCachedData();
  }, []);

  // 데이터를 캐시에 저장
  useEffect(() => {
    if (prices.length > 0) {
      try {
        localStorage.setItem('kimp_coin_data', JSON.stringify({
          data: prices,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error('Error saving data to cache:', err);
      }
    }
  }, [prices]);

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