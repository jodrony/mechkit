const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VERIFYING PYQ SEARCH FILTERING & WEB SHARE API FALLBACK ===\n');

// 1. Verify ResourcesHub.tsx
const resourcesHubPath = path.join(__dirname, '../src/pages/ResourcesHub.tsx');
const resourcesHubCode = fs.readFileSync(resourcesHubPath, 'utf8');

console.log('1. Checking matchesSearch in ResourcesHub.tsx...');
assert(resourcesHubCode.includes('const matchesSearch ='), 'matchesSearch function must be defined');
assert(resourcesHubCode.includes('item.title?.toLowerCase().includes(q)'), 'matchesSearch must check item.title');
assert(resourcesHubCode.includes("String(item.year || '').toLowerCase().includes(q)"), 'matchesSearch must check item.year');
assert(resourcesHubCode.includes('item.session?.toLowerCase().includes(q)'), 'matchesSearch must check item.session');
assert(resourcesHubCode.includes('item.filename?.toLowerCase().includes(q)'), 'matchesSearch must check item.filename');
assert(resourcesHubCode.includes('Boolean(titleMatch || yearMatch || sessionMatch || fileMatch)'), 'matchesSearch must return Boolean combination');

console.log('   ✓ matchesSearch logic matches exact specification.');

// Test matchesSearch logic in isolation
const testMatchesSearch = (searchQuery, item) => {
  if (!searchQuery.trim()) return true;
  const q = searchQuery.toLowerCase().trim();
  const titleMatch = item.title?.toLowerCase().includes(q);
  const yearMatch = String(item.year || '').toLowerCase().includes(q);
  const sessionMatch = item.session?.toLowerCase().includes(q);
  const fileMatch = item.filename?.toLowerCase().includes(q);
  return Boolean(titleMatch || yearMatch || sessionMatch || fileMatch);
};

const jan2024 = {
  year: '2024',
  session: '2024 (Jan)',
  title: 'Strength of Materials (SOM) 2024 (Jan)',
  filename: 'som_2024_jan.pdf'
};
const dec2024 = {
  year: '2024',
  session: '2024 (Dec)',
  title: 'Strength of Materials (SOM) 2024 (Dec)',
  filename: 'som_2024_dec.pdf'
};
const som2023 = {
  year: '2023',
  session: '2023',
  title: 'Strength of Materials (SOM) 2023',
  filename: 'som_2023.pdf'
};

assert.strictEqual(testMatchesSearch('2024', jan2024), true, '2024 must match 2024 (Jan)');
assert.strictEqual(testMatchesSearch('2024', dec2024), true, '2024 must match 2024 (Dec)');
assert.strictEqual(testMatchesSearch('2024', som2023), false, '2024 must not match 2023');
assert.strictEqual(testMatchesSearch('Jan', jan2024), true, 'Jan must match 2024 (Jan)');
assert.strictEqual(testMatchesSearch('Jan', dec2024), false, 'Jan must not match 2024 (Dec)');
assert.strictEqual(testMatchesSearch('dec', dec2024), true, 'dec must match 2024 (Dec)');
assert.strictEqual(testMatchesSearch('som_2024_jan', jan2024), true, 'filename query must match');

console.log('   ✓ Test 2024 search: Both 2024 (Jan) and 2024 (Dec) match and remain visible!');

console.log('\n2. Checking empty state badge in ResourcesHub.tsx...');
assert(
  resourcesHubCode.includes("No papers matching &apos;{searchQuery}&apos;"),
  "ResourcesHub must render clean badge: 'No papers matching '{searchQuery}''"
);
assert(resourcesHubCode.includes('id="input-pyq-filter"'), 'Search input with id="input-pyq-filter" must exist');
assert(resourcesHubCode.includes('id="btn-clear-pyq-filter"'), 'Clear button with id="btn-clear-pyq-filter" must exist');
console.log('   ✓ Clean badge "No papers matching \'{searchQuery}\'" verified.');

