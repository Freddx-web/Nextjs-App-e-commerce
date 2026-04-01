'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

// Props for the ProductPhotoAlbum component
interface ProductPhotoAlbumProps {
  images: string[];
  productName: string;
  initialIndex?: number;
}
// ProductPhotoAlbum Component
export function ProductPhotoAlbum({ images, productName, initialIndex = 0 }: ProductPhotoAlbumProps) {
  // State management
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    // Only add event listener when lightbox is open
    if (!isLightboxOpen) return;
    // Keyboard event handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setIsZoomed(false);
      }
    };
    // Attach event listener
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup event listener on unmount or when lightbox closes
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);
  // Handlers for navigation
  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };
  // Handler for next image
  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };
  // Open lightbox at specific index
  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };
  // Render component
  if (!images || images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
        Sin imagen
      </div>
    );
  }
  // Main return
  return (
    <>
      {/* Thumbnail Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => openLightbox(selectedIndex)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - Imagen ${selectedIndex + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          {images.length > 1 && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {images.length} - Click para ver álbum
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square rounded-md overflow-hidden transition-all ${
                  selectedIndex === idx
                    ? 'ring-2 ring-[#60B5FF] scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => {
              setIsLightboxOpen(false);
              setIsZoomed(false);
            }}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
                setIsZoomed(false);
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-full z-10">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Zoom Toggle */}
            {images.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-1/2 -translate-x-1/2 text-white hover:bg-white/20 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
              >
                {isZoomed ? (
                  <ZoomOut className="h-6 w-6" />
                ) : (
                  <ZoomIn className="h-6 w-6" />
                )}
              </Button>
            )}

            {/* Main Image */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              >
                <Image
                  src={images[selectedIndex]}
                  alt={`${productName} - Imagen ${selectedIndex + 1}`}
                  fill
                  className={`object-contain ${isZoomed ? 'object-scale-up' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </motion.div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation at Bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4 pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      selectedIndex === idx
                        ? 'ring-2 ring-[#60B5FF] scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
