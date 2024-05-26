/**
 * Calculates the dot product of two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Dot product of vec1 and vec2
 */
function dotProduct(vec1: number[], vec2: number[]): number {
  return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
}

/**
 * Calculates the magnitude of a vector
 * @param vec - Input vector
 * @returns Magnitude of the vector
 */
function magnitude(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, value) => sum + value * value, 0));
}

/**
 * Calculates the cosine similarity between two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Cosine similarity between vec1 and vec2
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProd = dotProduct(vec1, vec2);
  const mag1 = magnitude(vec1);
  const mag2 = magnitude(vec2);

  return dotProd / (mag1 * mag2);
}

export default cosineSimilarity;
