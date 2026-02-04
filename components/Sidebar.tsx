
import React, { useState } from 'react';
import { Search, Folder, Video, Music, Type, Plus, Upload, Trash2, Sparkles } from 'lucide-react';
import { TrackType, MediaClip } from '../types';

interface SidebarProps {
  onAddClip: (clip: MediaClip) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClip }) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'generate'>('assets');

  const assets = [
    { id: 'a1', name: 'Cinematic Dawn', type: TrackType.VIDEO, color: '#3b82f6', thumb: 'https://picsum.photos/seed/dawn/100/60' },
    { id: 'a2', name: 'Forest Path', type: TrackType.VIDEO, color: '#3b82f6', thumb: 'https://picsum.photos/seed/forest/100/60' },
    { id: 'a3', name: 'Bass Drop', type: TrackType.AUDIO, color: '#10b981' },
    { id: 'a4', name: 'Synth Wave', type: TrackType.AUDIO, color: '#10b981' },
    { id: 'a5', name: 'Lower Third', type: TrackType.OVERLAY, color: '#a855f7' },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 shrink-0">
        <button 
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'assets' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Assets
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'generate' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Generate
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'assets' ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                placeholder="Search assets..." 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            {/* Folders/Groups */}
            <div>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase">Library</h3>
                 <button className="text-zinc-500 hover:text-white"><Upload className="w-3 h-3" /></button>
              </div>
              
              <div className="space-y-1">
                {assets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className="group flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                    onClick={() => onAddClip({
                      id: `clip-${Math.random()}`,
                      name: asset.name,
                      type: asset.type,
                      startTime: 100, // Dummy
                      duration: 10,
                      color: asset.color,
                      thumbnail: asset.thumb
                    })}
                  >
                    <div className="w-10 h-6 bg-zinc-700 rounded flex items-center justify-center shrink-0 overflow-hidden">
                      {asset.thumb ? (
                        <img src={asset.thumb} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Video className="w-3 h-3 text-zinc-500" />
                      )}
                    </div>
                    <span className="text-xs text-zinc-300 truncate flex-1">{asset.name}</span>
                    <Plus className="w-3 h-3 text-zinc-600 group-hover:text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                VEO GENERATIVE
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Enter a prompt to generate high-quality cinematic video directly into your project.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">PROMPT</label>
              <textarea 
                placeholder="A futuristic neon city in the rain, 4k, cinematic lighting..." 
                className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-md p-3 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
              />
            </div>

            <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-md transition-colors shadow-lg shadow-purple-900/20">
              Generate Clip
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
           <Folder className="w-3.5 h-3.5" />
           <span>Storage (4.2GB / 10GB)</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
           <div className="h-full bg-blue-500 w-[42%]" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
