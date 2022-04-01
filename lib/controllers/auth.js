const { Router } = require('express');
const { exchangeCodeForToken, getGitHubProfile } = require('../utils/github');

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
      const payload = {};
      res
        .cookie('session', payload, {
          httpOnly: true,
          maxAge: 86400000,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  })
  // REDIRECT AUTHENTICATED USERS TO THE DASHBOARD
  .get('/dashboard', async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (error) {
      next(error);
    }
  })
  // LOGOUT USER
  .delete('/sessions', async (req, res, next) => {
    try {
      res.clearCookie('session').json({
        success: true,
        message: 'Sign Out Successful!',
      });
    } catch (error) {
      next(error);
    }
  });
