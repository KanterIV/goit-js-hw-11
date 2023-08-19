import axios, { Axios } from 'axios';

export default async function searchService(userInput) {
  const API_KEY = '38910037-843ad78f1fab8f9e210e82581';
  const BASE_URL = 'https://pixabay.com/api/';

  axios.defaults.params = {
    key: API_KEY,
    q: userInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };

  const {
    data: { hits },
  } = await axios.get(BASE_URL);
  return hits;
}
