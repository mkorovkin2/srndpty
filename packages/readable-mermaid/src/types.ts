export interface ReadableNode {
  id: string;
  label: string;
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;
  meta?: Record<string, any>;
}

export interface ReadableEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'thick' | 'dotted' | 'dashed';
  className?: string;
  meta?: Record<string, any>;
}

export interface ReadableGroup {
  id: string;
  label: string;
  nodes: string[];
  collapsible?: boolean;
  className?: string;
}

export interface LegendItem {
  swatch: string;
  label: string;
}

export interface ReadableSpec {
  type: 'flow' | 'sequence' | 'class' | 'state';
  direction?: 'TB' | 'BT' | 'RL' | 'LR';
  nodes: ReadableNode[];
  edges: ReadableEdge[];
  groups?: ReadableGroup[];
  legend?: LegendItem[];
  theme?: 'default' | 'dark' | 'neutral' | 'forest' | 'base';
}

export interface SrndptyOptions {
  width?: number;
  height?: number;
  fitToContainer?: boolean;
  enablePanZoom?: boolean;
  enableExport?: boolean;
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
  onEdgeClick?: (edge: ReadableEdge) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Legacy alias for backwards compatibility
export interface ReadableMermaidOptions extends SrndptyOptions {}

export interface InteractivityOptions {
  enablePan?: boolean;
  enableZoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export interface ExportOptions {
  format: 'svg' | 'png';
  filename?: string;
  backgroundColor?: string;
  scale?: number;
}

export interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

export interface VanillaRenderOptions {
  container: string | HTMLElement;
  width?: number;
  height?: number;
  enablePanZoom?: boolean;
  enableExport?: boolean;
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
  onEdgeClick?: (edge: ReadableEdge) => void;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
}

export interface FrameworkOptions {
  // Auto-detect React vs vanilla environment
  autoDetect?: boolean;
  // Fallback to vanilla if React not available
  fallbackToVanilla?: boolean;
  // Default container selector for vanilla mode
  defaultContainer?: string;
}
