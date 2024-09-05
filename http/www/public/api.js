document.addEventListener('DOMContentLoaded', () => {    
    /*
     *  environment = {
     *    name : "development",
     *    target: "http://dev.socialnetwork.local/api"
     *  }
     */
    if(typeof environment != "undefined") {
        if(environment.name == "development" || environment.name == "test") {
            window.urlApiDev = environment.target;
        } else {
            // environment.name == "production"
            window.urlApiDev = document.location.origin;
        }
    }
    // useful for loading another user's information (only Admin)
    if(apiKey != undefined) {
        loadInfos(); 
    }
});


function loadInfos() {
    const apiUrl =  window.urlApiDev || document.location.origin;

    fetch(`${apiUrl}/api/user/${document.getElementById('username').value}`, {
        'method': 'GET',
        'Content-Type': 'application/json',
        'headers': {
            'api-key': `${apiKey}`
        }
    })
    .then(response => response.json())
    .then(json => {
        // Button only visible to administrator
        if(document.querySelector("#admin-valid-account") != null && json.data.activated == "0") {
            document.querySelector("#admin-valid-account").addEventListener("click", () => {
                // allows you to activate an account
                validAccount();
            });
        }
    })
    .catch(error => console.log(error));
}

function validAccount() {
    const apiUrl =  window.urlApiDev || document.location.origin;
    fetch(`${apiUrl}/api/valid-account/${document.getElementById('username').value}`, {
        'method': 'PUT',
        'Content-Type': 'application/json',
        'headers': {
            'api-key': `${apiKey}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data));
}