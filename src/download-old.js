//const puppeteer = require('puppeteer');
//const fs = require('fs');

import fs from 'fs';
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );
  await page.goto('https://vipchanger.com/res/xml/exprates.xml');

  const xmlContent = await page.evaluate(() => document.body.innerText);

  fs.writeFileSync('exprates.xml', xmlContent);
  fs.writeFileSync(
    'data.xml',
    `<updated>${new Date().toISOString()}</updated>`
  );

  console.log('XML скачан успешно!');
  await browser.close();
})();
