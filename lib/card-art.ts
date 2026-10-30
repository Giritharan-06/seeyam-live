export const artObjects = ["bars", "database", "laptop", "pie", "sheet", "funnel", "network", "code", "target", "megaphone", "phone", "envelope", "rocket", "camera", "audience", "globe", "building", "pin", "books", "desk", "calendar", "clock", "trophy", "briefcase", "medal", "speech", "stars", "certificate", "gear", "lock", "shield", "folder"] as const;
export type ArtObject = typeof artObjects[number];

export const artGroups: Record<string, readonly ArtObject[]> = {
  analytics: ["bars", "database", "laptop", "pie", "sheet", "funnel", "network", "code"],
  marketing: ["megaphone", "target", "phone", "envelope", "rocket", "camera", "audience", "globe"],
  campus: ["building", "pin", "desk", "globe", "books", "laptop", "audience", "certificate"],
  learning: ["books", "certificate", "code", "folder", "sheet", "laptop", "database", "globe"],
  review: ["speech", "stars", "medal", "audience", "certificate", "trophy", "envelope", "phone"],
  calendar: ["calendar", "clock", "desk", "laptop", "books", "audience", "pin", "sheet"],
  growth: ["trophy", "briefcase", "rocket", "target", "medal", "bars", "certificate", "network"],
  settings: ["gear", "lock", "shield", "folder", "network", "code", "clock", "sheet"],
};

export function artHash(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return hash >>> 0;
}

const palettes = [
  ["#65d5ff", "#2563eb", "#8ef0cb", "#109c88", "#ffe393", "#f6a027"],
  ["#c4b5fd", "#7c3aed", "#92dcff", "#1685c6", "#ffc7ad", "#ee7869"],
  ["#81ead3", "#0d9488", "#f9b4d8", "#ce548e", "#b4caff", "#4d6ad4"],
  ["#ffcbaa", "#f27956", "#9ce2ff", "#178bb5", "#e1c6ff", "#9061d2"],
  ["#a4c5ff", "#4263c7", "#ffdf87", "#dba42f", "#a0efd8", "#209d89"],
  ["#f5b5e1", "#bd58a0", "#c5c0ff", "#7769cc", "#a2e2f6", "#259cba"],
];

