from django.urls import path

from weather import views

urlpatterns = [
    path("api/cities/", views.city_suggestions, name="city_suggestions"),
    path("api/weather/", views.weather_api, name="weather_api"),
    path("api/onecall/", views.onecall_forecast, name="onecall_forecast"),
]