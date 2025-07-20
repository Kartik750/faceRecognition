import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async (): Promise<void> => {
    if (modelsLoaded) return;

    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        modelsLoaded = true;
        console.log('Face API models loaded successfully');
    } catch (error) {
        console.error('Error loading face API models:', error);
        throw error;
    }
};

export const detectFaces = async (
    video: HTMLVideoElement
): Promise<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]> => {
    if (!modelsLoaded) {
        throw new Error('Models not loaded. Call loadModels() first.');
    }

    try {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        return detections;
    } catch (error) {
        console.error('Error detecting faces:', error);
        return [];
    }
};

export const drawFaceDetections = (
    canvas: HTMLCanvasElement,
    detections: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
        const { x, y, width, height } = detection.detection.box;

        // Draw face bounding box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Draw landmarks
        const landmarks = detection.landmarks;
        ctx.fillStyle = '#ff0000';

        landmarks.positions.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Add label
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px Arial';
        ctx.fillText('Face Detected', x, y - 10);
    });
};
