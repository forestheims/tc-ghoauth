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

  static find(user) {
    return pool
      .query(
        `
      SELECT
        *
      FROM
        users
      WHERE
        username=$1;
    `,
        [user]
      )
      .then(({ rows }) => {
        if (!rows[0]) return null;

        return new User(rows[0]);
      });
  }

  static async insert({ email, username, avatar }) {
    return pool
      .query(
        `
      INSERT INTO
        users (email, username, avatar)
      VALUES
        ($1, $2, $3)
      RETURNING
        *;
    `,
        [email, username, avatar]
      )
      .then(({ rows }) => new User(rows[0]));
  }

  toJSON() {
    return { ...this };
  }
};
