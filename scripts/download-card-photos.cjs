const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
 const root = path.resolve(__dirname, '../public/images/card-photos');
 const photos = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
 for (let offset = 0; offset < photos.length; offset += 4) {
  await Promise.all(photos.slice(offset, offset + 4).map(async photo => {
   const res = await fetch('https://images.pexels.com/photos/' + photo.id + '/pexels-photo-' + photo.id + '.jpeg?auto=compress&cs=tinysrgb&w=800', {signal: AbortSignal.timeout(30000)});
   if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) throw new Error(photo.name + ': ' + res.status);
   const bytes = Buffer.from(await res.arrayBuffer());
   await fs.writeFile(path.join(root, photo.name + '.jpg'), bytes);
   console.log(photo.name + ': ' + Math.round(bytes.length/1024) + ' KB');
  }));
 }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
