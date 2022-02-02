"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const country = document.querySelector("input");

// https://restcountries.com/v2/
// API to use needs CORS (Cross Resource Sharing) to be unknown/yes otherwise we connot access a third party API
///////////////////////////////////////

const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.official}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}M people</p>
    <p class="country__row"><span>🗣️</span>${
      Object.values(data.languages)[0]
    }</p>
    <p class="country__row"><span>💰</span>${
      Object.values(data.currencies)[0].name
    }</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  // uncomment when using XMLHttpRequest():
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  // uncomment when using XMLHttpRequest():
  // countriesContainer.style.opacity = 1;
};

// ***** Using XMLHttpRequest() to generate the country and its neighbor country *****
// -----------------------------------------------
/*
const getCountryData = function (country) {
  // AJAX call target country
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  // as long as the data is loaded, the callback function will be called
  request.addEventListener("load", function () {
    // 'this' refers to the request, and 'responseText' is xhr property that returns the text received from the server
    // convert the JSON string into a JS object:

    const data = JSON.parse(this.responseText)[0];
    console.log(data);
    // Render country 1
    renderCountry(data);

    // Get neighbor country (2)
    const neighbor = data.borders[0];

    // if neighbor country doesn't exist, return immediately
    if (!neighbor) return;

    // AJAX call neighbor country
    const request2 = new XMLHttpRequest();
    request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbor}`);
    request2.send();

    request2.addEventListener("load", function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2[0]);
      // Render country 2
      renderCountry(data2[0], "neighbor");
    });
  });
};
*/

// ***** Using fetch() to generate the country and its neighbor country *****
// -----------------------------------------------
const getCountryData = function (country) {
  // Country we're searching for
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => {
      // we need to manually handle errors because by default, the Promise returned by fetch() will only be rejected when there's a loss of Internect connection

      // response.ok is true if data looked up is valid, so we manually throw an error message when the input country name is invalid
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then((data) => {
      renderCountry(data[0]);
      const neighbor = data[0].borders[0];

      if (!neighbor) return;

      // Neighbor country
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
    })
    .then((response) => {
      if (!response.ok)
        throw new Error(`\nNeighbor country not found (${response.status})`);
      // console.log(response.json());
      return response.json();
    })
    .then((data) => renderCountry(data[0], "neighbor"))
    // The catch method at the end of the chain will catch any errors that occur in any place in this whole Promise chain. Errors propagate down the chain until they are caught
    .catch((err) =>
      renderError(`Something went wrong: ${err.message}. Try again!`)
    )
    // .finally will always be called no matter what the Promise status is
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  countriesContainer.innerHTML = "";
  getCountryData(`${country.value}`);
});

// ***** Using fetch() to generate the country and its neighbor country ***** (explanation)
// -----------------------------------------------
/*
const getCountryData = function (country) {
  // fetch() only takes URL as the parameter and it'll return a Promise
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      // When the request completes, the resource is available. At this time, the promise will resolve into a Response object.
      // The Response object is the API wrapper for the fetched resource. The 'body' of the object contains the data we're looking for, but it's not accessible
      console.log(response); // Response object

      // We need to parse the data from the Response object using .json() method.
      // .json() is available on all response objects from the fetch function and it'll return a new Promise which resolves with the result of parsing the body text as JSON to produce a JavaScript object.

      // console.log(response.json());
      return response.json(); // returns a Promise whose resolved value is the data read from the Response object

      // a Promise is a placeholder for a value that hasn't been computed yet, and there's no way to get a Promise's value from the Promise directly - you need to call the then() function to register a callback so that the Promise will resolve into JS object.
    })
    .then(function ([data]) {
      console.log(data); // JS object
      renderCountry(data);
    });
};
*/
