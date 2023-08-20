// import axios, { Axios } from 'axios';
import searchService from './js/search-service';
import CreateMarkup from './js/CreateMarkup';

const refs = {
  form: document.querySelector('form'),
  buttom: document.querySelector('button'),
  gallary: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more-hidden'),
};

let userInput = '';
let pageLimit = 0;
let currentPage = 1;
const photoLimit = 40;

refs.form.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(event) {
  event.preventDefault();

  userInput = event.target.elements[0].value;

  await searchService(userInput, photoLimit, currentPage).then(
    ({ data, data: { totalHits } }) => {
      pageLimit = Math.ceil(totalHits / photoLimit);
      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(data.hits));
    }
  );
  if (currentPage < pageLimit) {
    refs.loadMore.classList.replace('load-more-hidden', 'load-more');
  }
}

refs.loadMore.addEventListener('click', onLoadMoreClick);

function onLoadMoreClick() {
  currentPage += 1;
  searchService(userInput, photoLimit, currentPage).then(
    ({ data: { hits } }) => {
      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(hits));
    }
  );

  if (currentPage >= pageLimit) {
    refs.loadMore.classList.replace('load-more', 'load-more-hidden');
  }
}
