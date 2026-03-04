'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id?.[0];
  
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    if (articleId) {
      fetchArticle();
    }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Article Editor</h1>
          <button onClick={() => router.push('/admin/dashboard')} className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
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
              className="bg-white"
            />
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
