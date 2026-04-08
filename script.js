var API_KEY = '4bffe2485aa35ed37368f5d6949a7c7a';
var API_URL = 'https://api.openweathermap.org/data/2.5';

var shortDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var fullDays  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getEl(id) { return document.getElementById(id); }
function toCelsius(k) { return Math.round(k - 273.15); }
function zeroPad(n)   { return String(n).padStart(2, '0'); }
function iconUrl(code){ return 'https://openweathermap.org/img/wn/' + code + '@4x.png'; }

function getLocalTime(unix, offset) {
    var d = new Date((unix + offset) * 1000);
    return zeroPad(d.getUTCHours()) + ':' + zeroPad(d.getUTCMinutes());
}

function getCondEmoji(id) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 400) return '🌦️';
    if (id >= 500 && id < 600) return '🌧️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800)             return '☀️';
    if (id === 801)             return '🌤️';
    if (id <= 804)              return '☁️';
    return '🌡️';
}

function updateSmartAlert(temp, cond) {
    var alertEl = getEl('smartAlert');
    var textEl = alertEl.querySelector('.alert-text');
    
    if (temp > 35) {
        textEl.textContent = "Heatwave Protocol Active: Stay Hydrated";
        alertEl.style.borderColor = "#ff4d4d";
    } else if (temp < 5) {
        textEl.textContent = "Thermal Regulation Required: High Power Usage";
        alertEl.style.borderColor = "#4d94ff";
    } else if (cond.toLowerCase().includes('rain')) {
        textEl.textContent = "Drainage Systems Monitoring: Optimal";
        alertEl.style.borderColor = "#00f2ff";
    } else {
        textEl.textContent = "City Systems Status: Nominal";
        alertEl.style.borderColor = "var(--border-neon)";
    }
}

function getOutfitTips(temp, windKmh, rainPercent, conditionId) {
    var tips = [];
    if      (temp <= 0)  tips.push(['🧤', 'Heavy thermal insulation required']);
    else if (temp <= 12) tips.push(['🧥', 'Cyber-coat and wind layers']);
    else if (temp <= 22) tips.push(['🧣', 'Light smart-mesh jacket']);
    else if (temp <= 30) tips.push(['👕', 'Breathable synthetic fabrics']);
    else                  tips.push(['🩴', 'Max ventilation mode — stay cool']);
    
    if (rainPercent > 20) tips.push(['☂️', 'Precipitation shield recommended']);
    if (windKmh > 25)     tips.push(['💨', 'High-velocity wind warnings']);
    if (conditionId >= 600 && conditionId < 700) tips.push(['👢', 'A-Grip boots for frozen terrain']);
    return tips;
}

function showEl(id)  { var e = getEl(id); if (e) e.classList.remove('hidden'); }
function hideEl(id)  { var e = getEl(id); if (e) e.classList.add('hidden'); }

function showError(msg) { getEl('errorText').textContent = msg; showEl('errorBox'); }
function clearError()   { hideEl('errorBox'); }

function showLoading() {
    clearError();
    hideEl('weatherData');
    hideEl('welcomeScreen');
    showEl('loadingBox');
}
function hideLoading() { hideEl('loadingBox'); }

function renderWeather(data) {
    var temp      = toCelsius(data.main.temp);
    var feelsTemp = toCelsius(data.main.feels_like);
    var windKmh   = Math.round(data.wind.speed * 3.6);
    var tz        = data.timezone;

    getEl('cityName').textContent    = data.name;
    getEl('countryCode').textContent = data.sys.country;
    getEl('condLabel').textContent   = data.weather[0].description;
    getEl('condIcon').textContent    = getCondEmoji(data.weather[0].id);
    getEl('tempNow').textContent     = temp;
    getEl('weatherIcon').src         = iconUrl(data.weather[0].icon);
    getEl('feelsLike').textContent   = feelsTemp + '°C';
    getEl('humidity').textContent    = data.main.humidity + '%';
    getEl('windSpeed').textContent   = windKmh + ' km/h';
    getEl('pressure').textContent    = data.main.pressure + ' hPa';
    getEl('sunriseTime').textContent = getLocalTime(data.sys.sunrise, tz);
    getEl('sunsetTime').textContent  = getLocalTime(data.sys.sunset, tz);
    getEl('visibilityVal').textContent = data.visibility ? (data.visibility / 1000).toFixed(1) + ' KM' : 'N/A';
    getEl('minMaxTemp').textContent  = toCelsius(data.main.temp_min) + '° / ' + toCelsius(data.main.temp_max) + '°';
    getEl('windGust').textContent    = data.wind.gust ? Math.round(data.wind.gust * 3.6) + 'KM/H' : windKmh + 'KM/H';
    getEl('cloudCover').textContent  = (data.clouds ? data.clouds.all : 0) + '%';
    getEl('localTime').textContent   = getLocalTime(Math.floor(Date.now() / 1000), tz);

    updateSmartAlert(temp, data.weather[0].description);
    return { temp: temp, wind: windKmh, condId: data.weather[0].id };
}

