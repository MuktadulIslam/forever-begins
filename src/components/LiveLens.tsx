'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

// Mock data for demonstration - replace with Firebase data
const mockPhotos = [
  '/images/wedding-couple1.png',
  '/images/wedding-couple2.png',
  '/images/wedding-couple3.png',
  '/images/bride1.png',
  '/images/groom1.png',
];

export default function LiveLens() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState(mockPhotos);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate upload - Replace with actual Firebase upload
    setTimeout(() => {
      if (previewUrl) {
        setPhotos([previewUrl, ...photos]);
      }
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }, 2000);
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <section className="min-h-screen w-full bg-[#3a3a3a] px-4 py-24">
      <div ref={ref} className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-playfair mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            The Live Lens
          </h2>
          <p className="font-cormorant mb-8 text-xl text-white/80 sm:text-2xl">
            Capture and share your favorite moments from our celebration
          </p>

          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#9caf88] to-[#d4a5a5] px-8 py-4 font-cormorant text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Camera className="h-5 w-5" />
            Capture a Moment
          </motion.button>
        </motion.div>

        {/* Photo Gallery - Masonry Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4 break-inside-avoid"
            >
              <div className="group relative overflow-hidden rounded-lg">
                <img
                  src={photo}
                  alt={`Wedding moment ${index + 1}`}
                  className="w-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-playfair mb-4 text-2xl font-bold text-[#3a3a3a]">
              Share Your Moment
            </h3>

            {/* File Input */}
            {!previewUrl ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-[#9caf88]">
                <Upload className="mb-4 h-12 w-12 text-gray-400" />
                <p className="font-cormorant mb-2 text-lg font-semibold text-gray-700">
                  Click to upload photo
                </p>
                <p className="font-cormorant text-sm text-gray-500">
                  or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                <div className="overflow-hidden rounded-lg">
                  <img src={previewUrl} alt="Preview" className="w-full" />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="font-cormorant flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Change Photo
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="font-cormorant flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#9caf88] to-[#d4a5a5] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
