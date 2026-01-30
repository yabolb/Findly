
async function triggerSync() {
    console.log('Triggering sync via API...');
    try {
        const res = await fetch('http://localhost:3000/api/admin/sync-awin', {
            method: 'POST'
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

triggerSync();
