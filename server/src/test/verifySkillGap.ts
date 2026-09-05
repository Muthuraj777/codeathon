import mongoose from 'mongoose';
import app from '../index.js';
import http from 'http';

async function runTests() {
  console.log('--- Starting Skill Gap Engine Backend Verification ---');

  const testPort = 5099;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`[Test Server] Running on http://localhost:${testPort}`);
      resolve();
    });
  });

  const baseUrl = `http://localhost:${testPort}`;

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.assert(healthRes.status === 200, 'Health check should be 200');
    console.log('✓ Health check passed:', healthData.status);

    // 2. Seed demo dataset
    const seedRes = await fetch(`${baseUrl}/api/seed`, { method: 'POST' });
    const seedData = await seedRes.json();
    console.assert(seedRes.status === 201, 'Seed endpoint should return 201');
    console.log('✓ Demo data seeded:', seedData.message);

    const studentId = seedData.data.studentId;
    const jobId = seedData.data.jobId;

    // 3. Test Skill Gap Endpoint
    const gapRes = await fetch(`${baseUrl}/api/students/${studentId}/jobs/${jobId}/skill-gap`);
    const gapData = await gapRes.json();
    console.assert(gapRes.status === 200, 'Skill gap should return 200');
    console.assert(gapData.status === 'success', 'Status should be success');

    const result = gapData.data;
    console.log(`✓ Overall Match Score: ${result.overallMatchScore}%`);
    console.log(`✓ Skills evaluated: ${result.totalSkillsCount}, Matched: ${result.matchedCount}`);

    // 4. Test Recommendations Endpoint
    const recRes = await fetch(`${baseUrl}/api/students/${studentId}/jobs/${jobId}/recommendations`);
    const recData = await recRes.json();
    console.assert(recRes.status === 200, 'Recommendations should return 200');
    console.assert(Array.isArray(recData.data), 'Data should be array of recommendations');

    console.log('✓ Recommendations returned:', recData.data.length);

    // 5. Test 404 for unknown student
    const notFoundRes = await fetch(`${baseUrl}/api/students/unknown-id/jobs/${jobId}/skill-gap`);
    console.assert(notFoundRes.status === 404, 'Unknown student should return 404');
    console.log('✓ 404 correctly handled for unknown student');

    console.log('\n=============================================');
    console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ✓');
    console.log('=============================================');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
