function getDate() { // gets current date in ISO format
    const today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //add one to getMonth because it pulls months 0-11
    return date;
}

function getYelpObj(newUrl) { // does most of the work of the website. Creates cards from yelp obj
    fetch(newUrl)
        .then(r => r.json())
        .then(clearResultContainer)
        // .then(showMeThing)
        .then(addCardsToResultBox)
}

function addCardsToResultBox(array) { // adds cards, and if no results, displays it
    if (array.length === 0) {
        ifNoResults();
    } else {
        array.forEach(createCard);
    }
}

function getCurrentTimeString() { // gets ISO formatted current time
    let today1 = new Date();
    let hours = String(today1.getHours());
    let minutes = today1.getMinutes();
    if (minutes < 10) { // gets format correct for ISO date
        minutes = "0" + String(minutes);
    } else {
        minutes = String(minutes);
    }
    return hours + ":" + minutes;
}

function createCard(obj) { // does most of the work of the website by creating cards from data
    if ((extractDate(obj) === getDate()) && (extractTime(obj) < getCurrentTimeString())) { // if current time is past event start time, it doesn't create a card for event
        return
    }
    let resultContainer = document.querySelector(".js-resultContainer");
    let newCard = document.createElement('div');
    newCard.className = "js-resultCard";
    newCard.dataAttribute = [obj]; // gives ability to debug by adding data to card
    newCard.addEventListener("click", r => console.log(r.currentTarget.dataAttribute)); // adds debugging ability to click on card to see data
    findWeatherAndTempforDateGiven(getDateString(obj), extractLatitude(obj), extractLongitude(obj), newCard); // adds icon, weather description, and temp
    appendImagetoCard(extractImage(obj), newCard); // adds image
    appendTextToCard(extractName(obj), newCard, "h1"); // adds ID
    if (extractName(obj).length > 35) {
        newCard.children[1].style.fontSize = "20px"; // Keeps h1 headers from being too big by changing the text size if over a certain character length
    }
    appendTextToCard(extractDescription(obj), newCard, "p"); // adds description
    appendTextToCard(extractCost(obj), newCard, "li"); // adds cost
    appendTextToCard(`Date: ${extractDate(obj)}`, newCard, "li"); // adds date
    appendTextToCard(`Time: ${timeConvert(extractTime(obj))}`, newCard, "li"); // adds start time
    appendTextToCard(`Address: ${extractLocation(obj)}`, newCard, "li"); // adds address
    appendLinktoCard(extractLink(obj), newCard); // adds more info link
    resultContainer.appendChild(newCard);
    return obj;
}

function extractImage(obj) {
    return obj["image_url"];
}

function showMeThing (obj) { // used for debugging fetch requests
    console.log(obj);
    return obj;
}

function appendImagetoCard(str, newCard) {
    let pictureFrame = document.createElement("div");
    pictureFrame.className = "js-pictureFrame"; // used for flex sizing images
    let imgEl = document.createElement("img");
    if (str === "") {
        imgEl.src = "./images/no-image.jpg"; // adds basic filler image if no image provided
    } else {
        imgEl.src = str;
    }
    pictureFrame.appendChild(imgEl);
    newCard.appendChild(pictureFrame);
}

function extractName(obj) {
    return obj.name;
}

function appendTextToCard(str, newCard, type) {
    let typeThing = document.createElement(type);
    typeThing.textContent = str;
    newCard.appendChild(typeThing);
}

function extractDescription(obj) {
    return obj.description
}

function extractCost(obj) {
    if (obj.cost) {
        return `Cost: $${obj.cost}`;
    } else if (obj.is_free) { // if no cost provided and event is free, cost is free, otherwise no cost
        return "Cost: Free";
    }
}

function extractDate(obj) {
    let date = getDate();
    let objDate = obj.time_start;
    objDate = objDate.slice(0, 10);
    if (objDate < date) {
        return date;
    } else {
        return objDate;
    }
}

function extractLatitude(obj) {
    return obj.latitude;
}

function extractLongitude(obj) {
    return obj.longitude;
}

function extractTime(obj) {
    let time = obj.time_start;
    time = time.slice(11, 19);
    return time;
}

function extractTimeForWeather(obj) { // used slightly differently than extractTime due to UTC time requirements of openweather API (converts yelp time to utc time)
    let objTime = obj.time_start;
    let unconvertedTime = objTime.slice(11, 19);
    let timeConverted = parseInt(objTime.slice(19, 22));
    let unconvertedTimeNum = parseInt(unconvertedTime.slice(0,2));
    unconvertedTimeNum = unconvertedTimeNum - timeConverted;
    return String(unconvertedTimeNum) + objTime.slice(13,19);
}

