const fetch = require('cross-fetch');

module.exports = async function getParsedQuotes() {
  const apiArray = [
    'https://programming-quotes-api.herokuapp.com/quotes/random',
    'https://futuramaapi.herokuapp.com/api/quotes/1',
    'https://api.quotable.io/random',
  ].map((apiURL) => fetch(apiURL));

  return Promise.all(apiArray)
    .then((values) => {
      return Promise.all(values.map((value) => value.json()));
    })
    .then((resArray) => {
      return [
        { author: resArray[0].author, content: resArray[0].en },
        { author: resArray[1][0].character, content: resArray[1][0].quote },
        { author: resArray[2].author, content: resArray[2].content },
      ];
    });
};
