'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels, detectFaces, drawFaceDetections } from '@/utils/faceDetection';

export interface UseFaceDetectionReturn {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    isModelLoaded: boolean;
    isDetecting: boolean;
    detections: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[];
    error: string | null;
    startDetection: () => void;
    stopDetection: () => void;
    canvasStream: MediaStream | null;
}

export const useFaceDetection = (): UseFaceDetectionReturn => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detections, setDetections] = useState<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [canvasStream, setCanvasStream] = useState<MediaStream | null>(null);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load face detection models
    useEffect(() => {
        const initializeModels = async () => {
            try {
                await loadModels();
                setIsModelLoaded(true);
            } catch (err) {
                console.error('Failed to load models:', err);
                setError('Failed to load face detection models');
            }
        };

        initializeModels();
    }, []);

    // Initialize camera
    useEffect(() => {
        const initializeCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    },
                    audio: false
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err: any) {
                console.error('Error accessing camera:', err);
                let errorMessage = 'Failed to access camera';

                if (err.name === 'NotFoundError') {
                    errorMessage = 'No camera found. Please ensure a camera is connected and try again.';
                } else if (err.name === 'NotAllowedError') {
                    errorMessage = 'Camera access denied. Please allow camera permissions and refresh the page.';
                } else if (err.name === 'NotSupportedError') {
                    errorMessage = 'Camera not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.';
                } else if (err.name === 'NotReadableError') {
                    errorMessage = 'Camera is busy or not accessible. Please close other apps using the camera and try again.';
                } else if (err.name === 'OverconstrainedError') {
                    errorMessage = 'Camera settings not supported. Trying with different settings...';
                }

                setError(errorMessage);

                // If overconstrained, try with more relaxed constraints
                if (err.name === 'OverconstrainedError') {
                    try {
                        const fallbackStream = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: false
                        });

                        if (videoRef.current) {
                            videoRef.current.srcObject = fallbackStream;
                            setError(null); // Clear error if fallback works
                        }
                    } catch (fallbackErr) {
                        console.error('Fallback camera access failed:', fallbackErr);
                        setError('Camera access failed with fallback settings. Please check your camera.');
                    }
                }
            }
        };

        initializeCamera();

        return () => {
            // Cleanup camera stream
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Setup canvas stream for recording
    useEffect(() => {
        if (canvasRef.current) {
            const stream = canvasRef.current.captureStream(30); // 30 FPS
            setCanvasStream(stream);
        }
    }, []);

    const performDetection = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Ensure video is ready
            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            // Resize canvas to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            // Detect faces
            const faceDetections = await detectFaces(video);
            setDetections(faceDetections);

            // Draw face detection overlays
            drawFaceDetections(canvas, faceDetections);
        } catch (err) {
            console.error('Error during face detection:', err);
        }
    }, [isModelLoaded]);

    const startDetection = useCallback(() => {
        if (!isModelLoaded) {
            setError('Models not loaded yet');
            return;
        }

        setIsDetecting(true);
        setError(null);

        // Start detection loop
        detectionIntervalRef.current = setInterval(performDetection, 100); // 10 FPS detection
    }, [isModelLoaded, performDetection]);

    const stopDetection = useCallback(() => {
        setIsDetecting(false);

        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }

        // Clear canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }

        setDetections([]);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
        };
    }, []);

    return {
        videoRef,
        canvasRef,
        isModelLoaded,
        isDetecting,
        detections,
        error,
        startDetection,
        stopDetection,
        canvasStream,
    };
};
