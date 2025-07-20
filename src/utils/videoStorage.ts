export interface SavedVideo {
    id: string;
    name: string;
    blob: string; // base64 encoded blob
    timestamp: number;
    duration: number;
    size: number;
}

const STORAGE_KEY = 'face-tracking-videos';

export const saveVideoToLocalStorage = async (
    blob: Blob,
    name: string,
    duration: number
): Promise<string> => {
    try {
        const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Convert blob to base64
        const base64 = await blobToBase64(blob);

        const videoData: SavedVideo = {
            id: videoId,
            name,
            blob: base64,
            timestamp: Date.now(),
            duration,
            size: blob.size
        };

        // Get existing videos
        const existingVideos = getVideosFromLocalStorage();

        // Add new video
        existingVideos.push(videoData);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingVideos));

        return videoId;
    } catch (error) {
        console.error('Error saving video to localStorage:', error);
        throw error;
    }
};

export const getVideosFromLocalStorage = (): SavedVideo[] => {
    try {
        const videosJson = localStorage.getItem(STORAGE_KEY);
        return videosJson ? JSON.parse(videosJson) : [];
    } catch (error) {
        console.error('Error getting videos from localStorage:', error);
        return [];
    }
};

export const deleteVideoFromLocalStorage = (videoId: string): void => {
    try {
        const existingVideos = getVideosFromLocalStorage();
        const filteredVideos = existingVideos.filter(video => video.id !== videoId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVideos));
    } catch (error) {
        console.error('Error deleting video from localStorage:', error);
    }
};

export const getVideoById = (videoId: string): SavedVideo | null => {
    const videos = getVideosFromLocalStorage();
    return videos.find(video => video.id === videoId) || null;
};

export const downloadVideo = (video: SavedVideo): void => {
    try {
        const blob = base64ToBlob(video.blob);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${video.name}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading video:', error);
    }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:video/webm;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'video/webm' });
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
