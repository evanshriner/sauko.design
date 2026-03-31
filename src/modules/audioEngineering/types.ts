export interface SignalPoint {
  x: number;
  y: number;
}

export interface SignalPathData {
  points: SignalPoint[];
  noiseLevel: number;
  color: string;
}
