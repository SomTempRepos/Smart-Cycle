const express = require('express');
const router = express.Router();

const bikeRoutes = require('./bikeRoutes');

router.use('/bike', bikeRoutes);

module.exports = router;
