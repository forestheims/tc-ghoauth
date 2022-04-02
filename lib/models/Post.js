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

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        posts;
    `
    );
    return rows.map((row) => new Post(row));
  }

  static async insert({ text }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        posts (text)
      VALUES
        ($1)
      RETURNING
        *;
    `,
      [text]
    );
    return new Post(rows[0]);
  }
};
