const puppeteer = require('puppeteer');
const { scraperForNew, scraperForOld } = require('./scrapers');

const getArtcles = async (userId, limit) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`https://home.gamer.com.tw/profile/index_creation.php?owner=${userId}`);

  const isOld = await page.$('#BH-master');
  let domain = isOld ?
    `https://home.gamer.com.tw/creation.php?owner=${userId}&page=` :
    `https://home.gamer.com.tw/profile/index_creation.php?owner=${userId}&page=`;

  // 獲取上限
  const pageLimit = limit || 15;
  // 取得總頁數
  const pageTotal = await page.$eval('.BH-pagebtnA a:last-child', $el => parseInt($el.innerText));
  const pageNum = Math.min(pageTotal, pageLimit)
  // 目標網址陣列 
  let urls = [...Array(pageNum).keys()].map((i) => `${domain}${i + 1}`);
  const scraper = isOld ? scraperForOld : scraperForNew;
  const tasks = urls.map((url) => scraper(browser, url));
  let datas = await Promise.all(tasks);
  browser.close();

  return datas.flat();
}
module.exports = { getArtcles };