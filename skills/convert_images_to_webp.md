# Convert Images to WebP

This skill defines the workflow to automatically optimize and convert any new or updated images in the Bengal Wiki workspace into high-performance `.webp` format.

## Context
Bengal Wiki is an Astro-based content website. To ensure maximum loading speed and optimal performance, all images must be saved in `.webp` format in the static assets directory (`public/images/`).

## Step-by-Step Workflow

1. **Locate the Input Image**:
   - Check the user's request and the conversation brain directory (e.g. `/Users/sumitkar/.gemini/antigravity/brain/<conversation-id>/`) for any newly uploaded images.
   - Note the exact filename of the uploaded image (e.g. `media__12345.png` or `media__67890.jpg`).

2. **Copy the Image to Assets**:
   - Copy the image from the brain directory to the wiki's public images directory:
     ```bash
     cp "/Users/sumitkar/.gemini/antigravity/brain/<conversation-id>/media__12345.png" "/Users/sumitkar/Documents/code/bengal.wiki/public/images/slug-name.png"
     ```
   - Keep the target name clean and consistent with the page's slug (e.g. `nidhi-agarwal.png`, `pritam-sarkar.png`).

3. **Run the WebP Conversion Script**:
   - Change directory or execute the conversion script relative to `/Users/sumitkar/Documents/code/bengal.wiki`:
     ```bash
     npm run convert-images
     ```
   - This executes the custom script `scripts/convert-to-webp.js` which automatically:
     1. Scans `public/images/` for any `.png`, `.jpg`, or `.jpeg` files.
     2. Uses `sharp` to convert them to `.webp` format with a quality rating of `85%`.
     3. Deletes the original source images (`.png`/`.jpg`).
     4. Scans and updates any existing markdown files in `src/` to point to the new `.webp` filenames.

4. **Reference in Markdown Content**:
   - Ensure the `image` field in your page frontmatter points directly to the optimized path (e.g., `image: "/images/slug-name.webp"`).
   - Verify the image compiles and displays correctly by running `npm run build`.
