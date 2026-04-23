const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// Only create if it doesn't exist
if (!fs.existsSync(envPath)) {
  const envContent = `VITE_API_URL=http://localhost:5000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✓ .env file created successfully');
} else {
  console.log('✓ .env file already exists');
}
