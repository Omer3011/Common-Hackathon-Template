// utils/similarityChecker.js

const WEIGHTS = {
  location: 0.4,
  category: 0.3,
  text: 0.3
};

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function textSimilarity(text1 = "", text2 = "") {
  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));

  let common = 0;

  for (const word of words1) {
    if (words2.has(word)) {
      common++;
    }
  }

  const total = new Set([...words1, ...words2]).size;

  if (total === 0) {
    return 0;
  }

  return common / total;
}

function weightedSimilarity(issue1 = {}, issue2 = {}) {
  const location1 = (issue1.location || "").toLowerCase();
  const location2 = (issue2.location || "").toLowerCase();

  const category1 = (issue1.category || "").toLowerCase();
  const category2 = (issue2.category || "").toLowerCase();

  const locationScore = location1 === location2 ? 1 : 0;
  const categoryScore = category1 === category2 ? 1 : 0;

  const textScore = textSimilarity(
    issue1.description || "",
    issue2.description || ""
  );

  const finalScore =
    locationScore * WEIGHTS.location +
    categoryScore * WEIGHTS.category +
    textScore * WEIGHTS.text;

  return Number(finalScore.toFixed(2));
}

module.exports = weightedSimilarity;
