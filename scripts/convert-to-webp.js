import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = './public/images';
const SRC_DIR = './src';

// Recursively get all files in a directory matching specific extensions
function getFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

async function run() {
  console.log('--- Starting WebP Image Conversion & Link Update ---');

  // 1. Find all PNG, JPG, and JPEG images inside the public images directory
  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  const imageFiles = getFiles(IMAGES_DIR, imageExtensions);

  if (imageFiles.length === 0) {
    console.log('No PNG or JPG images found in', IMAGES_DIR);
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to convert...`);
  const replacements = [];

  for (const imgPath of imageFiles) {
    const ext = path.extname(imgPath);
    const baseName = path.basename(imgPath, ext);
    const dirName = path.dirname(imgPath);
    const webpPath = path.join(dirName, `${baseName}.webp`);

    console.log(`Converting: ${path.basename(imgPath)} -> ${baseName}.webp`);
    
    // Process conversion using sharp
    await sharp(imgPath)
      .webp({ quality: 85 })
      .toFile(webpPath);

    // Track filename replacement mappings
    replacements.push({
      old: path.basename(imgPath),
      new: `${baseName}.webp`
    });

    // Delete the original image to clean up assets
    fs.unlinkSync(imgPath);
    console.log(`Deleted original: ${path.basename(imgPath)}`);
  }

  console.log('\n--- Scanning & Updating References in Source Files ---');

  // 2. Scan all Astro, Markdown, and TypeScript files in src/
  const textExtensions = ['.md', '.mdx', '.astro', '.ts', '.js'];
  const textFiles = getFiles(SRC_DIR, textExtensions);

  let updatedFilesCount = 0;

  for (const textFilePath of textFiles) {
    let content = fs.readFileSync(textFilePath, 'utf8');
    let hasChanges = false;

    for (const replacement of replacements) {
      const oldFilename = replacement.old;
      const newFilename = replacement.new;

      if (content.includes(oldFilename)) {
        console.log(`Found reference to "${oldFilename}" in: ${path.relative('.', textFilePath)}`);
        
        // Globally replace the image filename
        const regex = new RegExp(oldFilename, 'g');
        content = content.replace(regex, newFilename);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(textFilePath, content, 'utf8');
      console.log(`Successfully updated: ${path.relative('.', textFilePath)}`);
      updatedFilesCount++;
    }
  }

  console.log(`\nWebP conversion & reference updates completed successfully! Updated ${updatedFilesCount} file(s).`);
}

run().catch(err => {
  console.error('Error during WebP conversion script execution:', err);
});
