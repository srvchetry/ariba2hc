// JavaScript Code Sample from API documentation used for this implementation

const { default: cds } = require('@sap/cds');
const XMLHttpRequest = require('xhr2');

// API end-point deifintion
const apiUrl = 'https://sandbox.api.sap.com/ariba/api/purchase-orders/v1/sandbox/orders';

// Create a new XHR object
const xhr = new XMLHttpRequest();

// Set up the request
xhr.open('GET', apiUrl, true);
//Add request headers
xhr.setRequestHeader("X-ARIBA-NETWORK-ID", "AN02000000280"); // ANID from step 1
xhr.setRequestHeader("APIKey", "dMqII3LaXJ383kLD6qrzASvqpi6TlgMa"); // API Key from step 1
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
xhr.send();