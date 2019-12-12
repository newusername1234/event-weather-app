// console.log(apiKey);
let cityName = "Atlanta"
const url = `https://yelp-events-helper.herokuapp.com/${cityName}/${apiKey}`
const today = new Date();
let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //add one to getMonth because it pulls months 0-11

function getYelpObj() {
    fetch(url)
        .then(r => r.json())
        .then()
}

function createCard() {
    let resultContainer = document.querySelector(".js-resultContainer");
    let newCard = document.createElement('div');
    resultContainer.appendChild(newCard);
}

let obj = {
attending_count: 96,
business_id: "twelve-eighty-atlanta-2",
category: "nightlife",
cost: null,
cost_max: null,
description: "Dodge the heat and cool off at this season's swanky Yelp soiree at Table 1280! ↵↵This is a party open to all yelpers, so RSVP now for A Midsummer Night's...",
event_site_url: "https://www.yelp.com/events/atlanta-a-midsummer-nights-yelp-party?adjust_creative=5p_ZUsIFmlTGsyt9YVdOsg&utm_campaign=yelp_api_v3&utm_medium=api_v3_event_search&utm_source=5p_ZUsIFmlTGsyt9YVdOsg",
id: "atlanta-a-midsummer-nights-yelp-party",
image_url: "https://s3-media4.fl.yelpcdn.com/ephoto/GngwFJBooOrJDVKz6UEsSg/o.jpg",
interested_count: 21,
is_canceled: false,
is_free: true,
is_official: false,
latitude: 33.789483,
location: {address1: "1280 Peachtree St NE", address2: "", address3: "", city: "Atlanta", zip_code: "30309"},
longitude: -84.385685,
name: "A Midsummer Night's Yelp Party!",
tickets_url: "",
time_end: "2008-07-17T21:30:00-04:00",
time_start: "2008-07-17T19:30:00-04:00",
__proto__: Object,
}

function extractImage(obj) {
    return obj["image_url"];
}

function extractID(obj) {
    return obj.id;
}

function extractDescription(obj) {
    return obj.description
}

function extractCost(obj) {
    if (obj.cost) {
        return obj.cost;
    } else {
        return "Unknown";
    }
}

function extractDate(obj) {
    let objDate = obj.time_start;
    objDate = objDate.slice(0, 10);
    if (objDate < date) {
        return date;
    } else {
        return objDate;
    }
}

function extractLocation(obj) {
    let objLocation = obj.location;
    let cityName = stuff;

}

// console.log(extractDate(obj));





