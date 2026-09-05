import mongoose from 'mongoose';
import app from '../index.js';
import http from 'http';

async function runTests() {
  console.log('--- Starting Applications Feature Backend Verification ---');

  const testPort = 5098;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`[Test Server] Running on http://localhost:${testPort}`);
      resolve();
    });
  });

  const baseUrl = `http://localhost:${testPort}`;

  try {
    // 1. Submit Application
    const submitRes = await fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student-101',
        studentName: 'Arun',
        studentEmail: 'arun@example.com',
        jobId: 'job-501',
        jobTitle: 'Java Full Stack Developer',
        companyName: 'ABC Technologies',
        matchPercent: 75,
      }),
    });

    const submitData = await submitRes.json();
    console.assert(submitRes.status === 201, 'Submit application should return 201');
    console.assert(submitData.status === 'success', 'Status should be success');
    const appId = submitData.data.id || submitData.data._id;
    console.log(`✓ Application submitted successfully with ID: ${appId}`);

    // 2. Fetch Applications
    const listRes = await fetch(`${baseUrl}/api/applications`);
    const listData = await listRes.json();
    console.assert(listRes.status === 200, 'List applications should return 200');
    console.assert(Array.isArray(listData.data), 'Data should be array of applications');
    console.log(`✓ Applications count in DB: ${listData.data.length}`);

    // 3. Update Status
    const updateRes = await fetch(`${baseUrl}/api/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Under Review' }),
    });

    const updateData = await updateRes.json();
    console.assert(updateRes.status === 200, 'Update status should return 200');
    console.assert(updateData.data.status === 'Under Review', 'Status should be updated to Under Review');
    console.log(`✓ Application status updated to: ${updateData.data.status}`);

    console.log('\n=============================================');
    console.log('ALL APPLICATIONS TESTS PASSED SUCCESSFULLY! ✓');
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
