from django.urls import path

from weather import views

urlpatterns = [
    path("api/weather/", views.weather_api, name="weather_api"),
]