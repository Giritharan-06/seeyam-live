const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.tsx')) files.push(file);
  }
}
walk(path.join(process.cwd(), 'app'));
walk(path.join(process.cwd(), 'components'));
const changes = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const additions = [];
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(tree);
      const attrs = node.attributes.properties;
      const classAttr = attrs.find(attr => attr.name?.getText(tree) === 'className');
      const classes = classAttr?.initializer?.getText(tree) || '';
      if (['div', 'section', 'article', 'aside', 'Link', 'a', 'form'].includes(tag)
        && /rounded-(?:2xl|3xl)/.test(classes) && /bg-/.test(classes)
        && /\bborder(?:\s|-)/.test(classes) && /\bp-(?:4|5|6|7|8|10|12)\b/.test(classes)
        && !attrs.some(attr => attr.name?.getText(tree) === 'data-card-3d')
        && !/\bfixed\b|\babsolute\b|card-3d-hover/.test(classes)) {
        const name = file.toLowerCase();
        const theme = /branch|campus/.test(name) ? 'campus' : /batch/.test(name) ? 'calendar'
          : /review|contact/.test(name) ? 'review' : /placement|jobportal/.test(name) ? 'growth'
          : /resource|syllabus|interview|blog|faq|about/.test(name) ? 'learning'
          : name.includes(`${path.sep}admin${path.sep}`) ? 'settings' : 'analytics';
        const density = /grid|items-center|space-y|form|modal/i.test(classes + tag + name) ? 'compact' : 'regular';
        additions.push({ position: node.attributes.end, text: ` data-card-3d="${theme}" data-card-density="${density}"` });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (additions.length) {
    changes.push({ file: path.relative(process.cwd(), file), count: additions.length });
    if (process.argv.includes('--write')) {
      let result = source;
      for (const change of additions.sort((a, b) => b.position - a.position)) result = result.slice(0, change.position) + change.text + result.slice(change.position);
      fs.writeFileSync(file, result);
    }
  }
}
console.log(JSON.stringify(changes, null, 2));
