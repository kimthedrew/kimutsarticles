'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackgroundImage {
  _id: string;
  url: string;
  filename: string;
  isActive: boolean;
  uploadedAt: string;
  fileSize: number;
}

export default function BackgroundManager() {
  const router = useRouter();
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/background');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/admin/background', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        await fetchImages();
        e.target.value = '';
      } else {
        const data = await res.json();
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/background/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (res.ok) {
        await fetchImages();
      }
    } catch (err) {
      console.error('Failed to update image:', err);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this background image?')) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/admin/background/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchImages();
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl font-bold text-slate-700">Background Manager</h1>
            <Link
              href="/admin/dashboard"
              className="text-slate-600 hover:text-slate-800 transition text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Upload Background Image</h2>
          <p className="text-slate-600 mb-6">
            Upload a background image for the homepage. Maximum file size: 5MB. 
            Recommended dimensions: 1920x1080 or larger for best quality.
          </p>
          
          <div className="mb-4">
            <label className="block">
              <span className="sr-only">Choose image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-slate-700 file:text-white
                  hover:file:bg-slate-800
                  file:cursor-pointer cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {uploading && (
            <div className="text-slate-600">Uploading...</div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Uploaded Images</h2>
          
          {images.length === 0 ? (
            <p className="text-slate-500">No background images uploaded yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image._id}
                  className={`border-2 rounded-xl overflow-hidden ${
                    image.isActive ? 'border-green-500' : 'border-slate-200'
                  }`}
                >
                  <div className="aspect-video bg-slate-100 relative">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    {image.isActive && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-slate-700 truncate mb-1">
                      {image.filename}
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      {formatFileSize(image.fileSize)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(image._id, !image.isActive)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          image.isActive
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {image.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteImage(image._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
