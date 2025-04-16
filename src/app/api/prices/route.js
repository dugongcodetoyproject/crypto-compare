import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const coins = [
      'BTC', 'SOL', 'DOGE', 'ETH', 'BCH', 
      'XRP', 'LINK', 'DOT', 'ADA', 'TRX', 'XLM'
    ];

    // Upbit API 호출
    const upbitMarkets = coins.map(coin => `KRW-${coin}`).join(',');
    const upbitResponse = await fetch(`https://api.upbit.com/v1/ticker?markets=${upbitMarkets}`);

    // Binance API 호출
    const binanceSymbols = JSON.stringify(coins.map(coin => `${coin}USDT`));
    const binanceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${binanceSymbols}`);

    if (!upbitResponse.ok || !binanceResponse.ok) {
      throw new Error('API 요청 실패');
    }

    const [upbitData, binanceData] = await Promise.all([
      upbitResponse.json(),
      binanceResponse.json()
    ]);

    // 응답 데이터 유효성 검사
    if (!Array.isArray(upbitData) || !Array.isArray(binanceData)) {
      throw new Error('잘못된 응답 데이터 형식');
    }

    return NextResponse.json({
      success: true,
      data: {
        upbit: upbitData,
        binance: binanceData,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('가격 데이터 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '가격 데이터를 가져오는데 실패했습니다.' 
      },
      { status: 500 }
    );
  }
} 