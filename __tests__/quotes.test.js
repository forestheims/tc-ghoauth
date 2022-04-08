const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('tc-ghoauth routes for quotes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('gets 3 quotes', async () => {
    const agent = request.agent(app);
    const res = await agent.get('/api/v1/quotes');
    expect(res.body).toEqual([
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
    ]);
  });
});
