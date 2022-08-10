// require syntax (if your code base does not support imports)
const yahooFinance = require('yahoo-finance2').default; // NOTE the .default

const testing = async () => {
  const quote = await yahooFinance.quote('META');
  // const { regularMarketPrice, currency } = quote;
  // console.log('regularMarketPrice: ', regularMarketPrice);
  // console.log('currency: ', currency);
  // console.log(quote.regularMarketPrice);
  console.log(quote);
};
testing();
