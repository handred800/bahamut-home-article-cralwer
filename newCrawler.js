const puppeteer = require('puppeteer');

const getArtcles = async (userId) => {

  let homeUrl = `https://home.gamer.com.tw/profile/index_creation.php?owner=${userId}`
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(homeUrl);
  const isOld = await page.$('#BH-master');

  if (isOld) homeUrl = `https://home.gamer.com.tw/creation.php?owner=${userId}`;

  // 獲取上限
  const pageLimit = 100;
  // 取得總頁數
  let pageNum = await page.$eval('.BH-pagebtnA a:last-child', $el => parseInt($el.innerText));

  pageNum = Math.min(pageNum, pageLimit)

  // 遍歷 page
  let articles = [];

  for (let i = 1; i <= pageNum; i++) {
    await page.goto(`${homeUrl}&page=${i}`);
    console.log(`${homeUrl}&page=${i}`);
    let list = [];
    
    if (isOld) {
      console.log('this is Old');
      list = await page.$eval('body', getPageArticlesOld);
    } else {
      console.log('this is New');
      await page.screenshot({path: 'screen.jpg'})
      list = await page.$eval('.platform-info-box', getPageArticles);
    }
    articles = articles.concat(list);
  }

  browser.close();

  return articles;
}

// 取得頁面中所有的 article，並返回資訊
// 舊版
function getPageArticlesOld() {

  const articlesInPage = [];
  // 抓文章標題和 href
  document.querySelectorAll('.TS1').forEach(($el) => {
    const href = $el.getAttribute('href');
    const id = href.match(/(\d+)/)[0];
    articlesInPage.push({
      id,
      title: $el.innerText,
      url: `https://home.gamer.com.tw/${href}`
    });
  })

  // // 抓封面圖
  document.querySelectorAll('.BC5 img').forEach(($el, i) => {
    articlesInPage[i]['image'] = $el.getAttribute('src');
  })

  // // 抓 meta
  // // 日期, 贊助, 人氣
  document.querySelectorAll('.HOME-mainbox1 .ST1').forEach(($el, i) => {
    const meta = $el.innerText.split('│').slice(-3);
    articlesInPage[i]['meta'] = {
      date: meta[0].split(' ')[0],
      coin: parseInt(meta[1].split('：')[1].replace(',', '')),
      view: parseInt(meta[2].split('：')[1].replace(',', ''))
    };
  })
  // // GP
  document.querySelectorAll('.HOME-mainbox1 .ST3').forEach(($el, i) => {
    articlesInPage[i]['meta']['gp'] = parseInt($el.innerText.split(' ')[0])
  })

  return articlesInPage;
}
// 新版
function getPageArticles() {
  const articlesInPage = [];

  console.log(document.querySelectorAll('.info-title a'));
  // // 抓文章標題和 href
  // document.querySelectorAll('.info-title a').forEach(($el) => {
  //   const href = $el.getAttribute('href');
  //   const id = href.match(/(\d+)/)[0];
  //   articlesInPage.push({
  //     id,
  //     title: $el.innerText,
  //     url: `https://home.gamer.com.tw/${href}`
  //   });
  // })

  // document.querySelectorAll('.platform-img a').forEach(($el, i) => {
  //   articlesInPage[i]['image'] = $el.getAttribute('src');
  // })

  // // // 抓 meta
  // // // 日期, 贊助, 人氣
  // document.querySelectorAll('.caption-text:not(.height-limit-2)').forEach(($el, i) => {
  //   const meta = $el.innerText.split('│').slice(-3);
  //   articlesInPage[i]['meta'] = {
  //     date: meta[0].split(' ')[0],
  //     coin: parseInt(meta[1].split('：')[1].replace(',', '')),
  //     view: parseInt(meta[2].split('：')[1].replace(',', ''))
  //   };
  // })
  // // // GP
  // document.querySelectorAll('.gp-text').forEach(($el, i) => {
  //   articlesInPage[i]['meta']['gp'] = parseInt($el.innerText.split(' ')[0])
  // })

  return articlesInPage;
}

module.exports = { getArtcles };