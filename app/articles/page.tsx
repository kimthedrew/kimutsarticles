'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
    fetch('/api/background/active')
      .then(res => res.json())
      .then(data => {
        if (data?.url) {
          setBackgroundImage(data.url);
        }
      })
      .catch(err => console.error('Failed to fetch background:', err));
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image Layer */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-amber-50/80 via-orange-50/75 to-yellow-50/80" />
      
      {/* Content Layer */}
      <div className="relative z-10">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-wide text-slate-700 uppercase hover:text-slate-800 transition">
              Real Estate Insights
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-800 font-medium transition">
              ← Back Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-slate-700 px-4 py-2 rounded-full mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">Latest Articles</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-700 mb-4">All Articles</h1>
          <p className="text-xl text-slate-600">Expert insights and educational content for real estate investors</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700"></div>
            <p className="mt-4 text-slate-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-600 text-lg">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link 
                key={article._id} 
                href={`/articles/${article._id}`}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block bg-slate-700 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category || 'Article'}
                    </span>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition line-clamp-2">
                    {article.title}
                  </h2>
                  
                  {article.excerpt && (
                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.views} views
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white/80 border-t border-amber-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-slate-600 mb-2">© 2024 Real Estate Insights. All rights reserved.</p>
            <p className="text-slate-500 text-sm">Educational insights for aspiring real estate investors</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
