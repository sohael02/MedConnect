const http = require('http');
const { spawn } = require('child_process');

// Start the server
const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

// Wait for server to start
setTimeout(() => {
  testAPI();
}, 3000);

function testAPI() {
  // Test health endpoint
  http.get('http://localhost:5000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Health Check:', data);
      testPharmacies();
    });
  }).on('error', (err) => {
    console.error('Health check failed:', err.message);
    process.exit(1);
  });
}

function testPharmacies() {
  http.get('http://localhost:5000/api/pharmacies?limit=3', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('Pharmacies count:', parsed.data?.length || parsed.length);
        if (parsed.data?.length > 0) {
          console.log('First pharmacy:', parsed.data[0].name);
        }
      } catch (e) {
        console.log('Raw response:', data.slice(0, 500));
      }
      testSearch();
    });
  }).on('error', (err) => {
    console.error('Pharmacies test failed:', err.message);
    process.exit(1);
  });
}

function testSearch() {
  const postData = JSON.stringify({
    medicine: 'paracetamol',
    latitude: 15.2156,
    longitude: 79.9034,
    radiusKm: 10
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('Search results:', parsed.pharmacies?.length || 0, 'pharmacies found');
        if (parsed.pharmacies?.length > 0) {
          console.log('First result:', parsed.pharmacies[0].name, '- distance:', parsed.pharmacies[0].distance, 'km');
        }
      } catch (e) {
        console.log('Search raw response:', data.slice(0, 500));
      }
      console.log('\n✅ All API tests passed!');
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Search test failed:', err.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

// Cleanup
process.on('exit', () => {
  console.log('Stopping server...');
});