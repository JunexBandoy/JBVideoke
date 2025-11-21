import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

interface VideoContextType {
  queue: string[];
  currentVideo: string | null;
  addVideo: (url: string) => void;
  nextVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedQueue = localStorage.getItem('videoQueue');
    if (savedQueue) {
      const parsed = JSON.parse(savedQueue);
      setQueue(parsed);
      setCurrentVideo(parsed[0] || null);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('videoQueue', JSON.stringify(queue));
  }, [queue]);

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const addVideo = (url: string) => {
    const id = extractVideoId(url);
    if (id && !queue.includes(id)) {
      const newQueue = [...queue, id];
      setQueue(newQueue);
      if (!currentVideo) setCurrentVideo(id);
    }
  };

  const nextVideo = () => {
    if (queue.length > 0) {
      const remaining = queue.slice(1);
      setQueue(remaining);
      setCurrentVideo(remaining[0] || null);
    }
  };

  return (
    <VideoContext.Provider value={{ queue, currentVideo, addVideo, nextVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const ctx = useContext(VideoContext);
  if (!ctx)
    throw new Error('useVideoContext must be used within VideoProvider');
  return ctx;
};
