function extractListforDateGiven(latitude, longitude) {
    let userInput = document.getElementById("locationInput");
    let cityName = userInput.value;
    let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${weatherAPIKey}`;
    return fetch(weatherAPIaddress)
    .then(r => r.json())
    .then(extractsList)
    // .then(showMeTHing)
}

function extractsList (obj) {
    return obj.list
}

function kToF (k){
   return parseInt(((k-273.15) * (9/5)) + 32);
}

function findWeatherAndTempforDateGiven (dateGiven, latitude, longitude, newCard) {
    extractListforDateGiven(latitude, longitude)
    .then(x => {
        for (let item of x) {
            if (item.dt_txt == dateGiven) {
                newCard.dataAttribute.push(item);
                appendIcontoCard("http://openweathermap.org/img/w/" + String(item.weather[0].icon) + ".png", item.weather[0].description.toUpperCase(), `Temperature: ${String(kToF(item.main.temp))}°F`, newCard);
            }
        }
    })  
}

function getIcon(obj) {
    let icon = "http://openweathermap.org/img/w/" + String(obj.weather[0].icon) + ".png";
    return icon;
}

function getDescription(obj) {
    let description = obj.weather[0].description;
    return description;
}

function getTemperature(obj) {
    return kToF(obj.main.temp);
}

function showMeTHing(thing) {
    console.log(thing);
    return thing;
}
