
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Allow only trusted browser origins.
const allowedOrigins = new Set([
  'https://unihubmits.netlify.app',
  'http://localhost:5173',
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
]);

app.use(cors({
  origin(origin, callback) {
    // Allow requests without an Origin header (e.g. server-to-server).
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed'));
  }
}));

app.use(express.json({ limit: '100kb' }));

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that',
  'you', 'your', 'item', 'used', 'new', 'good'
]);

function tokenize(value = '') {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

function getRecommendations(
  products,
  { search = '', category = 'All', limit = 4 } = {}
) {
  const queryWords = tokenize(search);

  if (!queryWords.length && category === 'All') {
    return [];
  }

  return products
    .map((product) => {
      let score = 0;

      const titleWords = tokenize(product.title);
      const descriptionWords = tokenize(product.description);

      if (category !== 'All' && product.category === category) {
        score += 10;
      }

      for (const word of queryWords) {
        if (titleWords.includes(word)) {
          score += 5;
        } else if (descriptionWords.includes(word)) {
          score += 2;
        }
      }

      if (
        score > 0 &&
        String(product.description || '').trim().length >= 30
      ) {
        score += 0.5;
      }

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(Number(limit) || 4, 1), 10))
    .map((item) => item.product);
}

app.get('/', (req, res) => {
  res.json({
    service: 'UniHub Recommendation API',
    status: 'running'
  });
});

app.post('/api/recommendations', (req, res) => {
  const {
    products,
    search = '',
    category = 'All',
    limit = 4
  } = req.body || {};

  if (!Array.isArray(products)) {
    return res.status(400).json({
      error: 'products must be an array'
    });
  }

  if (products.length > 200) {
    return res.status(400).json({
      error: 'Maximum 200 products allowed'
    });
  }

  if (
    typeof search !== 'string' ||
    search.length > 200 ||
    typeof category !== 'string' ||
    category.length > 100
  ) {
    return res.status(400).json({
      error: 'Invalid search or category'
    });
  }

  const validProducts = products.every((product) =>
    product &&
    typeof product === 'object' &&
    !Array.isArray(product) &&
    (product.title === undefined || typeof product.title === 'string') &&
    (product.description === undefined || typeof product.description === 'string') &&
    (product.category === undefined || typeof product.category === 'string') &&
    (product.title || '').length <= 200 &&
    (product.description || '').length <= 2000 &&
    (product.category || '').length <= 100
  );

  if (!validProducts) {
    return res.status(400).json({
      error: 'Invalid product data'
    });
  }

  const recommendations = getRecommendations(products, {
    search,
    category,
    limit
  });

  return res.json({ recommendations });
});

// Handle malformed JSON and oversized requests.
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request too large' });
  }

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (err.message === 'Origin not allowed') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  console.error('API error:', err.message);
  return res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Recommendation API running on port ${PORT}`);
  });
}

module.exports = {
  app,
  tokenize,
  getRecommendations
};
