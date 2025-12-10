
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            if (error.code) console.error('Error code:', error.code);
        } else {
            console.log('Connection successful!');
            console.log('Supabase is reachable.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
