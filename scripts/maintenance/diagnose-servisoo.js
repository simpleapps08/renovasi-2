// 🔍 SERVISOO.COM - Automatic Diagnostic Script
// Jalankan di browser console untuk diagnosa masalah

console.log('🔍 SERVISOO DIAGNOSTIC STARTING...');
console.log('='.repeat(50));

// 1. Basic Page Info
console.log('📄 PAGE INFO:');
console.log('URL:', window.location.href);
console.log('Title:', document.title);
console.log('HTML Length:', document.documentElement.outerHTML.length);
console.log('Body Content:', document.body ? document.body.innerText.substring(0, 100) + '...' : 'NO BODY');
console.log('');

// 2. Check for React Root
console.log('⚛️ REACT CHECK:');
const reactRoot = document.getElementById('root');
console.log('React Root Element:', reactRoot ? 'FOUND' : 'NOT FOUND');
if (reactRoot) {
    console.log('Root Content Length:', reactRoot.innerHTML.length);
    console.log('Root Children:', reactRoot.children.length);
}
console.log('');

// 3. Check JavaScript Files
console.log('📜 JAVASCRIPT FILES:');
const scripts = document.querySelectorAll('script[src]');
scripts.forEach((script, index) => {
    console.log(`Script ${index + 1}:`, script.src);
});
console.log('Total Scripts:', scripts.length);
console.log('');

// 4. Check CSS Files
console.log('🎨 CSS FILES:');
const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
stylesheets.forEach((css, index) => {
    console.log(`CSS ${index + 1}:`, css.href);
});
console.log('Total CSS:', stylesheets.length);
console.log('');

// 5. Check for Errors
console.log('🚨 ERROR CHECK:');
let errorCount = 0;

// Override console.error to count errors
const originalError = console.error;
console.error = function(...args) {
    errorCount++;
    originalError.apply(console, ['❌ ERROR:', ...args]);
};

// Check for common React/Vite errors
if (typeof React === 'undefined') {
    console.error('React is not loaded');
}

if (typeof ReactDOM === 'undefined') {
    console.error('ReactDOM is not loaded');
}

// 6. Network Requests Check
console.log('🌐 NETWORK CHECK:');
fetch('/assets/index.css')
    .then(response => {
        console.log('CSS File Status:', response.status, response.statusText);
    })
    .catch(error => {
        console.error('CSS File Failed:', error.message);
    });

fetch('/assets/index.js')
    .then(response => {
        console.log('JS File Status:', response.status, response.statusText);
    })
    .catch(error => {
        console.error('JS File Failed:', error.message);
    });

// 7. Environment Variables Check
console.log('🔐 ENVIRONMENT CHECK:');
setTimeout(() => {
    if (typeof import !== 'undefined' && import.meta && import.meta.env) {
        console.log('Vite Env Available:', true);
        console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
        console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET');
    } else {
        console.error('Vite environment not available');
    }
}, 1000);

// 8. Supabase Connection Check
console.log('🗄️ SUPABASE CHECK:');
setTimeout(() => {
    if (typeof window.supabase !== 'undefined') {
        console.log('Supabase Client:', 'LOADED');
        // Test connection
        window.supabase.from('profiles').select('count').limit(1)
            .then(result => {
                console.log('Supabase Connection:', result.error ? 'FAILED' : 'SUCCESS');
                if (result.error) console.error('Supabase Error:', result.error.message);
            })
            .catch(error => {
                console.error('Supabase Test Failed:', error.message);
            });
    } else {
        console.error('Supabase client not loaded');
    }
}, 2000);

// 9. Final Summary
setTimeout(() => {
    console.log('');
    console.log('='.repeat(50));
    console.log('🏁 DIAGNOSTIC SUMMARY:');
    console.log('Total Errors Found:', errorCount);
    console.log('React Root:', reactRoot ? '✅' : '❌');
    console.log('Scripts Loaded:', scripts.length > 0 ? '✅' : '❌');
    console.log('CSS Loaded:', stylesheets.length > 0 ? '✅' : '❌');
    console.log('');
    
    if (errorCount === 0 && reactRoot && scripts.length > 0) {
        console.log('🎉 DIAGNOSIS: Website should be working!');
        console.log('💡 If still blank, check browser cache or try incognito mode');
    } else {
        console.log('🔧 DIAGNOSIS: Issues found that need fixing');
        console.log('📋 Check the errors above and follow troubleshooting guide');
    }
    
    console.log('='.repeat(50));
}, 3000);

// 10. Additional Checks
console.log('🔍 ADDITIONAL CHECKS:');

// Check if page is actually loading content
setTimeout(() => {
    const bodyText = document.body ? document.body.innerText.trim() : '';
    if (bodyText.length < 50) {
        console.error('Page content is too short, likely not loading properly');
    } else {
        console.log('Page content length looks good:', bodyText.length, 'characters');
    }
}, 1500);

// Check for React components
setTimeout(() => {
    const reactElements = document.querySelectorAll('[data-reactroot], [data-react-helmet]');
    console.log('React Elements Found:', reactElements.length);
    
    if (reactElements.length === 0) {
        console.error('No React elements found - React app may not be mounting');
    }
}, 2500);

console.log('⏳ Running diagnostics... Please wait 3 seconds for complete results');
console.log('');