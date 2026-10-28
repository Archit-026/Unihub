
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

/**
 * Content-based recommendations for UniHub Marketplace.
 * Returns a ranked copy; never mutates the original listings.
 */
export function getRecommendations(
  products,
  { search = '', category = 'All', limit = 4 } = {}
) {
  const queryWords = tokenize(search);

  // Without a search or category preference, don't pretend
  // the recommendations are personalized.
  if (!queryWords.length && category === 'All') {
    return [];
  }

  return products
    .map((product) => {
      let score = 0;

      const titleWords = tokenize(product.title);
      const descriptionWords = tokenize(product.description);
      const productWords = new Set([...titleWords, ...descriptionWords]);

      if (category !== 'All' && product.category === category) {
        score += 10;
      }

      for (const word of queryWords) {
        if (titleWords.includes(word)) score += 5;
        else if (descriptionWords.includes(word)) score += 2;
      }

      // Small tie-breaker: listings with useful descriptions
      // receive a modest bonus, not a popularity claim.
      if (String(product.description || '').trim().length >= 30) {
        score += 0.5;
      }

      return { product, score, matchedWords: productWords.size };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.matchedWords - a.matchedWords ||
        String(a.product.title || '').localeCompare(String(b.product.title || ''))
    )
    .slice(0, limit)
    .map((item) => item.product);
}
