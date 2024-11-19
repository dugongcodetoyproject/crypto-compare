// src/app/api/exchange-rate/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const EXCHANGE_RATE_FILE = path.join(process.cwd(), 'data', 'exchange-rate.json');
const UPDATE_TIMES = [
    { hour: 9, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 19, minute: 45 }
];

async function saveExchangeRate(rate) {
    try {
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
        await fs.writeFile(EXCHANGE_RATE_FILE, JSON.stringify({
            rate,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error saving exchange rate:', error);
    }
}

async function readExchangeRate() {
    try {
        const data = await fs.readFile(EXCHANGE_RATE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

function needsUpdate(lastUpdate) {
    if (!lastUpdate) return true;
    const now = new Date();
    const updateTime = new Date(lastUpdate);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return UPDATE_TIMES.some(time => {
        const updateDateTime = new Date(now);
        updateDateTime.setHours(time.hour, time.minute, 0, 0);
        return updateDateTime > updateTime && 
               (currentHour > time.hour || 
               (currentHour === time.hour && currentMinute >= time.minute));
    });
}

export async function GET() {
    try {
        const savedData = await readExchangeRate();
        
        if (!needsUpdate(savedData?.timestamp)) {
            return NextResponse.json({ exchangeRate: savedData.rate });
        }

        const response = await axios.get('http://data.fixer.io/api/latest', {
            params: {
                access_key: 'f571b168bbd4609bec4370132229ad22',
                symbols: 'USD,KRW'
            }
        });

        if (response.data.success) {
            const rates = response.data.rates;
            const usdToKrw = Math.floor(rates.KRW / rates.USD);
            
            await saveExchangeRate(usdToKrw);
            
            return NextResponse.json({ exchangeRate: usdToKrw });
        } else {
            if (savedData) {
                return NextResponse.json({ exchangeRate: savedData.rate });
            }
            throw new Error('Failed to fetch exchange rate');
        }
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        return NextResponse.json(
            { error: 'Exchange rate fetch failed', message: error.message }, 
            { status: 500 }
        );
    }
}