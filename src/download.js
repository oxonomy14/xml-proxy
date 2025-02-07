import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

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

  // Указываем директорию src для сохранения файла
  const directoryPath = path.join(__dirname, 'src'); // Путь к директории src

  // Проверка и создание директории src, если её нет
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

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
