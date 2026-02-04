
import React, { useMemo } from 'react';
import { ProjectState, TrackType, FilterSettings } from '../types';

interface PreviewProps {
  project: ProjectState;
  filters: FilterSettings;
}

const Preview: React.FC<PreviewProps> = ({ project, filters }) => {
  // Find current active video clip to "preview"
  const currentVideoClip = useMemo(() => {
    for (const track of project.tracks) {
      if (track.type === TrackType.VIDEO) {
        const clip = track.clips.find(c => 
          project.currentTime >= c.startTime && 
          project.currentTime <= (c.startTime + c.duration)
        );
        if (clip) return clip;
      }
    }
    return null;
  }, [project.tracks, project.currentTime]);

  const currentOverlay = useMemo(() => {
    for (const track of project.tracks) {
      if (track.type === TrackType.OVERLAY) {
        const clip = track.clips.find(c => 
          project.currentTime >= c.startTime && 
          project.currentTime <= (c.startTime + c.duration)
        );
        if (clip) return clip;
      }
    }
    return null;
  }, [project.tracks, project.currentTime]);

  const filterStyle = {
    filter: `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      sepia(${filters.sepia}%) 
      blur(${filters.blur}px)
    `
  };

  return (
    <div className="relative aspect-video w-full max-w-4xl bg-zinc-900 rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/10 group">
      {/* Mock Video Frame */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={filterStyle}
      >
        {currentVideoClip ? (
          <div className="w-full h-full relative">
            <img 
              src={currentVideoClip.thumbnail || `https://picsum.photos/seed/${currentVideoClip.id}/1280/720`}
              className="w-full h-full object-cover"
              alt="Video frame"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-zinc-400 font-mono">
              CLIP: {currentVideoClip.name}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-zinc-700">
             <div className="text-4xl font-bold mb-2">NO SIGNAL</div>
             <div className="font-mono text-xs">Waiting for video stream at {project.currentTime.toFixed(2)}s</div>
          </div>
        )}
      </div>

      {/* Overlay Layer */}
      {currentOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-pulse bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl">
             <h2 className="text-3xl font-bold tracking-tighter text-white drop-shadow-lg">
                {currentOverlay.name}
             </h2>
          </div>
        </div>
      )}

      {/* Frame Grids/Guides */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
         {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20" />)}
      </div>

      {/* Status Bar */}
      <div className="absolute top-4 left-4 flex gap-2">
         <div className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse">REC</div>
         <div className="px-2 py-1 bg-black/60 text-white text-[10px] font-mono rounded backdrop-blur">4K 60FPS</div>
      </div>
    </div>
  );
};

export default Preview;