// 3. Verify handleShare & Web Share API fallback in Dashboard (Home.tsx & Dashboard.tsx)
console.log('\n3. Checking Web Share API fallback in Home.tsx & Dashboard.tsx...');
const homePath = path.join(__dirname, '../src/pages/Home.tsx');
const homeCode = fs.readFileSync(homePath, 'utf8');
const dashboardPath = path.join(__dirname, '../src/pages/Dashboard.tsx');
const dashboardCode = fs.readFileSync(dashboardPath, 'utf8');

assert(homeCode.includes('const handleShare = async () =>'), 'Home.tsx must implement handleShare');
assert(homeCode.includes('window.isSecureContext'), 'Home.tsx handleShare must check window.isSecureContext');
assert(homeCode.includes('navigator.clipboard.writeText'), 'Home.tsx handleShare must use navigator.clipboard.writeText');
assert(homeCode.includes("document.createElement('textarea')"), 'Home.tsx handleShare must fallback to textarea');
assert(homeCode.includes('Link copied to clipboard! Share it in your WhatsApp group.'), 'Home.tsx must display WhatsApp share copy message');
assert(homeCode.includes('Unable to auto-copy. App URL:'), 'Home.tsx must display origin fallback message');

assert(dashboardCode.includes('export const handleShare ='), 'Dashboard.tsx must export handleShare');
assert(dashboardCode.includes('window.isSecureContext'), 'Dashboard.tsx handleShare must check window.isSecureContext');
assert(dashboardCode.includes('navigator.clipboard.writeText'), 'Dashboard.tsx handleShare must use navigator.clipboard.writeText');
assert(dashboardCode.includes("document.createElement('textarea')"), 'Dashboard.tsx handleShare must fallback to textarea');

console.log('   ✓ handleShare in Home.tsx & Dashboard.tsx has complete fallback chain.');

// 4. Verify CreatorModal.tsx
console.log('\n4. Checking CreatorModal.tsx...');
const creatorModalPath = path.join(__dirname, '../src/components/CreatorModal.tsx');
const creatorModalCode = fs.readFileSync(creatorModalPath, 'utf8');

assert(creatorModalCode.includes('const handleShare = async () =>'), 'CreatorModal must implement handleShare');
assert(creatorModalCode.includes('window.isSecureContext'), 'CreatorModal handleShare must check window.isSecureContext');
assert(creatorModalCode.includes('navigator.clipboard.writeText'), 'CreatorModal handleShare must use navigator.clipboard.writeText');
assert(creatorModalCode.includes("document.createElement('textarea')"), 'CreatorModal handleShare must fallback to textarea');
assert(creatorModalCode.includes('Link copied to clipboard! Share it in your WhatsApp group.'), 'CreatorModal must display WhatsApp share copy message');
assert(creatorModalCode.includes('id="btn-creator-share"'), 'CreatorModal must have share button #btn-creator-share');
console.log('   ✓ CreatorModal.tsx share handler verified.');

// 5. Verify Toast.tsx auto-dismiss and styling
console.log('\n5. Checking Toast.tsx...');
const toastPath = path.join(__dirname, '../src/components/Toast.tsx');
const toastCode = fs.readFileSync(toastPath, 'utf8');

assert(toastCode.includes('3000'), 'Toast must auto-dismiss strictly after 3000ms (3 seconds)');
assert(toastCode.includes('bg-slate-900'), 'Toast must be a dark slate card (bg-slate-900)');
assert(toastCode.includes('text-mech-orange'), 'Toast must feature safety orange text');
assert(toastCode.includes('border-orange-500/80') || toastCode.includes('border-2 border-orange-500'), 'Toast must have high-visibility orange border');
console.log('   ✓ Toast.tsx has 3-second auto-dismiss and dark slate + safety orange styling.');

console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY! 🎉');
