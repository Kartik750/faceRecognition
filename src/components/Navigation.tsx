'use client';

import React from 'react';

interface NavigationProps {
    activeTab: 'tracker' | 'gallery';
    onTabChange: (tab: 'tracker' | 'gallery') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="w-full max-w-6xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-2">
                <div className="flex space-x-1">
                    <button
                        onClick={() => onTabChange('tracker')}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'tracker'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">📹</span>
                            <span>Face Tracker</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onTabChange('gallery')}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'gallery'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">🎬</span>
                            <span>Video Gallery</span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
