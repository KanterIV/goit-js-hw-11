import searchService from './js/search-service';
import CreateMarkup from './js/CreateMarkup';
import { Notify } from 'notiflix';

const refs = {
  form: document.querySelector('form'),
  button: document.querySelector('button'),
  gallary: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more-hidden'),
};

let userInput = '';
let pageLimit = 0;
let currentPage = 1;

const photoLimit = 40;
const arrayError =
  'Sorry, there are no images matching your search query. Please try again.';
const fechError = 'Sorry, something went wrong. Try again!';
const endOfResultsInfo =
  "We're sorry, but you've reached the end of search results.";

refs.form.addEventListener('submit', onSearchSubmit);

function onSearchSubmit(event) {
  event.preventDefault();
  refs.button.disabled = true;
  refs.gallary.innerHTML = '';

  userInput = event.target.elements[0].value;

  searchService(userInput, photoLimit, currentPage)
    .then(({ data, data: { totalHits } }) => {
      refs.button.disabled = false;
      const successInfo = `Hooray! We found ${totalHits} images.`;
      Notify.success(successInfo);

      if (data.hits.length === 0) {
        throw new Error(Notify.info(arrayError));
      }

      pageLimit = Math.ceil(totalHits / photoLimit);

      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(data.hits));

      if (currentPage < pageLimit) {
        refs.loadMore.classList.replace('load-more-hidden', 'load-more');
      }
      refs.loadMore.disabled = false;
    })
    .catch(function (error) {
      if (error.response) {
        Notify.failure(fechError);
      } else if (error.request) {
        Notify.failure(fechError);
      } else {
        console.log('Array length is 0', error);
      }
    });
}

refs.loadMore.addEventListener('click', onLoadMoreClick);

function onLoadMoreClick() {
  refs.loadMore.disabled = true;

  currentPage += 1;

  searchService(userInput, photoLimit, currentPage)
    .then(({ data: { hits } }) => {
      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(hits));
      refs.loadMore.disabled = false;
    })
    .catch(function (error) {
      if (error.response) {
        Notify.failure(fechError);
      } else if (error.request) {
        Notify.failure(fechError);
      }
    });

  if (currentPage >= pageLimit) {
    refs.loadMore.classList.replace('load-more', 'load-more-hidden');
    Notify.info(endOfResultsInfo);
  }
}
