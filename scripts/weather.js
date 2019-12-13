let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/forecast?q=Atlanta&APPID=${weatherAPIKey}`

const container = document.querySelector(".js-container");

let dateGiven = "2019-12-15 12:00:00"

function extractListforDateGiven() {
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
console.log(kToF(277.93))

function findWeatherAndTempforDateGiven (dateGiven) {   
    extractListforDateGiven()
    .then(x => {
        for (let item of x) {
            if (item.dt_txt == dateGiven) {
                createAndAppendElement(item.weather[0].description);
                createAndAppendElement(kToF(item.main.temp));
            }
        }
    })  
}

findWeatherAndTempforDateGiven(dateGiven);

function createAndAppendElement(abc) {
    const h1 = document.createElement("h1");
    h1.textContent = abc;
    container.appendChild(h1);
    return h1;
}

function showMeTHing(thing) {
    console.log(thing);
    return thing;
}