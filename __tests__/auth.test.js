const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('tc-ghoauth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const newAgent = async () => {
    const agent = await request.agent(app);
    return agent;
  };

  it('creates a cookie jar', async () => {
    const { jar } = await newAgent();
    const cookieJar = jar;
    expect(cookieJar).toBeTruthy();
  });

  it('redirects to githubs OAuth', async () => {
    const res = await newAgent().get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=[\w\d]/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await newAgent()
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
});
