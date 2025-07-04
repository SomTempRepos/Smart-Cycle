const express = require('express');
const router = express.Router();
const { receiveData, getCurrentSession, getHistoricData } = require('../controllers/bikeController');

// Route for ESP32 to POST data
router.post('/bike/data', receiveData);

// Route for frontend to GET current-session data
router.get('/bike/:bikeId', getCurrentSession);

// Route for frontend to GET historic data
router.get('/bike/:bikeId/historic', getHistoricData);

module.exports = router;
