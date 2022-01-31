const express = require('express');
const { protect } = require('../middlewares/protect');
const router = express.Router();
const { changeBalance, getBalance, getBalanceCoins, topupBalance } = require('../controllers/infoController');


router.post('/balance', protect(), changeBalance);
router.get('/balance', protect(), getBalance);
router.get('/my-balance', protect(), getBalanceCoins);
router.post('/topup', protect(), topupBalance)

module.exports = router;
