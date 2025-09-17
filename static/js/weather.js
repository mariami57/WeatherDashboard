const input = document.getElementById("search-input");
const resultsList = document.getElementById("search-results");
const weatherResult = document.getElementById("weather-result");


input.addEventListener("input", function () {
    const query = this.value.trim();

    if (query.length < 2) {
        resultsList.innerHTML = "";
        return;
    }

    fetch(`/weather/api/cities/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            resultsList.innerHTML = "";
            data.forEach(city => {
                const li = document.createElement("li");
                li.textContent = city.display;

                li.dataset.lat = city.lat;
                li.dataset.lon = city.lon;

                li.addEventListener("click", () => {
                    input.value = city.display;
                    resultsList.innerHTML = "";
                    fetchWeather(city.display);
                });

                resultsList.appendChild(li);
            });
        });
});


input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        fetchWeather(this.value);
    }

});


function fetchWeather(city) {
    document.getElementById("forecast-result").innerHTML="";
    fetch(`/weather/api/weather/?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            resultsList.innerHTML = "";

            if (data.error) {
                weatherResult.innerHTML = `<p>${data.error}</p>`;
            } else {
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                function isFavourite(city) {
                    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
                    return favourites.includes(city);
                }

                let favButtonHTML = "";
                if (!isFavourite(city)) {
                    favButtonHTML = `<button class="save-fav" data-city="${city}">📍</button>`;

                }

                weatherResult.innerHTML = `

                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; align-items: center; gap:10px;">
                            <img src="${iconUrl}" alt = "${data.weather[0].description}">
                            <div class="weather-results">
                                <div>
                                    <p style="margin:0; font-weight:bold;">${data.name}</p>
                                    <p style="margin:0;">${Math.round(data.main.temp)}°C, ${data.weather[0].description}</p>
                                </div>
                                <div class="dropdown-header">
                                    ${favButtonHTML}
                                    <span class="tooltip-text">Save to favourite cities</span>
                                </div>
                                
                            </div>
                        </div>

                        <a href="#" class="five-days"> See weather for the next 5 days</a>
                    </div>

                `;

                 const favButton = weatherResult.querySelector(".save-fav");
                 if (favButton){
                     favButton.addEventListener("click", () => {
                     saveFavourite(favButton.dataset.city);
                     renderFavourites();
                     favButton.style.display = "none";
                    });
                 }



                input.value = "";
                const fiveDaysLink = weatherResult.querySelector(".five-days");
                if (fiveDaysLink){
                    fiveDaysLink.addEventListener("click", (e) =>{
                    e.preventDefault();
                    fetchFiveDayForecast(data.coord.lat, data.coord.lon)
                    });
                }

            }


        });

}

function fetchFiveDayForecast(lat, lon) {
    fetch(`/weather/api/forecast/?lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
            const forecastContainer = document.getElementById("forecast-result");
            forecastContainer.innerHTML = "";

            forecastContainer.style.display = "flex";
            forecastContainer.style.flexDirection = "column";
            forecastContainer.style.alignItems = "center";

            if (data.error) {
                forecastContainer.innerHTML = `<p style="color:red;">${data.error}</p>`
                return;
            }

            const heading = document.createElement("h3");
            heading.textContent = "Forecast for the next five days";
            heading.style.textAlign = "center";
            forecastContainer.appendChild(heading);

            data.daily.forEach(day =>{
                const date = new Date(day.date);
                const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

                const div = document.createElement("div");
                div.className = "forecast-item";
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.gap = "10px";
                div.style.marginBottom = "8px";

                div.innerHTML = `
                    <p style="width:90px;">${date.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' })}</p>
                    <img style="width:100px; height:100px;" src="${iconUrl}" alt="${day.description}">
                    <p style="margin:0; word-break: break-word; max-width: 16ch;">${Math.round(day.temp_min)}°C – ${Math.round(day.temp_max)}°C, ${day.description}</p>
                `;
                forecastContainer.appendChild(div);

            });
        })

        .catch(err => {
            document.getElementById("forecast-result").innerHTML =
                `<p style="color:red;">Error fetching forecast: ${err}</p>`;
        });
}

function saveFavourite(city) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favourites.includes(city)) {
        favourites.push(city);
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }
}

function getFavourites() {
    return JSON.parse(localStorage.getItem("favourites")) || [];
}

function renderFavourites() {
    const favList = document.getElementById("favourites-list");
    favList.innerHTML = "";

    const favourites = getFavourites();
    favourites.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;

        li.addEventListener("click", () => {
            fetchWeather(city);

        });

        favList.appendChild(li);
    });

}

document.addEventListener("DOMContentLoaded", renderFavourites);
const header = document.getElementById("favourites-header");
const list = document.getElementById("favourites-list");

const favContainer = document.getElementById("favourites-container");
header.addEventListener("click", () => {
    if (list.style.display === "none" || list.style.display === "") {
        list.style.display = "block";
        header.style.display="none";
    } else {
        list.style.display = "none";
        header.style.display="block";
    }

});

document.addEventListener("click", (e) =>{
    if (!favContainer.contains(e.target)) {
        list.style.display = "none";
        header.style.display = "block";
    }
})
