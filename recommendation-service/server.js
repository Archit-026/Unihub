const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

function getRecommendations(products, { search = '', category = 'All', limit = 4 } = {}) {
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
        if (titleWords.includes(word)) score += 5;
        else if (descriptionWords.includes(word)) score += 2;
      }

      if (String(product.description || '').trim().length >= 30) {
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
  res.json({ service: 'UniHub Recommendation API', status: 'running' });
});

app.post('/api/recommendations', (req, res) => {
  const { products, search = '', category = 'All', limit = 4 } = req.body || {};

  if (!Array.isArray(products)) {
    return res.status(400).json({
      error: 'products must be an array'
    });
  }

  const recommendations = getRecommendations(products, {
    search,
    category,
    limit
  });

  res.json({ recommendations });
});

app.listen(PORT, () => {
  console.log(`Recommendation API running on http://localhost:${PORT}`);
});