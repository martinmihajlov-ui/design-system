const fs = require('fs');
const path = require('path');
const { transform } = require('@svgr/core');

const SVG_DIR = path.join(__dirname, '..', 'icons', 'svg');
const REACT_DIR = path.join(__dirname, '..', 'icons', 'react');

// Convert kebab-case to PascalCase
// "arrow-chevron-up" → "ArrowChevronUp"
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function main() {
  // Clean and recreate react output directory
  if (fs.existsSync(REACT_DIR)) {
    fs.rmSync(REACT_DIR, { recursive: true });
  }
  fs.mkdirSync(REACT_DIR, { recursive: true });

  const categories = fs.readdirSync(SVG_DIR).filter((f) =>
    fs.statSync(path.join(SVG_DIR, f)).isDirectory()
  );

  const allExports = [];

  for (const category of categories) {
    const categoryDir = path.join(SVG_DIR, category);
    const reactCategoryDir = path.join(REACT_DIR, category);
    fs.mkdirSync(reactCategoryDir, { recursive: true });

    const svgFiles = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.svg'));
    const categoryExports = [];

    for (const svgFile of svgFiles) {
      const iconName = path.basename(svgFile, '.svg');
      const componentName = toPascalCase(iconName);
      const svgCode = fs.readFileSync(path.join(categoryDir, svgFile), 'utf8');

      // Convert SVG to React component using SVGR
      const jsxCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-jsx'],
          typescript: true,
          dimensions: false,
          svgProps: {
            width: '{size}',
            height: '{size}',
            fill: 'none',
          },
          template: ({ componentName, jsx }, { tpl }) => tpl`
            import * as React from 'react';

            interface Props extends React.SVGProps<SVGSVGElement> {
              size?: number | string;
            }

            const ${componentName} = ({ size = 24, ...props }: Props) => (
              ${jsx}
            );

            export default ${componentName};
          `,
        },
        { componentName }
      );

      const outputFile = path.join(reactCategoryDir, `${componentName}.tsx`);
      fs.writeFileSync(outputFile, jsxCode);
      categoryExports.push(componentName);
      console.log(`  ✓ ${category}/${componentName}.tsx`);
    }

    // Write category index.ts
    const categoryIndex = categoryExports
      .map((name) => `export { default as ${name} } from './${name}';`)
      .join('\n');
    fs.writeFileSync(path.join(reactCategoryDir, 'index.ts'), categoryIndex + '\n');
  }

  // Write root index.ts
  const rootIndex = categories
    .map((cat) => `export * from './${cat}';`)
    .join('\n');
  fs.writeFileSync(path.join(REACT_DIR, 'index.ts'), rootIndex + '\n');

  console.log(`\nDone! Generated React components for ${categories.length} categories.`);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
