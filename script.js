// Ваш API ключ OpenWeatherMap
const apiKey = 'c421857110df2b1e6445d5eafd267825';

// Получаем элементы DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

const defaultCities = document.querySelectorAll('.default-city');

// Функция для отображения ошибки
function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
}

// Функция для скрытия ошибки
function hideError() {
    error.style.display = 'none';
}

// Функция для отображения загрузки
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    hideError();
}

// Функция для отображения данных о погоде
function showWeather() {
    loading.style.display = 'none';
    weatherInfo.style.display = 'block';
    hideError();
}

// Функция для получения иконки погоды по коду от API
function getWeatherIcon(code) {
    if (code >= 200 && code < 300) {
        return '<i class="fas fa-bolt"></i>'; // Гроза
    } else if (code >= 300 && code < 500) {
        return '<i class="fas fa-cloud-rain"></i>'; // Морось
    } else if (code >= 500 && code < 600) {
        return '<i class="fas fa-rain"></i>'; // Дождь
    } else if (code >= 600 && code < 700) {
        return '<i class="fas fa-snowflake"></i>'; // Снег
    } else if (code >= 700 && code < 800) {
        return '<i class="fas fa-smog"></i>'; // Атмосферные явления
    } else if (code === 800) {
        return '<i class="fas fa-sun"></i>'; // Ясно
    } else if (code > 800) {
        return '<i class="fas fa-cloud"></i>'; // Облачно
    } else {
        return '<i class="fas fa-cloud-sun"></i>'; // По умолчанию
    }
}

// Функция для получения данных о погоде
function getWeather(city) {
    showLoading();
    
    // Используем реальный API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Город не найден. Проверьте правильность написания.');
                } else if (response.status === 401) {
                    throw new Error('Проблема с API ключом.');
                } else {
                    throw new Error('Ошибка соединения с сервером.');
                }
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(err => {
            showError('Ошибка: ' + err.message);
        });
}

// Функция для отображения данных о погоде
function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp) + '°C';
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.innerHTML = getWeatherIcon(data.weather[0].id);
    feelsLike.textContent = Math.round(data.main.feels_like) + '°C';
    humidity.textContent = data.main.humidity + '%';
    windSpeed.textContent = data.wind.speed + ' м/с';
    
    showWeather();
}

// Функция для сохранения последнего города в localStorage
function saveLastCity(city) {
    localStorage.setItem('lastWeatherCity', city);
}

// Функция для загрузки последнего города из localStorage
function loadLastCity() {
    const lastCity = localStorage.getItem('lastWeatherCity');
    if (lastCity) {
        return lastCity;
    }
    return 'Москва'; // Город по умолчанию
}

// Обработчик клика по кнопке поиска
searchBtn.addEventListener('click', function() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        saveLastCity(city);
        cityInput.value = '';
    }
});

// Обработчик нажатия клавиши Enter в поле ввода
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            saveLastCity(city);
            cityInput.value = '';
        }
    }
});

// Обработчики кликов по городам по умолчанию
defaultCities.forEach(cityElement => {
    cityElement.addEventListener('click', function() {
        const city = this.getAttribute('data-city');
        getWeather(city);
        saveLastCity(city);
    });
});

// Загружаем погоду при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    const lastCity = loadLastCity();
    getWeather(lastCity);
});