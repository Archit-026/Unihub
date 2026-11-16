
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

const { app, tokenize, getRecommendations } = require('./server');

let server;
let baseUrl;

const products = [
  {
    id: 1,
    title: 'Python Programming Book',
    description: 'Learn Python programming with practical examples.',
    category: 'Books'
  },
  {
    id: 2,
    title: 'Java Programming Guide',
    description: 'A complete guide to Java development.',
    category: 'Books'
  },
  {
    id: 3,
    title: 'Wireless Headphones',
    description: 'Good quality wireless headphones for students.',
    category: 'Electronics'
  }
];

describe('Recommendation API', () => {
  before(async () => {
    server = app.listen(0);

    await new Promise((resolve) => server.once('listening', resolve));

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  it('tokenizes text into lowercase words', () => {
    assert.deepEqual(
      tokenize('Python PROGRAMMING Book'),
      ['python', 'programming', 'book']
    );
  });

  it('removes stop words and single-character words', () => {
    assert.deepEqual(
      tokenize('the new Python and C'),
      ['python']
    );
  });

  it('returns no recommendations for an empty search and All category', () => {
    assert.deepEqual(
      getRecommendations(products, {}),
      []
    );
  });

  it('recommends products matching the title', () => {
    const result = getRecommendations(products, {
      search: 'Python'
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });

  it('recommends products matching the description', () => {
    const result = getRecommendations(products, {
      search: 'practical'
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });

  it('prioritizes products from the selected category', () => {
    const result = getRecommendations(products, {
      category: 'Electronics'
    });

    assert.equal(result.length, 1);
    assert.equal(result[0].id, 3);
  });

  it('respects the recommendation limit', () => {
    const result = getRecommendations(products, {
      search: 'programming',
      limit: 1
    });

    assert.equal(result.length, 1);
  });

  it('caps the recommendation limit at 10', () => {
    const manyProducts = Array.from({ length: 15 }, (_, index) => ({
      id: index,
      title: 'Python Programming',
      description: 'A detailed programming book for students.',
      category: 'Books'
    }));

    const result = getRecommendations(manyProducts, {
      search: 'Python',
      limit: 20
    });

    assert.equal(result.length, 10);
  });

  it('returns the health check response', async () => {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.service, 'UniHub Recommendation API');
    assert.equal(data.status, 'running');
  });

  it('returns recommendations through the API', async () => {
    const response = await fetch(`${baseUrl}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products,
        search: 'Python'
      })
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.recommendations.length, 1);
    assert.equal(data.recommendations[0].id, 1);
  });

  it('returns HTTP 400 when products is not an array', async () => {
    const response = await fetch(`${baseUrl}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: 'invalid'
      })
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(data.error, 'products must be an array');
  });
});
