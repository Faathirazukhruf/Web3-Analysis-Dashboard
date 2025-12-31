const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    try {
        const response = await axios.get('https://airdrops.io/latest/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const airdrops = [];

        $('article').each((i, el) => {
            if (i > 10) return;
            const name = $(el).find('h3').text().trim();
            const url = $(el).find('a').attr('href');
            const img = $(el).find('img').attr('src');
            const desc = $(el).find('.front-drop-list .est-value span').text().trim() || 'No description';

            if (name) airdrops.push({ name, url, img, desc });
        });

        console.log('Scraped Airdrops Length:', airdrops.length);
        console.log('Sample Airdrop:', JSON.stringify(airdrops[0], null, 2));

    } catch (error) {
        console.error('Scrape Failed:', error.message);
    }
}

testScrape();
