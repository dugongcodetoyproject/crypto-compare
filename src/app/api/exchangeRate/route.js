import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();

    return NextResponse.json({
      success: true,
      rate: data.rates.KRW
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({
      success: false,
      error: '환율 정보를 가져오는데 실패했습니다.'
    });
  }
} 