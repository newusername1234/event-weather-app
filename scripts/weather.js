

const container = document.querySelector(".js-container");

let dateGiven = "2019-12-15 12:00:00"

function extractListforDateGiven() {
    let userInput = document.getElementById("locationInput");
    let cityName = userInput.value;
    let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${weatherAPIKey}`;
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
// console.log(kToF(277.93))

function findWeatherAndTempforDateGiven (dateGiven, newCard) {
    extractListforDateGiven()
    .then(x => {
        for (let item of x) {
            if (item.dt_txt == dateGiven) {
                appendTextToCard(item.weather[0].description, newCard, "h3");
                appendTextToCard(String(kToF(item.main.temp)), newCard, "h4");
                appendImagetoCard("http://openweathermap.org/img/w/" + String(item.weather[0].icon) + ".png", newCard);
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
        appendTextToCard(getDescription(obj), newCard, "h3");
        appendTextToCard(String(getTemperature(obj)), newCard, "h4");
        appendImagetoCard(getIcon(obj), newCard);
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

// findWeatherAndTempforDateGiven(dateGiven);

// function createAndAppendElement(abc) {
//     const h1 = document.createElement("h1");
//     h1.textContent = abc;
//     container.appendChild(h1);
//     return h1;
// }

function showMeTHing(thing) {
    console.log(thing);
    return thing;
}
