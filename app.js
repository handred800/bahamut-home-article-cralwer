const express = require("express");
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const { getArtcles } = require('./newCrawler.js');
const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000,
  max: 1, 
})

app.use(limiter)

app.get("/", async (req, res) => {
  // 使用者ID
  const userId = req.query.owner;

  const articles = await getArtcles(userId);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');

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