function renderForecast(list, curTemp, curWind, curCond) {
    var daily = [];
    var seen = {};

    for (var i = 0; i < list.length; i++) {
        var d = new Date(list[i].dt * 1000);
        var key = d.getDate();
        if (!seen[key]) {
            seen[key] = true;
            daily.push(list[i]);
            if (daily.length >= 5) break;
        }
    }

    var maxRain = 0;
    for (var r = 0; r < daily.length; r++) {
        if (daily[r].pop > maxRain) maxRain = daily[r].pop;
    }

    var tips = getOutfitTips(curTemp, curWind, maxRain * 100, curCond);
    var tipHTML = '';
    for (var t = 0; t < tips.length; t++) {
        tipHTML += '<div class="tip-item"><span class="tip-icon">' + tips[t][0] + '</span><span>' + tips[t][1] + '</span></div>';
    }
    getEl('outfitTips').innerHTML = tipHTML;

    var cardHTML = '';
    for (var k = 0; k < daily.length; k++) {
        var fc = daily[k];
        var fcDate = new Date(fc.dt * 1000);
        var dayLbl = k === 0 ? 'Today' : shortDays[fcDate.getDay()];
        cardHTML += '<div class="day-card' + (k === 0 ? ' active' : '') + '">'
            + '<div class="day-name">' + dayLbl + '</div>'
            + '<div class="day-icon"><img src="' + iconUrl(fc.weather[0].icon) + '" width="40" /></div>'
            + '<div class="day-temps">'
            + '<span class="temp-high">' + Math.round(fc.main.temp_max - 273.15) + '°</span>'
            + '<span class="temp-low">' + Math.round(fc.main.temp_min - 273.15) + '°</span>'
            + '</div>'
            + '</div>';
    }
    getEl('forecastRow').innerHTML = cardHTML;
}

function loadWeather(lat, lon, cityName) {
    showLoading();
    var param = lat !== null ? 'lat=' + lat + '&lon=' + lon : 'q=' + encodeURIComponent(cityName);

    Promise.all([
        fetch(API_URL + '/weather?'  + param + '&appid=' + API_KEY),
        fetch(API_URL + '/forecast?' + param + '&appid=' + API_KEY)
    ])
    .then(res => Promise.all([res[0].json(), res[1].json()]))
    .then(data => {
        if (data[0].cod != 200) throw new Error(data[0].message);
        hideLoading();
        var result = renderWeather(data[0]);
        renderForecast(data[1].list, result.temp, result.wind, result.condId);
        showEl('weatherData');
    })
    .catch(err => {
        hideLoading();
        showError(err.message);
        showEl('welcomeScreen');
    });
}

getEl('searchBtn').addEventListener('click', () => {
    var q = getEl('cityInput').value.trim();
    if (q) loadWeather(null, null, q);
});

getEl('cityInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        var q = getEl('cityInput').value.trim();
        if (q) loadWeather(null, null, q);
    }
});

getEl('geoBtn').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        pos => loadWeather(pos.coords.latitude, pos.coords.longitude, null),
        () => loadWeather(null, null, 'New York')
    );
});

function updateClock() {
    var now = new Date();
    getEl('clockTime').textContent = zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes()) + ':' + zeroPad(now.getSeconds());
    getEl('clockDate').textContent = fullDays[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
}

setInterval(updateClock, 1000);
updateClock();
loadWeather(null, null, 'Pune');