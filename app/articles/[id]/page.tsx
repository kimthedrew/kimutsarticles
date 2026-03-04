'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ author: '', email: '', content: '' });

  useEffect(() => {
    if (params.id) {
      fetchArticle();
      fetchComments();
      fetchLikes();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${params.id}`);
      const data = await res.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/articles/${params.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await fetch(`/api/articles/${params.id}/likes`);
      const data = await res.json();
      setLikes(data.count);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/articles/${params.id}/likes`, {
        method: hasLiked ? 'DELETE' : 'POST',
      });
      if (res.ok) {
        fetchLikes();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/articles/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm),
      });
      if (res.ok) {
        setCommentForm({ author: '', email: '', content: '' });
        alert('Comment submitted for approval!');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            ← Back to Articles
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-500 mb-6">
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')} • {article.views} views
          </div>
          <div 
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.likesEnabled && (
            <div className="border-t pt-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  hasLiked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                ❤️ {hasLiked ? 'Liked' : 'Like'} ({likes})
              </button>
            </div>
          )}
        </article>

        {article.commentsEnabled && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
            
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentForm.author}
                  onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Your Comment"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded h-24"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit Comment
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment._id} className="border-b pb-4">
                  <div className="font-semibold">{comment.author}</div>
                  <div className="text-sm text-gray-500 mb-2">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
