const request = require('request');
const cheerio = require('cheerio');

// 取得所有文章
async function getArtcles(homeUrl, param) {
  const $ = await waitPageRequest(homeUrl);
  // 取得總頁數
  const pageNum = $('.BH-pagebtnA a').length;

  // 遍歷 page
  let articleRequests = [];
  for (let i = 1; i <= pageNum; i++) {
    const pageUrl = `http://home.gamer.com.tw/creationCategory.php?page=${i}&owner=handred800&v=2&c=279252`;
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
  // 抓頁面中的連結，返回文字和 href
  $('.HOME-mainbox2a').each((i, el) => {
    articlesInPage.push({
      title: $(el).text(),
      url: `https://home.gamer.com.tw/${$(el).attr('href')}`
    });
  });

  $('.HOME-mainbox2 img').each((i, el) => {
    articlesInPage[i]['image'] = $(el).attr('src');
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