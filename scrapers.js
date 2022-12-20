const scraperForOld = async (browser, url) => {
  const page = await browser.newPage()
  await page.goto(url);
  await page.$('.BH-lbox');

  return page.evaluate(() => {
    const articlesInPage = [];
    // 抓文章標題和 href
    document.querySelectorAll('.TS1').forEach(($el) => {
      const href = $el.getAttribute('href');
      const id = href.match(/(\d+)/)[0];
      articlesInPage.push({
        id,
        title: $el.textContent,
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
      const meta = $el.textContent.split('│').slice(-3);
      articlesInPage[i]['meta'] = {
        date: meta[0].split(' ')[0],
        coin: parseInt(meta[1].split('：')[1].replace(',', '')),
        view: parseInt(meta[2].split('：')[1].replace(',', ''))
      };
    })
    // // GP
    document.querySelectorAll('.HOME-mainbox1 .ST3').forEach(($el, i) => {
      articlesInPage[i]['meta']['gp'] = parseInt($el.textContent.split(' ')[0])
    })

    return articlesInPage;
  })
}

const scraperForNew = async (browser, url) => {
  const page = await browser.newPage()
  await page.goto(url);
  await page.$('#creation-list');

  return page.evaluate(() => {
    let articlesData = [];
    document.querySelectorAll('.platform-info').forEach(($el) => {
      const $title = $el.querySelector('.info-title > a');
      const $gpText = $el.querySelector('.float-right');
      const meta = $el.querySelector('.caption-text').textContent.replaceAll(' ', '').replaceAll('\n', '').split('｜');

      articlesData.push({
        id: $title.getAttribute('href').match(/(\d+)/)[0],
        title: $title.textContent.trim().replaceAll(' ', ''),
        url: $title.getAttribute('href'),
        meta: {
          date: meta[1],
          coin: Number(meta[2].split('：')[1].replace(',', '')),
          view: Number(meta[3].split('：')[1].replace(',', '')),
          gp: Number($gpText.textContent.match(/(\d+)/)[0]),
        }
      })
    })
    return articlesData;
  })
}

module.exports = { scraperForNew, scraperForOld };