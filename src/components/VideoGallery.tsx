'use client';

import React, { useState, useEffect } from 'react';
import {
    getVideosFromLocalStorage,
    deleteVideoFromLocalStorage,
    downloadVideo,
    formatFileSize,
    formatDuration,
    SavedVideo,
} from '@/utils/videoStorage';

const VideoGallery: React.FC = () => {
    const [videos, setVideos] = useState<SavedVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = () => {
        const savedVideos = getVideosFromLocalStorage();
        setVideos(savedVideos.sort((a, b) => b.timestamp - a.timestamp));
    };

    const handleDeleteVideo = (videoId: string) => {
        deleteVideoFromLocalStorage(videoId);
        loadVideos();
        setShowDeleteConfirm(null);
        if (selectedVideo?.id === videoId) {
            setSelectedVideo(null);
        }
    };

    const handleDownloadVideo = (video: SavedVideo) => {
        downloadVideo(video);
    };

    const playVideo = (video: SavedVideo) => {
        setSelectedVideo(video);
    };

    const closeVideoPlayer = () => {
        setSelectedVideo(null);
    };

    const getVideoBlob = (video: SavedVideo): string => {
        const byteCharacters = atob(video.blob);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'video/webm' });
        return URL.createObjectURL(blob);
    };

    if (videos.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Video Gallery
                </h2>
                <div className="text-center py-12">
                    <div className="text-6xl text-gray-300 mb-4">📹</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Videos Yet
                    </h3>
                    <p className="text-gray-500">
                        Start recording with face tracking to see your videos here!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Video Gallery
                </h2>
                <div className="text-sm text-gray-500">
                    {videos.length} video{videos.length !== 1 ? 's' : ''} saved
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        {/* Video Thumbnail/Preview */}
                        <div className="relative bg-gray-800 rounded-lg mb-3 aspect-video flex items-center justify-center">
                            <div className="text-white text-3xl">📹</div>
                            <button
                                onClick={() => playVideo(video)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                            >
                                <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                                </div>
                            </button>
                        </div>

                        {/* Video Info */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 truncate" title={video.name}>
                                {video.name}
                            </h3>

                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Duration: {formatDuration(video.duration)}</div>
                                <div>Size: {formatFileSize(video.size)}</div>
                                <div>
                                    Created: {new Date(video.timestamp).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => playVideo(video)}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                    Play
                                </button>
                                <button
                                    onClick={() => handleDownloadVideo(video)}
                                    className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    title="Download"
                                >
                                    ⬇️
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(video.id)}
                                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {selectedVideo.name}
                            </h3>
                            <button
                                onClick={closeVideoPlayer}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4">
                            <video
                                src={getVideoBlob(selectedVideo)}
                                controls
                                autoPlay
                                className="w-full h-auto max-h-[60vh] rounded-lg"
                                onEnded={() => {
                                    // Cleanup object URL after video ends
                                    const video = document.querySelector('video');
                                    if (video?.src) {
                                        URL.revokeObjectURL(video.src);
                                    }
                                }}
                            />

                            <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="font-semibold">Duration:</span> {formatDuration(selectedVideo.duration)}
                                </div>
                                <div>
                                    <span className="font-semibold">Size:</span> {formatFileSize(selectedVideo.size)}
                                </div>
                                <div>
                                    <span className="font-semibold">Created:</span> {new Date(selectedVideo.timestamp).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-semibold">Format:</span> WebM
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 justify-end">
                                <button
                                    onClick={() => handleDownloadVideo(selectedVideo)}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    Download Video
                                </button>
                                <button
                                    onClick={closeVideoPlayer}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Delete Video?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this video? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteVideo(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGallery;
