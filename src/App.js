import React, { useEffect, useState } from 'react';
import './App.css';
import HotBG from './Hot.jpg';
import ColdBG from './Cold.jpg';
import WeatherInfo from './Components/WeatherInfo.js';
import { getformattedWeatherData } from './WeatherService.js';

function App() {
  const [city, setCity] = useState('shimla');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(HotBG);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getformattedWeatherData(city, units);
        if (data && data.temp !== undefined) {
          setWeather(data);
          setError(null);
          const threshold = units === 'metric' ? 20 : 60;
          setBg(data.temp <= threshold ? ColdBG : HotBG);
          setSearchHistory([...new Set([...searchHistory, city].slice(0, 5))]);
        } else {
          setError('Invalid City');
        }
      } catch (error) {
        console.error(error);
        setError('Invalid City');
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C';
    setUnits(isCelsius ? 'metric' : 'imperial');
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      const enteredCity = e.currentTarget.value;
      setCity(enteredCity);
      setSearchHistory([...new Set([enteredCity, ...searchHistory].slice(0, 5))]);
      e.currentTarget.blur();
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <button onClick={handleUnitsClick}>°F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={`${weather.iconURL}`} alt="weathericon" />
                <h3>{`${weather.description}`}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? 'C' : 'F'}`}</h1>
              </div>
            </div>
            {/* Bottom Description */}
            <WeatherInfo weather={weather} units={units} />

            {/* Search History Section */}
            <div className="section section__history">
              <h3>Recent Searches:</h3>
              <ul>
                {searchHistory.map((city, index) => (
                  <li key={index} onClick={() => setCity(city)}>
                    {city}
                  </li>
                ))}
              </ul>
              <button onClick={clearHistory}>Clear History</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
