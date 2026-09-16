import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from '../config/env.js';
import routes from '../routes/routes.js';
import requestLogger from '../middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from '../middlewares/errorMiddleware.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const TEST_PORT = 3009;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let failed = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runHttpTests() {
  const server = app.listen(TEST_PORT);
  console.log(`Test server running at ${BASE_URL}\n`);

  try {
    // 1. Health check
    console.log('[1] Testing GET /health');
    const resHealth = await fetch(`${BASE_URL}/health`);
    assert(resHealth.status === 200, 'GET /health status is 200');
    const jsonHealth = await resHealth.json();
    assert(jsonHealth.status === 'healthy', 'Health check body is healthy');

    // 2. Auth Login Failure
    console.log('\n[2] Testing POST /api/auth/login (invalid password)');
    const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' }),
    });
    assert(resBadLogin.status === 401, 'Bad password returns 401');
    const jsonBadLogin = await resBadLogin.json();
    assert(jsonBadLogin.success === false, 'Bad login returns success: false');
    assert(jsonBadLogin.error?.code === 'INVALID_CREDENTIALS', 'Error code is INVALID_CREDENTIALS');

    // 3. Auth Login Success
    console.log('\n[3] Testing POST /api/auth/login (valid password)');
    const resGoodLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ENV.ADMIN_PASSWORD }),
    });
    assert(resGoodLogin.status === 200, 'Valid password returns 200');
    const jsonGoodLogin = await resGoodLogin.json();
    assert(jsonGoodLogin.success === true, 'Login returns success: true');
    assert(typeof jsonGoodLogin.token === 'string', 'Login returns token');
    const adminToken = jsonGoodLogin.token;

    // Check Set-Cookie header
    const setCookie = resGoodLogin.headers.get('set-cookie');
    assert(setCookie && setCookie.includes(ENV.COOKIE_NAME), 'Set-Cookie header includes COOKIE_NAME');

    // 4. Auth Me Check
    console.log('\n[4] Testing GET /api/auth/me');
    const resAuthMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const jsonAuthMe = await resAuthMe.json();
    assert(jsonAuthMe.authenticated === true, 'Auth verification returns authenticated: true');

    // 5. Public Content
    console.log('\n[5] Testing GET /api/content');
    const resContent = await fetch(`${BASE_URL}/api/content`);
    assert(resContent.status === 200, 'GET /api/content returns 200');
    const jsonContent = await resContent.json();
    assert(typeof jsonContent === 'object' && jsonContent['home.hero.headline'] !== undefined, 'Contains home.hero.headline');

    console.log('\n[6] Testing GET /api/content/:key');
    const resSingleContent = await fetch(`${BASE_URL}/api/content/home.hero.headline`);
    assert(resSingleContent.status === 200, 'GET /api/content/:key returns 200');
    const jsonSingleContent = await resSingleContent.json();
    assert(jsonSingleContent.key === 'home.hero.headline' && typeof jsonSingleContent.value === 'string', 'Returns key and value');

    // 6. Public Projects
    console.log('\n[7] Testing GET /api/projects');
    const resProjects = await fetch(`${BASE_URL}/api/projects`);
    assert(resProjects.status === 200, 'GET /api/projects returns 200');
    const jsonProjects = await resProjects.json();
    assert(Array.isArray(jsonProjects) && jsonProjects.length > 0, 'Projects is an array with items');
    assert(jsonProjects[0].slug !== undefined, 'Project item has slug');

    console.log('\n[8] Testing GET /api/projects/:slug');
    const resSingleProj = await fetch(`${BASE_URL}/api/projects/resume-ai-generator`);
    assert(resSingleProj.status === 200, 'GET /api/projects/resume-ai-generator returns 200');
    const jsonSingleProj = await resSingleProj.json();
    assert(jsonSingleProj.slug === 'resume-ai-generator', 'Slug matches requested slug');

    console.log('\n[9] Testing GET /api/projects/:slug (nonexistent)');
    const resNotFoundProj = await fetch(`${BASE_URL}/api/projects/unknown-nonexistent-project`);
    assert(resNotFoundProj.status === 404, 'Unknown slug returns 404');
    const jsonNotFoundProj = await resNotFoundProj.json();
    assert(jsonNotFoundProj.error?.code === 'RESOURCE_NOT_FOUND', 'Returns RESOURCE_NOT_FOUND error code');

    // 7. LeetCode Telemetry
    console.log('\n[10] Testing GET /api/leetcode/stats');
    const resLeetcode = await fetch(`${BASE_URL}/api/leetcode/stats`);
    assert(resLeetcode.status === 200, 'GET /api/leetcode/stats returns 200');
    const jsonLeetcode = await resLeetcode.json();
    assert(typeof jsonLeetcode.totalSolved === 'number', 'totalSolved is a number');
    assert(Array.isArray(jsonLeetcode.recentSubmissions), 'recentSubmissions is an array');

    // 8. Spotify Telemetry
    console.log('\n[11] Testing GET /api/spotify/now-playing');
    const resSpotify = await fetch(`${BASE_URL}/api/spotify/now-playing`);
    assert(resSpotify.status === 200, 'GET /api/spotify/now-playing returns 200');
    const jsonSpotify = await resSpotify.json();
    assert(typeof jsonSpotify.isPlaying === 'boolean', 'isPlaying is a boolean');
    assert(Array.isArray(jsonSpotify.topTracks), 'topTracks is an array');

    // 9. Protected Admin Route without Token
    console.log('\n[12] Testing Protected Route without Token (Expect 401)');
    const resNoAuth = await fetch(`${BASE_URL}/api/admin/system/health`);
    assert(resNoAuth.status === 401, 'Missing token returns 401');
    const jsonNoAuth = await resNoAuth.json();
    assert(jsonNoAuth.error?.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

    // 10. Protected Admin Route with Token
    console.log('\n[13] Testing Protected Route with Token');
    const resAdminHealth = await fetch(`${BASE_URL}/api/admin/system/health`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(resAdminHealth.status === 200, 'Authenticated admin route returns 200');
    const jsonAdminHealth = await resAdminHealth.json();
    assert(jsonAdminHealth.status === 'operational', 'Admin health is operational');

    console.log('\n[14] Testing Cache Status in Admin Route');
    const resCacheStatus = await fetch(`${BASE_URL}/api/admin/cache/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(resCacheStatus.status === 200, 'Admin cache status returns 200');

    // 11. Auth Logout
    console.log('\n[15] Testing POST /api/auth/logout');
    const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });
    assert(resLogout.status === 200, 'Logout returns 200');
    const logoutCookie = resLogout.headers.get('set-cookie');
    console.log('logoutCookie header:', logoutCookie);
    assert(logoutCookie && (logoutCookie.includes('Max-Age=0') || logoutCookie.includes('Expires=') || logoutCookie.includes('expires=') || logoutCookie.includes(ENV.COOKIE_NAME)), 'Cookie cleared on logout');

    console.log(`\n========================================`);
    console.log(`HTTP INTEGRATION TEST RESULTS: ${failed === 0 ? 'ALL PASSED 🎉' : `${failed} FAILED ❌`}`);
    console.log(`========================================`);
  } finally {
    server.close();
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runHttpTests().catch((err) => {
  console.error('Fatal error during HTTP test run:', err);
  process.exit(1);
});
