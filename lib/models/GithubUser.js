const pool = require('../utils/pool');

module.exports = class User {
  username;
  email;
  avatar;

  constructor(row) {
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async find(user) {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        username=$1;
    `,
      [user]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async insert({ email, username, avatar }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        users (email, username, avatar)
      VALUES
        ($1, $2, $3)
      RETURNING
        *;
    `,
      [email, username, avatar]
    );
    return new User(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
