const yahooFinance = require('yahoo-finance2').default;
const ARIMA = require('arima');

// mảng chứa dữ liệu realtime lấy về
let realtimmeData = [];

// hàm dự đoán với thuật toán ARIMA
const calARIMA = async (trainingData) => {
  const arima = await new ARIMA({
    p: 2,
    d: 1,
    q: 2,
    verbose: false,
  }).train(trainingData);

  // Predict next 1 values
  const [pred, errors] = await arima.predict(1);

  return [pred, errors];
};

// hàm tính toán arima với dữ liệu realtime
exports.calculate = async (req, res, next) => {
  try {
    console.log('-  Bắt đầu tính toán dự báo ARIMA.');

    // lấy symbol từ request
    const symbol = req.body.symbol;

    for (let i = 0; i < 10; i++) {
      const quote = await yahooFinance.quote(symbol);

      realtimmeData.push(quote.regularMarketPrice);
    }

    const arimaResult = await calARIMA(realtimmeData);

    const predict = parseFloat(arimaResult[0], 10);
    const error = parseFloat(arimaResult[1], 10);

    console.log('Xong.');

    let traningDataRespond = realtimmeData;
    realtimmeData = [];

    res.status(200).json({
      trainingData: traningDataRespond,
      result: { predict: predict, error: error },
    });
  } catch (err) {
    // res.status(500).json({ error: 'server error' });
    res.status(500).json({ err });
  }
};
