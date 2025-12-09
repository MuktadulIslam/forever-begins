'use client';

import { useState, useEffect } from 'react';
import {
  Edit,
  Save,
  X,
  RotateCcw,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';

interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  googlePhotosLink: string;
  order: number;
  isDefault: boolean;
}

export default function AlbumManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    googlePhotosLink: '',
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/albums');
      const data = await response.json();

      if (data.success) {
        setAlbums(data.albums);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setCompressing(true);
      setError(null);

      // Compress the image
      const compressed = await compressImage(file, 75);

      setFormData({ ...formData, coverImage: compressed });
      setImagePreview(compressed);
      setCompressing(false);
    } catch (error) {
      console.error('Error compressing image:', error);
      setError('Failed to compress image');
      setCompressing(false);
    }
  };

  const handleEditAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/albums/${editingAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Album updated successfully');
        setEditingAlbum(null);
        resetForm();
        fetchAlbums();
      } else {
        setError(data.error || 'Failed to update album');
      }
    } catch (error) {
      console.error('Error updating album:', error);
      setError('Failed to update album');
    } finally {
      setSaving(false);
    }
  };

  const handleResetAlbums = async () => {
    if (
      !confirm(
        'Are you sure you want to reset albums to default? This will revert all albums to their original state.'
      )
    )
      return;

    try {
      setSaving(true);
      const response = await fetch('/api/albums', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Albums reset to default successfully');
        fetchAlbums();
      } else {
        setError(data.error || 'Failed to reset albums');
      }
    } catch (error) {
      console.error('Error resetting albums:', error);
      setError('Failed to reset albums');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      description: album.description,
      coverImage: album.coverImage,
      googlePhotosLink: album.googlePhotosLink,
    });
    setImagePreview(album.coverImage);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '',
      googlePhotosLink: '',
    });
    setImagePreview(null);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-svh">
        <div className="text-gray-600">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              Photo Album Management
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Update your 4 photo albums. Click edit to modify album details and cover images.
            </p>
          </div>
          {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleResetAlbums}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div> */}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="flex-1 wrap-break-word">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="flex-1 wrap-break-word">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Form */}
      {editingAlbum && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 border-b-2 border-[#d4a5a5] pb-2">
            Edit Album: {editingAlbum.title}
          </h3>
          <form onSubmit={handleEditAlbum}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  📌 Square images are recommended for best results. Image will be compressed to 70-80KB.
                </p>
                <div className="flex sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-xs text-gray-500">
                          {compressing ? 'Compressing...' : 'Click to upload new image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={compressing}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="w-32 h-32 shrink-0">
                      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Square Preview
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Album Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  placeholder="e.g., Engagement Ceremony"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Photos Link
                </label>
                <input
                  type="url"
                  value={formData.googlePhotosLink}
                  onChange={(e) =>
                    setFormData({ ...formData, googlePhotosLink: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  placeholder="https://photos.google.com/..."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  rows={3}
                  placeholder="Describe this album..."
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="submit"
                disabled={saving || compressing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9caf88] text-white rounded-md hover:bg-[#8a9d76] transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Update Album'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingAlbum(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Albums List */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
          Albums (4)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-500 text-center py-8 md:col-span-2">
              No albums found. Click "Reset to Default" to restore albums.
            </p>
          ) : (
            albums.map((album) => (
              <div
                key={album.id}
                className="flex flex-col gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-[#d4a5a5] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {album.title}
                      </h4>
                      {album.isDefault && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {album.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => startEditing(album)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
