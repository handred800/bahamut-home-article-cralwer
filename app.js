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
  const url = 'http://home.gamer.com.tw/creationCategory.php?owner=handred800&c=279252';

  const articles = await articleCrawler.getArtcles(url);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  return res.json({
    success: true,
    data: articles
  })
})

app.listen(port);  