const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authROuts = require('./routes/api/auth.routes');
const transactionRoutes = require('./routes/api/transactions.routes');
const app = express();

app.use(express.json({ extended: true }));

app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authROuts);
app.use('/transaction', transactionRoutes);

module.exports = app;
