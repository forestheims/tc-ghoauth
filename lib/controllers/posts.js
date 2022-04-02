const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  // CREATE POST
  .post('/', async (req, res, next) => {
    try {
      const post = await Post.insert(req.body);
      res.json(post);
    } catch (error) {
      next(error);
    }
  })
  // GET ALL POSTS
  .get('/', async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });
