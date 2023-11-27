// JavaScript Code Sample from API documentation used for this implementation

const { default: cds } = require('@sap/cds');
const XMLHttpRequest = require('xhr2');

var data = null;

function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      handleResponse(this.responseText);
    }
  });

  xhr.open("GET", "https://sandbox.api.sap.com/ariba/api/purchase-orders/v1/sandbox/orders");
  xhr.setRequestHeader("X-ARIBA-NETWORK-ID", "AN02000000280");
  xhr.setRequestHeader("APIKey", "dMqII3LaXJ383kLD6qrzASvqpi6TlgMa");
  xhr.setRequestHeader("DataServiceVersion", "2.0");
  xhr.setRequestHeader("Accept", "application/json");

  // Handle the response
xhr.onload = async function () {
  if (xhr.status === 200) {
    const service = await cds.connect.to("CatalogService");
    const { Orders } = service.entities;
    // Parse the response as JSON
    const apiResponse = JSON.parse(xhr.responseText);

    // Loop through each item in the 'content'
    apiResponse.content.forEach(async item => {
      const write2HC = UPSERT.into(Orders).entries(
        {
          vendorId: item.vendorId,
          customerName: item.customerName,
          supplierName: item.supplierName,
          documentNumber: item.documentNumber,

        })
      try {
        const orders = await service.run(write2HC);
        console.log(orders);
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    console.log('API request failed with status:', xhr.status);
  }
};
// Handle errors
xhr.onerror = function () {
  console.error('Error making API request');
};
// Send the request
xhr.send(data);
}

function handleResponse(responseText) {
  // Compare the new data with the existing data to detect changes
  if (data !== responseText) {
    console.log("Data has changed:", responseText);
  }

  // Update the stored data for the next comparison
  data = responseText;
}
setInterval(fetchData, 5000);
fetchData();
