import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import JScrewIt from 'jscrewit';

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
    console.error('Usage: node encode-html.mjs <input.html> <output.html>');
    process.exit(1);
}

const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);
const html = readFileSync(inputPath, 'utf8');
const encoded = JScrewIt.encode(`document.write(${JSON.stringify(html)})`);

writeFileSync(outputPath, `<script type="text/javascript">${encoded}</script>\n`);
console.log(`Encoded ${inputPath} -> ${outputPath} (${encoded.length} chars)`);
