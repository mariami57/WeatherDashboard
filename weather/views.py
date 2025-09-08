import requests
from django.conf import settings
from django.http import JsonResponse
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

def city_suggestions(request):
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse([], safe=False)
    url = (
        f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={settings.API_KEY}"
    )
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        results = [f"{city['name']}, {city['country']}" for city in data]
        return JsonResponse(results, safe=False)
    else:
        return JsonResponse([], safe=False)