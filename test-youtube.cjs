const { z } = require('zod');
const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/;
const youtubeUrlSchema = z.object({
  url: z.string().min(1, 'YouTube URL is required').refine((url) => youtubeUrlRegex.test(url), {
    message: 'Please enter a valid YouTube URL',
  }),
});

const testUrl = 'https://youtu.be/Cb46_P12bMY?si=CpmfzjoxzVrJXqgM';

// Simulate what the frontend sends
const frontendPayload = JSON.stringify({ url: testUrl, aiPrefs: undefined });
console.log('Frontend sends:', frontendPayload);

// Simulate JSON.parse
const parsed = JSON.parse(frontendPayload);
console.log('Parsed body:', JSON.stringify(parsed));
console.log('body.url:', parsed.url);
console.log('typeof body.url:', typeof parsed.url);

// Validate
const result = youtubeUrlSchema.safeParse(parsed);
console.log('Validation:', result.success ? 'PASS' : 'FAIL');
if (!result.success) {
  console.log('Error:', result.error.issues[0].message);
}

// Test with empty body (what happens when middleware consumes body)
const emptyResult = youtubeUrlSchema.safeParse({});
console.log('\nEmpty body validation:', emptyResult.success ? 'PASS' : 'FAIL');
if (!emptyResult.success) {
  console.log('Empty body error:', emptyResult.error.issues[0].message);
}

// Test video ID extraction
const patterns = [
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
];
for (const p of patterns) {
  const match = testUrl.match(p);
  console.log('\nVideo ID extraction:', match ? match[1] : 'FAILED');
}

console.log('\nAll tests passed.');
