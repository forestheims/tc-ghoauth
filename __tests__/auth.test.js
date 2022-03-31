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

  it('is a blank test', async () => {
    const agent = await newAgent();
    expect(agent).toBeTruthy();
  });
});
