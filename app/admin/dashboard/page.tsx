'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/admin/articles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setArticles(data.filter((a: any) => a.status === 'published'));
      setDrafts(data.filter((a: any) => a.status === 'draft'));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchArticles();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              <Link href="/admin/settings" className="bg-slate-600 text-white px-3 py-2 text-sm rounded hover:bg-slate-700">
                Settings
              </Link>
              <Link href="/admin/background" className="bg-amber-600 text-white px-3 py-2 text-sm rounded hover:bg-amber-700">
                Background
              </Link>
              <Link href="/admin/engagement" className="bg-purple-600 text-white px-3 py-2 text-sm rounded hover:bg-purple-700">
                Engagement
              </Link>
              <Link href="/admin/editor" className="bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700">
                New Article
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Drafts ({drafts.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((article: any) => (
              <div key={article._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Updated: {format(new Date(article.updatedAt), 'MMM d, yyyy')}
                </p>
                <div className="flex gap-2">
                  <Link href={`/admin/editor/${article._id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Published Articles ({articles.length})</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Published</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article: any) => (
                  <tr key={article._id}>
                    <td className="px-4 sm:px-6 py-4 text-sm">{article.title}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">{article.views}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm hidden sm:table-cell">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <Link href={`/admin/editor/${article._id}`} className="text-blue-600 hover:underline mr-2 sm:mr-4">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
