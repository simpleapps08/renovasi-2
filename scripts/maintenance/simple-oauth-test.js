import https from 'https';

const SUPABASE_URL = 'https://tkqvozgorpapofejphyn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

function testOAuthEndpoint() {
    return new Promise((resolve) => {
        const path = '/auth/v1/authorize?provider=google';
        console.log(`Testing: ${SUPABASE_URL}${path}`);
        
        const url = new URL(SUPABASE_URL + path);
        
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'User-Agent': 'OAuth-Test/1.0'
            }
        };
        
        const req = https.request(options, (res) => {
            console.log(`\n✅ Status: ${res.statusCode} ${res.statusMessage}`);
            
            if (res.statusCode === 302) {
                console.log('🔄 Redirect detected (this is GOOD for OAuth)');
                console.log('📍 Location:', res.headers.location);
            } else if (res.statusCode === 404) {
                console.log('❌ 404 NOT_FOUND - Google provider not configured');
            } else if (res.statusCode === 200) {
                console.log('✅ 200 OK - Endpoint accessible');
            }
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (data.length < 500) {
                    console.log('\n📄 Response Body:');
                    console.log(data);
                } else {
                    console.log('\n📄 Response Body (truncated):');
                    console.log(data.substring(0, 200) + '...');
                }
                
                console.log('\n🔍 Analysis:');
                if (res.statusCode === 302 && res.headers.location?.includes('accounts.google.com')) {
                    console.log('✅ Google OAuth is WORKING! The redirect to Google is successful.');
                    console.log('❓ The 404 error might be happening after the OAuth callback.');
                } else if (res.statusCode === 404) {
                    console.log('❌ Google provider is NOT configured in Supabase.');
                } else {
                    console.log('⚠️  Unexpected response. Check Supabase configuration.');
                }
                
                resolve({ status: res.statusCode, location: res.headers.location });
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Request Error:', error.message);
            resolve({ error: error.message });
        });
        
        req.setTimeout(10000, () => {
            console.error('⏰ Request Timeout');
            req.destroy();
            resolve({ error: 'timeout' });
        });
        
        req.end();
    });
}

console.log('🔍 Testing Supabase Google OAuth Endpoint');
console.log('=========================================');

testOAuthEndpoint().then(() => {
    console.log('\n🏁 Test completed!');
}).catch(console.error);