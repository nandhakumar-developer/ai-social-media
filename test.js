import fs from 'fs';
const key = "AIzaSyCtngc9m3O_KJ2IUfy75XJ4e7NbN_98fM4";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(r => r.json())
  .then(data => {
    fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
  })
  .catch(console.error);
