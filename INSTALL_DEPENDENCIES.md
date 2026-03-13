# Install New Dependencies

After pulling these changes, run the following command to install the new packages:

```bash
npm install
```

This will install:
- `mammoth` - For parsing Word (.docx) documents
- `marked` - For converting Markdown to HTML

These packages are required for the new "Import from File" feature in the article editor.

## Feature: Import Article from File

The article editor now supports importing content from existing files:

### Supported Formats:
- `.txt` - Plain text files
- `.html` / `.htm` - HTML files
- `.md` / `.markdown` - Markdown files
- `.docx` - Microsoft Word documents

### How to Use:
1. Go to the article editor
2. Click "Import from File" button (green button at the top)
3. Select a file from your computer
4. The title and content will be automatically populated
5. Edit as needed and add excerpt, category, tags
6. Save as draft or publish

### Notes:
- Maximum file size: 10MB
- Title is extracted from the first heading or filename
- Content formatting is preserved where possible
- After import, you can still edit everything in the rich text editor
