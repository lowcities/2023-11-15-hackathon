const API = "AIzaSyCPuBkqpi6Ia0QoMQCUcQq2IU3eIqDMyo0";
const url = "https://maps.googleapis.com/maps/api/geocode/json\?address\=1600+Amphitheatre+Parkway,+Mountain+View,+CA\&key\=";
const axios = require('axios');


const fs = require('fs');
const csvParser = require('csv-parser');

fs.createReadStream('../../driver-partial-geocoded.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    if(row.latitude && row.longitude) {
        console.log(JSON.stringify(row));
    } else {
        let address = [row["Street address"]];
        address.push(row["Apt / Unit #"]);
        address.push(row["City"]);
        address.push(row["State"]);
        address.push(row["Zip code"]);
        
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json\?address\=${address.join(",")}\&key\=${API}`)
  .then(response => {
    // Handle successful response
    
    row.latitude = response.data.results[0].geometry.location.lat;
    row.longitude = response.data.results[0].geometry.location.lng;
    console.log(JSON.stringify(row));
  })
  .catch(error => {
    // Handle error
    console.error('Error:', error);
  });
    }
    
  })
  .on('end', () => {
    console.log('Parsing complete.');
  });

