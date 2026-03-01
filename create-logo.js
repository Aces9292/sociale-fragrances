const { createCanvas } = require('canvas');
const fs = require('fs');

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// White background
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, 512, 512);

// SOCIALE text
ctx.fillStyle = '#000000';
ctx.font = 'bold 72px serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('SOCIALE', 256, 220);

// Tagline
ctx.fillStyle = '#666666';
ctx.font = '24px serif';
ctx.fillText('Handcrafted Candles', 256, 300);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/home/alex/clawd/sociale-nextjs/public/images/SOCIALE-logo-512.png', buffer);

const stats = fs.statSync('/home/alex/clawd/sociale-nextjs/public/images/SOCIALE-logo-512.png');
console.log('✅ Logo created!');
console.log('File: SOCIALE-logo-512.png');
console.log('Dimensions: 512x512');
console.log('Size:', (stats.size/1024).toFixed(1), 'KB');
console.log('Format: PNG');