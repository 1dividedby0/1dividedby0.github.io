'use strict'

var apigClient = apigClientFactory.newClient();

// Http.onreadystatechange = (e) => {
//   selectElement.innerHTML = Http.responseText
// }

function search() {
  var selectElement = document.getElementById('date');
  selectElement.innerHTML = "Loading...";
  var query = document.getElementById('textfield').value;
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
        var objective = data[0].split("!")
        var subjective = data[1].split("!")
        if (objective.length <= 1 && subjective.length > 1) {
          document.getElementById("container").innerHTML = "<p>No unbiased results found.</p>";
          return;
        } else if (objective.length <= 1) {
          document.getElementById("container").innerHTML = "<p>No results found.</p>";
          return;
        }
        console.log(data)
        var html = "<table><tr>";

        // Loop through array and add table cells
        for (var i=0; i<objective.length; i++) {
          var factors = objective[i].split("&&&")
          var link = factors[0]
          var title = factors[1]
          var rating = factors[2]
          var blank = "target=\"_blank\"";
          html += "<td height=\"25\"><a href=\"" + link + "\" " + blank + ">" + title + " — Bias Level: " + Math.round(rating * 100) + "/100</a></td>";
          // Break into next row
          var next = i+1;
          if (next!=objective.length) {
            html += "</tr><tr>";
          }
        }
        html += "</tr></table>";

        document.getElementById("container").innerHTML = html;

        var subjhtml = "<table><tr>";

        // Loop through array and add table cells
        for (var i=0; i<subjective.length; i++) {
          var factors = subjective[i].split("&&&")
          var link = factors[0]
          var title = factors[1]
          var rating = factors[2]
          var blank = "target=\"_blank\"";
          subjhtml += "<td height=\"25\"><a href=\"" + link + "\" " + blank + ">" + title + " - Bias Level: " + Math.round(rating * 100) + "/100</a></td>";
          // Break into next row
          var next = i+1;
          if (next!=subjective.length) {
            subjhtml += "</tr><tr>";
          }
        }
        subjhtml += "</tr></table>";

        // document.getElementById("container_subj").innerHTML = subjhtml;
        // sentence1.innerHTML = data.split("$$$")[1].split(".")[0]
        // sentence2.innerHTML = data.split("$$$")[1].split(".")[1]
        // sentence3.innerHTML = data.split("$$$")[1].split(".")[2]
        // sentence4.innerHTML = data.split("$$$")[1].split(".")[3]
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
