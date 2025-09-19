// React Component Export
export { Srndpty, ReadableMermaid } from './ReadableMermaid.js';
export type { SrndptyMethods, SrndptyProps, SrndptyMethods as ReadableMermaidMethods, SrndptyProps as ReadableMermaidProps } from './ReadableMermaid.js';

// Core Compiler and Utilities
export { specToMermaid as makeDiagram, specToMermaid as makeMermaid, validateSpec, wrapLabel } from './compiler.js';

// Export Functions
export { 
  exportSVG, 
  exportPNG, 
  exportAndDownloadSVG, 
  exportAndDownloadPNG,
  downloadDataUrl 
} from './export.js';

// Interactivity Utilities
export {
  createPanZoomState,
  applyTransform,
  fitToContainer,
  resetTransform,
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} from './interactivity.js';

// Vanilla JavaScript API
export { createDiagram, renderDiagram } from './vanilla.js';
export type { DiagramInstance } from './vanilla.js';

// Main Framework Entry Point
export { SrndptyFramework, ReadableMermaidFramework, createDiagram as createVanillaDiagram, renderDiagram as renderVanillaDiagram } from './framework.js';

// Default export - the main framework
export { default } from './framework.js';

// Type Exports
export type {
  ReadableSpec,
  ReadableNode,
  ReadableEdge,
  ReadableGroup,
  LegendItem,
  SrndptyOptions,
  ReadableMermaidOptions,
  InteractivityOptions,
  ExportOptions,
  PanZoomState,
  VanillaRenderOptions,
  FrameworkOptions
} from './types.js';
