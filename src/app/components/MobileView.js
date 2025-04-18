import React from 'react';

const MobileView = ({ prices, loading, lastUpdate, exchangeRate, coins }) => {
  return (
    <div className="container mx-auto px-2">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-1 p-2 border-b border-gray-200 text-[10px]">
          <div className="col-span-1 font-medium text-gray-500">코인</div>
          <div className="col-span-1 text-right font-medium text-gray-500">BINANCE($)</div>
          <div className="col-span-1 text-right font-medium text-gray-500">UPBIT(₩)</div>
          <div className="col-span-1 text-right font-medium text-gray-500">등락(%)</div>
          <div className="col-span-1 text-right font-medium text-gray-500">거래량(억)</div>
          <div className="col-span-1 text-right font-medium text-gray-500">김치프리미엄</div>
        </div>
        <div className="divide-y divide-gray-200">
          {prices.map((coin) => (
            <div key={coin.symbol} className="grid grid-cols-6 gap-1 p-2 hover:bg-gray-50 text-[10px]">
              <div className="col-span-1">
                <div className="font-medium text-gray-900">{coin.symbol}</div>
                <div className="text-gray-500 truncate">{coin.korName}</div>
              </div>
              <div className="col-span-1 text-right">
                <div className="text-gray-900">${coin.binancePrice}</div>
              </div>
              <div className="col-span-1 text-right">
                <div className="text-gray-900">₩{coin.upbitPrice}</div>
              </div>
              <div className={`col-span-1 text-right ${parseFloat(coin.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.change}%
              </div>
              <div className="col-span-1 text-right text-gray-900">
                {coin.volume}
              </div>
              <div className="col-span-1 text-right">
                <div className="text-red-600">{coin.premium}%</div>
                <div className="text-[8px] text-red-500">₩{coin.priceDifference}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileView; 