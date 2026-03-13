'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroTag: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  card3Title: string;
  card3Description: string;
}

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'Real Estate Insights',
    heroSubtitle: 'Educational insights for aspiring real estate investors. Stay informed with expert analysis, market trends, and proven investment strategies.',
    heroTag: 'Key Insights',
    card1Title: 'Market Trends',
    card1Description: 'Understanding legal due diligence is crucial for real estate transactions. Stay updated with the latest market analysis.',
    card2Title: 'Buying Guides',
    card2Description: 'Expert advice for first-time buyers and seasoned property investors. Navigate the market with confidence.',
    card3Title: 'Investment Tips',
    card3Description: 'Ensure all necessary documents are thoroughly reviewed to mitigate risks and protect your investment.',
  });

  useEffect(() => {
    fetch('/api/background/active')
      .then(res => res.json())
      .then(data => {
        if (data?.url) {
          setBackgroundImage(data.url);
        }
      })
      .catch(err => console.error('Failed to fetch background:', err));

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            heroTitle: data.heroTitle || 'Real Estate Insights',
            heroSubtitle: data.heroSubtitle || 'Educational insights for aspiring real estate investors. Stay informed with expert analysis, market trends, and proven investment strategies.',
            heroTag: data.heroTag || 'Key Insights',
            card1Title: data.card1Title || 'Market Trends',
            card1Description: data.card1Description || 'Understanding legal due diligence is crucial for real estate transactions. Stay updated with the latest market analysis.',
            card2Title: data.card2Title || 'Buying Guides',
            card2Description: data.card2Description || 'Expert advice for first-time buyers and seasoned property investors. Navigate the market with confidence.',
            card3Title: data.card3Title || 'Investment Tips',
            card3Description: data.card3Description || 'Ensure all necessary documents are thoroughly reviewed to mitigate risks and protect your investment.',
          });
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err));
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image Layer */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay - more transparent to show background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-amber-50/80 via-orange-50/75 to-yellow-50/80" />
      
      {/* Content Layer */}
      <div className="relative z-10">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wide text-slate-700 uppercase">
              Real Estate Insights
            </h1>
            <div className="flex gap-6">
              <Link 
                href="/articles"
                className="text-slate-600 hover:text-slate-800 font-medium transition"
              >
                Articles
              </Link>
              <Link 
                href="/admin/login"
                className="text-slate-500 hover:text-slate-700 transition text-sm"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-slate-700 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">{settings.heroTag}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-700 tracking-tight">
            {settings.heroTitle}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {settings.heroSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">{settings.card1Title}</h3>
            <p className="text-slate-200 leading-relaxed">
              {settings.card1Description}
            </p>
          </div>
          
          <div className="bg-slate-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">{settings.card2Title}</h3>
            <p className="text-slate-200 leading-relaxed">
              {settings.card2Description}
            </p>
          </div>
          
          <div className="bg-slate-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">{settings.card3Title}</h3>
            <p className="text-slate-200 leading-relaxed">
              {settings.card3Description}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/articles"
            className="inline-block bg-slate-700 text-white px-10 py-4 rounded-full hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-lg"
          >
            Browse All Articles
          </Link>
        </div>
      </main>

      <footer className="bg-white/80 border-t border-amber-100 mt-32">
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
