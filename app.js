'use strict'

var apigClient = apigClientFactory.newClient();

// Http.onreadystatechange = (e) => {
//   selectElement.innerHTML = Http.responseText
// }
var objective = [];
var subjective = [];

function updateTable() {
  var subjcheck = document.getElementById('subjcheckbox').checked;
  var objcheck = document.getElementById('objcheckbox').checked;
  if(objective.length == 0 && subjective.length == 0) {
    return;
  }
  var arr = [];
  if(subjcheck && objcheck) {
    arr = objective.concat(subjective);
  } else if (!subjcheck && objcheck) {
    arr = objective;
  } else if (subjcheck && !objcheck) {
    arr = subjective;
  }

  var selectElement = document.getElementById('date');
  var html = "<table><tr>";

  // Loop through array and add table cells
  for (var i=0; i<arr.length; i++) {
    var factors = arr[i].split("&&&")
    var link = factors[0]
    var title = factors[1]
    var rating = factors[2]
    var blank = "target=\"_blank\"";
    var addition = "<td height=\"25\"><a href=\"" + link + "\" " + blank + ">" + title + " — Bias Level: " + Math.round(rating * 100) + "/100</a></td>";
    if(addition.includes("NaN")) {
      continue;
    }
    html += addition;
    // Break into next row
    var next = i+1;
    if (next!=arr.length) {
      html += "</tr><tr>";
    }
  }
  html += "</tr></table>";

  document.getElementById("container").innerHTML = html;
}

function search() {
  var selectElement = document.getElementById('date');
  
  selectElement.innerHTML = "Loading...";
  var query = document.getElementById('textfield').value.toLowerCase();
  var params = {
    // This is where any modeled request parameters should be added.
    // The key is the parameter name, as it is defined in the API in API Gateway.
    'query': query,
    'cap': 30
  };
  
  var additionalParams = {
    // If there are any unmodeled query parameters or headers that must be
    //   sent with the request, add them here.
    headers: {
      'content-type': 'application/json'
    },
    queryParams: {
      'query': query,
      'cap': 30
    }
  };
  
  var body = {
    // This is where you define the body of the request,
  };
  
  apigClient.classifyGet(params, body, additionalParams)
      .then(function(result){
        selectElement.innerHTML = ""
        var data = JSON.stringify(result['data'])
        data = data.replace("\"", "").split(";;;")
        objective = data[0].split("!")
        subjective = data[1].split("!")
        if (objective.length <= 1 && subjective.length > 1) {
          document.getElementById("container").innerHTML = "<p>No unbiased results found.</p>";
          return;
        } else if (objective.length <= 1) {
          document.getElementById("container").innerHTML = "<p>No results found.</p>";
          return;
        }
        console.log(data)
        updateTable()
        
      }).catch( function(result){
        console.log(result)
        selectElement.innerHTML = "Failed to search query. Please try a different one."
      });
}

function submitMe() {
  var selectElement = document.getElementById('date');
  selectElement.innerHTML = "";
  var sentence1 = document.getElementById('sentence1');
  var sentence2 = document.getElementById('sentence2');
  var sentence3 = document.getElementById('sentence3');
  var sentence4 = document.getElementById('sentence4');
  selectElement.innerHTML = "Checking for Bias...";
  let link = document.getElementById('textfield').value;
  var params = {
    // This is where any modeled request parameters should be added.
    // The key is the parameter name, as it is defined in the API in API Gateway.
    'link': link
  };
  
  var additionalParams = {
    // If there are any unmodeled query parameters or headers that must be
    //   sent with the request, add them here.
    headers: {
      'content-type': 'application/json'
    },
    queryParams: {
      'link': link}
  };
  
  var body = {
    // This is where you define the body of the request,
  };
  
  apigClient.classifyGet(params, body, additionalParams)
      .then(function(result){
        console.log(result['data'])
        var data = JSON.stringify(result['data'])
        console.log(data.split("$$$")[0].substring(1))
        console.log(parseFloat(data.split("$$$")[0]))
        var raw = parseFloat(data.split("$$$")[0].substring(1))
        raw = 25.62050323 * raw - 13.67818969
        raw = 1/(1+Math.pow(Math.E, 0-raw)) * 100
        raw = Math.round(raw)
        selectElement.innerHTML = "Article Subjectivity: " + raw.toString() + "/100"
        // sentence1.innerHTML = data.split("$$$")[1].split(".")[0]
        // sentence2.innerHTML = data.split("$$$")[1].split(".")[1]
        // sentence3.innerHTML = data.split("$$$")[1].split(".")[2]
        // sentence4.innerHTML = data.split("$$$")[1].split(".")[3]
      }).catch( function(result){
        console.log(result)
        selectElement.innerHTML = "Failed to retrieve article, please try a different one."
      });
  
}
