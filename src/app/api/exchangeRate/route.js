import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1');
    const data = await response.json();
    
    // 환율 값 추출 (콤마 제거)
    const rate = parseFloat(data.country[1].value.replace(/,/g, ''));

    if (isNaN(rate)) {
      throw new Error('환율 값을 파싱할 수 없습니다.');
    }

    return NextResponse.json({
      success: true,
      rate: rate
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({
      success: false,
      error: '환율 정보를 가져오는데 실패했습니다.'
    });
  }
} 