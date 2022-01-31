const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
  coinsBalance: [{
    type: Object,
    default: []
  }],
  usdBalance: {
      type: Number,
      default: 0,
  },
  user: {
      type: String,
      ref: 'User',
      require: true
  }
});

module.exports = mongoose.model('Info', infoSchema);
