import React from 'react';

const PCView = ({ prices, loading, lastUpdate, exchangeRate, coins }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-[15%] text-sm font-medium text-gray-500">코인</div>
          <div className="w-[15%] text-right text-sm font-medium text-gray-500">BINANCE($)</div>
          <div className="w-[20%] text-right text-sm font-medium text-gray-500">UPBIT(₩)</div>
          <div className="w-[15%] text-right text-sm font-medium text-gray-500">등락(%)</div>
          <div className="w-[15%] text-right text-sm font-medium text-gray-500">거래량(억)</div>
          <div className="w-[20%] text-right text-sm font-medium text-gray-500">김치프리미엄</div>
        </div>
        <div className="divide-y divide-gray-200">
          {prices.map((coin) => (
            <div key={coin.symbol} className="flex items-center p-4 hover:bg-gray-50">
              <div className="w-[15%]">
                <div className="font-medium text-gray-900">{coin.symbol}</div>
                <div className="text-sm text-gray-500">{coin.korName}</div>
              </div>
              <div className="w-[15%] text-right">
                <div className="text-gray-900">${coin.binancePrice}</div>
              </div>
              <div className="w-[20%] text-right">
                <div className="text-gray-900">₩{coin.upbitPrice}</div>
              </div>
              <div className={`w-[15%] text-right ${parseFloat(coin.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.change}%
              </div>
              <div className="w-[15%] text-right text-gray-900">
                {coin.volume}
              </div>
              <div className="w-[20%] text-right">
                <div className="text-blue-500">{coin.premium}%</div>
                <div className="text-sm text-blue-500">₩{coin.priceDifference}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PCView; 