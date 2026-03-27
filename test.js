import fs from 'fs';

const key = process.env.GEMINI_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(r => r.json())
  .then(data => {
    fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
  })
  .catch(console.error);