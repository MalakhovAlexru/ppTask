const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  // Id: {
  //   type: Types.ObjectId,
  //   // unique: true,
  // },
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
});

module.exports = model('User', schema);
