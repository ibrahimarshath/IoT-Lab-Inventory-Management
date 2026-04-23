const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// Only create if it doesn't exist
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=5000
MONGO_URI=mongodb+srv://ibrahima_db_user:iot_inventory@cluster0.djwpkxw.mongodb.net/iot_inventory?retryWrites=true&w=majority
JWT_SECRET=supersecretkey_iot_inventory_2024
ALLOWED_EMAIL_DOMAIN=atriauniversity.edu.in
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✓ .env file created successfully');
} else {
  console.log('✓ .env file already exists');
}
