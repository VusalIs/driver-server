const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Info = require('../models/info');

//@desc   add coin to user's favorite list
//@route  POST /coin/add-favorite
//@access PRIVATE
exports.changeBalance = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let {coinId, amount, action, currentPrice} = req.query;
    amount = parseFloat(amount);
    currentPrice = parseFloat(currentPrice);
    const dbBalance = await Info.findOne({ user: userId});

    if(coinId == 'usd' && action == 'BUY'){
        dbBalance.usdBalance = dbBalance.usdBalance + amount;
        await dbBalance.save()
    } else if(action == 'BUY'){
        if(dbBalance.usdBalance < amount){
            throw new ErrorResponse('Insufficiant Balance', 400);
        }
        const equalance = amount / currentPrice;
        dbBalance.usdBalance = dbBalance.usdBalance - amount;

        if(dbBalance.coinsBalance.filter(coin => coin.coinId == coinId).length == 0){
            dbBalance.coinsBalance.push({ coinId, amount: equalance});
        }else{
            dbBalance.coinsBalance.forEach(element => {
                if(element.coinId == coinId){
                    element.amount = element.amount + equalance
                }
            });
        }
        dbBalance.markModified('coinsBalance')

        await dbBalance.save();
    } else if(action == 'SELL'){
        const coinData = dbBalance.coinsBalance.filter(coin => coin.coinId == coinId)[0];
        if(!coinData || coinData.amount < amount){
            throw new ErrorResponse('Insufficiant Balance', 400);
        }

        const equalance = amount * currentPrice;
        console.log(dbBalance)
        console.log(equalance)
        dbBalance.usdBalance = dbBalance.usdBalance + equalance;
        dbBalance.coinsBalance.forEach(element => {
            if(element.coinId == coinId){
                element.amount = element.amount - amount;
            }
        })

        dbBalance.markModified('coinsBalance')
        dbBalance.markModified('usdBalance')
        await dbBalance.save();
    }

    const coinBalance = dbBalance.coinsBalance.filter(coin => coin.coinId == coinId)[0]
    return res.status(200).json({ usdBalance: dbBalance.usdBalance, coinBalance: coinBalance ? coinBalance : 0});
});

//@desc   returns favorite list of the user 
//@route  GET /coin/my-favorites
//@access PRIVATE
exports.topupBalance = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let {amount} = req.query;
    amount = parseFloat(amount);
    const dbBalance = await Info.findOne({ user: userId});

    dbBalance.usdBalance = dbBalance.usdBalance + amount;
    await dbBalance.save()

    return res.status(200).json(dbBalance);
});

//@desc   returns favorite list of the user 
//@route  GET /coin/my-favorites
//@access PRIVATE
exports.getBalance = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const {coinId} = req.query;

    const dbBalance = await Info.findOne({ user: userId });
    const coinBalance = dbBalance.coinsBalance.filter(coin => coin.coinId == coinId)[0]
    
    return res.status(200).json({ usdBalance: dbBalance.usdBalance, coinBalance: coinBalance ? coinBalance : 0})
});

//@desc   returns favorite list of the user 
//@route  GET /coin/my-favorites
//@access PRIVATE
exports.getBalanceCoins = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const dbBalance = await Info.findOne({ user: userId });

    return res.status(200).json(dbBalance)
});
