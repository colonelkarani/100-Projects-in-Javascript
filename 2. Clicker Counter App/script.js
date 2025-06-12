let counter = Number(localStorage.getItem("counter")) || 0;
const counterNumber = document.getElementById("counter")
;counterNumber.innerHTML =counter;

let sessionCounter = Number(sessionStorage.getItem("scounter")) || 0;
const sessionNumber = document.getElementById("sCounter")
sessionNumber.innerHTML = sessionCounter;



function addCounter() {
    counter ++;
    localStorage.setItem("counter", counter);
    counterNumber.innerHTML = counter;
}
function saddCounter() {
    sessionCounter++
    sessionStorage.setItem("scounter", sessionCounter);
    sessionNumber.innerHTML = sessionCounter;
}