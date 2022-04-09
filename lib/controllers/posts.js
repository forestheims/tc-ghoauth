const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  // CREATE POST
  .post('/', authenticate, (req, res, next) => {
    Post.insert(req.body)
      .then((post) => res.json(post))
      .catch((error) => next(error));
  })
  // GET ALL POSTS
  .get('/', authenticate, (req, res, next) => {
    Post.getAll()
      .then((posts) => res.json(posts))
      .catch((error) => next(error));
  });
