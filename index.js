/* empty css                      */(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();let u=[];fetch("/xml-proxy/data/users.json").then(e=>{if(!e.ok)throw new Error(`Ошибка загрузки: ${e.status}`);return e.json()}).then(e=>{u=e}).catch(e=>console.error(e));const m="feedback-form-state",c={form:document.querySelector(".feedback-form"),container:document.querySelector(".feedback-message"),title:document.querySelector(".sub-title"),result:document.querySelector(".text-1"),text2:document.querySelector(".text-2"),text3:document.querySelector(".text-3")};//! Парсим xml обменника
let l=null;fetch("/xml-proxy/data/exprates.xml").then(e=>e.text()).then(e=>{const t=new DOMParser().parseFromString(e,"application/xml"),s="SBERRUB",r="THB",o=Array.from(t.querySelectorAll("item")).find(a=>a.querySelector("from").textContent===s&&a.querySelector("to").textContent===r);o?(l=o.querySelector("out").textContent,console.log(`Курс ${s} → ${r}: ${l}`)):console.log("Курс не найден")}).catch(e=>console.error("Ошибка загрузки XML:",e));//! Сохраняем значения в localStorage
c.form.addEventListener("input",e=>{const t={email:e.currentTarget.elements.email.value};x(m,t)});d();//!  Загружаем данные из localStorage
function d(){const e=h(m);c.form.elements.email.value=(e==null?void 0:e.email)||""}//! Текущая дата
const i=new Date,p=String(i.getDate()).padStart(2,"0"),y=String(i.getMonth()+1).padStart(2,"0"),g=i.getFullYear(),f=`${p}.${y}.${g}`;console.log(f);//!  submit - выводим информацию
c.form.addEventListener("submit",e=>{if(e.preventDefault(),!e.currentTarget.elements.email.value){alert("Заполните поле Email для идентификации Вас");return}const n=e.currentTarget.elements.email.value.trim().toLowerCase(),t=u.find(s=>s.email.toLowerCase()===n);t?(c.title.textContent=`${t.username}, ${t.titleCourse}`,c.result.textContent=`Стоимость сессии ${t.price} Бат, что на сегодня ${f} по текущему курсу vipChanger   1 руб = ${l} Бат составляет: ${Math.floor(t.price/l)} руб.`,c.text3.textContent=`Куратор: ${t.teacher}`,t.opt!==""?c.text2.textContent=`Стоимость ${t.opt}-x занятий составит - ${Math.floor(t.priceOpt*l*t.opt)} руб.`:c.text2.textContent=""):c.result.textContent="Такой электронной почты нет в списке",c.form.reset()});//! функция для LocalStorage
function x(e,n){const t=JSON.stringify(n);localStorage.setItem(e,t)}function h(e){const n=localStorage.getItem(e);try{return JSON.parse(n)}catch{return n}}
//# sourceMappingURL=index.js.map
