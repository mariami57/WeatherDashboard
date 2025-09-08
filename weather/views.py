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
    if not city:
        return JsonResponse({'error': 'No city provided'}, status=400)

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
            'display': f"{c['city']}, {c['country']}"
        }
        for c in CITIES if q_norm in c['search_name'].lower()
    ][:15]

    return JsonResponse(results, safe=False)
