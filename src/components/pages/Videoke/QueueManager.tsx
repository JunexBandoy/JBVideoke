import React, { useState, useEffect } from 'react';

interface Video {
  id: string;
  url: string;
}

const QueueManager: React.FC = () => {
  const [queue, setQueue] = useState<Video[]>([]);
  const [input, setInput] = useState('');

  // Load queue from localStorage on load
  useEffect(() => {
    const savedQueue = localStorage.getItem('videoQueue');
    if (savedQueue) setQueue(JSON.parse(savedQueue));
  }, []);

  // Save queue whenever it changes
  useEffect(() => {
    localStorage.setItem('videoQueue', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = () => {
    if (!input.trim()) return;

    const newVideo = {
      id: Date.now().toString(),
      url: input.trim(),
    };

    const updatedQueue = [...queue, newVideo];
    setQueue(updatedQueue);
    setInput('');

    // If player tab is open, notify it
    localStorage.setItem('videoQueue', JSON.stringify(updatedQueue));
    window.dispatchEvent(new Event('storage'));
  };

  const openPlayer = () => {
    window.open('/player.html', '_blank');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎶 YouTube Queue Manager</h2>

      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Enter YouTube link"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-md"
        />
        <button
          onClick={addToQueue}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      <button
        onClick={openPlayer}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Open Player Tab
      </button>

      <ul className="space-y-2">
        {queue.map((video, i) => (
          <li key={video.id} className="border p-2 rounded-md">
            <p className="text-sm">
              {i + 1}. {video.url}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueueManager;
