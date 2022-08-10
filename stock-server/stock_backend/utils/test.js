const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://yh-finance.p.rapidapi.com/auto-complete',
  params: { q: 'tesla', region: 'US' },
  headers: {
    'X-RapidAPI-Key': 'f516e6ea81mshc8dc80fa5439614p12193djsnbdf659c8d2f8',
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
