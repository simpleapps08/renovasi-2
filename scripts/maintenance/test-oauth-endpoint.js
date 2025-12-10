import https from 'https';
import http from 'http';

// Konfigurasi Supabase
const SUPABASE_URL = 'https://tkqvozgorpapofejphyn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

function testEndpoint(path, description) {
    return new Promise((resolve) => {
        console.log(`\n=== ${description} ===`);
        console.log(`Testing: ${SUPABASE_URL}${path}`);
        
        const url = new URL(SUPABASE_URL + path);
        
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'User-Agent': 'OAuth-Test/1.0'
            }
        };
        
        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
            console.log('Headers:', JSON.stringify(res.headers, null, 2));
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Response Body:');
                try {
                    const parsed = JSON.parse(data);
                    console.log(JSON.stringify(parsed, null, 2));
                } catch (e) {
                    console.log(data);
                }
                resolve({ status: res.statusCode, data });
            });
        });
        
        req.on('error', (error) => {
            console.error('Request Error:', error.message);
            resolve({ error: error.message });
        });
        
        req.setTimeout(10000, () => {
            console.error('Request Timeout');
            req.destroy();
            resolve({ error: 'timeout' });
        });
        
        req.end();
    });
}

async function runTests() {
    console.log('🔍 Testing Supabase OAuth Endpoints');
    console.log('=====================================');
    
    // Test 1: Basic health check
    await testEndpoint('/rest/v1/', 'Supabase REST API Health Check');
    
    // Test 2: Auth endpoint
    await testEndpoint('/auth/v1/', 'Supabase Auth API Health Check');
    
    // Test 3: OAuth authorize endpoint (yang menyebabkan 404)
    await testEndpoint('/auth/v1/authorize?provider=google', 'Google OAuth Authorize Endpoint');
    
    // Test 4: OAuth providers list
    await testEndpoint('/auth/v1/settings', 'Auth Settings/Providers');
    
    // Test 5: Test dengan redirect_to
    await testEndpoint('/auth/v1/authorize?provider=google&redirect_to=http://localhost:8080/dashboard', 'Google OAuth with Redirect');
    
    console.log('\n✅ Testing completed!');
    console.log('\n📋 Analysis:');
    console.log('- If /auth/v1/ returns 200: Auth API is working');
    console.log('- If /auth/v1/authorize returns 404: Google provider not configured');
    console.log('- If /auth/v1/settings returns provider info: Check Google config');
    console.log('\n🔧 Next steps if 404 on authorize:');
    console.log('1. Check Supabase Dashboard > Authentication > Providers');
    console.log('2. Enable Google provider');
    console.log('3. Add Google Client ID and Secret');
    console.log('4. Verify redirect URI in Google Cloud Console');
}

runTests().catch(console.error);