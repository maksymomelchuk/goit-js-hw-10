import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const getEl = selector => document.querySelector(selector);

const input = getEl('#search-box');
const list = getEl('.country-list');
const info = getEl('.country-info');

input.addEventListener(
  'input',
  debounce(event => {
    const formatted = event.target.value.trim();
    if (formatted) {
      fetchCountries(formatted)
        .then(response => filterCountries(response))
        .then(response => createMarkup(response))
        .catch(err => console.log(err));
    } else {
      Notiflix.Notify.warning('Enter country name');
      list.innerHTML = '';
    }
  }, DEBOUNCE_DELAY)
);

function createMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    list.innerHTML = '';
  } else if (countries.length > 1 && countries.length <= 10) {
    const markup = countries.map(country => {
      return `<li class="list-item"><img class="img" src="${country.flag}" alt=""><p>${country.name}</p></li>`;
    });
    list.innerHTML = markup.join('');
  } else if (countries.length === 1) {
    const markup = countries.map(country => {
      const { capital, population, name, languages, flag } = country;
      return `<li class="list-item-column">
                <div class="country">
                  <img class="img" src="${flag}" alt="" />
                  <p class="title">${name}</p>
                </div>
                <div class="country-info">
                  <p class="subtitle">Capital: <span class="subtitle-text">${capital}</span></p>
                  <p class="subtitle">Population: <span class="subtitle-text">${population}</span></p>
                  <p class="subtitle">Languages: <span class="subtitle-text">${Object.values(
                    languages
                  )}</span></p>
                </div>
              </li>`;
    });
    list.innerHTML = markup.join('');
  }
}

function filterCountries(name) {
  return name.map(item => {
    const {
      capital,
      population,
      name: { official: name },
      languages,
      flags: { svg: flag },
    } = item;
    const countryName = {
      name,
      capital,
      population,
      languages,
      flag,
    };
    return countryName;
  });
}

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      throw new Error(response.status);
    }
    return response.json();
  });
}
