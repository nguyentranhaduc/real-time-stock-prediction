const brain = require('brain.js');
const scaler = require('minmaxscaler');
const yahooFinance = require('yahoo-finance');

// mảng chứa dữ liệu realtime lấy về
let realtimmeData = [];

// hàm cắt mảng 1 chiều thành 2 chiều
function format(arr) {
  const toReturn = [];
  for (let i = 0; i < arr.length; i += 2) {
    toReturn.push(arr.slice(i, i + 2));
  }
  if (toReturn[toReturn.length - 1].length == 1) {
    const last = toReturn.pop();
    toReturn[toReturn.length - 1].concat(last);
  }
  return toReturn;
}

// hàm chính
exports.calculate = async (req, res, next) => {
  try {
    console.log('-  Bắt đầu tính toán dự báo LSTMs.');

    // lấy symbol, from, to từ request
    const symbol = req.body.symbol;

    const from = new Date(req.body.from).toISOString();

    // ngày hiện tại
    let today = new Date().toISOString();

    while (realtimmeData.length === 0) {
      await yahooFinance.historical(
        {
          symbol: symbol,
          from: from,
          to: today,
        },
        function (err, quotes) {
          realtimmeData = quotes;
        }
      );
    }

    var trainingDataRespond = realtimmeData.map((obj) => {
      let { close, date } = obj;

      date = new Date(date);
      date =
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

      return { close, date };
    });

    let dailyStats = realtimmeData.map((obj) => obj['close']);

    const scaledData = scaler.fit_transform(dailyStats);

    const trainingData = format(scaledData);

    const net = new brain.recurrent.LSTMTimeStep({
      inputSize: 2,
      outputSize: 2,
    });

    await net.train(trainingData, {
      learningRate: 0.005,
      errorThresh: 0.02,
    });

    const theTwoNextDaysPrediction = scaler.inverse_transform(
      await net.run(trainingData)
    );

    const tomorrow = parseFloat(theTwoNextDaysPrediction[0]);
    const theNextDayOfTomorrow = parseFloat(theTwoNextDaysPrediction[1]);

    const arima = {
      trainingData: trainingDataRespond,
      result: {
        tomorrow: tomorrow,
        theNextDayOfTomorrow: theNextDayOfTomorrow,
      },
    };

    console.log('Xong.');

    res.status(200).json(arima);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};