function timeConvert(time) { // used to format time strings for display
    let hours = time.substr(0, 2);
    let convertedHours = hours % 12 || 12;
    let ampm = (hours < 12 || hours == 24) ? "AM" : "PM";
    time = convertedHours + time.substr(2, 3) + ampm;
    return time;
}

function extractLocation(obj) {
    let objLocation = obj.location;
    let state = convertZipcodeToState(objLocation.zip_code); // no states are provided in yelp data
    let line1 = objLocation.address1;
    let line2 = `${objLocation.city}, ${state} ${objLocation.zip_code}`
    let location = `${line1}
${line2}`
    return location;
}

function getDateString(obj) { // used to convert dates and times from yelp start time data to something that matches openweather API datetimes (every three hours and UTC)
    let date = extractDate(obj);
    let hours = extractTimeForWeather(obj);
    if (hours > "21:00:00") { // anything after 21:00:00 is converted to the next day's 00:00:00 weather forecast per below
        if (hours < "24:00:00") { // catches anything between 21:00:00 and 24:00:00 to make it 00:00:00 for next day
            hours = "24:00:00";
        }
        date = addDays(date, 1).toISOString().slice(0,10); // adds one day to the date and converts it to usable format
        let hoursNum = parseInt(hours.slice(0,3));
        hoursNum = hoursNum % 24; // converts utc times that are greater than 24:00:00 
        hours = "0" + String(hoursNum) + hours.slice(2); // brings it all back together into usable format
    } // below converts everything in between 3 hour time segments to the next 3 hour time segment
    if (hours <= "03:00:00") {
        date += " 03:00:00";
    } else if (hours <= "06:00:00") {
        date += " 06:00:00";
    } else if (hours <= "09:00:00") {
        date += " 09:00:00";
    } else if (hours <= "12:00:00") {
        date += " 12:00:00";
    } else if (hours <= "15:00:00") {
        date += " 15:00:00";
    } else if (hours <= "18:00:00") {
        date += " 18:00:00";
    } else if (hours <= "21:00:00") {
        date += " 21:00:00";
    }
    return date;
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days); // changes the day of the month by however many days it needs to be modified
    return result;
}

function extractLink(obj) {
    return obj.event_site_url;
}

function appendLinktoCard(url, newCard) {
    let link = document.createElement("a");
    link.textContent = "Click here for more info"
    link.href = url;
    link.target = "_blank";
    newCard.appendChild(link);
}


