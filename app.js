const express = require('express');
var cors = require('cors');
const rateLimit = require("express-rate-limit");
const fetch = require('node-fetch');
const _ = require('lodash');
const responseGenerator = require('./responseGenerator.js');

const port = process.env.PORT || 3000;
const limiter = rateLimit({
	windowMs: 1000,
	max: 1, // 每 windowMs 最大請求數
})

const app = express();
app.use(cors());
app.use(limiter);

app.get('/', async (req, res) => {
    res.send('請造訪 /page');
    res.end();
})

app.get('/page/', async (req, res) => {

    const respond = responseGenerator(res);
    if (_.isEmpty(req.query)) {
        res.send('query parameter: owner[String], (page[Number])');
        res.end();
        return;
    }

    let { owner, page } = req.query;

    if (!owner) return respond('owner is missing', false);
    if (!page) page = 1;

    const result = await fetch(`https://api.gamer.com.tw/home/v1/creation_list.php?owner=${owner}&page=${page}`);
    const { data } = await result.json();

    return respond(data);
})

app.listen(port);