// DONE: Create a submit button
// DONE: Add event listener to submit button
// DONE: Create function to make getYelpObj a call
// TODO: Update weather function to call only the next 3 hour increment
// TODO: 

createButton();
// creates submit button for html

function createButton() {
    let inputContainer = document.querySelector(".userInput");
    let submitButton = document.createElement("button");
    submitButton.addEventListener("click", submitYelpCall);
    submitButton.textContent = "Submit";
    inputContainer.appendChild(submitButton);
}

function submitYelpCall() {
    let userInput = document.getElementById("locationInput");
    let cityName = userInput.value
    const newUrl = `https://yelp-events-helper.herokuapp.com/${cityName}/${yelpapiKey}/${currentTime}/${endTime}`
    console.log("clicked")
    console.log(cityName)
    console.log(newUrl)
    clearResultContainer();
    getYelpObj(newUrl);
}

function clearResultContainer() {
    let resultContainer = document.querySelector(".js-resultContainer");
    resultContainer.textContent = "";
}