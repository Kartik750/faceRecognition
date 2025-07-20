# Face Tracking Application

A real-time face detection and tracking application built with Next.js and face-api.js. This application allows users to track faces in real-time using their webcam and record videos with face tracking overlays.

## Features

- **Real-time Face Detection**: Uses face-api.js to detect faces in real-time
- **Face Tracking Markers**: Visual markers overlay detected faces with landmarks
- **Video Recording**: Record videos with face tracking overlays visible
- **Local Storage**: Save recorded videos locally in the browser
- **Video Gallery**: View, play, download, and delete saved recordings
- **Responsive Design**: Works on both desktop and mobile devices
- **Clean UI**: Modern, user-friendly interface built with Tailwind CSS

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **face-api.js**: Face detection and landmark recognition
- **Tailwind CSS**: Utility-first CSS framework
- **MediaRecorder API**: Video recording functionality
- **Canvas API**: Real-time video processing and overlay rendering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with webcam access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd face-recognition
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. Allow camera access when prompted by your browser
2. Wait for face detection models to load (shown in status section)
3. Click "Start Face Tracking" to begin face detection
4. Click "Start Recording" to record videos with face tracking

## Usage

### Face Tracking

1. Click **"Start Face Tracking"** to begin real-time face detection
2. Position your face in front of the camera
3. Green bounding boxes and red landmark points will appear on detected faces
4. The status panel shows the number of faces detected

### Video Recording

1. Start face tracking first (or it will start automatically)
2. Click **"Start Recording"** to begin recording
3. Use **"Pause"/"Resume"** to control recording
4. Click **"Stop Recording"** to finish
5. Enter a name for your video and click **"Save Video"**

### Video Gallery

1. Switch to the **"Video Gallery"** tab
2. View all your saved recordings
3. Click **"Play"** to watch videos in a modal
4. Click **"Download"** to save videos to your device
5. Click **"Delete"** to remove videos from storage

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FaceTracker.tsx      # Main face tracking component
│   ├── Navigation.tsx       # Tab navigation
│   └── VideoGallery.tsx     # Video gallery and player
├── hooks/
│   ├── useFaceDetection.ts  # Face detection logic
│   └── useVideoRecorder.ts  # Video recording logic
└── utils/
    ├── faceDetection.ts     # Face-api.js utilities
    └── videoStorage.ts      # Local storage utilities
```

## Features in Detail

### Face Detection
- Uses TinyFaceDetector model for fast detection
- 68-point facial landmark detection
- Real-time processing at 10 FPS
- Visual overlays with bounding boxes and landmarks

### Video Recording
- Records canvas stream with face overlays
- WebM format with VP9 codec
- Real-time duration tracking
- Pause/resume functionality

### Local Storage
- Videos stored as base64 in localStorage
- Metadata includes duration, size, timestamp
- Download functionality converts back to video files
- Efficient storage management

## Browser Support

- Chrome 52+
- Firefox 47+
- Safari 14+
- Edge 79+

Requires MediaRecorder API and getUserMedia support.

## Performance Considerations

- Face detection runs at 10 FPS for optimal performance
- Video recording at 30 FPS
- Models are loaded once and cached
- Canvas rendering optimized for smooth playback

## Troubleshooting

### Camera Access Issues
- Ensure HTTPS connection (required for camera access)
- Check browser permissions for camera access
- Try refreshing the page

### Models Not Loading
- Check browser console for network errors
- Ensure model files are accessible in `/public/models/`
- Verify CORS headers are properly configured

### Recording Issues
- Ensure browser supports MediaRecorder API
- Check available storage space
- Try using Chrome for best compatibility

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
