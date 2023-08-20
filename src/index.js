// import axios, { Axios } from 'axios';
import searchService from './js/search-service';
import CreateMarkup from './js/CreateMarkup';

const refs = {
  form: document.querySelector('form'),
  buttom: document.querySelector('button'),
  gallary: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(event) {
  event.preventDefault();

  const userInput = event.target.elements[0].value;

  await searchService(userInput).then(data => {
    refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(data));
  });
}
