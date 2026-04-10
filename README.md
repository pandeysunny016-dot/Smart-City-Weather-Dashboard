# SmartCity Weather Dashboard

> A real-time weather web app that goes beyond temperature — giving smart lifestyle suggestions, 5-day forecasts, city search, filtering, sorting, favorites, and a beautiful sky-themed UI.

---

## 🌦️ What is this?

The SmartCity Weather Dashboard is an intelligent weather application built with plain HTML, CSS, and JavaScript. Instead of just showing numbers, it tells you what to **wear**, whether to **carry an umbrella**, and gives you a **5-day forecast** — all wrapped in a cinematic animated sky background that changes color based on the actual temperature.

---

## ✨ Features

### Milestone 1 — Planning & Design
- Designed the full UI concept and layout
- Identified public API and data requirements
- Planned responsive layout for mobile, tablet, and desktop

### Milestone 2 — API Integration
- ✅ Live weather data using `fetch()` from OpenWeatherMap API
- ✅ Current weather — temperature, humidity, wind, pressure, visibility
- ✅ 5-day / 3-hour forecast
- ✅ Sunrise & sunset times
- ✅ Automatic location detection using Geolocation API
- ✅ Loading states and error handling
- ✅ Fully responsive across all screen sizes

### Milestone 3 — Core Interactive Features
- ✅ **Search** — Search any city worldwide
- ✅ **Filter** — Filter the 5-day forecast by weather type (All / Sunny / Rainy / Cloudy)
- ✅ **Sort** — Sort forecast cards by: Default / Hottest First / Coldest First / Most Rain First
- ✅ **Favorites** — Save and manage favourite cities with a heart button (stored in localStorage)
- ✅ **Dark / Light Mode** — Toggle between dark and light themes

---

## 🧠 Smart Suggestions

The app gives dynamic "What to Wear Today" advice based on real data:

| Condition | Suggestion |
|---|---|
| Temp ≤ 0°C | 🧤 Heavy coat, gloves & thermal layers |
| Temp ≤ 10°C | 🧥 Warm jacket and layered clothing |
| Temp ≤ 17°C | 🧣 Light jacket or a cosy hoodie |
| Temp ≤ 26°C | 👕 Casual, comfortable clothing |
| Temp > 26°C | 🩴 Light & breathable outfit |
| Rain > 20% | ☂️ Carry an umbrella |
| Wind > 25 km/h | 💨 Wear a windbreaker |
| Snow conditions | 👢 Waterproof boots |
| Temp > 28°C | 🕶️ Sunglasses recommended |
| Temp > 32°C | 🧴 Apply sunscreen |

---

## 🎨 Dynamic Sky Background

The background gradient changes automatically based on the real temperature of the searched city:

| Temperature | Background |
|---|---|
| ≤ 0°C | Deep navy blue — freezing |
| 1–12°C | Cool blue-grey — cold |
| 13–22°C | Golden sunset — mild / warm |
| 23–30°C | Warm amber-orange — hot |
| > 30°C | Fiery red-orange — very hot |

The animated cloud blurs and sunbeam effect also shift with the temperature.

---

## 🧰 Tech Stack

| Tech | Usage |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, animations, glassmorphism, responsive design |
| JavaScript (ES6) | API calls, DOM manipulation, logic |
| OpenWeatherMap API | Live weather + forecast data |
| Geolocation API | Auto-detect user location |
| localStorage | Saving favourite cities |

---

## 📐 Array Higher-Order Functions Used (Milestone 3)

All filtering, sorting, and data operations use JavaScript Array HOFs — no traditional `for` or `while` loops.

```js
// .filter() — Filter forecast by weather condition
days.filter(function(day) {
    var group = getConditionGroup(day.weather[0].id);
    return group === currentFilter;
});

// .sort() — Sort forecast by temperature (high to low)
copy.sort(function(a, b) {
    return toCelsius(b.main.temp_max) - toCelsius(a.main.temp_max);
});

// .map() — Build forecast card HTML from data array
sorted.map(function(fc, i) {
    return '<div class="day-card">...</div>';
}).join('');

// .reduce() — Get maximum rain probability across all forecast days
allForecastDays.reduce(function(max, day) {
    var pop = (day.pop || 0) * 100;
    return pop > max ? pop : max;
}, 0);

// .find() — Check if a city is already in favourites
savedCities.find(function(c) {
    return c === currentCityName;
});

// .filter() — Remove a city from favourites list
savedCities.filter(function(c) {
    return c !== currentCityName;
});
```

---

## ⚙️ Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/smart-weather-dashboard.git
```

**2. Navigate into the project folder**
```bash
cd smart-weather-dashboard
```

**3. Open in browser**
```
Open index.html directly in Chrome / Firefox
OR use Live Server extension in VS Code
```

---

## 🔑 API Configuration

1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Go to **API Keys** tab in your account
3. Copy your key and replace it in `index.html`:

```js
var API_KEY = 'your_api_key_here';
```

> ⚠️ New API keys take up to 2 hours to activate after creation.

---

## 📍 Geolocation

| Action | Result |
|---|---|
| Allow location access | Weather loads automatically for your city |
| Deny location access | Error shown, default city (Pune) loads instead |
| Search manually | Type any city name and press Search or Enter |

---

## ❤️ Favorites Feature

- Click the **🤍 heart button** next to the city name to save it
- Click **Favorites** button in the controls bar to open the saved cities panel
- Click any saved city chip to reload its weather instantly
- Click **✕** on a chip to remove it
- Saved cities are stored in `localStorage` — they persist after closing the browser

---

## 📂 Project Structure

```
smart-weather-dashboard/
│
├── index.html        ← complete app (HTML + CSS + JS in one file)
└── README.md         ← project documentation
```

> The entire project is a single `index.html` file — no build tools or dependencies required.

---

## 📱 Responsive Design

| Screen | Layout |
|---|---|
| Desktop (> 860px) | 2-column hero grid, 4-column stats |
| Tablet (580–860px) | Single column, side cards in a row |
| Mobile (< 600px) | Fully stacked, compact search, 2-column stats |
| Small mobile (< 380px) | Extra compact — all elements adjusted |

---

## 🧩 Future Improvements

- 📊 Hourly temperature chart using Chart.js
- 🔔 Weather alerts and push notifications
- 🌍 Side-by-side multi-city comparison
- 📱 Progressive Web App (PWA) with offline support
- 🌐 Multi-language support

---

## ⚠️ Challenges Solved

1. **Geolocation fallback** — If the user denies location access, the app gracefully falls back to a default city instead of crashing
2. **Parallel API calls** — Both `/weather` and `/forecast` endpoints are called at the same time using `Promise.all()` for faster load
3. **Dynamic sky theming** — Background gradient changes smoothly based on the actual temperature of the fetched city
4. **Filter + Sort on same data** — Filter and sort work together without modifying the original data array (using `.slice()` copy before sorting)
5. **Forecast noon selection** — The app intelligently picks the forecast entry closest to 12:00 PM for each day to represent that day accurately

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch — `git checkout -b feature/your-feature`
3. Make your changes
4. Commit — `git commit -m "add: your feature description"`
5. Push — `git push origin feature/your-feature`
6. Submit a Pull Request

---

## 👨‍💻 Author

**Sunny Pandey**  
SmartCity Weather Dashboard — College Project  
Built with HTML, CSS & JavaScript
