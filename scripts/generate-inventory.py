import os
import re

content_dir = "./src/content/pages"
output_file = "./DATABASE.md"
public_file = "./public/DATABASE.md"

print("Generating database inventory...")

files_by_folder = {}

def get_frontmatter_value(content, key):
    match = re.search(rf'^{key}:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return ""

def get_categories(content):
    match = re.search(r'^categories:\s*\n((?:\s*-\s*.*?\n)+)', content, re.MULTILINE)
    if match:
        lines = match.group(1).strip().split('\n')
        return [re.sub(r'^\s*-\s*["\']?(.*?)["\']?$', r'\1', line).strip() for line in lines]
    return []

for root, dirs, files in os.walk(content_dir):
    for file in files:
        if file.endswith('.md'):
            file_path = os.path.join(root, file)
            rel_dir = os.path.relpath(root, content_dir)
            if rel_dir == '.':
                rel_dir = 'root'
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            title = get_frontmatter_value(content, 'title') or file
            desc = get_frontmatter_value(content, 'description')
            categories = get_categories(content)
            
            item = {
                'filename': file,
                'path': file_path.replace('\\', '/'),
                'title': title,
                'description': desc,
                'categories': categories
            }
            
            if rel_dir not in files_by_folder:
                files_by_folder[rel_dir] = []
            files_by_folder[rel_dir].append(item)

# Create public dir if it doesn't exist
os.makedirs(os.path.dirname(public_file), exist_ok=True)

# Generate inventory content
content_buffer = []
content_buffer.append("# Bengal Wiki - Database & Content Inventory\n\n")
content_buffer.append("This file is an automatically generated inventory of all local Markdown corpus pages managed within `src/content/pages/`.\n\n")

total_files = sum(len(items) for items in files_by_folder.values())
content_buffer.append(f"**Total Pages Indexed:** {total_files}\n\n")

# Generate statistics / TOC
content_buffer.append("## Portals & Directories\n\n")
for folder, items in sorted(files_by_folder.items()):
    content_buffer.append(f"- [{folder.upper()}](#{folder.lower()}) ({len(items)} pages)\n")
content_buffer.append("\n---\n\n")

for folder, items in sorted(files_by_folder.items()):
    content_buffer.append(f"## {folder.upper()}\n\n")
    content_buffer.append("| Title | Filename | Categories | Description |\n")
    content_buffer.append("| :--- | :--- | :--- | :--- |\n")
    for item in sorted(items, key=lambda x: x['title']):
        cats = ", ".join([f"`{c}`" for c in item['categories']])
        content_buffer.append(f"| **[{item['title']}]({item['path']})** | `{item['filename']}` | {cats} | {item['description']} |\n")
    content_buffer.append("\n")

full_content = "".join(content_buffer)

# Write to root directory
with open(output_file, 'w', encoding='utf-8') as out:
    out.write(full_content)

# Write to public directory for deployment copy
with open(public_file, 'w', encoding='utf-8') as out:
    out.write(full_content)

print(f"Successfully generated {output_file} and {public_file} with {total_files} pages.")
