const { Router } = require('express');
const User = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  // INITIATE GITHUB OAUTH FLOW
  .get('/login', async (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
      );
    } catch (error) {
      next(error);
    }
  })
  // LOGIN ONCE GITHUB SENDS THE USER BACK
  .get('/login/callback', async (req, res, next) => {
    try {
      const token = await exchangeCodeForToken(req.query.code);
      const githubProfile = await getGithubProfile(token);
      // const { login, email, avatar_url } = githubProfile;
      let user = await User.find(githubProfile.login);
      if (!user) {
        user = await User.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
        });
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie('session', payload, {
          httpOnly: true,
          maxAge: 86400000,
        })
        .redirect('/api/v1/posts');
    } catch (error) {
      next(error);
    }
  })
  // REDIRECT AUTHENTICATED USERS TO THE DASHBOARD
  .get('/dashboard', authenticate, async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (error) {
      next(error);
    }
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
