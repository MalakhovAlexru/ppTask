/**
 * MAIN File of App
 *
 */

const app = require('./app');
const config = require('config');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const port = config.get('port') || 5000;

async function start() {
  try {
    const connection = await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    autoIncrement.initialize(connection);
    app.listen(port, () => console.log(`app has been started on port ${port}`));
  } catch (e) {
    console.log('Server Error', e.message);
  }
}
start();
