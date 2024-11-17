// pages/api/exchangeRate.js

import axios from 'axios';

let cachedExchangeRate = null;
let lastFetchedTime = null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date().getTime();

  if (cachedExchangeRate && lastFetchedTime && now - lastFetchedTime < oneDay) {
    return res.status(200).json({ success: true, rate: cachedExchangeRate });
  }

  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      params: {
        access_key: 'f571b168bbd4609bec4370132229ad22', // 여기에 실제 API 키를 사용하세요.
        symbols: 'KRW,USD',
      },
    });

    const exchangeRate = response.data.rates.KRW;

    cachedExchangeRate = exchangeRate;
    lastFetchedTime = now;

    res.status(200).json({ success: true, rate: exchangeRate });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch exchange rate' });
  }
}
