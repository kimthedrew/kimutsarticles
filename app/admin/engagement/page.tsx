'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default function EngagementPage() {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comments');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [commentsRes, articlesRes] = await Promise.all([
        fetch('/api/admin/comments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/articles', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const commentsData = await commentsRes.json();
      const articlesData = await articlesRes.json();

      setComments(commentsData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAction = async (commentId: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' }),
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleFeature = async (articleId: string, feature: 'likesEnabled' | 'commentsEnabled', value: boolean) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [feature]: value }),
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pendingComments = comments.filter((c: any) => c.status === 'pending');
  const approvedComments = comments.filter((c: any) => c.status === 'approved');


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Engagement Management</h1>
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'comments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('visibility')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'visibility'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visibility Settings
            </button>
          </nav>
        </div>

        {activeTab === 'comments' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Pending Comments
                {pendingComments.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                    {pendingComments.length}
                  </span>
                )}
              </h2>
              {pendingComments.length === 0 ? (
                <p className="text-gray-500">No pending comments</p>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment: any) => (
                    <div key={comment._id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-sm text-gray-500">{comment.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{comment.content}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCommentAction(comment._id, 'approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleCommentAction(comment._id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Approved Comments ({approvedComments.length})</h2>
              {approvedComments.length === 0 ? (
                <p className="text-gray-500">No approved comments yet</p>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {approvedComments.map((comment: any) => (
                        <tr key={comment._id}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{comment.author}</p>
                              <p className="text-sm text-gray-500">{comment.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-md truncate">{comment.content}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'visibility' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Article Visibility Settings</h2>
            <p className="text-gray-600 mb-6">Control which articles show likes and comments to readers</p>
            <div className="space-y-4">
              {articles.map((article: any) => (
                <div key={article._id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-4">{article.title}</h3>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={article.likesEnabled}
                        onChange={(e) => handleToggleFeature(article._id, 'likesEnabled', e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        Show Likes to Readers
                        <span className="text-sm text-gray-500 ml-2">
                          ({article.likesEnabled ? 'Visible' : 'Hidden'})
                        </span>
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={article.commentsEnabled}
                        onChange={(e) => handleToggleFeature(article._id, 'commentsEnabled', e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        Show Comments to Readers
                        <span className="text-sm text-gray-500 ml-2">
                          ({article.commentsEnabled ? 'Visible' : 'Hidden'})
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
