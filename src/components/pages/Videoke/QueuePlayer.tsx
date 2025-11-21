import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface VideoItem {
  id: string;
  url: string;
}

const QueuePlayer: React.FC = () => {
  const [queue, setQueue] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [input, setInput] = useState('');
  const playerRef = useRef<YouTube | null>(null);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleAdd = () => {
    const id = extractVideoId(input);
    if (!id) {
      alert('Invalid YouTube link');
      return;
    }
    const newVideo = { id, url: input };
    setQueue((prev) => [...prev, newVideo]);
    if (!currentVideo) setCurrentVideo(newVideo);
    setInput('');
  };

  const handleNext = () => {
    setQueue((prev) => {
      const [, ...rest] = prev;
      if (rest.length > 0) setCurrentVideo(rest[0]);
      else setCurrentVideo(null);
      return rest;
    });
  };

  const handleRemove = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePlay = (video: VideoItem) => {
    setCurrentVideo(video);
  };

  const handleEnd = () => handleNext();

  useEffect(() => {
    if (playerRef.current && currentVideo) {
      playerRef.current.getInternalPlayer().loadVideoById(currentVideo.id);
    }
  }, [currentVideo]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md w-full h-screen">
      {/* Player Section */}
      <div className="flex-1 flex flex-col items-center">
        {currentVideo ? (
          <>
            <YouTube
              ref={playerRef}
              videoId={currentVideo.id}
              onEnd={handleEnd}
              opts={{
                width: '100%',
                height: '800',
                playerVars: { autoplay: 1 },
              }}
              className="w-full rounded-lg overflow-hidden shadow-lg"
            />
            <button
              onClick={handleNext}
              className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Next Video
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No video playing. Add one to start!
          </p>
        )}
      </div>

      {/* Queue Section */}
      <div className="md:w-80 w-full bg-gray-50 rounded-lg p-4 border shadow-sm">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Queue Manager
        </h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste YouTube link..."
            className="flex-grow border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 text-sm"
          >
            Add
          </button>
        </div>

        {/* Queue List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {queue.length > 0 ? (
            queue.map((video, index) => (
              <div
                key={index}
                className={`p-2 rounded-md border ${
                  currentVideo?.id === video.id
                    ? 'bg-blue-100 border-blue-400'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <p className="text-xs truncate">{video.url}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handlePlay(video)}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No videos queued
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueuePlayer;
