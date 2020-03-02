'use strict'

var apigClient = apigClientFactory.newClient();

// Http.onreadystatechange = (e) => {
//   selectElement.innerHTML = Http.responseText
// }

function submitMe() {
  var selectElement = document.getElementById('date')
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
        console.log(JSON.stringify(result['data']))
        var raw = JSON.stringify(result['data'])
        raw = 25.62050323 * raw - 13.67818969
        raw = 1/(1+Math.pow(Math.E, 0-raw)) * 100
        raw = Math.round(raw)
        selectElement.innerHTML = raw
      }).catch( function(result){
        console.log(result)
        selectElement.innerHTML = result
      });
  
}
