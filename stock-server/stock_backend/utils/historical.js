const yahooFinance = require('yahoo-finance');

yahooFinance.historical(
  {
    symbol: 'META',
    from: '2022-4-01',
    to: '2022-6-17',
  },
  function (err, quotes) {
    console.log(quotes);
  }
);
