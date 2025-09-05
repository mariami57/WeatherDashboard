from django.http import JsonResponse
from django.shortcuts import render

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