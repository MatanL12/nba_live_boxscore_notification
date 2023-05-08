require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// PUT /auth/signup
exports.putSignup = async (req, res, next) => {
    // const errors = validationResult(req);

    const email = req.body.email;
    const password = req.body.password;
    const firebaseRegistrationToken = req.body.firebaseRegistrationToken;
    //add validate user input
    console.log(req.session);

    try {
      const existUser = await User.findOne({email:email});
      if(existUser) {
        res.status(500).json({ message: 'User already exist!'});
      }

      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPw,
        firebaseRegistrationToken: firebaseRegistrationToken
      });
      const result = await user.save();
      res.status(201).json({ message: 'User created!', userId: result._id });
    }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}

// PUT /auth/login
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const updateFirebaseToken = {
      firebaseRegistrationToken:req.body.firebaseRegistrationToken
    };
    const existUser = await User.findOneAndUpdate({ email: email }, updateFirebaseToken, {
      new: true
    });
    if (!existUser) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, existUser.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: existUser.email,
        userId: existUser._id.toString()
      },
      JWT_HASH,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: existUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
