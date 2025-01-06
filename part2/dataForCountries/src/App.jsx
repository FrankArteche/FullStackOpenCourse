import { useState, useEffect } from "react";

import "./App.css";
import axios from "axios";

const api_key = import.meta.env.weatherAPIKey

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });

  }, []);

  useEffect(() => {
    if(countries.length === 1){
      axios
      .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${countries[0].latlng[0]}&lon=${countries[0].latlng[1]}&appid=${api_key}`)
      .then((response) => {
        console.log(response.data);
      });
    }
  }, [countries]);

  const handleSearch = (event) => {
    setSearch(event.target.value);

    let countriesSearched = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    console.log(countriesSearched);

    setCountries(countriesSearched);
  };

  const handleShowCountry = (event) => {
    setCountries([countries.find((country)=> country.name.common === event.target.previousSibling.textContent)]);
  }

  return (
    <>
      <div>
        find countries <input onChange={handleSearch} value={search} />
        {countries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}
        {countries.length <= 10 && countries.length > 1 && (
          <>
            {countries.map((country) => (
              <div key={country.name.common}>
                <p>{country.name.common}</p>
                <button onClick={handleShowCountry}>show</button>
              </div>
            ))}
          </>
        )}
        {countries.length == 1 && (
          <div>
            <h1>{countries[0].name.common}</h1>
            <p>capital: {countries[0].capital[0]}</p>
            <p>area: {countries[0].area}</p>
            <h2>Languages:</h2>
            <ul>
              {Object.values(countries[0].languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={countries[0].flags.png}></img>
            <h2>Weather in {countries[0].capital[0]}</h2>
            <p>temperature:</p>
            <p>wind:</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
