

const container = document.querySelector(".js-container");

function extractListforDateGiven() {
    let userInput = document.getElementById("locationInput");
    let cityName = userInput.value;
    let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${weatherAPIKey}`;
    return fetch(weatherAPIaddress)
    .then(r => r.json())
    .then(extractsList)
    .then(showMeTHing)
}

function extractsList (obj) {
    return obj.list
}

function kToF (k){
   return parseInt(((k-273.15) * (9/5)) + 32);
}

function findWeatherAndTempforDateGiven (dateGiven, newCard) {
    extractListforDateGiven()
    .then(x => {
        for (let item of x) {
            if (item.dt_txt == dateGiven) {
                newCard.dataAttribute.push(item)
                appendTextToCard(item.weather[0].description.toUpperCase(), newCard, "h3");
                appendTextToCard(String(kToF(item.main.temp)), newCard, "h4");
                appendIcontoCard("http://openweathermap.org/img/w/" + String(item.weather[0].icon) + ".png", newCard);
            }
        }
    })  
}

function findCurrentWeather(newCard) {
    let userInput = document.getElementById("locationInput");
    let cityName = userInput.value;
    let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${weatherAPIKey}`;
    fetch(weatherAPIaddress)
    .then(r => r.json())
    .then(function (obj) {
        appendTextToCard(getDescription(obj).toUpperCase(), newCard, "h3");
        appendTextToCard(String(getTemperature(obj)), newCard, "h4");
        appendIcontoCard(getIcon(obj), newCard);
    })
        // .then(showMeTHing)
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
