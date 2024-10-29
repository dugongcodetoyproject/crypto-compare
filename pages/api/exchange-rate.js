import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // 오늘 날짜 형식 만들기 (YYYYMMDD)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const searchDate = `${year}${month}${day}`;

    const authKey = 'DRRdUKo3a5ehnfR9tCOheGnxX6oKBQe7';
    const response = await fetch(
      `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authKey}&searchdate=${searchDate}&data=AP01`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (Array.isArray(data)) {
      const usdRate = data.find(item => item.cur_unit === 'USD');
      if (usdRate) {
        const rate = parseFloat(usdRate.deal_bas_r.replace(',', ''));
        res.status(200).json({
          rate: rate,
          timestamp: new Date().getTime()
        });
        return;
      }
    }
    
    throw new Error('Exchange rate not found');
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    // 에러 발생시 기본 환율 사용
    res.status(200).json({
      rate: 1,386
      timestamp: new Date().getTime(),
      isDefaultRate: true
    });
  }
}