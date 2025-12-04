const fs = require('fs');
const path = require('path');

// Remove TypeScript syntax from JSX files
function cleanTypeScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove `type VariantProps` from imports
    content = content.replace(/import\s*{\s*cva,\s*type\s+VariantProps\s*}\s*from\s*(".*?")/g, 'import { cva } from $1');
    
    // Remove `type Mode` imports
    content = content.replace(/import\s*{\s*([^}]*?),\s*type\s+VariantProps\s*([^}]*?)\s*}\s*from\s*(".*?")/g, 'import { $1$2 } from $3');
    
    // Remove standalone `type` declarations (e.g., type Mode = 'admin' | 'user';)
    content = content.replace(/\ntype\s+\w+\s*=\s*[^;]+;/g, '');
    
    // Remove standalone `interface` declarations
    content = content.replace(/\ninterface\s+\w+\s*{[^}]+}/gs, '');
    
    // Remove type annotations from function parameters: (param: Type) => (param) =>
    content = content.replace(/({[^}]*})\s*:\s*\w+/g, '$1');
    
    // Remove `: TypeName` type annotations
    content = content.replace(/:\s+[\w<>|&\[\]'"]*(?=[,)\n\s])/g, '');
    
    // Remove `as TypeName` type assertions  
    content = content.replace(/\s+as\s+[\w<>|&\[\]'"]+/g, '');
    
    // Remove `ToasterProps` type from destructuring
    content = content.replace(/}\s*:\s*\w+\s*\)/g, '}$&'.replace(/}\s*:\s*\w+/, '}'));
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

// Find all JSX files
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx')) {
      cleanTypeScript(filePath);
    }
  });
}

const srcDir = path.join(__dirname, 'src');
walkDir(srcDir);
console.log('TypeScript cleanup complete!');
