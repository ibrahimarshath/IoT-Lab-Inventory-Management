import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixTypeScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Only remove type VariantProps from imports - not cva
    content = content.replace(/import\s+{\s*cva,\s*type\s+VariantProps\s*}\s+from/g, 'import { cva } from');
    
    // Remove standalone type declarations (type X = ...)
    content = content.replace(/^type\s+\w+\s*=\s*[^;]+;?\n*/gm, '');
    
    // Remove standalone interface declarations  
    content = content.replace(/^interface\s+\w+\s*\{[^}]*\}\n*/gm, '');
    
    // Remove ` as TypeName` type assertions - but be careful not to remove valid keywords
    content = content.replace(/\s+as\s+[\w<>|&\[\]'"]+(?=\s|;|,|\)|])/g, '');
    
    // From component function params, remove type annotations like ({ ...props }: ToasterProps)
    // Change to ({ ...props }) 
    content = content.replace(/\(\s*{\s*([^}]+)\s*}\s*:\s*\w+\s*\)/g, '({ $1 })');
    content = content.replace(/\(\s*\.\.\.\s*(\w+)\s*:\s*\w+\s*\)/g, '(...$1)');
    
    // Generic types in function params - e.g., (props: SomeType) => becomes (props) =>
    // But only for obvious TypeScript patterns
    content = content.replace(/\(\s*(\w+)\s*:\s*[\w<>|&\[\]]+\s*\)/g, '($1)');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Error: ${path.basename(filePath)} - ${error.message}`);
    return false;
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx')) {
      fixTypeScript(filePath);
    }
  });
}

const srcDir = path.join(__dirname, 'src');
console.log('Fixing TypeScript in JSX files...');
walkDir(srcDir);
console.log('Done!');
