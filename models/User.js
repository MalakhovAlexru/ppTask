const { Schema, model, Types } = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const schema = new Schema({
  Id: {
    type: Types.ObjectId,
    unique: true,
  },
  customUserId: {
    type: Number,
  },
  nickName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  currency: {
    type: Types.ObjectId,
    ref: 'Currency',
  },
  token: {
    type: String,
  },
}).plugin(AutoIncrement, { inc_field: 'customUserId' });

module.exports = model('User', schema);
