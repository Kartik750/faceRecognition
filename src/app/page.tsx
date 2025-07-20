'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FaceTracker from '@/components/FaceTracker';
import VideoGallery from '@/components/VideoGallery';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'gallery'>('tracker');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Face Tracking App
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time face detection and tracking with video recording capabilities.
            Track faces in real-time and save your recordings locally.
          </p>
        </header>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="w-full">
          {activeTab === 'tracker' ? <FaceTracker /> : <VideoGallery />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>&copy; 2025 Face Tracking Application. Built with Next.js and face-api.js</p>
        </footer>
      </div>
    </main>
  );
}
