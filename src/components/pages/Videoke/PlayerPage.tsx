import React, { useState, useEffect } from 'react';

interface Video {
  id: string;
  url: string;
}

const PlayerPage: React.FC = () => {
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Load queue and start first video
  useEffect(() => {
    const savedQueue = localStorage.getItem('videoQueue');
    if (savedQueue) {
      const parsed = JSON.parse(savedQueue);
      setQueue(parsed);
      if (parsed.length > 0) setCurrentVideo(parsed[0]);
    }
  }, []);

  // Listen for queue changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedQueue = JSON.parse(
        localStorage.getItem('videoQueue') || '[]'
      );
      setQueue(updatedQueue);
      if (!currentVideo && updatedQueue.length > 0) {
        setCurrentVideo(updatedQueue[0]);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentVideo]);

  // Play next video automatically when current ends
  const handleVideoEnd = () => {
    if (queue.length > 1) {
      const newQueue = queue.slice(1);
      localStorage.setItem('videoQueue', JSON.stringify(newQueue));
      setQueue(newQueue);
      setCurrentVideo(newQueue[0]);
    } else {
      setCurrentVideo(null);
      setQueue([]);
      localStorage.removeItem('videoQueue');
    }
  };

  const getYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Now Playing</h1>

      {currentVideo ? (
        <div className="w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYouTubeId(
              currentVideo.url
            )}?autoplay=1&enablejsapi=1`}
            title="YouTube player"
            allow="autoplay; encrypted-media"
            allowFullScreen
            // eslint-disable-next-line react/no-unknown-property
            onEnded={handleVideoEnd as any} // doesn't fire directly, handled below
          ></iframe>
        </div>
      ) : (
        <p className="text-lg text-gray-700 mt-4">No videos in queue.</p>
      )}

      <div className="mt-6 text-gray-600">
        <p>Total pending: {queue.length - 1 > 0 ? queue.length - 1 : 0}</p>
      </div>
    </div>
  );
};

export default PlayerPage;
