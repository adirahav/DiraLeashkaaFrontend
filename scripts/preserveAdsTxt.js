import { copyFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve the current directory (__dirname equivalent)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the source and destination paths
const adsTxtSrc = join(__dirname, '../ads.txt'); // Source file path
const adsTxtDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/ads.txt'); // Destination file path

// Copy the file from source to destination
try {
  await copyFile(adsTxtSrc, adsTxtDest);
  console.log('ads.txt has been successfully copied to the backend public directory.');
} catch (err) {
  console.error('Error copying ads.txt:', err);
}
