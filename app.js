const express = require('express');
const cors = require('cors');
const authROuts = require('./routes/api/auth.routes');
const transactionRoutes = require('./routes/api/transactions.routes');

const app = express();

app.use(express.json({ extended: true }));

app.use(cors());

app.use('/api/auth', authROuts);
app.use('/api/transaction', transactionRoutes);

module.exports = app;
