// Import libraries
import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
// Import function
import { fetchCountries } from './func.js';
// Standart debounce delay
const DEBOUNCE_DELAY = 300;
// Query selectors
const getEl = selector => document.querySelector(selector);
const input = getEl('#search-box');
const list = getEl('.country-list');
const info = getEl('.country-info');
// Event listener with debounce. Fetch from API, handling promises
input.addEventListener(
  'input',
  debounce(event => {
    const formatted = event.target.value.trim();
    if (formatted) {
      fetchCountries(formatted, clearFields)
        .then(response => filterCountries(response))
        .then(response => createMarkup(response))
        .catch(err => console.log(err));
    } else {
      Notiflix.Notify.warning('Enter country name');
      clearFields();
    }
  }, DEBOUNCE_DELAY)
);

// Func to clear fields
function clearFields() {
  list.innerHTML = '';
  info.innerHTML = '';
}
// Func to create markup
function createMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    clearFields();
  } else if (countries.length <= 10) {
    list.innerHTML = someCountries(countries).join('');
    if (countries.length === 1) {
      info.innerHTML = oneCountry(countries);
    } else {
      info.innerHTML = '';
    }
  }
}
// Func to create markup for more than one country
function someCountries(countries) {
  return countries.map(country => {
    return `<li class="list-item"><img class="img" src="${country.flag}" alt=""><p class="title">${country.name}</p></li>`;
  });
}
// Func to create markup for one country
function oneCountry(countries) {
  return countries.map(country => {
    const { capital, population, languages } = country;
    return `<p class="subtitle">Capital: <span class="subtitle-text">${capital}</span></p>
              <p class="subtitle">Population: <span class="subtitle-text">${population}</span></p>
              <p class="subtitle">Languages: <span class="subtitle-text">${Object.values(
                languages
              )}</span></p>
                `;
  });
}
// Func to filter countries info
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
