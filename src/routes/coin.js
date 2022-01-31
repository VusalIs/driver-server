const express = require('express');
const { protect } = require('../middlewares/protect');
const router = express.Router();
const { addToFavorites, getMyFavorites } = require('../controllers/coinController')


router.post('/add-favorite/:coinId', protect(), addToFavorites);
router.get('/my-favorites', protect(), getMyFavorites);

module.exports = router;
