function getWeather() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block'; 

  const apiKey = '7e80f2e51fc88e030249e4575b13245e';
  const city = document.getElementById('city-input').value;
  document.getElementById('weather-container').classList.add('active');

  if (!city) {
    alert('Please enter a city');
    loader.style.display = 'none'; 
    return;
  }
  localStorage.setItem('lastCity', city);

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      loader.style.display = 'none'; 
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching weather data.');
      loader.style.display = 'none';
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching hourly forecast data. Please try again.');
    });
}

      
    

function displayWeather(data) {
  const tempDivInfo = document.getElementById('temp-div');
  const weatherInfoDiv = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');
  const hourlyForecastDiv = document.getElementById('hourly-forecast');

  weatherInfoDiv.innerHTML = '';
  hourlyForecastDiv.innerHTML = '';
  tempDivInfo.innerHTML = '';

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  hourlyForecastDiv.innerHTML = '';

  const now = Date.now();
  const futureData = hourlyData.filter(item => item.dt * 1000 > now);
  const next24Hours = futureData.slice(0, 8);

  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.style.display = 'block';
}

document.getElementById('get-weather-btn').addEventListener('click', getWeather);
document.getElementById('city-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
});
window.addEventListener('load', () => {
const savedCity = localStorage.getItem('lastCity');
  if (savedCity) {
    document.getElementById('city-input').value = savedCity;
  }
});
const themeToggleBtn = document.getElementById('toggle-theme');

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
  }
});


themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
});
