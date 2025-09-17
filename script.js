function showLoaderMin2s(promise) {
  const loader = document.getElementById('loader');
  loader.classList.add('active');
  const minTime = new Promise(resolve => setTimeout(resolve, 2000));
  return Promise.all([promise, minTime]).then(([result]) => {
    loader.classList.remove('active');
    return result;
  }).catch((err) => {
    loader.classList.remove('active');
    throw err;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  loader.classList.add('active');
  setTimeout(() => {
    loader.classList.remove('active');
  }, 2000);
});
function getWeather() {
  document.getElementById('error-message') && (document.getElementById('error-message').textContent = '');
  document.getElementById('weather-container').classList.remove('active');
  document.getElementById('weather-icon').style.display = 'none'; 
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('active');
    document.getElementById('weather-icon').style.display = 'none';

    const apiKey = '7e80f2e51fc88e030249e4575b13245e';
    const city = document.getElementById('city-input').value;

    if (!city) {
      document.getElementById('error-message') && (document.getElementById('error-message').textContent = 'Please enter a city');
      loader.classList.remove('active');
      return;
    }
    localStorage.setItem('lastCity', city);

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    showLoaderMin2s(
      Promise.all([
        fetch(currentWeatherUrl).then(r => r.json()),
        fetch(forecastUrl).then(r => r.json())
      ])
    )
    
    .then(([weatherData, forecastData]) => {
  if (!weatherData || weatherData.cod !== 200) {
  const errorMessage = weatherData?.message || 'Invalid city name. Please try again.';
  alert(errorMessage); 
  document.getElementById('error-message').textContent = errorMessage;
  document.getElementById('loader').classList.remove('active');
  throw new Error(errorMessage); 
}

  displayWeather(weatherData);
  displayHourlyForecast(forecastData.list);

  setTimeout(() => {
    document.getElementById('weather-container').classList.add('active');
  }, 100);
})

    .catch(error => {
      document.getElementById('error-message') && (document.getElementById('error-message').textContent = 'Error fetching weather data.');
    });
  }, 600); 
  
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
    weatherIcon.style.display = 'none';
    loadParticlesForWeather('clear');
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    const mainWeather = data.weather[0].main.toLowerCase();
    loadParticlesForWeather(mainWeather);

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';

    showImage();
  }
}
function loadParticlesForWeather(weather) {
  let config;
  if (window.pJSDom && window.pJSDom.length) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }

  if (weather.includes('rain')) {
    config = {
      particles: {
        number: { value: 80 },
        shape: {
          type: "image",
          image: {
            src: "rain.png", 
            width: 2,
            height: 16
          }
        },
        opacity: { value: 0.7 },
        size: { value: 16, random: false },
        move: { enable: true, speed: 25, direction: "bottom", straight: true }
      }
    };
  } else if (weather.includes('snow')) {
    config = {
      particles: {
        number: { value: 100 },
        color: { value: "#fff" },
        shape: { type: "circle" },
        opacity: { value: 0.7, random: true },
        size: { value: 4, random: true },
        move: { enable: true, speed: 2, direction: "bottom", straight: false }
      }
    };
  } else if (weather.includes('cloud')) {
    config = {
      particles: {
        number: { value: 30 },
        color: { value: "#b0b0b0" },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 60, random: true },
        move: { enable: true, speed: 1, direction: "right", straight: false }
      }
    };
  } else {
    config = {
      particles: {
        number: { value: 0 }
      }
    };
  }
  particlesJS('particles-js', config);
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

