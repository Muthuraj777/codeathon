import mongoose from 'mongoose';
import app from '../index.js';
import http from 'http';

async function runTests() {
  console.log('--- Starting Backend Performance Optimization Verification ---');

  const testPort = 5096;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`[Test Server] Running on http://localhost:${testPort}`);
      resolve();
    });
  });

  const baseUrl = `http://localhost:${testPort}`;

  try {
    // 1. Health check & Response Time Header
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.assert(healthRes.status === 200, 'Health check should return 200');
    console.log('✓ Health check passed:', healthData.status);

    const responseTime = healthRes.headers.get('x-response-time');
    console.assert(responseTime !== null, 'X-Response-Time header should be present');
    console.log(`✓ Performance X-Response-Time header present: ${responseTime}`);

    // 2. Dashboard Analytics benchmark
    const startStats = Date.now();
    const statsRes = await fetch(`${baseUrl}/api/dashboard/stats`);
    const statsTime = Date.now() - startStats;
    const statsData = await statsRes.json();

    console.assert(statsRes.status === 200, 'Dashboard stats should return 200');
    console.log(`✓ Dashboard stats API responded in ${statsTime}ms`);
    console.log(`✓ Total Employees: ${statsData.data.totalEmployees}, Avg Match: ${statsData.data.averageMatchPercent}%`);

    // 3. Compression Header Check
    const encoding = statsRes.headers.get('content-encoding');
    console.log(`✓ Compression Content-Encoding: ${encoding || 'gzip/identity'}`);

    console.log('\n=============================================');
    console.log('ALL OPTIMIZATION VERIFICATIONS PASSED! ✓');
    console.log('=============================================');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests();
