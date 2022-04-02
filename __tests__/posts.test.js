const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

describe('tc-ghoauth routes for posts', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a post', async () => {
    const agent = request.agent(app);
    // await User.insert({
    //   username: 'acat',
    //   avatar: 'meow',
    //   email: 'nah',
    // });

    const res = await agent.post('/api/v1/posts').send({
      text: 'meow meow meow',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'meow meow meow',
      createdAt: expect.any(String),
    });
  });

  it('gets all posts', async () => {
    const agent = request.agent(app);
    // await User.insert({
    //   username: 'acat',
    //   avatar: 'meow',
    //   email: 'nah',
    // });

    await request.agent(app).post('/api/v1/posts').send({
      text: 'meow meow meow',
    });

    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        text: 'meow meow meow',
        createdAt: expect.any(String),
      },
    ]);
  });
});