function convertZipcodeToState(zipcode) { // used in extractLocation() since yelp data doesn't include state
    // copied from https://stackoverflow.com/questions/28821804/how-can-i-quickly-determine-the-state-for-a-given-zipcode
    const thiszip = parseInt(zipcode, 10);
    let st;
    let state;
    if (thiszip >= 35000 && thiszip <= 36999) {
        st = 'AL';
        state = 'Alabama';
        }
    else if (thiszip >= 99500 && thiszip <= 99999) {
        st = 'AK';
        state = 'Alaska';
        }
    else if (thiszip >= 85000 && thiszip <= 86999) {
        st = 'AZ';
        state = 'Arizona';
        }
    else if (thiszip >= 71600 && thiszip <= 72999) {
        st = 'AR';
        state = 'Arkansas';
        }
    else if (thiszip >= 90000 && thiszip <= 96699) {
        st = 'CA';
        state = 'California';
        }
    else if (thiszip >= 80000 && thiszip <= 81999) {
        st = 'CO';
        state = 'Colorado';
        }
    else if (thiszip >= 6000 && thiszip <= 6999) {
        st = 'CT';
        state = 'Connecticut';
        }
    else if (thiszip >= 19700 && thiszip <= 19999) {
        st = 'DE';
        state = 'Delaware';
        }
    else if (thiszip >= 32000 && thiszip <= 34999) {
        st = 'FL';
        state = 'Florida';
        }
    else if (thiszip >= 30000 && thiszip <= 31999) {
        st = 'GA';
        state = 'Georgia';
        }
    else if (thiszip >= 96700 && thiszip <= 96999) {
        st = 'HI';
        state = 'Hawaii';
        }
    else if (thiszip >= 83200 && thiszip <= 83999) {
        st = 'ID';
        state = 'Idaho';
        }
    else if (thiszip >= 60000 && thiszip <= 62999) {
        st = 'IL';
        state = 'Illinois';
        }
    else if (thiszip >= 46000 && thiszip <= 47999) {
        st = 'IN';
        state = 'Indiana';
        }
    else if (thiszip >= 50000 && thiszip <= 52999) {
        st = 'IA';
        state = 'Iowa';
        }
    else if (thiszip >= 66000 && thiszip <= 67999) {
        st = 'KS';
        state = 'Kansas';
        }
    else if (thiszip >= 40000 && thiszip <= 42999) {
        st = 'KY';
        state = 'Kentucky';
        }
    else if (thiszip >= 70000 && thiszip <= 71599) {
        st = 'LA';
        state = 'Louisiana';
        }
    else if (thiszip >= 3900 && thiszip <= 4999) {
        st = 'ME';
        state = 'Maine';
        }
    else if (thiszip >= 20600 && thiszip <= 21999) {
        st = 'MD';
        state = 'Maryland';
        }
    else if (thiszip >= 1000 && thiszip <= 2799) {
        st = 'MA';
        state = 'Massachusetts';
        }
    else if (thiszip >= 48000 && thiszip <= 49999) {
        st = 'MI';
        state = 'Michigan';
        }
    else if (thiszip >= 55000 && thiszip <= 56999) {
        st = 'MN';
        state = 'Minnesota';
        }
    else if (thiszip >= 38600 && thiszip <= 39999) {
        st = 'MS';
        state = 'Mississippi';
        }
    else if (thiszip >= 63000 && thiszip <= 65999) {
        st = 'MO';
        state = 'Missouri';
        }
    else if (thiszip >= 59000 && thiszip <= 59999) {
        st = 'MT';
        state = 'Montana';
        }
    else if (thiszip >= 27000 && thiszip <= 28999) {
        st = 'NC';
        state = 'North Carolina';
        }
    else if (thiszip >= 58000 && thiszip <= 58999) {
        st = 'ND';
        state = 'North Dakota';
        }
    else if (thiszip >= 68000 && thiszip <= 69999) {
        st = 'NE';
        state = 'Nebraska';
        }
    else if (thiszip >= 88900 && thiszip <= 89999) {
        st = 'NV';
        state = 'Nevada';
        }
    else if (thiszip >= 3000 && thiszip <= 3899) {
        st = 'NH';
        state = 'New Hampshire';
        }
    else if (thiszip >= 7000 && thiszip <= 8999) {
        st = 'NJ';
        state = 'New Jersey';
        }
    else if (thiszip >= 87000 && thiszip <= 88499) {
        st = 'NM';
        state = 'New Mexico';
        }
    else if (thiszip >= 10000 && thiszip <= 14999) {
        st = 'NY';
        state = 'New York';
        }
    else if (thiszip >= 43000 && thiszip <= 45999) {
        st = 'OH';
        state = 'Ohio';
        }
    else if (thiszip >= 73000 && thiszip <= 74999) {
        st = 'OK';
        state = 'Oklahoma';
        }
    else if (thiszip >= 97000 && thiszip <= 97999) {
        st = 'OR';
        state = 'Oregon';
        }
    else if (thiszip >= 15000 && thiszip <= 19699) {
        st = 'PA';
        state = 'Pennsylvania';
        }
    else if (thiszip >= 300 && thiszip <= 999) {
        st = 'PR';
        state = 'Puerto Rico';
        }
    else if (thiszip >= 2800 && thiszip <= 2999) {
        st = 'RI';
        state = 'Rhode Island';
        }
    else if (thiszip >= 29000 && thiszip <= 29999) {
        st = 'SC';
        state = 'South Carolina';
        }
    else if (thiszip >= 57000 && thiszip <= 57999) {
        st = 'SD';
        state = 'South Dakota';
        }
    else if (thiszip >= 37000 && thiszip <= 38599) {
        st = 'TN';
        state = 'Tennessee';
        }
    else if ( (thiszip >= 75000 && thiszip <= 79999) || (thiszip >= 88500 && thiszip <= 88599) ) {
        st = 'TX';
        state = 'Texas';
        }
    else if (thiszip >= 84000 && thiszip <= 84999) {
        st = 'UT';
        state = 'Utah';
        }
    else if (thiszip >= 5000 && thiszip <= 5999) {
        st = 'VT';
        state = 'Vermont';
        }
    else if (thiszip >= 22000 && thiszip <= 24699) {
        st = 'VA';
        state = 'Virgina';
        }
    else if (thiszip >= 20000 && thiszip <= 20599) {
        st = 'DC';
        state = 'Washington DC';
        }
    else if (thiszip >= 98000 && thiszip <= 99499) {
        st = 'WA';
        state = 'Washington';
        }
    else if (thiszip >= 24700 && thiszip <= 26999) {
        st = 'WV';
        state = 'West Virginia';
        }
    else if (thiszip >= 53000 && thiszip <= 54999) {
        st = 'WI';
        state = 'Wisconsin';
        }
    else if (thiszip >= 82000 && thiszip <= 83199) {
        st = 'WY';
        state = 'Wyoming';
        }
    else {
        st = 'none';
        state = 'none';
    }

    return st;
}