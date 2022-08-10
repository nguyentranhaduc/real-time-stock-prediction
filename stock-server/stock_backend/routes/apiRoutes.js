const express = require('express');

const router = express.Router();

const arimaController = require('../controllers/arimaController');
const lstmsController = require('../controllers/lstmsController');
const linearRegressionController = require('../controllers/linearRegressionController');

router.post('/arima', arimaController.calculate);
router.post('/lstms', lstmsController.calculate);
router.post('/linearRegresssion', linearRegressionController.calculate);

module.exports = router;
