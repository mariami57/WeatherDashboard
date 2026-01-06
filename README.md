# WeatherDashboard App
A Django-based weather dashboard called "Weather Today" that provides current weather, city search suggestions, and 5-day forecasts using the [OpenWeatherMap API](https://openweathermap.org/).

## Features
🏙️ City Search Suggestions – Find cities from a built-in world cities dataset.

🌡️ Current Weather – Search by city name or by latitude/longitude.

📅 5-Day Forecast – Get daily temperature ranges and conditions.

🔎 Autocomplete Search – Provides up to 15 matching cities.

⚡ Fast JSON API – Designed for real-time front-end consumption.

## Tech Stack

○ Backend: Django

○ API: OpenWeatherMap

○ Data: CSV (world cities dataset)

○ Libraries:

- requests (API calls)

- unidecode (city name normalization)

- collections (forecast aggregation)

## Project Structure
<pre>
Weather_Dashboard/
├── common/                   # Common views & templates (home page)
├── weather/
    └── data/
        └── worldcities.csv   # Cities dataset for autocomplete
</pre>

## Installation
### 1. Clone the repository:
<pre>
  git clone https://github.com/mariami57/weather-dashboard.git
  cd weather-dashboard
</pre>

### 2. Create a virtual environment and activate it:
<pre>
  python -m venv venv
  source venv/bin/activate   # On Windows: venv\Scripts\activate
</pre>

### 3. Install dependencies:
<pre>
  pip install -r requirements.txt
</pre>

### 4. Run migrations:
<pre>
  python manage.py migrate
</pre>

### 5. Run the development server:
<pre>
  python manage.py runserver
</pre>

### 6. Open in browser:
<pre>
  http://127.0.0.1:8000/
</pre>
## API Endpoints
- Current Weather
<pre>
  GET /weather_api?city=London
  GET /weather_api?lat=51.5074&lon=-0.1278
</pre>
 - City Suggestions
<pre>
  GET /city_suggestions?q=par
 </pre> 
- Forecast (5 days)
<pre>
  GET /forecast?lat=51.5074&lon=-0.1278
 </pre>
 
## Deployment
This app is deployed on Azure.
Here’s an overview of the deployment setup:

○ Database in Production:  SQLite

○ Static & Media Files: (Handled by Django’s collectstatic)

○ Environment Variables:
<br>
This project uses a .env file to manage secrets and environment configuration.
A template.env file is included in the repository – you can copy it and rename it to .env before running the project

- SECRET_KEY – Django secret key

- DEBUG – Set to False in production

- ALLOWED_HOSTS – Your domain or IP

- CSRF_TRUSTED_ORIGINS - ensures Django accepts form submissions from your deployed domains
  
- API_KEY - OpenWeather API key

## Live Demo
Check out the live version here:
[Weather Today](https://appweather-cdf9gdbmcsakcngw.italynorth-01.azurewebsites.net/)
