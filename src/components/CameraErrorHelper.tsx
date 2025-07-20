'use client';

import React from 'react';

interface CameraErrorHelperProps {
    error: string;
    onRetry: () => void;
}

const CameraErrorHelper: React.FC<CameraErrorHelperProps> = ({ error, onRetry }) => {
    const getTroubleshootingSteps = (error: string) => {
        const steps = [
            'Make sure you have a camera connected to your device',
            'Check that no other applications are using your camera',
            'Try refreshing the page',
            'Ensure you\'re using HTTPS (required for camera access)',
        ];

        if (error.includes('denied') || error.includes('NotAllowedError')) {
            return [
                'Click the camera icon in your browser\'s address bar',
                'Allow camera access for this website',
                'Refresh the page after granting permission',
                ...steps
            ];
        }

        if (error.includes('not found') || error.includes('NotFoundError')) {
            return [
                'Check if your camera is properly connected',
                'Try unplugging and reconnecting your camera',
                'Make sure camera drivers are installed',
                'Test your camera in another application',
                ...steps
            ];
        }

        if (error.includes('not supported') || error.includes('NotSupportedError')) {
            return [
                'Use a modern browser (Chrome, Firefox, Safari, Edge)',
                'Update your browser to the latest version',
                'Try using a different browser',
                ...steps
            ];
        }

        return steps;
    };

    const troubleshootingSteps = getTroubleshootingSteps(error);

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
                <div className="text-red-500 text-2xl mr-3">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800">Camera Access Issue</h3>
            </div>

            <p className="text-red-700 mb-4">{error}</p>

            <div className="mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Troubleshooting Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                    {troubleshootingSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Refresh Page
                </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This application requires camera access to detect faces.
                    For the best experience, use Chrome or Firefox with a stable internet connection.
                </p>
            </div>
        </div>
    );
};

export default CameraErrorHelper;
