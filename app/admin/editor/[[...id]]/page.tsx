'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id?.[0];
  const quillRef = useRef<any>(null);
  
  const [article, setArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: '',
    likesEnabled: true,
    commentsEnabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [quillInstance, setQuillInstance] = useState<any>(null);

  // Image upload handler
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');

      try {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          
          // Try multiple ways to get the Quill instance
          let quill = quillInstance;
          
          if (!quill) {
            // Try to find it from the DOM
            const quillContainer = document.querySelector('.ql-container');
            if (quillContainer && (quillContainer as any).__quill) {
              quill = (quillContainer as any).__quill;
            }
          }
          
          if (!quill) {
            // Try the editor element
            const editorElement = document.querySelector('.ql-editor');
            if (editorElement && (editorElement as any).__quill) {
              quill = (editorElement as any).__quill;
            }
          }
          
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, 'image', data.url);
              quill.setSelection(range.index + 1);
            } else {
              // If no selection, insert at the end
              const length = quill.getLength();
              quill.insertEmbed(length - 1, 'image', data.url);
            }
          } else {
            alert('Editor not ready. Please refresh the page and try again.');
          }
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      }
    };
  };

  // Quill modules - memoized without dependencies to prevent re-creation
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []); // Empty dependency array to prevent recreation

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  // Import article from file
  const handleImportFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.txt,.html,.htm,.md,.markdown,.docx');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setImporting(true);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');

      try {
        const res = await fetch('/api/admin/import-article', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setArticle({
            ...article,
            title: data.title,
            content: data.content,
          });
          alert('Article imported successfully! You can now edit and add details.');
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to import article');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import article');
      } finally {
        setImporting(false);
      }
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    if (articleId) {
      fetchArticle();
    }

    // Try to capture Quill instance with multiple attempts
    let attempts = 0;
    const captureQuill = () => {
      attempts++;
      
      // Try different selectors
      let quillContainer = document.querySelector('.ql-container');
      let quill = (quillContainer as any)?.__quill;
      
      if (!quill) {
        quillContainer = document.querySelector('.ql-editor');
        quill = (quillContainer as any)?.__quill;
      }
      
      if (quill && !quillInstance) {
        setQuillInstance(quill);
      } else if (attempts < 10) {
        // Retry up to 10 times
        setTimeout(captureQuill, 100);
      }
    };
    
    captureQuill();

    const interval = setInterval(() => {
      if (article.title || article.content) {
        autoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [articleId]);

  const fetchArticle = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setArticle({
        ...data,
        tags: data.tags?.join(', ') || '',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const autoSave = async () => {
    const token = localStorage.getItem('token');
    const payload = {
      ...article,
      tags: article.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'draft',
    };

    try {
      const url = articleId ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      await fetch(url, {
        method: articleId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    const token = localStorage.getItem('token');
    const payload = {
      ...article,
      tags: article.tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    };

    try {
      const url = articleId ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      const res = await fetch(url, {
        method: articleId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(status === 'draft' ? 'Draft saved!' : 'Article published!');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Article Editor</h1>
            <button onClick={() => router.push('/admin/dashboard')} className="text-gray-600 hover:text-gray-900 text-sm">
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Import Button */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={handleImportFile}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {importing ? 'Importing...' : 'Import from File'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Import an existing article from .txt, .html, .md, or .docx file
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Title</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter article title"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Excerpt (Optional)</label>
            <textarea
              value={article.excerpt}
              onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Brief summary"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Content</label>
            <ReactQuill
              theme="snow"
              value={article.content}
              onChange={(content) => setArticle({ ...article, content })}
              onChangeSelection={(selection, source, editor) => {
                // Also capture when user interacts with editor
                if (editor && !quillInstance) {
                  setQuillInstance(editor);
                }
              }}
              modules={modules}
              formats={formats}
              className="bg-white"
            />
            <p className="text-sm text-gray-500 mt-2">
              Click the image icon in the toolbar to insert images into your article
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Category</label>
              <input
                type="text"
                value={article.category}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Tags (comma-separated)</label>
              <input
                type="text"
                value={article.tags}
                onChange={(e) => setArticle({ ...article, tags: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                placeholder="buying, investment, tips"
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-3">Visibility Settings</h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={article.likesEnabled}
                  onChange={(e) => setArticle({ ...article, likesEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Enable Likes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={article.commentsEnabled}
                  onChange={(e) => setArticle({ ...article, commentsEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Enable Comments</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Publish Article
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
