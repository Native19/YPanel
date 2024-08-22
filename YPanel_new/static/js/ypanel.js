//TODO: refactor this bullshit
let earthOnBtn =  document.getElementById("earthOn");
let earthOffBtn =  document.getElementById("earthOff");

let hallOnBtn = document.getElementById("hallOn");
let hallOffBtn = document.getElementById("hallOff");
let hallResponseField = document.getElementById("hall");

let aquaOnBtn = document.getElementById("aquaOn");
let aquaOffBtn = document.getElementById("aquaOff");
let aquaResponseField = document.getElementById("aqua");

let allOn = document.getElementById("allOn");
let allOff = document.getElementById("allOff");

let switchHallOn = function () {
    hallOnBtn.className = "uk-button uk-button-secondary uk-active";
    hallOffBtn.className = "uk-button uk-button-danger"
};

let switchHallOff = function () {
    hallOnBtn.className = "uk-button uk-button-secondary";
    hallOffBtn.className = "uk-button uk-button-danger uk-active"
};

let switchHallInactive = function () {
    hallOnBtn.className = "uk-button uk-button-secondary";
    hallOffBtn.className = "uk-button uk-button-danger"
};

let switchAquaOn = function () {
    aquaOnBtn.className = "uk-button uk-button-secondary uk-active";
    aquaOffBtn.className = "uk-button uk-button-danger"
};

let switchAquaOff = function () {
    aquaOnBtn.className = "uk-button uk-button-secondary";
    aquaOffBtn.className = "uk-button uk-button-danger uk-active"
};

let switchAquaInactive = function () {
    aquaOnBtn.className = "uk-button uk-button-secondary";
    aquaOffBtn.className = "uk-button uk-button-danger"
};

let switchEarthOn = function () {
    earthOnBtn.className = "uk-button uk-button-secondary uk-active";
    earthOffBtn.className = "uk-button uk-button-danger"
};

let switchEarthOff = function () {
    earthOnBtn.className = "uk-button uk-button-secondary";
    earthOffBtn.className = "uk-button uk-button-danger uk-active"
};

let getHallRelayStatus = function () {
    let responseField = document.getElementById("hall");

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                //Response is empty. Relay doesn't respond
                responseField.className = "uk-animation-slide-left";
                responseField.innerText = "Реле не отвечает. Пробую переподключиться..";
                //Retry after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            } else {
                responseField.innerText = request.status + ': ' + request.statusText;
            }

        } else {
            responseField.innerText = "ONLINE";
            //1 - on, 0 - off. Change buttons
            if (request.responseText === "1") {
                switchHallOn()
            } else if (request.responseText === "0") {
                switchHallOff()
            } else {
                responseField.innerText = "Реле не отвечает. Пробую переподключиться.. " + request.responseText;
                //Retry after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            }
        }
    };
    //Loading, waiting for response
    //TODO: animation on loading
    switchHallInactive();
    responseField.innerHTML = "<a href=\"http://192.168.100.249/\" target=\"_blank\">OFFLINE</a>";

    request.open("GET", "/hallRelayStatus", true);
    request.send()
};

let getAquaRelayStatus = function () {
    let responseField = document.getElementById("aqua");

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                //Response is empty. Relay doesn't respond
                responseField.innerText = "Реле не отвечает. Пробую переподключиться..";
                //Retry after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            } else {
                responseField.innerText = request.status + ': ' + request.statusText;
            }

        } else {
            responseField.innerText = "ONLINE";
            //1 - on, 0 - off. Change buttons
            if (request.responseText === "1") {
                switchAquaOn()
            } else if (request.responseText === "0") {
                switchAquaOff()
            } else {
                responseField.innerText = "Реле не отвечает. Пробую переподключиться.. " + request.responseText;
                //Retry after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            }
        }
    };
    //Loading, waiting for response
    //TODO: animation on loading
    switchAquaInactive();
    responseField.innerHTML = "<a href=\"http://192.168.100.3/\" target=\"_blank\">OFFLINE</a>";

    request.open("GET", "/aquaRelayStatus", true);
    request.send()
};

let switchEarthButtons = function () {
    //Store conditions in array
    let statesMap =[];
    //Fill array with conditions
    for (let i = 95; i <= 99; i++) {
        let state = document.getElementById(i).innerText;
        if ( (state === "on") || (state === "eco") ) {
            statesMap.push("on")
        } else if ( (state === "ready") || (state === "conditioning") || (state === "standby") ) {
            statesMap.push("off")
        } else {
            statesMap.push("change")
        }
    }
    //If all elements are on/off/change, switch buttons
    if (statesMap.every(function (v) {return v === "on"})) {
        switchEarthOn()
    } else if (statesMap.every(function (v) {return v === "off"})) {
        switchEarthOff()
    } else {
        earthOnBtn.className = "uk-button uk-button-secondary";
        earthOffBtn.className = "uk-button uk-button-danger"
    }
};

