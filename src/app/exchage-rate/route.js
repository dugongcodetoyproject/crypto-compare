// src/app/api/exchange-rate/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

// 환율 업데이트 시간 설정
const UPDATE_TIMES = [
    { hour: 9, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 19, minute: 45 }
];

// 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const EXCHANGE_RATE_FILE = path.join(DATA_DIR, 'exchange-rate.json');

// 환율 저장 함수
async function saveExchangeRate(rate) {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(EXCHANGE_RATE_FILE, JSON.stringify({
            rate,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error saving exchange rate:', error);
    }
}

// 환율 읽기 함수
async function readExchangeRate() {
    try {
        const data = await fs.readFile(EXCHANGE_RATE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

// 업데이트 필요 여부 확인 함수
function needsUpdate(lastUpdate) {
    if (!lastUpdate) return true;

    const now = new Date();
    const updateTime = new Date(lastUpdate);
    
    // 오늘 날짜의 업데이트 시간들을 생성
    const todayUpdateTimes = UPDATE_TIMES.map(time => {
        const dateTime = new Date(now);
        dateTime.setHours(time.hour, time.minute, 0, 0);
        return dateTime;
    });

    // 마지막 업데이트 이후 지난 업데이트 시간이 있는지 확인
    return todayUpdateTimes.some(time => time > updateTime && time <= now);
}

// API 핸들러
export async function GET() {
    try {
        // 저장된 환율 읽기
        const savedData = await readExchangeRate();
        
        // 업데이트가 필요하지 않으면 저장된 환율 반환
        if (savedData && !needsUpdate(savedData.timestamp)) {
            return NextResponse.json({ exchangeRate: savedData.rate });
        }

        // 새로운 환율 정보 가져오기
        const response = await axios.get('http://data.fixer.io/api/latest', {
            params: {
                access_key: 'f571b168bbd4609bec4370132229ad22',
                symbols: 'USD,KRW'
            }
        });

        if (response.data.success) {
            const rates = response.data.rates;
            const usdToKrw = Math.floor(rates.KRW / rates.USD);
            
            // 새 환율 저장
            await saveExchangeRate(usdToKrw);
            
            return NextResponse.json({ exchangeRate: usdToKrw });
        } else {
            // API 호출 실패시 저장된 값 반환
            if (savedData) {
                return NextResponse.json({ exchangeRate: savedData.rate });
            }
            throw new Error('Failed to fetch exchange rate');
        }
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        
        // 에러 발생시 저장된 값이 있으면 반환
        const savedData = await readExchangeRate();
        if (savedData) {
            return NextResponse.json({ exchangeRate: savedData.rate });
        }
        
        // 저장된 값도 없으면 에러 반환
        return NextResponse.json(
            { error: 'Exchange rate fetch failed', message: error.message },
            { status: 500 }
        );
    }
}