import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixTypeScriptCarefully(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 1. Remove standalone type declarations at start of line (type X = ...)
    content = content.replace(/^type\s+\w+\s*=\s*[^;]+;?\n*/gm, '');
    
    // 2. Remove standalone interface declarations (handles multi-line)
    content = content.replace(/^interface\s+\w+\s*\{[\s\S]*?\}\n*/gm, '');
    
    // 3. From imports: remove "type" keyword - import { cva, type VariantProps } from -> import { cva } from
    // This is a safer way to remove multiple `type` keywords from an import
    content = content.replace(/import\s*\{([^}]+)\}\s*from/g, (match, group1) => {
      // Remove "type" keyword, then clean up extraneous commas
      let newImports = group1.replace(/type\s+\w+,?/g, '');
      newImports = newImports.replace(/,\s*,/g, ','); // handle case where type was in middle
      newImports = newImports.replace(/^\s*,\s*/, ''); // handle case where type was at start
      newImports = newImports.replace(/,\s*$/, ''); // handle case where type was at end
      return `import { ${newImports.trim()} } from`;
    });
    
    // 4. Fix broken useState calls with remaining type syntax
    // const [x, setX] = useState<Type>(...) -> const [x, setX] = useState(...)
    content = content.replace(/useState<[^>]+>\(/g, 'useState(');
    
    // 5. Fix function parameters with type syntax
    // Handles ({ prop }: Type) =>, (props: Type) =>, etc.
    content = content.replace(/\(\s*({[^}]+}|\w+|\.\.\.\w+)\s*:\s*[\w<>\|&\[\]'"]+\s*\)/g, '($1)');
    
    // 6. Remove " as TypeName" casts - but only when followed by specific patterns
    // theme as ToasterProps["theme"] -> theme
    // This is safer than before
    // This regex avoids removing 'as' from import/export statements.
    content = content.replace(/(?<!\b(import|export)\s*{[^}]*)\s+as\s+[\w<>|&\[\]'"]+(?=\s*[,)\n};]|\s*$)/g, '');
    
    // 7. Fix specific problematic patterns from the destructuring cleanup
    // The script may have left some broken syntax like { ...props }: Type
    // Fix: ( { ...props }: Type ) -> ( { ...props } )
    
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
      fixTypeScriptCarefully(filePath);
    }
  });
}

const srcDir = path.join(__dirname, 'src');
console.log('Fixing TypeScript in JSX files...');
walkDir(srcDir);
console.log('Done!');