//When DOM loads, get hall relay status and switch buttons
document.addEventListener("DOMContentLoaded", function () {
    switchEarthButtons();
    getHallRelayStatus();
    getAquaRelayStatus()
});

earthOnBtn.onclick = function () {
    let request = new XMLHttpRequest();
    request.open("GET", "/turnOn", true);
    request.send();
    switchEarthOn();
    //Refresh page after 2 seconds
    setTimeout(function() {
        document.location.reload();
    }, 2000);
};

earthOffBtn.onclick = function () {
    let request = new XMLHttpRequest();
    request.open("GET", "/turnOff", true);
    request.send();
    switchEarthOff();
    //Refresh page after 2 seconds
    setTimeout(function() {
        document.location.reload();
    }, 2000);
};

hallOnBtn.onclick = function () {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                hallResponseField.innerText = "Реле не отвечает. Переподключаюсь..";
                //Get status after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            } else {
                hallResponseField.innerText = request.status + ': ' + request.statusText;
            }
        } else {
            if (request.responseText === "DONE") {
                hallResponseField.innerText = "ON: DONE";
                switchHallOn();
            } else {
                hallResponseField.innerText = "Реле не отвечает. Переподключаюсь.. " + request.responseText;
                //Get status after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            }
        }
    };
    //Loading
    switchHallInactive();

    request.open("GET", "/hallRelayOn", true);
    request.send();
};

hallOffBtn.onclick = function () {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                hallResponseField.innerText = "Реле не отвечает. Переподключаюсь..";
                //Get status after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            } else {
                hallResponseField.innerText = request.status + ': ' + request.statusText;
            }
        } else {
            if (request.responseText === "DONE") {
                hallResponseField.innerText = "OFF: DONE";
                switchHallOff();
            } else {
                hallResponseField.innerText = "Реле не отвечает. Переподключаюсь.. " + request.responseText;
                //Get status after 3 seconds
                setTimeout(getHallRelayStatus, 3000);
            }
        }
    };
    //Loading
    switchHallInactive();

    request.open("GET", "/hallRelayOff", true);
    request.send()
};

aquaOnBtn.onclick = function () {
    let responseField = document.getElementById("aqua");

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                responseField.innerText = "Реле не отвечает. Переподключаюсь..";
                //Get status after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            } else {
                responseField.innerText = request.status + ': ' + request.statusText;
            }
        } else {
            if (request.responseText === "DONE") {
                responseField.innerText = "ON: DONE";
                switchAquaOn();
            } else {
                responseField.innerText = "Реле не отвечает. Переподключаюсь.. " + request.responseText;
                //Get status after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            }
        }
    };
    //Loading
    switchAquaInactive();

    request.open("GET", "/aquaRelayOn", true);
    request.send();
};

aquaOffBtn.onclick = function () {
    let responseField = document.getElementById("aqua");

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            if (request.status === 0) {
                responseField.innerText = "Реле не отвечает. Переподключаюсь..";
                //Get status after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            } else {
                responseField.innerText = request.status + ': ' + request.statusText;
            }
        } else {
            if (request.responseText === "DONE") {
                responseField.innerText = "OFF: DONE";
                switchAquaOff();
            } else {
                responseField.innerText = "Реле не отвечает. Переподключаюсь.. " + request.responseText;
                //Get status after 3 seconds
                setTimeout(getAquaRelayStatus, 3000);
            }
        }
    };
    //Loading
    switchAquaInactive();

    request.open("GET", "/aquaRelayOff", true);
    request.send();
};

allOn.onclick = function () {
    aquaOnBtn.click();
    hallOnBtn.click();
    earthOnBtn.click()
};

allOff.onclick = function () {
    aquaOffBtn.click();
    hallOffBtn.click();
    earthOffBtn.click()
};

//Listen for SSE responses
let eventSource = new EventSource("/sse");
eventSource.onmessage = function (event) {
    let response = JSON.parse(event.data);
    let responseField = document.getElementById(response.Ip);
    responseField.className = "uk-animation-slide-left";
    responseField.textContent = response.Message;
    switchEarthButtons()
};