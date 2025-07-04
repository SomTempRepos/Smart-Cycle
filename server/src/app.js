const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bikeRoutes = require('./routes/bikeRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', bikeRoutes);

module.exports = app;
