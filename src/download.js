import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

// Получаем путь к текущей директории
const directoryPath = path.join(
  new URL(import.meta.url).pathname,
  '..',
  'public/data'
);

// Если директория не существует, создаём её
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

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

  //const xmlContent = await page.evaluate(() => document.body.innerText);

  // Используем page.content(), чтобы получить исходный контент страницы (включая XML)
  const xmlContent = await page.content();

  // Путь к файлу внутри src
  const filePath = path.join(directoryPath, 'exprates.xml');

  // Записываем XML в файл
  fs.writeFileSync(filePath, xmlContent);

  // Записываем обновлённую метку времени в data.xml
  fs.writeFileSync(
    path.join(directoryPath, 'data.xml'),
    `<updated>${new Date().toISOString()}</updated>`
  );

  console.log('XML скачан успешно!');
  await browser.close();
})();
