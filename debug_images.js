const axios = require('axios');
const cheerio = require('cheerio');

async function debugImages() {
    try {
        const response = await axios.get('https://airdrops.io/latest/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        $('article').each((i, el) => {
            if (i >= 2) return;
            const img = $(el).find('img');
            if (img.length > 0) {
                console.log(`Airdrop ${i} Attributes:`, img[0].attribs);
            } else {
                console.log(`Airdrop ${i}: No img tag found in article`);
            }
        });

    } catch (error) {
        console.error('Debug Failed:', error.message);
    }
}

debugImages();
