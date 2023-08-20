import axios, { Axios } from 'axios';

export default async function searchService(
  userInput,
  photoLimit,
  currentPage
) {
  const API_KEY = '38910037-843ad78f1fab8f9e210e82581';
  const BASE_URL = 'https://pixabay.com/api/';

  axios.defaults.params = {
    key: API_KEY,
    q: userInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: photoLimit,
    page: currentPage,
  };

  const data = await axios.get(BASE_URL);
  return data;
}
