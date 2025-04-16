import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const coins = [
      'BTC', 'SOL', 'DOGE', 'ETH', 'BCH', 
      'XRP', 'LINK', 'DOT', 'ADA', 'TRX', 'XLM'
    ];

    const [upbitResponse, binanceResponse] = await Promise.all([
      fetch(`https://api.upbit.com/v1/ticker?markets=${coins.map(coin => `KRW-${coin}`).join(',')}`, {
        headers: {
          'Accept': 'application/json',
        },
      }),
      fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coins.map(coin => `${coin}USDT`))}`, {
        headers: {
          'Accept': 'application/json',
        },
      })
    ]);

    if (!upbitResponse.ok || !binanceResponse.ok) {
      throw new Error('Failed to fetch prices');
    }

    const [upbitData, binanceData] = await Promise.all([
      upbitResponse.json(),
      binanceResponse.json()
    ]);

    return NextResponse.json({
      success: true,
      upbit: upbitData,
      binance: binanceData
    });
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 