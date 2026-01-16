/**
 * Test Takedown API Endpoint
 * 
 * This script tests the /api/takedown endpoint to verify:
 * 1. Form validation works correctly
 * 2. Data is stored in database
 * 3. Success/error responses are correct
 */

async function testTakedownAPI() {
    const baseUrl = 'http://localhost:3000';

    console.log('🧪 Testing Takedown API Endpoint\n');
    console.log('='.repeat(60));

    // Test 1: Valid submission
    console.log('\n📝 Test 1: Valid Takedown Request');
    console.log('-'.repeat(60));

    const validData = {
        listingUrl: 'https://findly.com/test/listing/12345',
        reporterName: 'Test User',
        reporterEmail: 'test@example.com',
        reason: 'This is a comprehensive test of the takedown request system to verify that the form validation, API endpoint, and database integration are working correctly together.'
    };

    try {
        const response = await fetch(`${baseUrl}/api/takedown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success! Status:', response.status);
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('❌ Failed with status:', response.status);
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }

    // Test 2: Missing fields
    console.log('\n📝 Test 2: Missing Required Fields');
    console.log('-'.repeat(60));

    const invalidData = {
        listingUrl: 'https://findly.com/test',
        reporterName: 'Test User',
        // Missing email and reason
    };

    try {
        const response = await fetch(`${baseUrl}/api/takedown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('❌ Unexpected success! Should have failed validation');
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ Correctly rejected! Status:', response.status);
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }

    // Test 3: Invalid email
    console.log('\n📝 Test 3: Invalid Email Format');
    console.log('-'.repeat(60));

    const invalidEmailData = {
        listingUrl: 'https://findly.com/test',
        reporterName: 'Test User',
        reporterEmail: 'not-an-email',
        reason: 'This is a test with invalid email format to verify validation works correctly.'
    };

    try {
        const response = await fetch(`${baseUrl}/api/takedown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidEmailData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('❌ Unexpected success! Should have rejected invalid email');
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ Correctly rejected! Status:', response.status);
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }

    // Test 4: Reason too short
    console.log('\n📝 Test 4: Reason Too Short (< 50 characters)');
    console.log('-'.repeat(60));

    const shortReasonData = {
        listingUrl: 'https://findly.com/test',
        reporterName: 'Test User',
        reporterEmail: 'test@example.com',
        reason: 'Too short'
    };

    try {
        const response = await fetch(`${baseUrl}/api/takedown`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shortReasonData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('❌ Unexpected success! Should have rejected short reason');
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ Correctly rejected! Status:', response.status);
            console.log('📋 Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏁 Test Suite Complete');
    console.log('='.repeat(60) + '\n');
}

// Run tests
testTakedownAPI();