function rect(x: number, y: number, w: number, h: number, fill = "url(#a)", radius = 7) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`; }
function line(x1: number,y1: number,x2: number,y2: number,stroke="url(#a)",width=5) { return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`; }
function circle(x:number,y:number,r:number,fill="url(#a)") { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`; }
function block(x:number,y:number,w:number,h:number,fill="url(#a)") { return `<path d="M${x} ${y}l10 -6h${w}l-10 6Z" fill="${fill}" opacity=".65"/>${rect(x,y,w,h,fill,3)}<path d="M${x+w} ${y}l10 -6v${h}l-10 6Z" fill="#173b70" opacity=".3"/>`; }
function paper(x=58,y=28) { return `${rect(x+5,y+5,78,89,"#abc2e3")}${rect(x,y,78,89,"url(#paper)")}`; }
function spark(x:number,y:number,color:string) { return `<path d="M${x} ${y-6}Q${x+1} ${y-1} ${x+6} ${y}Q${x+1} ${y+1} ${x} ${y+6}Q${x-1} ${y+1} ${x-6} ${y}Q${x-1} ${y-1} ${x} ${y-6}" fill="${color}"/>`; }

function subject(kind: ArtObject, seed: number): string {
  const v = seed % 3;
  switch(kind) {
    case "bars": return block(42,83-v*3,23,37+v*3)+block(79,61-v*5,23,59+v*5,"url(#b)")+block(116,36+v*4,23,84-v*4,"url(#c)")+`<path d="M43 67l37-23 37 6 23-26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
    case "database": return [85,62,39].map((y,i)=>`${rect(54,y,85,25,i===1?"url(#b)":"url(#a)",3)}<ellipse cx="96.5" cy="${y}" rx="42.5" ry="13" fill="${i===1?'url(#b)':'url(#a)'}" stroke="#fff" stroke-opacity=".6"/>${circle(124,y+14,3,"#fff")}`).join('');
    case "laptop": return `${rect(39,27,119,79,"#1b3b65")}${rect(45,33,107,64,"url(#paper)",3)}${block(55,65,13,24)}${block(82,54,13,35,"url(#b)")}${block(109,44,13,45,"url(#c)")}<path d="M39 106h119l21 17H19Z" fill="url(#paper)" stroke="#b7cae6" stroke-width="2"/>${rect(66,111,64,4,"#afc3e0",2)}`;
    case "pie": return `<ellipse cx="97" cy="93" rx="48" ry="34" fill="#22518a"/><ellipse cx="97" cy="83" rx="48" ry="34" fill="url(#a)"/><path d="M97 83V49c27 0 48 15 48 34Z" fill="url(#c)"/><path d="M97 83l48 0c0 19-21 34-48 34Z" fill="url(#b)"/>${circle(97,83,14,"url(#paper)")}`;
    case "sheet": return `${paper()}${rect(66,38,62,14,"url(#a)",3)}${[60,74,88,102].map(y=>[67,88,109].map((x,i)=>rect(x,y,17,10,i===(y/2)%3?'url(#c)':'#c3daf1',2)).join('')).join('')}`;
    case "funnel": return `<path d="M43 37h109l-39 51v29l-29 13V88Z" fill="url(#a)"/><ellipse cx="97.5" cy="37" rx="54.5" ry="15" fill="url(#b)" stroke="#fff" stroke-opacity=".5"/>${circle(71,35,6,"url(#c)")}${circle(94,40,5,"#fff")}${circle(117,32,5,"url(#c)")}`;
    case "network": return `<path d="M97 76L45 43M97 76l58-35M97 76l-55 46M97 76l53 47" stroke="#b4cdec" stroke-width="5"/>${circle(97,76,24)}${circle(45,43,16,'url(#b)')}${circle(155,41,16,'url(#c)')}${circle(42,122,16,'url(#c)')}${circle(150,123,16,'url(#b)')}${circle(97,76,9,'#fff')}`;
    case "code": return `${rect(39,28,119,93,"#214568")}${rect(44,31,109,83,"url(#paper)",4)}${circle(54,42,3,'url(#c)')}${circle(64,42,3,'url(#b)')}<path d="M78 60L61 76l17 16m36-32 17 16-17 16m-12-22-11 37" fill="none" stroke="url(#a)" stroke-width="7" stroke-linecap="round"/>`;
    case "target": return `${circle(96,78,48,'#58789e')}${circle(91,73,48,'url(#c)')}${circle(91,73,35,'#fff')}${circle(91,73,24,'url(#a)')}${circle(91,73,12,'#fff')}<path d="M94 70l53-44m-4 3 1-19 17 1-2 18Z" fill="url(#b)" stroke="url(#b)" stroke-width="7" stroke-linecap="round"/>`;
    case "megaphone": return `<path d="M61 91l8 32h19l-5-38Z" fill="url(#b)"/><path d="M52 55l73-24v79L52 88Z" fill="url(#a)"/><ellipse cx="125" cy="71" rx="19" ry="41" fill="url(#c)"/><ellipse cx="125" cy="71" rx="11" ry="31" fill="#304b72"/>${rect(42,55,19,34,'url(#b)',9)}${line(154,49,167,41,'url(#c)',4)}${line(157,71,175,71,'url(#c)',4)}${line(154,94,167,102,'url(#c)',4)}`;
    case "phone": return `${rect(65,19,72,117,'#364c71',12)}${rect(61,15,72,117,'url(#a)',12)}${rect(67,26,60,95,'url(#paper)',7)}${rect(83,21,29,4,'#fff',3)}${[51,77,101].map((y,i)=>`${circle(80,y,7,i%2?'url(#b)':'url(#c)')}${rect(94,y-4,25,6,'#a7bfd9',2)}`).join('')}`;
    case "envelope": return `${rect(36,47,128,77,'url(#a)',9)}<path d="M36 51l64 46 64-46" fill="url(#paper)"/><path d="M36 119l43-37m85 37-43-37" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>${paper(65,20).replaceAll('78','66').replaceAll('89','51')}${line(76,35,119,35,'url(#b)',5)}${line(76,48,108,48,'#c4d7ed',4)}`;
    case "rocket": return `<path d="M76 102l21 35 22-35" fill="url(#c)"/><path d="M74 69l-23 40 24-8m48-32 23 40-24-8" fill="url(#b)"/><path d="M73 99C65 58 80 28 98 15c18 13 33 43 25 84Z" fill="url(#paper)"/><path d="M80 38l18-23 18 23Z" fill="url(#a)"/>${circle(98,61,14,'url(#a)')}${circle(98,61,8,'#e0f7ff')}${rect(91,87,14,27,'url(#b)',4)}`;
    case "camera": return `${rect(37,53,99,65,'url(#a)',12)}${rect(58,38,39,21,'url(#b)',5)}${circle(87,85,25,'#304764')}${circle(87,85,18,'url(#b)')}${circle(87,85,9,'#c5f0ff')}<path d="M136 65l31-18v77l-31-17Z" fill="url(#c)"/>`;
    case "audience": return [ [48,62,'url(#b)'],[148,62,'url(#c)'],[98,44,'url(#a)'] ].map(([x,y,c])=>`${circle(Number(x),Number(y),18,String(c))}${rect(Number(x)-24,Number(y)+22,48,44,String(c),17)}${circle(Number(x)-5,Number(y)-5,4,'#ffffff55')}`).join('');
    case "globe": return `${rect(89,108,18,16,'url(#b)',4)}${rect(63,120,69,9,'url(#paper)',4)}${circle(97,67,47,'url(#a)')}<ellipse cx="97" cy="67" rx="23" ry="47" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/><path d="M51 67h92M59 43h76M59 91h76" stroke="#fff" stroke-opacity=".6" stroke-width="2"/><path d="M50 20c-39 81 81 164 96 45" fill="none" stroke="url(#c)" stroke-width="6" stroke-linecap="round"/>`;
    case "building": return `${block(40,53,45,72,'url(#a)')}${block(88,30,49,95,'url(#b)')}${[45,63,81,99].map(y=>[100,118].map(x=>rect(x,y,10,9,'#dcfaff',1)).join('')).join('')}${[67,86,105].map(y=>rect(50,y,23,8,'#dcfaff',1)).join('')}${rect(105,112,14,14,'#26456f',1)}${circle(156,111,15,'url(#c)')}${rect(153,117,5,13,'#497680',1)}`;
    case "pin": return `<path d="M34 100l44-14 45 15 39-14v38l-39 14-45-15-44 14Z" fill="url(#paper)"/><path d="M78 86v38m45-23v38" stroke="#aac5e1" stroke-width="2"/><path d="M100 18c-48 0-50 43 0 84 50-41 48-84 0-84Z" fill="url(#a)"/>${circle(100,49,15,'#fff')}${circle(100,49,7,'url(#c)')}`;
    case "books": return [ [47,98,'url(#a)'],[61,73,'url(#b)'],[44,47,'url(#c)'] ].map(([x,y,c])=>`<path d="M${x} ${y}l72-13 32 10-72 14Z" fill="${c}"/><path d="M${x} ${y}v15l32 11v-15Z" fill="${c}"/><path d="M${Number(x)+32} ${Number(y)+11}l72-14v15l-72 14Z" fill="url(#paper)"/><path d="M${Number(x)+38} ${Number(y)+17}l60-12" stroke="#adc4df" stroke-width="2"/>`).join('');
    case "desk": return `${block(42,76,109,12,'url(#c)')}${rect(48,88,7,42,'#547794',2)}${rect(133,88,7,42,'#547794',2)}${rect(73,33,61,40,'#233e68',4)}${rect(78,38,51,29,'url(#a)',2)}${rect(99,72,7,10,'#5e7f9a',2)}${rect(61,66,13,11,'url(#b)',3)}${circle(162,80,13,'url(#b)')}${rect(157,95,9,34,'#c1d7e7',2)}`;
    case "calendar": return `${rect(48,31,104,95,'#a6c1de',9)}${rect(43,26,104,95,'url(#paper)',9)}${rect(43,26,104,25,'url(#a)',6)}${[64,121].map(x=>rect(x,16,8,23,'url(#c)',4)).join('')}${[65,85,105].map((y,i)=>[59,85,111].map((x,j)=>rect(x,y,13,10,(i+j+v)%4===0?'url(#b)':'#c9dcee',2)).join('')).join('')}`;
    case "clock": return `${circle(102,79,47,'#3c5e80')}${circle(96,72,47,'url(#a)')}${circle(96,72,36,'url(#paper)')}<path d="M96 47v26l18 12" fill="none" stroke="url(#b)" stroke-width="6" stroke-linecap="round"/>${circle(96,72,5,'url(#c)')}${[0,90,180,270].map(angle=>`<path d="M96 40v5" stroke="#6a91b7" stroke-width="3" transform="rotate(${angle} 96 72)"/>`).join('')}`;
    case "trophy": return `<path d="M66 38H45c-1 30 9 42 28 40m56-40h20c1 30-9 42-28 40" fill="none" stroke="url(#c)" stroke-width="9"/><path d="M63 26h72l-8 48c-4 22-52 22-56 0Z" fill="url(#c)"/>${rect(91,86,14,31,'url(#c)',2)}${rect(73,114,49,12,'url(#a)',4)}${spark(98,55,'#fff')}`;
    case "briefcase": return `${rect(72,29,50,23,'url(#b)',6)}${rect(79,36,36,15,'#edf5ff',3)}${rect(35,47,132,78,'url(#a)',10)}${rect(35,47,132,35,'url(#b)',9)}${rect(89,71,21,20,'url(#c)',4)}${line(57,60,57,109,'#ffffff55',3)}${line(145,60,145,109,'#ffffff55',3)}`;
    case "medal": return `<path d="M58 16h33l13 54-23 19Zm47 0h33l-21 73-23-19Z" fill="url(#a)"/>${circle(97,97,34,'url(#c)')}${circle(97,97,25,'#fff0b6')}${spark(97,97,'#e5a22c')}`;
    case "speech": return `${rect(39,28,117,75,'#2e4b76',17)}${rect(34,22,117,75,'url(#a)',17)}<path d="M60 89v31l32-31Z" fill="url(#a)"/>${[63,91,119].map(x=>circle(x,59,6,'#fff')).join('')}`;
    case "stars": return `<path d="M101 19l14 31 35 4-26 24 7 35-30-17-31 17 7-35-26-24 35-4Z" fill="#304e7c"/><path d="M96 13l14 31 35 4-26 24 7 35-30-17-31 17 7-35-26-24 35-4Z" fill="url(#c)"/>${spark(44,108,'url(#a)')}${spark(155,109,'url(#b)')}`;
    case "certificate": return `${paper(47,24)}${rect(58,38,56,7,'url(#a)',3)}${rect(58,54,49,5,'#bed2e8',2)}${rect(58,65,38,5,'#bed2e8',2)}<path d="M111 91l-12 40 17-8 11 13 5-43Z" fill="url(#a)"/>${circle(123,85,22,'url(#c)')}${spark(123,85,'#fff')}`;
    case "gear": return `<g transform="rotate(${v*15} 98 76)">${[0,45,90,135,180,225,270,315].map(angle=>`<rect x="86" y="20" width="24" height="33" rx="5" fill="url(#a)" transform="rotate(${angle} 98 76)"/>`).join('')}${circle(98,76,43,'url(#a)')}${circle(98,76,22,'url(#paper)')}${circle(98,76,12,'#4c6c94')}</g>`;
    case "lock": return `<path d="M69 65V44c0-36 57-36 57 0v21" fill="none" stroke="url(#b)" stroke-width="13"/>${rect(51,60,94,68,'url(#a)',12)}${circle(98,85,9,'url(#c)')}${rect(94,89,8,20,'url(#c)',3)}`;
    case "shield": return `<path d="M101 23l50 19v39c-6 33-27 48-50 58-23-10-44-25-50-58V42Z" fill="#365b85"/><path d="M96 18l50 19v39c-6 33-27 48-50 58-23-10-44-25-50-58V37Z" fill="url(#a)"/><path d="M70 73l18 17 34-36" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "folder": return `<path d="M35 47V30h51l15 17h59v74H35Z" fill="url(#b)"/><path d="M29 56h135l-13 72H40Z" fill="url(#c)"/>${rect(59,70,65,8,'#fff9',3)}${rect(59,87,44,6,'#fff7',3)}`;
  }
}

export function createCardArt(kind: ArtObject, seed: number) {
  const colors = palettes[seed % palettes.length];
  const tilt = ((seed >>> 5) % 9) - 4;
  const companion = artObjects[(seed >>> 10) % artObjects.length];
  const defs = ['a','b','c'].map((id,i)=>`<linearGradient id="${id}" x2=".3" y2="1"><stop stop-color="${colors[i*2]}"/><stop offset="1" stop-color="${colors[i*2+1]}"/></linearGradient>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 170"><defs>${defs}<linearGradient id="paper" x2=".3" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d7e7f7"/></linearGradient><filter id="shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="1" dy="7" stdDeviation="4" flood-color="#173b70" flood-opacity=".18"/></filter></defs><ellipse cx="111" cy="147" rx="82" ry="11" fill="#375a85" opacity=".11"/><g transform="translate(5 0) rotate(${tilt} 100 85)" filter="url(#shadow)">${subject(kind,seed)}</g><g transform="translate(${165+seed%7} ${84+(seed>>>7)%16}) scale(.28)" filter="url(#shadow)">${subject(companion,seed+1)}</g>${spark(192,29,colors[4])}${circle(28,32,3,colors[0])}${circle(213,70,2,colors[2])}<path d="M29 124h8m-4-4v8" stroke="${colors[3]}" stroke-width="2" stroke-linecap="round"/></svg>`;
}
