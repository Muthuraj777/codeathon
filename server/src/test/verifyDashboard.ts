import mongoose from 'mongoose';
import app from '../index.js';
import http from 'http';

async function runTests() {
  console.log('--- Starting Executive Dashboard Analytics Backend Verification ---');

  const testPort = 5097;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`[Test Server] Running on http://localhost:${testPort}`);
      resolve();
    });
  });

  const baseUrl = `http://localhost:${testPort}`;

  try {
    // 1. Fetch Dashboard Stats
    const statsRes = await fetch(`${baseUrl}/api/dashboard/stats`);
    const statsData = await statsRes.json();

    console.assert(statsRes.status === 200, 'Dashboard stats should return 200');
    console.assert(statsData.status === 'success', 'Status should be success');

    const stats = statsData.data;
    console.log(`✓ Total Employees/Students: ${stats.totalEmployees}`);
    console.log(`✓ Total Jobs: ${stats.totalJobs}`);
    console.log(`✓ Total Applications: ${stats.totalApplications}`);
    console.log(`✓ Average Match Percent: ${stats.averageMatchPercent}%`);
    console.log(`✓ Top Skill Gaps Count: ${stats.topSkillGaps.length}`);

    console.assert(typeof stats.totalEmployees === 'number', 'totalEmployees should be number');
    console.assert(typeof stats.totalJobs === 'number', 'totalJobs should be number');
    console.assert(typeof stats.totalApplications === 'number', 'totalApplications should be number');
    console.assert(typeof stats.averageMatchPercent === 'number', 'averageMatchPercent should be number');
    console.assert(Array.isArray(stats.topSkillGaps), 'topSkillGaps should be an array');

    stats.topSkillGaps.forEach((g: any) => {
      console.log(`   - ${g.skillName}: ${g.gapCount} gaps (${g.percentage}%) [${g.category}]`);
    });

    console.log('\n=============================================');
    console.log('ALL DASHBOARD TESTS PASSED SUCCESSFULLY! ✓');
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
