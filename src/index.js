import searchService from './js/search-service';
import CreateMarkup from './js/CreateMarkup';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

const lightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
  showCounter: false,
});

refs.form.addEventListener('submit', onSearchSubmit);

function onSearchSubmit(event) {
  event.preventDefault();
  Loading.dots();
  refs.button.disabled = true;
  refs.gallary.innerHTML = '';
  currentPage = 1;

  userInput = event.target.elements[0].value;

  searchService(userInput, photoLimit, currentPage)
    .then(({ data, data: { totalHits } }) => {
      refs.button.disabled = false;

      const successInfo = `Hooray! We found ${totalHits} images.`;
      if (totalHits > 0) {
        Notify.success(successInfo);
      }

      if (data.hits.length === 0) {
        throw new Error(Notify.info(arrayError));
      }

      pageLimit = Math.ceil(totalHits / photoLimit);

      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(data.hits));
      lightbox.refresh();

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
    })
    .finally(() => Loading.remove());
}

refs.loadMore.addEventListener('click', onLoadMoreClick);

function onLoadMoreClick() {
  Loading.dots();
  refs.loadMore.disabled = true;

  currentPage += 1;

  searchService(userInput, photoLimit, currentPage)
    .then(({ data: { hits } }) => {
      refs.gallary.insertAdjacentHTML('beforeend', CreateMarkup(hits));
      refs.loadMore.disabled = false;

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      lightbox.refresh();
    })
    .catch(function (error) {
      if (error.response) {
        Notify.failure(fechError);
      } else if (error.request) {
        Notify.failure(fechError);
      }
    })
    .finally(() => Loading.remove());

  if (currentPage >= pageLimit) {
    refs.loadMore.classList.replace('load-more', 'load-more-hidden');
    Notify.info(endOfResultsInfo);
  }
}
