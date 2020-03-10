'use strict'

var apigClient = apigClientFactory.newClient();

// Http.onreadystatechange = (e) => {
//   selectElement.innerHTML = Http.responseText
// }

function submitMe() {
  var selectElement = document.getElementById('date');
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
        var data = JSON.stringify(result['data'])
        console.log(data.split("$$$")[0].substring(1))
        console.log(parseFloat(data.split("$$$")[0]))
        var raw = parseFloat(data.split("$$$")[0].substring(1))
        raw = 25.62050323 * raw - 13.67818969
        raw = 1/(1+Math.pow(Math.E, 0-raw)) * 100
        raw = Math.round(raw)
        selectElement.innerHTML = "Article Subjectivity: " + raw.toString() + "/100"
        sentence1.innerHTML = data.split("$$$")[1].split(".")[0]
        sentence2.innerHTML = data.split("$$$")[1].split(".")[1]
        sentence3.innerHTML = data.split("$$$")[1].split(".")[2]
        sentence4.innerHTML = data.split("$$$")[1].split(".")[3]
      }).catch( function(result){
        console.log(result)
        selectElement.innerHTML = result
      });
  
}
