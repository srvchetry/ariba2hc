// 

const { default: cds } = require('@sap/cds');
const XMLHttpRequest = require('xhr2');

var data = null;

async function fetchData(apiUrl, serviceName, entityName, mapAttributes) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      handleResponse(this.responseText);
    }
  });

  xhr.open("GET", apiUrl);
  xhr.setRequestHeader("X-ARIBA-NETWORK-ID", "AN02000000280");
  xhr.setRequestHeader("APIKey", "dMqII3LaXJ383kLD6qrzASvqpi6TlgMa");
  xhr.setRequestHeader("DataServiceVersion", "2.0");
  xhr.setRequestHeader("Accept", "application/json");

  // Handle the response
  xhr.onload = async function () {
    if (xhr.status === 200) {
      try {
        const service = await cds.connect.to(serviceName);
        const Entity = service.entities[entityName];

        // Parse the response as JSON
        const apiResponse = JSON.parse(xhr.responseText);

        // Loop through each item in the 'content'
        for (const item of apiResponse.content) {
          const write2HC = UPSERT.into(Entity).entries(mapAttributes(item));
          try {
            const result = await service.run(write2HC);
            console.log(result);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(`Error connecting to service: ${error}`);
      }
    } else {
      console.log(`API request failed with status: ${xhr.status} for ${apiUrl}`);
    }
  };

  // Handle errors
  xhr.onerror = function () {
    console.error(`Error making API request for ${apiUrl}`);
  };

  // Send the request
  xhr.send(data);
}

function mapHeaderAttributes(item) {
  return {
    vendorId: item.vendorId,
    customerName: item.customerName,
    supplierName: item.supplierName,
    documentNumber: item.documentNumber,
  };
}

function mapItemAttributes(item) {
  return {
    documentNumber: item.documentNumber,
    quantity: item.quantity,
    agreementDate: item.agreementDate,
  };
}

function handleResponse(responseText) {
  // Compare the new data with the existing data to detect changes
  if (data !== responseText) {
    console.log("Data has changed:", responseText);
  }

  // Update the stored data for the next comparison
  data = responseText;
}

setInterval(() => fetchData("https://sandbox.api.sap.com/ariba/api/purchase-orders/v1/sandbox/orders", "OrderHeader", "Orders", mapHeaderAttributes), 5000);
setInterval(() => fetchData("https://sandbox.api.sap.com/ariba/api/purchase-orders/v1/sandbox/items", "OrderItem", "Items", mapItemAttributes), 5000);
