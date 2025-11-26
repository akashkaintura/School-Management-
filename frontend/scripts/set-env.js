const fs = require('fs');
const path = require('path');

// Load environment variables
const apiUrl = process.env.API_URL || 'https://school-saas-backend.vercel.app/api';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '766681414146-odluoseqqc8et5377mq1tjhfg2t0beog.apps.googleusercontent.com';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  googleClientId: '${googleClientId}'
};
`;

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
