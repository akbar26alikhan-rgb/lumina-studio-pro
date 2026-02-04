
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Plus, 
  Layers, 
  Scissors, 
  Volume2, 
  Sun, 
  Download, 
  Sparkles,
  Search,
  Settings,
  Monitor,
  Video,
  Music,
  Type as TypeIcon
} from 'lucide-react';
import Timeline from './components/Timeline';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import Properties from './components/Properties';
import { ProjectState, TrackType, MediaClip, FilterSettings } from './types';

const INITIAL_PROJECT: ProjectState = {
  name: "Untitled Masterpiece",
  currentTime: 0,
  duration: 600, // 10 minutes default
  zoomLevel: 10, // pixels per second
  tracks: [
    {
      id: 'track-1',
      name: 'Video 1',
      type: TrackType.VIDEO,
      clips: [
        { id: 'clip-1', name: 'Cinematic Sunset', type: TrackType.VIDEO, startTime: 10, duration: 45, color: '#3b82f6', thumbnail: 'https://picsum.photos/seed/sunset/200/120' },
        { id: 'clip-2', name: 'Urban Exploration', type: TrackType.VIDEO, startTime: 70, duration: 30, color: '#3b82f6', thumbnail: 'https://picsum.photos/seed/urban/200/120' },
      ]
    },
    {
      id: 'track-2',
      name: 'Overlay',
      type: TrackType.OVERLAY,
      clips: [
        { id: 'clip-3', name: 'Title Card', type: TrackType.OVERLAY, startTime: 5, duration: 15, color: '#a855f7' },
      ]
    },
    {
      id: 'track-3',
      name: 'Background Music',
      type: TrackType.AUDIO,
      clips: [
        { id: 'clip-4', name: 'Ambient Lo-fi', type: TrackType.AUDIO, startTime: 0, duration: 300, color: '#10b981' },
      ]
    }
  ]
};

const INITIAL_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  blur: 0
};

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState>(INITIAL_PROJECT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>(INITIAL_FILTERS);
  const playbackRef = useRef<number | null>(null);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const start = performance.now();
      const initialTime = project.currentTime;
      
      const step = (now: number) => {
        const elapsed = (now - start) / 1000;
        const newTime = Math.min(initialTime + elapsed, project.duration);
        
        setProject(prev => ({ ...prev, currentTime: newTime }));
        
        if (newTime >= project.duration) {
          setIsPlaying(false);
          return;
        }
        
        playbackRef.current = requestAnimationFrame(step);
      };
      
      playbackRef.current = requestAnimationFrame(step);
    } else if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
    }

    return () => {
      if (playbackRef.current) cancelAnimationFrame(playbackRef.current);
    };
  }, [isPlaying, project.duration]);

  const handleSeek = (time: number) => {
    setProject(prev => ({ ...prev, currentTime: Math.max(0, Math.min(time, prev.duration)) }));
  };

  const handleZoom = (delta: number) => {
    setProject(prev => ({ ...prev, zoomLevel: Math.max(1, Math.min(100, prev.zoomLevel + delta)) }));
  };

  const activeClip = project.tracks
    .flatMap(t => t.clips)
    .find(c => c.id === activeClipId);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-sm uppercase tracking-widest text-zinc-400">
            Lumina <span className="text-zinc-100">Studio Pro</span>
          </h1>
          <div className="h-4 w-[1px] bg-zinc-700 mx-2" />
          <span className="text-xs text-zinc-500 font-mono">{project.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Assistant
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors text-xs font-bold text-white">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Assets */}
        <Sidebar onAddClip={(clip) => {
          setProject(prev => ({
            ...prev,
            tracks: prev.tracks.map((t, i) => i === 0 ? { ...t, clips: [...t.clips, clip] } : t)
          }));
        }} />

        {/* Center - Preview & Properties */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            {/* Preview Section */}
            <div className="flex-[2] bg-black flex flex-col border-r border-zinc-800 relative">
               <div className="flex-1 flex items-center justify-center p-8">
                  <Preview 
                    project={project} 
                    filters={filters}
                  />
               </div>
               
               {/* Preview Controls */}
               <div className="h-16 border-t border-zinc-800 flex items-center justify-center gap-6 bg-zinc-900/40">
                  <button onClick={() => handleSeek(0)} className="text-zinc-400 hover:text-white transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={togglePlayback}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                  </button>
                  <button className="text-zinc-400 hover:text-white transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <div className="absolute right-6 font-mono text-xs text-zinc-500">
                    {formatTime(project.currentTime)} / {formatTime(project.duration)}
                  </div>
               </div>
            </div>

            {/* Properties Section */}
            <div className="w-80 shrink-0 bg-zinc-900 flex flex-col border-l border-zinc-800">
              <Properties 
                activeClip={activeClip} 
                filters={filters} 
                setFilters={setFilters} 
              />
            </div>
          </div>

          {/* Bottom - Timeline */}
          <div className="h-80 bg-zinc-900/80 border-t border-zinc-800 flex flex-col shrink-0">
            <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/60">
              <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-zinc-800 rounded"><Scissors className="w-4 h-4 text-zinc-400" /></button>
                <button className="p-1 hover:bg-zinc-800 rounded"><Layers className="w-4 h-4 text-zinc-400" /></button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-zinc-500">ZOOM</span>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={project.zoomLevel}
                  onChange={(e) => setProject(prev => ({ ...prev, zoomLevel: parseInt(e.target.value) }))}
                  className="w-24 accent-blue-500 h-1 rounded-full appearance-none bg-zinc-700"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <Timeline 
                project={project} 
                onSeek={handleSeek} 
                onActiveClipChange={setActiveClipId}
                activeClipId={activeClipId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
};

export default App;
