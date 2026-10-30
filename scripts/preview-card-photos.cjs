const fs = require('node:fs/promises');
const sharp = require('sharp');
(async()=>{
 const photos = JSON.parse(await fs.readFile('public/images/card-photos/manifest.json','utf8'));
 const tiles = await Promise.all(photos.map(async(p,i)=>({input:await sharp('public/images/card-photos/'+p.name+'.jpg').resize(230,140,{fit:'cover'}).extend({bottom:26,background:'#ffffff'}).composite([{input:Buffer.from('<svg width="230" height="26"><text x="8" y="18" font-family="Arial" font-size="12">'+p.name+'</text></svg>'),top:140,left:0}]).toBuffer(),left:(i%4)*230,top:Math.floor(i/4)*166})));
 await sharp({create:{width:920,height:Math.ceil(photos.length/4)*166,channels:3,background:'#ffffff'}}).composite(tiles).png().toFile('demo/screenshots/card-photo-contact-sheet.png');
})();