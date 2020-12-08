const request = require('request');
const cheerio = require('cheerio');

// 取得所有文章
async function getArtcles(homeUrl, param) {
  const $ = await waitPageRequest(homeUrl);
  // 取得總頁數
  const pageNum = parseInt($('.BH-pagebtnA a:last-child').text());

  // 遍歷 page
  let articleRequests = [];
  for (let i = 1; i <= pageNum; i++) {
    const pageUrl = `http://home.gamer.com.tw/creationCategory.php?owner=handred800&c=279252&page=${i}`;
    articleRequests.push(getPageArticles(pageUrl));
  }

  let articles = [];
  // 等待所有請求，一次執行
  await Promise.all(articleRequests)
    .then((res) => {
      articles = [].concat(...res);
    })
  return articles;
}

// 取得頁面中所有的 article，並返回資訊
async function getPageArticles(pageUrl) {
  let articlesInPage = [];
  const $ = await waitPageRequest(pageUrl);
  // 抓文章標題和 href
  $('.TS1').each((i, el) => {
    articlesInPage.push({
      title: $(el).text(),
      url: `https://home.gamer.com.tw/${$(el).attr('href')}`
    });
  });

  // 抓封面圖
  $('.BC5 img').each((i, el) => {
    articlesInPage[i]['image'] = $(el).attr('src');
  })

  // 抓 meta
  // 日期, 贊助, 人氣
  $('.HOME-mainbox1 .ST1').each((i, el) => {
    const meta = $(el).text().split('│').slice(-3);
    articlesInPage[i]['meta'] = {
      date: meta[0],
      sponsor: parseInt(meta[1].split('：')[1]),
      view: parseInt(meta[2].split('：')[1])
    };
  })
  // GP
  $('.HOME-mainbox1 .ST3').each((i, el) => {
    articlesInPage[i]['meta']['gp'] = parseInt($(el).text().split(' ')[0])
  })
  
  return articlesInPage;
}

// 等待 request 回來
function waitPageRequest(url) {
  return new Promise((resolve) => {
    request(url, (err, res, body) => {
      const $ = cheerio.load(body);
      resolve($);
    })
  })
}

module.exports = { getArtcles };