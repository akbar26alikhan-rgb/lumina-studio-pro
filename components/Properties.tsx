
import React from 'react';
import { FilterSettings, MediaClip } from '../types';
import { Sliders, Maximize, Clock, Trash2 } from 'lucide-react';

interface PropertiesProps {
  activeClip: MediaClip | undefined;
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
}

const Properties: React.FC<PropertiesProps> = ({ activeClip, filters, setFilters }) => {
  const handleFilterChange = (key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="p-4 border-b border-zinc-800 shrink-0 flex items-center justify-between bg-zinc-800/20">
         <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            Properties
         </h2>
         {activeClip && <button className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {activeClip ? (
          <>
            {/* General Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Clip Name</label>
                <input 
                  type="text" 
                  value={activeClip.name} 
                  readOnly
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                     <Clock className="w-2.5 h-2.5" /> Start
                   </label>
                   <div className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 font-mono">
                     {activeClip.startTime.toFixed(2)}s
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                     <Maximize className="w-2.5 h-2.5" /> Duration
                   </label>
                   <div className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 font-mono">
                     {activeClip.duration.toFixed(2)}s
                   </div>
                </div>
              </div>
            </div>

            {/* Color Grading / Filters */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-800 pb-2">Color Grading</h3>
              
              <FilterControl 
                label="Brightness" 
                value={filters.brightness} 
                onChange={(val) => handleFilterChange('brightness', val)} 
                min={0} max={200}
              />
              <FilterControl 
                label="Contrast" 
                value={filters.contrast} 
                onChange={(val) => handleFilterChange('contrast', val)} 
                min={0} max={200}
              />
              <FilterControl 
                label="Saturation" 
                value={filters.saturation} 
                onChange={(val) => handleFilterChange('saturation', val)} 
                min={0} max={200}
              />
              <FilterControl 
                label="Sepia" 
                value={filters.sepia} 
                onChange={(val) => handleFilterChange('sepia', val)} 
                min={0} max={100}
              />
              <FilterControl 
                label="Blur" 
                value={filters.blur} 
                onChange={(val) => handleFilterChange('blur', val)} 
                min={0} max={20}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
             <Sliders className="w-12 h-12 mb-4 text-zinc-700" />
             <p className="text-xs font-medium text-zinc-500">Select a clip to view properties</p>
          </div>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setFilters({ brightness: 100, contrast: 120, saturation: 80, sepia: 20, blur: 0 })}
            className="text-[10px] py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors uppercase font-bold"
          >
            Cinematic
          </button>
          <button 
            onClick={() => setFilters({ brightness: 80, contrast: 150, saturation: 0, sepia: 0, blur: 0 })}
            className="text-[10px] py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors uppercase font-bold"
          >
            Noir
          </button>
        </div>
      </div>
    </div>
  );
};

interface FilterControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}

const FilterControl: React.FC<FilterControlProps> = ({ label, value, onChange, min, max }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
       <span className="uppercase font-bold">{label}</span>
       <span>{value}{label === 'Blur' ? 'px' : '%'}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-blue-500 cursor-pointer"
    />
  </div>
);

export default Properties;
