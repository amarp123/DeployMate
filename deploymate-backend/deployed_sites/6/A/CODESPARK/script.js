  const OWM_API_KEY = '46dbac456aeaea5891e382fae73711ca';
  const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
  const tempEl = document.getElementById('temp');
  const descEl = document.getElementById('desc');
  const locationEl = document.getElementById('location');
  const timeLocalEl = document.getElementById('timeLocal');
  const humidityEl = document.getElementById('humidity');
  const feelsEl = document.getElementById('feels');
  const windEl = document.getElementById('wind');
  const aqiEl = document.getElementById('aqi');
  const recentCityLabel = document.getElementById('recentCityLabel');

  let hourChart, weekChart;

  function celsius(kelvin) {
    return Math.round(kelvin - 273.15);
  }

  function setBackgroundForWeather(main) {
    const bg = document.getElementById('bg');
    bg.classList.remove('bg-sunny', 'bg-cloudy', 'bg-storm');
    if (!main) main = 'Clear';
    main = main.toLowerCase();
    if (main.includes('clear') || main.includes('sun')) bg.classList.add('bg-sunny');
    else if (main.includes('cloud') || main.includes('mist')) bg.classList.add('bg-cloudy');
    else bg.classList.add('bg-storm');
  }

  function saveRecent(city) {
    city = city.trim();
    if (!city) return;
    const key = 'skypulse_recent';
    let arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr = arr.filter(c => c.toLowerCase() !== city.toLowerCase());
    arr.unshift(city);
    if (arr.length > 6) arr.pop();
    localStorage.setItem(key, JSON.stringify(arr));
    renderRecent();
  }

  function renderRecent() {
    const container = document.getElementById('recentSearches');
    container.innerHTML = '';
    const arr = JSON.parse(localStorage.getItem('skypulse_recent') || '[]');
    arr.forEach(city => {
      const el = document.createElement('div');
      el.className = 'chip';
      el.textContent = city;
      el.onclick = () => fetchByCity(city);
      container.appendChild(el);
    });
    recentCityLabel.textContent = arr[0] || '-';
  }

  const POPULAR = ['New York', 'London', 'Mumbai', 'Sydney', 'Tokyo', 'Bengaluru'];
  function renderPopular() {
    const p = document.getElementById('popularCities');
    p.innerHTML = '';
    POPULAR.forEach(city => {
      const el = document.createElement('div');
      el.className = 'chip';
      el.textContent = city;
      el.onclick = () => fetchByCity(city);
      p.appendChild(el);
    });
  }

  async function fetchByCoords(lat, lon) {
    try {
      const weatherUrl = `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error('Failed fetching current weather');
      const current = await weatherRes.json();

      const forecastUrl = `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error('Failed fetching forecast');
      const forecast = await forecastRes.json();

      const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const geoJson = await geo.json().catch(() => null);
      const cityName = geoJson?.address?.city || geoJson?.display_name || `${lat.toFixed(2)},${lon.toFixed(2)}`;

      updateCurrentWeatherUI(current, cityName);
      updateForecastUI(forecast, current.timezone);
      fetchAQI(lat, lon);

    } catch (err) {
      alert(err.message || 'Error fetching weather data');
    }
  }


  async function fetchByCity(city) {
    try {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OWM_API_KEY}`;
      const r = await fetch(geocodeUrl);
      const arr = await r.json();
      if (!arr || arr.length === 0) return alert('City not found');
      const { lat, lon, name, country, state } = arr[0];
      const label = [name, state, country].filter(Boolean).join(', ');
      saveRecent(label);
      await fetchByCoords(lat, lon);
      locationEl.textContent = label;
    } catch (e) {
      alert('Failed to geocode city');
    }
  }

  async function fetchAQI(lat, lon) {
    try {
      const url = `${OWM_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
      const res = await fetch(url);
      const j = await res.json();
      const aqi = j.list?.[0]?.main?.aqi ?? null; 
      aqiEl.textContent = aqi ? `${aqi} / 5` : 'N/A';
    } catch (e) {
      aqiEl.textContent = 'N/A';
    }
  }

  
  function updateCurrentWeatherUI(data, label) {
    tempEl.textContent = celsius(data.main.temp) + '°';
    descEl.textContent = data.weather?.[0]?.description || '';
    humidityEl.textContent = data.main.humidity + '%';
    feelsEl.textContent = celsius(data.main.feels_like) + '°';
    windEl.textContent = (data.wind.speed * 3.6).toFixed(0) + ' km/h';
    locationEl.textContent = label || 'Unknown';

    setBackgroundForWeather(data.weather?.[0]?.main);

    const localTime = new Date((data.dt + data.timezone) * 1000);
    timeLocalEl.textContent = localTime.toUTCString().match(/\d{2}:\d{2}/)[0] + ' (local)';
  }

 
  function updateForecastUI(forecastData, timezoneOffset) {
    const now = Date.now();
    const next12Hours = forecastData.list.filter(item => {
      const forecastTime = item.dt * 1000;
      return forecastTime >= now && forecastTime <= now + 12 * 3600 * 1000;
    }).slice(0, 4);

   
    const hLabels = next12Hours.map(h => {
      const d = new Date((h.dt + timezoneOffset) * 1000);
      return d.getHours() + ':00';
    });
    const hTemps = next12Hours.map(h => celsius(h.main.temp));
    
    const hPop = next12Hours.map(h => Math.round((h.pop || 0) * 100));

    renderHourChart(hLabels, hTemps, hPop);

   
    const dailyMap = new Map();

    forecastData.list.forEach(item => {
      const dateObj = new Date((item.dt + timezoneOffset) * 1000);
      const dayStr = dateObj.toISOString().split('T')[0]; 
      if (!dailyMap.has(dayStr)) dailyMap.set(dayStr, { temps: [], min: Infinity, max: -Infinity });
      const day = dailyMap.get(dayStr);
      const tempC = celsius(item.main.temp);
      day.temps.push(tempC);
      if (tempC < day.min) day.min = tempC;
      if (tempC > day.max) day.max = tempC;
    });

   
    const dailyEntries = Array.from(dailyMap.entries()).slice(0, 7);
    const dLabels = dailyEntries.map(([day]) => {
      const d = new Date(day);
      return d.toLocaleDateString(undefined, { weekday: 'short' });
    });
    const dHigh = dailyEntries.map(([, day]) => day.max);
    const dLow = dailyEntries.map(([, day]) => day.min);

    renderWeekChart(dLabels, dHigh, dLow);
  }

  function renderHourChart(labels, temps, pops) {
    const ctx = document.getElementById('hourChart').getContext('2d');
    if (hourChart) hourChart.destroy();
    hourChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temp (°C)',
            data: temps,
            fill: true,
            tension: 0.3,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            yAxisID: 'tempAxis'
          },
          {
            label: 'Precip %',
            data: pops,
            type: 'bar',
            yAxisID: 'popAxis',
            backgroundColor: 'rgba(96,165,250,0.5)'
          }
        ]
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          tempAxis: { type: 'linear', position: 'left', beginAtZero: false },
          popAxis: { type: 'linear', position: 'right', beginAtZero: true, max: 100, ticks: { stepSize: 25 } }
        }
      }
    });
  }

  function renderWeekChart(labels, high, low) {
    const ctx = document.getElementById('weekChart').getContext('2d');
    if (weekChart) weekChart.destroy();
    weekChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'High',
            data: high,
            tension: 0.4,
            fill: false,
            borderColor: '#ef4444' 
          },
          {
            label: 'Low',
            data: low,
            tension: 0.4,
            fill: false,
            borderColor: '#3b82f6' 
          }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: false }
        }
      }
    });
  }

  async function tryGeolocation() {
    if (!navigator.geolocation) return console.log('No geolocation');
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetchByCoords(latitude, longitude);
      saveRecent('Current Location');
    }, err => {
      console.log('Geolocation denied');
    });
  }

  function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return alert('Speech recognition not supported in this browser');
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.onresult = (e) => {
      const t = e.results[0][0].transcript;
      const city = t.replace(/^search\s+/i, '');
      document.getElementById('cityInput').value = city;
      fetchByCity(city);
    };
    recog.onerror = (e) => console.log('voice error', e);
    recog.start();
  }

  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  function autoThemeByTime() {
    const h = new Date().getHours();
    if (h < 6 || h > 18) applyTheme('dark');
    else applyTheme('light');
  }


  document.getElementById('searchBtn').onclick = () => {
    const q = document.getElementById('cityInput').value.trim();
    if (q) fetchByCity(q);
  };
  document.getElementById('locateBtn').onclick = tryGeolocation;
  document.getElementById('voiceBtn').onclick = startVoiceSearch;
  document.getElementById('themeToggle').onclick = () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  document.getElementById('deployBtn').onclick = () => {
    alert('To deploy: push repo to GitHub and connect Netlify, or drag & drop this project folder into Netlify Sites.')
  };

  renderPopular();
  renderRecent();

  (async () => {
    autoThemeByTime();
    try {
      await tryGeolocation();
      setTimeout(() => {
        const recent = JSON.parse(localStorage.getItem('skypulse_recent') || '[]');
        if (!recent.length) fetchByCity('New York');
      }, 1500);
    } catch (e) {
      fetchByCity('New York');
    }
  })();