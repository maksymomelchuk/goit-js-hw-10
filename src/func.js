import Notiflix from 'notiflix';
// Func to fetch from API
function fetchCountries(name, callback) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      callback;
      throw new Error(response.status);
    }
    return response.json();
  });
}

export { fetchCountries };
