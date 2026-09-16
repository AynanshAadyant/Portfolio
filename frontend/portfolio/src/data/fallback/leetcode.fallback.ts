import type { LeetCodeStats } from '../../types';

export const FALLBACK_LEETCODE_STATS: LeetCodeStats = {
  totalSolved: 600,
  easySolved: 210,
  mediumSolved: 320,
  hardSolved: 70,
  contestRating: 1600,
  streakDays: 365,
  badges: ['50-Day Badge', '100-Day Badge', '365-Day Continuous Problem Solving Badge'],
  recentSubmissions: [
    { title: 'Course Schedule II', difficulty: 'Medium', timestamp: '2 hours ago' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', timestamp: '1 day ago' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', timestamp: '2 days ago' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', timestamp: '3 days ago' },
  ],
};
