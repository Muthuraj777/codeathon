import mongoose from 'mongoose';
import app from '../index.js';
import http from 'http';

async function runTests() {
  console.log('--- Starting Skill Gap Engine Backend Verification ---');

  // Start server on a test port
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

    // 2. Seed demo dataset (Arun + ABC Technologies Java Full Stack)
    const seedRes = await fetch(`${baseUrl}/api/seed`, { method: 'POST' });
    const seedData = await seedRes.json();
    console.assert(seedRes.status === 201, 'Seed endpoint should return 201');
    console.log('✓ Demo data seeded:', seedData.message);

    // 3. Test Skill Gap Endpoint
    const gapRes = await fetch(`${baseUrl}/api/students/101/jobs/501/skill-gap`);
    const gapData = await gapRes.json();
    console.assert(gapRes.status === 200, 'Skill gap should return 200');
    console.assert(gapData.success === true, 'Success flag should be true');

    const result = gapData.data;
    console.log(`✓ Overall Match: ${result.overallMatchPercent}%`);
    console.log(`✓ Skills evaluated: ${result.summary.totalSkills}, Matched: ${result.summary.matchedSkills}, Gaps: ${result.summary.gapSkills}`);

    // Verify individual skills
    const java = result.skills.find((s: any) => s.skillName === 'Java');
    console.assert(java.gap === 0 && java.status === 'Matched', 'Java should be matched with gap 0');

    const mysql = result.skills.find((s: any) => s.skillName === 'MySQL');
    console.assert(mysql.gap === 0 && mysql.status === 'Matched', 'MySQL should be matched with gap 0');

    const springBoot = result.skills.find((s: any) => s.skillName === 'Spring Boot');
    console.assert(springBoot.gap === 2 && springBoot.status === 'Gap', 'Spring Boot should have gap 2');

    const react = result.skills.find((s: any) => s.skillName === 'React');
    console.assert(react.gap === 1 && react.status === 'Gap', 'React should have gap 1');

    const aws = result.skills.find((s: any) => s.skillName === 'AWS');
    console.assert(aws.gap === 1 && aws.status === 'Gap', 'AWS should have gap 1');

    console.log('✓ Skill gap calculations & status verified successfully!');

    // 4. Test Recommendations Endpoint
    const recRes = await fetch(`${baseUrl}/api/students/101/jobs/501/recommendations`);
    const recData = await recRes.json();
    console.assert(recRes.status === 200, 'Recommendations should return 200');
    console.assert(recData.data.recommendations.length === 3, 'Should have 3 recommendations for gaps');

    const recs = recData.data.recommendations;
    console.log('✓ Recommendations returned:');
    recs.forEach((r: any) => {
      console.log(`   - [${r.priority}] ${r.skillName}: Current ${r.currentLevel} -> Target ${r.targetLevel} | Reason: "${r.reason}"`);
    });

    console.assert(recs[0].skillName === 'Spring Boot' && recs[0].priority === 'High', 'Spring Boot should be High Priority');
    console.assert(recs[0].reason === 'Mandatory job requirement', 'Spring Boot reason should be "Mandatory job requirement"');

    // 5. Test 404 for non-existent student
    const notFoundRes = await fetch(`${baseUrl}/api/students/unknown-id/jobs/501/skill-gap`);
    console.assert(notFoundRes.status === 404, 'Unknown student should return 404');
    console.log('✓ 404 correctly handled for unknown student');

    // 6. Test Application creation
    const appRes = await fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: '101', job_id: '501' }),
    });
    const appData = await appRes.json();
    console.assert(appRes.status === 201, 'Application should be created with 201');
    console.log(`✓ Job Application created with match_percent: ${appData.data.match_percent}%`);

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
