import { ENV } from '../config/env.js';
import MermaidValidator from '../utils/MermaidValidator.js';
import TokenManager from '../utils/TokenManager.js';
import DataProcessor from '../utils/DataProcessor.js';
import cacheManager from '../utils/CacheManager.js';
import ContentService from '../services/ContentService.js';
import ProjectService from '../services/ProjectService.js';
import LeetCodeService from '../services/LeetCodeService.js';
import SpotifyService from '../services/SpotifyService.js';
import AdminService from '../services/AdminService.js';

let failed = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting Smoke & Unit Tests ---');

  // 1. MermaidValidator
  console.log('\n[1] Testing MermaidValidator:');
  const validDiagram = `graph TD
    A[Client] --> B[API]`;
  const validResult = MermaidValidator.validate(validDiagram);
  assert(validResult.isValid, 'Valid graph TD passes');

  const invalidDiagram = `randomNonMermaidKeyword
    A --> B`;
  const invalidResult = MermaidValidator.validate(invalidDiagram);
  assert(!invalidResult.isValid, 'Invalid diagram keyword fails');

  const scriptInjection = `graph TD
    A --> <script>alert("hacked")</script>`;
  const scriptResult = MermaidValidator.validate(scriptInjection);
  assert(!scriptResult.isValid, 'Script injection in diagram fails');

  // 2. TokenManager
  console.log('\n[2] Testing TokenManager:');
  const token = TokenManager.sign({ admin: true });
  assert(typeof token === 'string' && token.length > 20, 'Token generated');
  const decoded = TokenManager.verify(token);
  assert(decoded.admin === true, 'Token verified with admin: true');

  // 3. DataProcessor
  console.log('\n[3] Testing DataProcessor:');
  const dummyGraphQL = {
    matchedUser: {
      submitStatsGlobal: {
        acSubmissionNum: [
          { difficulty: 'All', count: 500 },
          { difficulty: 'Easy', count: 150 },
          { difficulty: 'Medium', count: 250 },
          { difficulty: 'Hard', count: 100 },
        ],
      },
    },
    recentSubmissionList: [
      { title: 'Test Problem', timestamp: Math.floor(Date.now() / 1000) - 3600 },
    ],
  };
  const processedLeetcode = DataProcessor.processLeetCodeData(dummyGraphQL);
  assert(processedLeetcode.totalSolved === 500, 'Total solved mapped to 500');
  assert(processedLeetcode.easySolved === 150, 'Easy solved mapped to 150');
  assert(processedLeetcode.recentSubmissions.length > 0, 'Recent submissions processed');

  const dummyContentDocs = [
    { key: 'home.hero.headline', value: 'Test Headline' },
    { key: 'resume.bio', value: 'Test Bio' },
  ];
  const dict = DataProcessor.normalizeContentDictionary(dummyContentDocs);
  assert(dict['home.hero.headline'] === 'Test Headline', 'Dictionary key mapped');
  assert(dict['resume.bio'] === 'Test Bio', 'Dictionary bio mapped');

  // 4. CacheManager in-memory
  console.log('\n[4] Testing CacheManager in-memory:');
  await cacheManager.set('test:key', { foo: 'bar' }, 10000);
  const cachedVal = await cacheManager.get('test:key');
  assert(cachedVal && cachedVal.foo === 'bar', 'CacheManager set & get works');
  await cacheManager.delete('test:key');
  const deletedVal = await cacheManager.get('test:key');
  assert(deletedVal === null, 'CacheManager delete works');

  // 5. Public Services fallback resilience
  console.log('\n[5] Testing Fallback Resilience:');
  const allContent = await ContentService.getAllContent();
  assert(typeof allContent === 'object' && allContent['home.status_pill'] !== undefined, 'ContentService returns valid map');

  const allProjects = await ProjectService.getAllProjects();
  assert(Array.isArray(allProjects) && allProjects.length > 0, 'ProjectService returns project array');

  const lcStats = await LeetCodeService.getCachedStats();
  assert(typeof lcStats.totalSolved === 'number', 'LeetCodeService returns totalSolved number');

  const spotifyData = await SpotifyService.getNowPlaying();
  assert(typeof spotifyData.isPlaying === 'boolean' && Array.isArray(spotifyData.topTracks), 'SpotifyService returns valid data');

  // 6. Admin Service
  console.log('\n[6] Testing AdminService:');
  const health = await AdminService.getSystemHealth();
  assert(health.status === 'operational', 'AdminService health is operational');

  console.log(`\n--- Test Results: ${failed === 0 ? 'ALL PASSED 🎉' : `${failed} FAILED ❌`} ---`);
  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
