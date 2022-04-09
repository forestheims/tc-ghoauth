const pool = require('../utils/pool');

module.exports = class Post {
  id;
  text;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.createdAt = row.created_at;
  }

  static getAll() {
    return pool
      .query(
        `
      SELECT
        *
      FROM
        posts;
    `
      )
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }

  static insert({ text }) {
    return pool
      .query(
        `
      INSERT INTO
        posts (text)
      VALUES
        ($1)
      RETURNING
        *;
    `,
        [text]
      )
      .then(({ rows }) => new Post(rows[0]));
  }
};
