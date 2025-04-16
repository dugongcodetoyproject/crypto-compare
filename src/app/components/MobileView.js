import React from 'react';

const MobileView = ({ prices, exchangeRate, coins }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-4">
        {prices.map((coin) => (
          <div key={coin.symbol} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium text-gray-900">{coin.korName}</div>
                <div className="text-sm text-gray-500">{coin.symbol}</div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                parseFloat(coin.premium) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {coin.premium}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">업비트</div>
                <div className="text-sm font-medium">{coin.upbitPrice} 원</div>
                <div className="text-xs text-gray-500">${coin.upbitPriceUsd}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">바이낸스</div>
                <div className="text-sm font-medium">{coin.binanceKrwPrice} 원</div>
                <div className="text-xs text-gray-500">${coin.binancePrice}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              거래량: {coin.volume}억
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileView; 