'use client';

import React, { useState } from 'react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { formatDuration } from '@/utils/videoStorage';
import CameraErrorHelper from '@/components/CameraErrorHelper';

const FaceTracker: React.FC = () => {
    const {
        videoRef,
        canvasRef,
        isModelLoaded,
        isDetecting,
        detections,
        error: detectionError,
        startDetection,
        stopDetection,
        canvasStream,
    } = useFaceDetection();

    const {
        isRecording,
        isPaused,
        recordedChunks,
        error: recordingError,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        saveRecording,
        clearRecording,
        recordingDuration,
    } = useVideoRecorder(canvasStream);

    const [saveFileName, setSaveFileName] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleStartTracking = () => {
        startDetection();
    };

    const handleStopTracking = () => {
        stopDetection();
        if (isRecording) {
            stopRecording();
        }
    };

    const handleStartRecording = async () => {
        if (!isDetecting) {
            handleStartTracking();
        }
        await startRecording();
    };

    const handleStopRecording = async () => {
        await stopRecording();
        setShowSaveDialog(true);
    };

    const handleSaveVideo = async () => {
        const fileName = saveFileName.trim() || `face-tracking-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
        const videoId = await saveRecording(fileName);

        if (videoId) {
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                setShowSaveDialog(false);
                setSaveFileName('');
                clearRecording();
            }, 2000);
        }
    };

    const handleCancelSave = () => {
        setShowSaveDialog(false);
        setSaveFileName('');
        clearRecording();
    };

    const error = detectionError || recordingError;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Face Tracking Application
            </h2>

            {/* Status Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="font-semibold">Models:</span>{' '}
                        <span className={isModelLoaded ? 'text-green-600' : 'text-red-600'}>
                            {isModelLoaded ? 'Loaded' : 'Loading...'}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Detection:</span>{' '}
                        <span className={isDetecting ? 'text-green-600' : 'text-gray-600'}>
                            {isDetecting ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Recording:</span>{' '}
                        <span className={isRecording ? 'text-red-600' : 'text-gray-600'}>
                            {isRecording ? (isPaused ? 'Paused' : 'Active') : 'Inactive'}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Faces:</span>{' '}
                        <span className="text-blue-600">{detections.length}</span>
                    </div>
                </div>

                {isRecording && (
                    <div className="mt-2">
                        <span className="font-semibold">Duration:</span>{' '}
                        <span className="text-red-600 font-mono">
                            {formatDuration(recordingDuration)}
                        </span>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <>
                    {error.includes('camera') || error.includes('Camera') ? (
                        <CameraErrorHelper
                            error={error}
                            onRetry={() => {
                                window.location.reload();
                            }}
                        />
                    ) : (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                </>
            )}

            {/* Video and Canvas Container */}
            <div className="relative mb-6 bg-black rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="hidden"
                    onLoadedMetadata={() => {
                        if (videoRef.current) {
                            videoRef.current.play();
                        }
                    }}
                />
                <canvas
                    ref={canvasRef}
                    className="w-full h-auto max-h-96 object-contain"
                    style={{ aspectRatio: '4/3' }}
                />

                {/* Recording Indicator */}
                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold">
                            {isPaused ? 'PAUSED' : 'REC'}
                        </span>
                    </div>
                )}

                {/* Face Counter */}
                {isDetecting && detections.length > 0 && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold">
                            {detections.length} Face{detections.length !== 1 ? 's' : ''} Detected
                        </span>
                    </div>
                )}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
                {!isDetecting ? (
                    <button
                        onClick={handleStartTracking}
                        disabled={!isModelLoaded}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Start Face Tracking
                    </button>
                ) : (
                    <button
                        onClick={handleStopTracking}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Stop Face Tracking
                    </button>
                )}

                {!isRecording ? (
                    <button
                        onClick={handleStartRecording}
                        disabled={!isModelLoaded}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Start Recording
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleStopRecording}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Stop Recording
                        </button>

                        {!isPaused ? (
                            <button
                                onClick={pauseRecording}
                                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                Pause
                            </button>
                        ) : (
                            <button
                                onClick={resumeRecording}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Resume
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        {saveSuccess ? (
                            <div className="text-center">
                                <div className="text-green-600 text-5xl mb-4">✓</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Video Saved Successfully!
                                </h3>
                                <p className="text-gray-600">
                                    Your recording has been saved to local storage.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Save Recording
                                </h3>
                                <div className="mb-4">
                                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Video Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="fileName"
                                        value={saveFileName}
                                        onChange={(e) => setSaveFileName(e.target.value)}
                                        placeholder="Enter video name (optional)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancelSave}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveVideo}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Video
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaceTracker;
