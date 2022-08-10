const yahooFinance = require('yahoo-finance2').default;

const regression = require('regression');

// mảng chứa dữ liệu realtime lấy về
let realtimmeData = [];

exports.calculate = async (req, res, next) => {
  try {
    console.log('-  Bắt đầu tính toán dự báo Linear Regression.');

    // lấy symbol từ request
    const symbol = req.body.symbol;

    for (let i = 0; i < 10; i++) {
      const quote = await yahooFinance.quote(symbol);

      const x = quote.regularMarketChange;
      const y = quote.regularMarketPrice;

      const dataChunk = [x, y];

      realtimmeData.push(dataChunk);
    }

    const result = regression.linear(realtimmeData);

    const trainDT = result.points.map((array) => {
      return {
        change: parseFloat(array[0]),
        price: parseFloat(array[1]),
      };
    });

    const model = result.string;
    const m = parseFloat(result.equation[0]);
    const c = parseFloat(result.equation[1]);

    // console.log('Hồi quy tuyến tính đơn biến ', result);

    console.log('Xong.');
    realtimmeData = [];

    res.status(200).json({
      trainingData: trainDT,
      m: m,
      c: c,
      model: model,
    });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};
