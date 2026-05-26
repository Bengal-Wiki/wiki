# Wiki-Style Internal Linking and Backlinks

This skill defines the workflow to ensure that the Bengal Wiki content remains deeply integrated, high-quality, and highly discoverable—adhering to strict Wikipedia-style cross-linking and reciprocal backlink standards.

## Context
A premium wiki relies on the interconnectedness of its pages. By ensuring related people, places, organizations, and songs are linked bidirectionally, we improve search-engine optimization (SEO), user discoverability, and standard encyclopedic quality.

## Core Rules for Interlinking

1. **Identify Entities**:
   - Before writing or editing any page, scan the current content folders (`src/content/pages/people/`, `/places/`, `/songs/`) to build a list of existing page slugs.
   
2. **Apply Active Internal Links**:
   - Whenever an existing page entity is mentioned in body text, wrap it in a standard markdown link using its absolute slug path.
   - *Example*: Change "Kolkata, West Bengal" to "**[Kolkata](/places/kolkata)**, West Bengal".
   - *Example*: Change "built at the Thera World Skin Clinic" to "built at the **[Thera World Skin Clinic](/places/thera-world-skin-clinic)**".

3. **Enforce Bidirectional Backlinks**:
   - Linking should never be one-way. If Page A links to Page B, then Page B *must* contain a relevant contextual link back to Page A.
   - *Example*: When linking the clinic's page to `[Dr. Manaswita Roy](/people/manaswita-roy)`, ensure Dr. Roy's page is also edited to link to `[Thera World Skin Clinic](/places/thera-world-skin-clinic)`.
   - *Example*: When linking Ritipriya's career to `[Think Again Lab](/people/sayandeep-majumdar)`, ensure Sayandeep's experience under Think Again Lab links back to co-workers or related figures like `[Pritam Sarkar](/people/pritam-sarkar)`.

4. **Preserve Clean Metadata for JSON-LD Schemas**:
   - Do not nest raw HTML or complex markdown inside key frontmatter properties that are serialized for JSON-LD schemas (such as `facts` metadata).
   - Use simple plain text or standard `[Label](url)` format which the layout's link-cleaner can cleanly sanitize into valid search markup.

## Step-by-Step Execution Workflow

1. **Map Existing Slugs**:
   - Run a search or list directories under `/src/content/pages/` to catalog active paths.
   
2. **Scan Text for Matches**:
   - Search the target page's draft content for any matching terms, notable historical figures, cities, clinics, or songs.
   
3. **Insert the Markdown Links**:
   - Map matches using the correct sub-portal prefix (`/people/`, `/places/`, `/songs/`).
   
4. **Apply Reciprocal Edits**:
   - Open any matching related pages in the workspace and edit their context to inject the reciprocal backlinks.
   
5. **Verify Compiles and Routes**:
   - Recompile the static website to ensure all paths resolve cleanly:
     ```bash
     npm run build
     ```
