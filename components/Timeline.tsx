
import React, { useRef, useEffect } from 'react';
import { ProjectState, TrackType, MediaClip } from '../types';
import { Music, Video, Type as TypeIcon } from 'lucide-react';

interface TimelineProps {
  project: ProjectState;
  onSeek: (time: number) => void;
  onActiveClipChange: (id: string | null) => void;
  activeClipId: string | null;
}

const Timeline: React.FC<TimelineProps> = ({ project, onSeek, onActiveClipChange, activeClipId }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const time = (x - 160) / project.zoomLevel; // 160px is the track header width
    onSeek(Math.max(0, time));
  };

  const getTrackIcon = (type: TrackType) => {
    switch (type) {
      case TrackType.VIDEO: return <Video className="w-3.5 h-3.5" />;
      case TrackType.AUDIO: return <Music className="w-3.5 h-3.5" />;
      case TrackType.OVERLAY: return <TypeIcon className="w-3.5 h-3.5" />;
    }
  };

  // Generate markers for the ruler
  const rulerMarkers = [];
  const duration = project.duration;
  for (let i = 0; i <= duration; i += 5) {
    rulerMarkers.push(i);
  }

  return (
    <div className="relative h-full flex flex-col font-mono text-[10px]">
      {/* Time Ruler */}
      <div 
        className="h-8 border-b border-zinc-800 relative bg-zinc-900/40 cursor-crosshair overflow-hidden"
        onClick={handleTimelineClick}
      >
        <div className="absolute left-40 flex items-end h-full">
           {rulerMarkers.map(m => (
             <div 
               key={m} 
               className="absolute flex flex-col items-center" 
               style={{ left: m * project.zoomLevel }}
             >
                <div className="h-2 w-[1px] bg-zinc-700" />
                <span className="text-zinc-600 mb-0.5">{m}s</span>
             </div>
           ))}
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative" ref={timelineRef}>
        {project.tracks.map((track) => (
          <div key={track.id} className="flex h-16 border-b border-zinc-800 group hover:bg-zinc-800/20">
            {/* Track Header */}
            <div className="w-40 border-r border-zinc-800 flex items-center px-4 gap-3 bg-zinc-900 sticky left-0 z-10">
               <div className="text-zinc-500">{getTrackIcon(track.type)}</div>
               <span className="text-zinc-400 font-medium truncate">{track.name}</span>
            </div>
            
            {/* Track Timeline Area */}
            <div className="flex-1 relative min-w-[5000px] bg-zinc-950/20">
              {track.clips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActiveClipChange(clip.id);
                  }}
                  className={`absolute top-2 bottom-2 rounded-md cursor-pointer transition-all flex flex-col overflow-hidden border ${
                    activeClipId === clip.id 
                      ? 'border-white ring-2 ring-blue-500/50 z-20 scale-[1.02]' 
                      : 'border-white/10'
                  }`}
                  style={{
                    left: clip.startTime * project.zoomLevel,
                    width: clip.duration * project.zoomLevel,
                    backgroundColor: clip.color + '33',
                  }}
                >
                  <div 
                    className="h-1.5 w-full shrink-0" 
                    style={{ backgroundColor: clip.color }}
                  />
                  <div className="px-2 py-1 flex items-center gap-2 truncate">
                    {clip.thumbnail && (
                      <img src={clip.thumbnail} className="w-8 h-5 object-cover rounded opacity-80" alt="" />
                    )}
                    <span className="text-zinc-100 font-medium">{clip.name}</span>
                  </div>
                  <div className="mt-auto px-2 pb-1 flex justify-between text-zinc-500 opacity-60">
                    <span>{clip.duration.toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div 
          ref={playheadRef}
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          style={{ 
            left: 160 + (project.currentTime * project.zoomLevel),
            transition: 'none'
          }}
        >
          <div className="absolute -top-1 -left-[5px] w-3 h-3 bg-red-500 rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
