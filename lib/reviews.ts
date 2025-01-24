import { Review, PaginatedResponse } from './types';

// Simulated review data
const reviews: Review[] = Array.from({ length: 50 }, (_, i) => ({
  id: `review-${i + 1}`,
  name: `Guest ${i + 1}`,
  date: new Date(2024, 0, 1 - i).toLocaleString(),
  ots: Math.floor(Math.random() * 3) + 7, // Random score between 7-10
  wes: Math.floor(Math.random() * 3) + 7, // Random score between 7-10
  recommend: Math.random() > 0.2, // 80% chance of recommending
}));

export async function getReviews(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Review>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  return {
    data: paginatedReviews,
    metadata: {
      currentPage: page,
      totalPages: Math.ceil(reviews.length / itemsPerPage),
      totalItems: reviews.length,
      itemsPerPage: itemsPerPage
    }
  };
}