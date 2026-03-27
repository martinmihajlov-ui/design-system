const https = require('https');
const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'icons', 'svg');

// Fetch JSON from a URL
function fetch(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });
}

// Download a file from a URL and save it
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
  });
}

// Convert "Navigation/arrow-chevron-up" → category: "Navigation", name: "arrow-chevron-up"
function parseName(componentName) {
  const parts = componentName.split('/');
  if (parts.length === 2) {
    return { category: parts[0].trim(), name: parts[1].trim() };
  }
  return { category: 'Other', name: parts[parts.length - 1].trim() };
}

async function main() {
  console.log('Fetching file structure from Figma...');
  const file = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`,
    { 'X-Figma-Token': FIGMA_TOKEN }
  );

  const components = file.meta?.components || [];
  console.log(`Found ${components.length} components`);

  // Group by category
  const byCategory = {};
  for (const component of components) {
    const { category, name } = parseName(component.name);
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push({ ...component, iconName: name });
  }

  // Print categories found
  console.log('Categories:', Object.keys(byCategory).join(', '));

  // Get node IDs for all components
  const nodeIds = components.map((c) => c.node_id).join(',');

  console.log('Requesting SVG export URLs from Figma...');
  const images = await fetch(
    `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIds}&format=svg`,
    { 'X-Figma-Token': FIGMA_TOKEN }
  );

  const urls = images.images || {};

  // Download each SVG
  let downloaded = 0;
  for (const component of components) {
    const { category, name: iconName } = parseName(component.name);
    const url = urls[component.node_id];
    if (!url) {
      console.warn(`  No URL for ${component.name}`);
      continue;
    }

    // Create category folder if needed
    const categoryDir = path.join(OUTPUT_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const dest = path.join(categoryDir, `${iconName}.svg`);
    await download(url, dest);
    downloaded++;
    console.log(`  ✓ ${category}/${iconName}.svg`);
  }

  console.log(`\nDone! Downloaded ${downloaded} icons.`);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
