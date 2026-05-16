const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');

async function testScrape() {
    try {
        console.log("Fetching Pune Police NCRB...");
        const res1 = await axios.get('http://punepolice.co.in/ncrb.php', { timeout: 10000 });
        fs.writeFileSync('police_raw.html', res1.data);
        console.log("Success! Saved police_raw.html");
    } catch (e) {
        console.log("Failed to fetch Pune Police:", e.message);
    }

    try {
        console.log("Fetching Pune Civic BI...");
        const res2 = await axios.get('http://bi.punecorporation.org/', { timeout: 10000 });
        fs.writeFileSync('civic_raw.html', res2.data);
        console.log("Success! Saved civic_raw.html");
    } catch (e) {
        console.log("Failed to fetch Pune Civic:", e.message);
    }
}

testScrape();
