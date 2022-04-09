const { Router } = require('express');
const User = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  // INITIATE GITHUB OAUTH FLOW
  .get('/login', (req, res, next) => {
    res
      .redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
      )
      .catch((error) => next(error));
  })
  // LOGIN ONCE GITHUB SENDS THE USER BACK
  .get('/login/callback', (req, res, next) => {
    let current = {};
    exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then((profile) => {
        current = profile;
        return User.find(profile.login);
      })
      .then((user) => {
        if (!user) {
          return User.insert({
            username: current.login,
            email: current.email,
            avatar: current.avatar_url,
          });
        } else {
          return user;
        }
      })
      .then((user) =>
        jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: '1 day',
        })
      )
      .then((payload) =>
        res
          .cookie('session', payload, {
            httpOnly: true,
            maxAge: 86400000,
          })
          .redirect('/api/v1/posts')
      )
      .catch((error) => next(error));
  })
  // REDIRECT AUTHENTICATED USERS TO THE DASHBOARD
  .get('/dashboard', authenticate, (req, res, next) => {
    res.json(req.user).catch((error) => next(error));
  })
  // LOGOUT USER
  .delete('/sessions', (req, res, next) => {
    res
      .clearCookie('session')
      .json({
        success: true,
        message: 'Sign Out Successful!',
      })
      .catch((error) => next(error));
  });
