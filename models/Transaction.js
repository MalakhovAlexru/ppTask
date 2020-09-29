const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  Id: {
    type: Types.ObjectId,
    unique: true,
  },
  customTransId: {
    type: Number,
  },
  date: {
    type: String,
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
});

module.exports = model('Transaction', schema);
