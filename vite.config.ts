import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Automatic copy mechanism for the Bliss wallpaper
const srcPath = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\7b4bd912-31b5-4e98-91e8-7d915e94ec19\\media__1780391350221.jpg';
const destDir = path.resolve(__dirname, 'public');
const destPath = path.resolve(destDir, 'bliss.jpg');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Successfully copied Bliss wallpaper!');
  }
} catch (e) {
  console.error('Error copying wallpaper:', e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
