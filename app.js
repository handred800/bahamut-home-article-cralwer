const request = require('request');
const cheerio = require('cheerio');

const url = 'http://home.gamer.com.tw/creationCategory.php?owner=handred800&v=2&c=279252';

request(url, (err, res, body) => {
	const $ = cheerio.load(body);
  // 取得總頁數
  const pageNum = $('.BH-pagebtnA a').length;

  let articleRequests = [];

  for(let i = 1; i <= pageNum; i++){
    const pageUrl = `http://home.gamer.com.tw/creationCategory.php?page=${i}&owner=handred800&v=2&c=279252`;
    // article.push(`http://home.gamer.com.tw/creationCategory.php?page=${i}&owner=handred800&v=2&c=279252`);
     articleRequests.push(getArticles(pageUrl));
  }
  Promise.all(articleRequests)
    .then((res) => {
      console.log(...res);
    })
});

// 遍歷 page 中所有的 article，並返回資訊
async function getArticles(pageUrl) {
  let articlesInPage = [];
  const $ = await waitPageRequest(pageUrl);
  $('.HOME-mainbox2a').each(function(i,el) {
    articlesInPage.push({
      title: $(el).text(),
      url: `https://home.gamer.com.tw/${$(el).attr('href')}`
    });
  });
  // console.log(articlesInPage);
  return articlesInPage;
}

// 等待 request 回來
function waitPageRequest(url) {
  return new Promise(function(resolve) {
    request(url, (err, res, body) => {
      const $ = cheerio.load(body);
      resolve($);
    })
  })
}