var API_KEY = '4bffe2485aa35ed37368f5d6949a7c7a';
    var API_URL = 'https://api.openweathermap.org/data/2.5';
 
    var shortDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var fullDays  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 
    function getEl(id) { return document.getElementById(id); }
    function toCelsius(k) { return Math.round(k - 273.15); }
    function zeroPad(n)   { return String(n).padStart(2, '0'); }
    function iconUrl(code){ return 'https://openweathermap.org/img/wn/' + code + '@2x.png'; }
 
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
 
    function updateSkyTheme(temp) {
      var gradient;
      if (temp <= 0)       gradient = 'linear-gradient(175deg,#0a0f1e 0%,#0e1e35 20%,#1a3055 40%,#2a4a75 65%,#3a6090 100%)';
      else if (temp <= 12) gradient = 'linear-gradient(175deg,#0d1b2a 0%,#1a3a5c 20%,#2d6a8a 40%,#7ab0c8 65%,#b8d8ec 100%)';
      else if (temp <= 22) gradient = 'linear-gradient(175deg,#0d1b2a 0%,#1a3a5c 18%,#2d6a8a 35%,#c4703a 58%,#e8904a 70%,#f5b56a 80%,#e8c88a 88%,#d4a870 100%)';
      else if (temp <= 30) gradient = 'linear-gradient(175deg,#1a0d00 0%,#3a1a00 15%,#7a3a10 30%,#c06020 50%,#e08030 65%,#f0a840 78%,#fce080 100%)';
      else                 gradient = 'linear-gradient(175deg,#2a0800 0%,#5a1000 15%,#a02010 30%,#d04020 50%,#e86030 65%,#f8b060 88%,#fcd880 100%)';
 
      getEl('skyBg').style.background = gradient;
 
      if      (temp <= 0)  getEl('sunbeam').style.opacity = '0.05';
      else if (temp <= 12) getEl('sunbeam').style.opacity = '0.18';
      else if (temp <= 22) getEl('sunbeam').style.opacity = '0.55';
      else if (temp <= 30) getEl('sunbeam').style.opacity = '0.78';
      else                 getEl('sunbeam').style.opacity = '0.90';
    }
 
    function getOutfitTips(temp, windKmh, rainPercent, conditionId) {
      var tips = [];
      if      (temp <= 0)  tips.push(['🧤', 'Heavy coat, gloves & thermal layers']);
      else if (temp <= 10) tips.push(['🧥', 'Warm jacket and layered clothing']);
      else if (temp <= 17) tips.push(['🧣', 'Light jacket or a cosy hoodie']);
      else if (temp <= 26) tips.push(['👕', 'Casual, comfortable clothing']);
      else                  tips.push(['🩴', 'Light & breathable outfit — stay cool']);
      if (rainPercent > 20) tips.push(['☂️', 'Rain likely (' + Math.round(rainPercent) + '%) — carry an umbrella']);
      if (windKmh > 25)     tips.push(['💨', 'Strong wind (' + Math.round(windKmh) + ' km/h) — windbreaker']);
      if (conditionId >= 600 && conditionId < 700) tips.push(['👢', 'Waterproof boots for snowy ground']);
      if (temp > 28) tips.push(['🕶️', 'Sunglasses recommended today']);
      if (temp > 32) tips.push(['🧴', 'Apply sunscreen — UV is high']);
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
      var minTemp   = toCelsius(data.main.temp_min);
      var maxTemp   = toCelsius(data.main.temp_max);
      var windKmh   = Math.round(data.wind.speed * 3.6);
      var gustVal   = data.wind.gust ? Math.round(data.wind.gust * 3.6) + 'km/h' : windKmh + 'km/h';
      var visKm     = data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : 'N/A';
      var tz        = data.timezone;
 
      getEl('cityName').textContent    = data.name;
      getEl('countryCode').textContent = data.sys.country;
      getEl('condLabel').textContent   = data.weather[0].description;
      getEl('condIcon').textContent    = getCondEmoji(data.weather[0].id);
      getEl('tempNow').textContent     = temp;
      getEl('weatherIcon').src         = iconUrl(data.weather[0].icon);
      getEl('weatherIcon').alt         = data.weather[0].description;
      getEl('feelsLike').textContent   = feelsTemp + '°C';
      getEl('humidity').textContent    = data.main.humidity + '%';
      getEl('windSpeed').textContent   = windKmh + ' km/h';
      getEl('pressure').textContent    = data.main.pressure + ' hPa';
      getEl('sunriseTime').textContent = getLocalTime(data.sys.sunrise, tz);
      getEl('sunsetTime').textContent  = getLocalTime(data.sys.sunset, tz);
      getEl('visibilityVal').textContent = visKm;
      getEl('minMaxTemp').textContent  = minTemp + '° / ' + maxTemp + '°';
      getEl('windGust').textContent    = gustVal;
      getEl('cloudCover').textContent  = (data.clouds && data.clouds.all !== undefined ? data.clouds.all : 0) + '%';
      getEl('localTime').textContent   = getLocalTime(Math.floor(Date.now() / 1000), tz);
 
      updateSkyTheme(temp);
      return { temp: temp, wind: windKmh, condId: data.weather[0].id };
    }
 
    function renderForecast(list, curTemp, curWind, curCond) {
      var seen  = {};
      var daily = [];
 
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var d    = new Date(item.dt * 1000);
        var key  = d.getDate() + '-' + d.getMonth();
        var hr   = d.getHours();
        if (!seen[key] && hr >= 11 && hr <= 14) {
          seen[key] = true;
          daily.push(item);
          if (daily.length >= 5) break;
        }
      }
 
      if (daily.length < 5) {
        for (var j = 0; j < list.length; j++) {
          var item2 = list[j];
          var d2    = new Date(item2.dt * 1000);
          var key2  = d2.getDate() + '-' + d2.getMonth();
          if (!seen[key2]) { seen[key2] = true; daily.push(item2); }
          if (daily.length >= 5) break;
        }
      }
 
      var maxRain = 0;
      for (var r = 0; r < daily.length; r++) {
        var pop = (daily[r].pop || 0) * 100;
        if (pop > maxRain) maxRain = pop;
      }
 
      var tips    = getOutfitTips(curTemp, curWind, maxRain, curCond);
      var tipHTML = '';
      for (var t = 0; t < tips.length; t++) {
        tipHTML += '<div class="tip-item"><span class="tip-icon">' + tips[t][0] + '</span><span>' + tips[t][1] + '</span></div>';
      }
      getEl('outfitTips').innerHTML = tipHTML;
 
      var slice    = daily.slice(0, 5);
      var cardHTML = '';
 
      for (var k = 0; k < slice.length; k++) {
        var fc      = slice[k];
        var fcDate  = new Date(fc.dt * 1000);
        var hiTemp  = toCelsius(fc.main.temp_max || fc.main.temp);
        var loTemp  = toCelsius(fc.main.temp_min || fc.main.temp - 4);
        var fcRain  = Math.round((fc.pop || 0) * 100);
        var dayLbl  = k === 0 ? 'Today' : shortDays[fcDate.getDay()] + ' ' + fcDate.getDate();
        var isActive = k === 0 ? ' active' : '';
        var rainHTML = fcRain > 0 ? '<div class="rain-chance">💧 ' + fcRain + '%</div>' : '';
 
        cardHTML += '<div class="day-card' + isActive + '">'
          + '<div class="day-name">' + dayLbl + '</div>'
          + '<div class="day-icon"><img src="' + iconUrl(fc.weather[0].icon) + '" alt="" /></div>'
          + '<div class="day-desc">' + fc.weather[0].description + '</div>'
          + '<div class="day-temps">'
          +   '<span class="temp-high">' + hiTemp + '°</span>'
          +   '<span class="temp-low">'  + loTemp  + '°</span>'
          + '</div>'
          + rainHTML
          + '</div>';
      }
 
      getEl('forecastRow').innerHTML = cardHTML;
 
      var cards = getEl('forecastRow').querySelectorAll('.day-card');
      cards.forEach(function(card) {
        card.addEventListener('click', function() {
          cards.forEach(function(c) { c.classList.remove('active'); });
          card.classList.add('active');
        });
      });
    }
 
    function loadWeather(lat, lon, cityName) {
      showLoading();
 
      var param = lat !== null
        ? 'lat=' + lat + '&lon=' + lon
        : 'q=' + encodeURIComponent(cityName);
 
      Promise.all([
        fetch(API_URL + '/weather?'  + param + '&appid=' + API_KEY),
        fetch(API_URL + '/forecast?' + param + '&appid=' + API_KEY)
      ])
      .then(function(res) {
        if (!res[0].ok) {
          return res[0].json().then(function(e) {
            throw new Error(e.message || 'City not found. Please try again.');
          });
        }
        return Promise.all([ res[0].json(), res[1].json() ]);
      })
      .then(function(data) {
        hideLoading();
        var result = renderWeather(data[0]);
        renderForecast(data[1].list, result.temp, result.wind, result.condId);
        showEl('weatherData');
        hideEl('welcomeScreen');
      })
      .catch(function(err) {
        hideLoading();
        showError(err.message);
        showEl('welcomeScreen');
      });
    }
 
    function useMyLocation() {
      if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
      }
      showLoading();
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          loadWeather(pos.coords.latitude, pos.coords.longitude, null);
        },
        function() {
          hideLoading();
          showError('Location access was denied. Loading default city instead.');
          loadWeather(null, null, 'Pune');
        },
        { timeout: 8000 }
      );
    }
 
    getEl('searchBtn').addEventListener('click', function() {
      var q = getEl('cityInput').value.trim();
      if (q !== '') { clearError(); loadWeather(null, null, q); }
    });
 
    getEl('cityInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var q = getEl('cityInput').value.trim();
        if (q !== '') { clearError(); loadWeather(null, null, q); }
      }
    });
 
    getEl('geoBtn').addEventListener('click', useMyLocation);
 
    function updateClock() {
      var now     = new Date();
      var timeStr = zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes()) + ':' + zeroPad(now.getSeconds());
      var dateStr = fullDays[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ' ' + now.getFullYear();
      getEl('clockTime').textContent = timeStr;
      getEl('clockDate').textContent = dateStr;
    }
 
    setInterval(updateClock, 1000);
    updateClock();
 

    loadWeather(null, null, 'Pune');
 