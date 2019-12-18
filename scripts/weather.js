function extractListforLocation(latitude, longitude) { // gets the weather data and returns an array of 40 weather objects
    let userInput = document.getElementById("locationInput");
    let weatherAPIaddress = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${weatherAPIKey}`; // fixes typo issues of user input by checking for exact lat and long of yelp event location
    return fetch(weatherAPIaddress)
    .then(r => r.json())
    .then(extractsList)
    // .then(showMeTHing)
}

function extractsList (obj) { // used to grab objects from openweather array
    return obj.list
}

function kToF (k){ // openweather API returns temp in kelvin. This converts it to fahrenheit
   return parseInt(((k-273.15) * (9/5)) + 32);
}

function findWeatherAndTempforDateGiven (dateGiven, latitude, longitude, newCard) { // grabs weather data and appends it to resultCard
    extractListforLocation(latitude, longitude)
    .then(x => {
        for (let item of x) {
            if (item.dt_txt == dateGiven) { // checks for yelp event date and time to match one of the 40 weather objects date and time
                // newCard.dataAttribute.push(item); // adds data to resultCard dataAttribute for debugging
                appendWeathertoCard(getIcon(item), getDescription(item), getTemperatureString(getTemperature(item)), newCard);
            }
        }
    })  
}

function appendWeathertoCard(str, text, text2, newCard) { // creates div element holding weather data and appends it to resultCard
    let pictureFrame = document.createElement("div");
    pictureFrame.className = "js-iconFrame"; // used for flex sizing icon and css for weather properties
    let imgEl = document.createElement("img");
    imgEl.src = str;
    let h4El = document.createElement("h4");
    h4El.textContent = text;
    let h3El2 = document.createElement("h3");
    h3El2.textContent = text2;
    pictureFrame.appendChild(imgEl);
    pictureFrame.appendChild(h4El);
    pictureFrame.appendChild(h3El2);
    newCard.appendChild(pictureFrame);
}

function getIcon(obj) { // pulls openweathermap's icon source
    let icon = "http://openweathermap.org/img/w/" + String(obj.weather[0].icon) + ".png";
    return icon;
}

function getDescription(obj) { // gets the description and makes it uppercase for design reasons
    let description = obj.weather[0].description;
    return description.toUpperCase();
}

function getTemperature(obj) { // gets temp in F as an int
    return kToF(obj.main.temp);
}

function getTemperatureString(fTemp) { // converts temp in F as an int to string
    return `Temperature: ${fTemp}°F`;
}

function showMeTHing(thing) {
    console.log(thing);
    return thing;
}
