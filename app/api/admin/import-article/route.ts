import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import mammoth from 'mammoth';
import { marked } from 'marked';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    let title = '';
    let content = '';

    // Process based on file type
    if (fileExtension === 'txt') {
      // Plain text
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // First non-empty line as title
      title = lines[0] || 'Untitled Article';
      
      // Rest as content, convert to HTML paragraphs
      content = lines.slice(1)
        .map(line => `<p>${line}</p>`)
        .join('\n');

    } else if (fileExtension === 'html' || fileExtension === 'htm') {
      // HTML file
      const html = await file.text();
      
      // Extract title from h1 or first heading
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                        html.match(/<h2[^>]*>(.*?)<\/h2>/i);
      title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Untitled Article';
      
      // Remove title from content if found
      content = html.replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

    } else if (fileExtension === 'md' || fileExtension === 'markdown') {
      // Markdown file
      const markdown = await file.text();
      const lines = markdown.split('\n');
      
      // Extract title from first # heading
      const titleLine = lines.find(line => line.trim().startsWith('#'));
      title = titleLine ? titleLine.replace(/^#+\s*/, '').trim() : 'Untitled Article';
      
      // Convert markdown to HTML
      const contentMarkdown = lines
        .filter(line => line !== titleLine)
        .join('\n')
        .trim();
      content = await marked(contentMarkdown);

    } else if (fileExtension === 'docx') {
      // Word document
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      const html = result.value;
      
      // Extract title from first heading
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                        html.match(/<h2[^>]*>(.*?)<\/h2>/i) ||
                        html.match(/<p[^>]*><strong>(.*?)<\/strong><\/p>/i);
      title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : file.name.replace(/\.[^/.]+$/, '');
      
      // Remove title from content
      content = html.replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

    } else {
      return NextResponse.json({ 
        error: 'Unsupported file format. Please use .txt, .html, .md, or .docx' 
      }, { status: 400 });
    }

    // Clean up title
    title = title.trim() || 'Untitled Article';
    
    // Ensure content is not empty
    if (!content || content.trim() === '') {
      content = '<p>No content found in the file.</p>';
    }

    return NextResponse.json({ 
      title, 
      content 
    }, { status: 200 });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ 
      error: 'Failed to import article. Please check the file format.' 
    }, { status: 500 });
  }
}
