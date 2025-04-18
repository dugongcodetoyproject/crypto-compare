import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 네이버 API 호출 시 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

    const response = await fetch('https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1', {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`네이버 API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 데이터 구조 검증
    if (!data || !data.country || !Array.isArray(data.country) || data.country.length < 2) {
      throw new Error('잘못된 API 응답 형식');
    }

    const krwValue = data.country[1].value;
    if (!krwValue) {
      throw new Error('환율 값이 없습니다');
    }

    // 환율 값 추출 (콤마 제거)
    const rate = parseFloat(krwValue.replace(/,/g, ''));

    if (isNaN(rate) || rate <= 0) {
      throw new Error('유효하지 않은 환율 값');
    }

    return NextResponse.json({
      success: true,
      rate: rate,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('환율 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '환율 정보를 가져오는데 실패했습니다.'
    }, { status: 500 });
  }
} 