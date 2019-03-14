'use strict';

const express = require('express');
const puppeteer = require('puppeteer');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// const counter = 0;
// const blockedCounter = 0;

// App
const app = express();

let scrape = async (path) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.goto(path);

    const result = await page.evaluate(() => {
        const featureArticle = document
            .evaluate(
                '//*[@id="classifiedDetail"]/div[1]/div[1]/h1',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            )
            .singleNodeValue;

        if (featureArticle == null) {
            return 'Blocked!';
        } else {
            return featureArticle.textContent;
        }
    });

    browser.close();
    return result;
};

let scrapeGoogle = async (path) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.goto(path);

    const result = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
        };
    });

    // const result = await page.evaluate(() => {
    //     const featureArticle = document
    //         .evaluate(
    //             '//*[@id="classifiedDetail"]/div[1]/div[1]/h1',
    //             document,
    //             null,
    //             XPathResult.FIRST_ORDERED_NODE_TYPE,
    //             null
    //         )
    //         .singleNodeValue;

    //     if (featureArticle == null) {
    //         return 'Blocked!';
    //     } else {
    //         return featureArticle.textContent;
    //     }
    // });

    browser.close();
    return result;
};

app.get('/getpath', (req, res) => {
    let url = req.query.url;

    scrape(url).then((value) => {
        // if (value == 'Blocked!') {
        //     blockedCounter++;
        // } else {
        //     counter++;
        // }
        console.log('value: ', value);
        // console.log('requestCounter :', counter);
        // console.log('blockedrequestCounter :', blockedCounter);

        // return value;
        res.status(200).json(value);
    });
});

app.get('/getgooglepath', (req, res) => {
    let url = req.query.url;

    scrapeGoogle(url).then((value) => {
        // if (value == 'Blocked!') {
        //     blockedCounter++;
        // } else {
        //     counter++;
        // }
        console.log('value: ', value);
        // console.log('requestCounter :', counter);
        // console.log('blockedrequestCounter :', blockedCounter);

        // return value;
        res.status(200).json(value);
    });
});

app.get('/check', (req, res) => {
    res.status(200).send('It works!');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);