// scripts/buildMasterSeo.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('=== Starting Master SEO Build for 100 Course Pages ===');

// 1. Build catalog
console.log('1. Compiling 100 Courses Catalog...');
execSync('node scripts/buildCatalog.js', { cwd: rootDir, stdio: 'inherit' });

// 2. Update React data file
console.log('2. Updating ghaziabadCoursesData.js...');
execSync('node scripts/updateGhaziabadCourseData.js', { cwd: rootDir, stdio: 'inherit' });

// 3. Generate HTML pages
console.log('3. Generating 100 Prerendered Static HTML Pages...');
execSync('node scripts/generateHtmlPages.js', { cwd: rootDir, stdio: 'inherit' });

// 4. Update Sitemaps & Robots.txt
console.log('4. Updating XML Sitemaps & Robots.txt...');
execSync('node scripts/updateSitemapsAndRobots.js', { cwd: rootDir, stdio: 'inherit' });

// 5. Sync static assets from frontend/public to dist if dist exists
const distCourses = path.join(rootDir, 'dist/courses');
const distThumbnails = path.join(rootDir, 'dist/assets/images/courses');
if (!fs.existsSync(distCourses)) fs.mkdirSync(distCourses, { recursive: true });
if (!fs.existsSync(distThumbnails)) fs.mkdirSync(distThumbnails, { recursive: true });

console.log('=== Master SEO Build Complete! ===');
