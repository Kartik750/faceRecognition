'use client';

import { useRef, useCallback, useState } from 'react';
import { saveVideoToLocalStorage } from '@/utils/videoStorage';

export interface UseVideoRecorderReturn {
    isRecording: boolean;
    isPaused: boolean;
    recordedChunks: Blob[];
    error: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    pauseRecording: () => void;
    resumeRecording: () => void;
    saveRecording: (name?: string) => Promise<string | null>;
    clearRecording: () => void;
    recordingDuration: number;
}

export const useVideoRecorder = (
    canvasStream: MediaStream | null
): UseVideoRecorderReturn => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const updateDuration = useCallback(() => {
        if (startTimeRef.current > 0 && !isPaused) {
            setRecordingDuration((Date.now() - startTimeRef.current) / 1000);
        }
    }, [isPaused]);

    const startRecording = useCallback(async () => {
        if (!canvasStream) {
            setError('No canvas stream available');
            return;
        }

        try {
            setError(null);
            setRecordedChunks([]);

            const mediaRecorder = new MediaRecorder(canvasStream, {
                mimeType: 'video/webm;codecs=vp9',
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstart = () => {
                setIsRecording(true);
                setIsPaused(false);
                startTimeRef.current = Date.now();
                setRecordingDuration(0);

                // Start duration tracking
                durationIntervalRef.current = setInterval(updateDuration, 100);
            };

            mediaRecorder.onstop = () => {
                setIsRecording(false);
                setIsPaused(false);

                // Stop duration tracking
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }
            };

            mediaRecorder.onpause = () => {
                setIsPaused(true);
            };

            mediaRecorder.onresume = () => {
                setIsPaused(false);
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                setError('Recording failed');
            };

            mediaRecorder.start(1000); // Collect data every second
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Failed to start recording');
        }
    }, [canvasStream, updateDuration]);

    const stopRecording = useCallback(async () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();

            // Stop duration tracking
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }
        }
    }, [isRecording]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
        }
    }, [isRecording, isPaused]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
        }
    }, [isRecording, isPaused]);

    const saveRecording = useCallback(async (name?: string): Promise<string | null> => {
        if (recordedChunks.length === 0) {
            setError('No recording to save');
            return null;
        }

        try {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoName = name || `face-tracking-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;

            const videoId = await saveVideoToLocalStorage(blob, videoName, recordingDuration);
            return videoId;
        } catch (err) {
            console.error('Error saving recording:', err);
            setError('Failed to save recording');
            return null;
        }
    }, [recordedChunks, recordingDuration]);

    const clearRecording = useCallback(() => {
        setRecordedChunks([]);
        setRecordingDuration(0);
        setError(null);
    }, []);

    return {
        isRecording,
        isPaused,
        recordedChunks,
        error,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        saveRecording,
        clearRecording,
        recordingDuration,
    };
};
