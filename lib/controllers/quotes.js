const { Router } = require('express');
const getParsedQuotes = require('../middleware/get-parse-quotes');

module.exports = Router()
  // get 3 quotes
  .get('/', (req, res, next) => {
    getParsedQuotes()
      .then((posts) => res.json(posts))
      .catch((error) => next(error));
  });
