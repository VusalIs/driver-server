const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema({
  favorites: [{
    type: String,
    default: []
  }],
  user: {
      type: String,
      ref: 'User',
      require: true
  }
});

module.exports = mongoose.model('Favorites', favoritesSchema);
