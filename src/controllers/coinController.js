const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Favorites = require('../models/favorites');

//@desc   add coin to user's favorite list
//@route  POST /coin/add-favorite
//@access PRIVATE
exports.addToFavorites = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const coinId = req.params.coinId;
    const dbFavorites = await Favorites.findOne({ user: userId })
    if(dbFavorites.favorites.find(data => data == coinId)) dbFavorites.favorites = dbFavorites.favorites.filter(data => data != coinId)
    else dbFavorites.favorites.push(coinId)
    const result = await Favorites.findOneAndUpdate({ user: userId }, dbFavorites, {new: true} )
    return res.status(200).json(result);
});

//@desc   returns favorite list of the user 
//@route  GET /coin/my-favorites
//@access PRIVATE
exports.getMyFavorites = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const dbFavorites = await Favorites.findOne({ user: userId });

    return res.status(200).json(dbFavorites)
});
