let users = []; // Глобальная переменная

fetch(`${import.meta.env.BASE_URL}data/users.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    users = data;
  })
  .catch(error => console.error(error));

const STORAGE_KEY = 'feedback-form-state';

const refs = {
  form: document.querySelector('.feedback-form'),
  container: document.querySelector('.feedback-message'),
  title: document.querySelector('.sub-title'),
  result: document.querySelector('.text-1'),
  text2: document.querySelector('.text-2'),
  text3: document.querySelector('.text-3'),
};

const formData = {
  email: '',
  message: '',
};

//! Парсим xml обменника

let exchangeRate = null; // Глобальная переменная

fetch(`${import.meta.env.BASE_URL}data/exprates.xml`)
  .then(response => response.text())
  .then(xmlText => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const fromCurrency = 'SBERRUB';
    const toCurrency = 'WIRETHB';

    const exchangeNode = Array.from(xmlDoc.querySelectorAll('item')).find(
      item =>
        item.querySelector('from').textContent === fromCurrency &&
        item.querySelector('to').textContent === toCurrency
    );

    if (exchangeNode) {
      let exchangeRateOut = exchangeNode.querySelector('out').textContent;
      let exchangeRateIn = exchangeNode.querySelector('in').textContent;
      exchangeRate = (exchangeRateOut / exchangeRateIn).toFixed(4);

      console.log(`Курс ${fromCurrency} → ${toCurrency}: ${exchangeRate}`);
    } else {
      console.log('Курс не найден');
    }
  })
  .catch(error => console.error('Ошибка загрузки XML:', error));

// Можно использовать exchangeRate в других частях кода
// setTimeout(() => {
//   console.log('Доступ к курсу через 2 секунды:', exchangeRate);
// }, 200);

//! Сохраняем значения в localStorage

refs.form.addEventListener('input', e => {
  // console.log(e.currentTargettarget);
  const email = e.currentTarget.elements.email.value; // currentTarget - элемент на котором происходит событие
  // const message = e.currentTarget.elements.message.value;
  //console.log(email, message);
  const formData = { email }; // создаем обьект и кладем значение
  //console.log(formData);
  saveToLS(STORAGE_KEY, formData);
});

initPage(); //!  Загружаем данные из localStorage

function initPage() {
  const formData = loadFromLS(STORAGE_KEY);
  refs.form.elements.email.value = formData?.email || ''; // ? - если нет значения и не надо брать
  //refs.form.elements.message.value = formData?.message || '';
}

//! Текущая дата

const today = new Date(); // Текущая дата
const day = String(today.getDate()).padStart(2, '0'); // День с ведущим нулем
const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяц (январь = 0)
const year = today.getFullYear(); // Год

const formattedDate = `${day}.${month}.${year}`; // Форматируем дату
console.log(formattedDate); // Например: 02.02.2024

//!  submit - выводим информацию

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  if (!e.currentTarget.elements.email.value) {
    alert('Заполните поле Email для идентификации Вас');
    return;
  }
  const email = e.currentTarget.elements.email.value.trim().toLowerCase(); // Получаем email и нормализуем
  //const message = e.currentTarget.elements.message.value;

  //localStorage.removeItem(STORAGE_KEY); // очищаем LocalStorage

  const user = users.find(user => user.email.toLowerCase() === email);

  if (user) {
    refs.title.textContent = `${user.username}, ${user.titleCourse}`;
    refs.result.textContent = `Стоимость сессии ${
      user.price
    } Бат, что на сегодня ${formattedDate} по текущему курсу обменника vipChanger 1 руб = ${exchangeRate} Бат составляет: ${Math.floor(
      user.price / exchangeRate
    )} руб.`;
    refs.text3.textContent = `Куратор: ${user.teacher}`;

    if (user.opt !== '') {
      refs.text2.textContent = `Стоимость ${
        user.opt
      }-x занятий составит - ${Math.floor(
        (user.priceOpt / exchangeRate) * user.opt
      )} руб.`;
    } else {
      refs.text2.textContent = ``;
    }
  } else {
    refs.result.textContent = 'Такой электронной почты нет в списке';
  }

  refs.form.reset();
});

//! функция для LocalStorage

function saveToLS(key, value) {
  const jsonData = JSON.stringify(value);
  localStorage.setItem(key, jsonData);
}

function loadFromLS(key) {
  const body = localStorage.getItem(key);
  try {
    const data = JSON.parse(body);
    return data;
  } catch {
    return body;
  }
}
