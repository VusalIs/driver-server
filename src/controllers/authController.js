const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');
const Info = require('../models/info');
const Favorites = require('../models/favorites');

//@desc   registration for users
//@route  POST /auth/register
//@access PUBLIC
exports.createUser = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, username, password, email } = req.body;

    const newUser = new User({
        first_name,
        last_name, 
        username,
        password, 
        email
    });
  
    await newUser.save();
    const favorites = new Favorites({user: newUser.id});
    const info = new Info({user: newUser.id});
    await favorites.save();
    await info.save();
    return res.status(201).json({ success: true, message: 'You successfully created a user!' });
  });

//@desc   login for users
//@route  POST /auth/login
//@access PUBLIC
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('username email password');

  if (!user) {
    return next(new ErrorResponse('Provided email is not correct!', 403));
  }

  const isMatch = user.isMatchedPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect!', 403));
  }

  const token = user.getSignedJWTToken();
  sendTokenInCookie(token, 200, res);
});

// Sent token in cookie
const sendTokenInCookie = (token, statusCode, res, optional) => {
  const options = {
    expires: new Date(Date.now() + 360000000000),
    httpOnly: true,
  };

  const response = {
    success: true,
    message: 'Logged in!',
    optional,
  };


  return res.status(statusCode).cookie('token', token, options).json(response);
};
