//const puppeteer = require('puppeteer');
//const fs = require('fs');

import fs from 'fs';
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('https://vipchanger.com/res/xml/exprates.xml', {
    waitUntil: 'networkidle2',
  });

  const xmlContent = await page.evaluate(() => document.body.innerText);

  fs.writeFileSync('exprates.xml', xmlContent);

  console.log('XML скачан успешно!');
  await browser.close();
})();
