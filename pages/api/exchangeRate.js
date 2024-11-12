import axios from 'axios';
import cheerio from 'cheerio';

const fetchExchangeRates = async (req, res) => {
  try {
    const response = await axios.get('https://spot.wooribank.com/pot/Dream?withyou=FXXRT0021', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const exchangeRates = {};
    $('div.exchange-typea ul tbody tr').each((index, element) => {
      const currency = $(element).find('td').eq(0).text().trim();
      const rate = $(element).find('td').eq(1).text().trim();
      exchangeRates[currency] = rate;
    });

    res.status(200).json(exchangeRates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};

export default fetchExchangeRates;
