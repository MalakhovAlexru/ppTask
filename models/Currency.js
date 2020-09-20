const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  Id: {
    type: Types.ObjectId,
  },
  CharCode: {
    type: String,
    required: true,
  },
  NumCode: {
    type: Number,
    required: true,
  },
});

module.exports = model('Currency', schema);
