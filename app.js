const express = require("express");
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const articleCrawler = require('./articleCrawler.js');
const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000,
  max: 1, 
})

app.use(limiter)

app.get("/", async (req, res) => {
  // creationCategory (查分類文章)
  const collection = req.query.collection || 'creation';
  // 使用者ID
  const userId = req.query.owner || 'handred2100';
  // 分類ID
  const catrgoryId = req.query.c || '279252';

  const url = `http://home.gamer.com.tw/${collection}.php?owner=${userId}&c=${catrgoryId}`;
  const articles = await articleCrawler.getArtcles(url);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  if(articles.length === 0) {
    return res.json({
      success: false,
      data: {message: '查無使用者或是此使用者無創作'}
    })
  } else {
    return res.json({
      success: true,
      data: articles
    })
  }

})

app.listen(port);  