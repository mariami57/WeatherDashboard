import csv
from idlelib import query
from pathlib import Path

import requests
from django.conf import settings
from django.http import JsonResponse
from unidecode import unidecode

from Weather_Dashboard.utils import get_weather



# Create your views here.
def weather_api(request):
    city = request.GET.get('city')
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.API_KEY}&units=metric"
    elif city:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={settings.API_KEY}&units=metric"
    else:
        return JsonResponse({"error": "Missing parameters"}, status=400)

    data = get_weather(city)

    if data:
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Could not fetch weather'}, status=500)


DATA_PATH = Path(__file__).resolve().parent / 'data' / 'worldcities.csv'
CITIES = []
with open(DATA_PATH, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        CITIES.append({
            'city': row['city'],
            'country': row['country'],
            'lat': row['lat'],
            'lon': row['lng'],
            'search_name': unidecode(row['city'].lower()),
        })

def city_suggestions(request):
    query = request.GET.get("q", "").strip().lower()

    if not query:
        return JsonResponse([], safe=False)

    q_norm = unidecode(query).lower()
    results = [
        {
            'name': c['city'],
            'country':c['country'],
            'lat': row['lat'],
            'lon': row['lng'],
            'display': f"{c['city']}, {c['country']}"
        }
        for c in CITIES if q_norm in c['search_name'].lower()
    ][:15]

    return JsonResponse(results, safe=False)

def onecall_forecast(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if not lat or not lon:
        return JsonResponse({"error": "Missing lat/lon parameters"}, status=400)

    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&units=metric&appid={settings.API_KEY}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        return JsonResponse({"error": f"Could not fetch weather: {e}"}, status=500)
