
export enum TrackType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OVERLAY = 'OVERLAY'
}

export interface MediaClip {
  id: string;
  name: string;
  type: TrackType;
  startTime: number; // in seconds
  duration: number; // in seconds
  color: string;
  url?: string;
  thumbnail?: string;
}

export interface ProjectTrack {
  id: string;
  type: TrackType;
  name: string;
  clips: MediaClip[];
}

export interface ProjectState {
  name: string;
  currentTime: number;
  duration: number;
  tracks: ProjectTrack[];
  zoomLevel: number;
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  blur: number;
}
