import mermaid from 'mermaid';
import type { ReadableSpec, VanillaRenderOptions } from './types.js';
import { specToMermaid, validateSpec } from './compiler.js';
import { exportAndDownloadSVG, exportAndDownloadPNG } from './export.js';

// Initialize Mermaid with readable defaults
let mermaidInitialized = false;

function initializeMermaid() {
  if (mermaidInitialized) return;
  
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      fontSize: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      primaryColor: '#f0f9ff',
      primaryTextColor: '#0f172a',
      primaryBorderColor: '#0ea5e9',
      lineColor: '#64748b',
    },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: 'basis'
    },
    securityLevel: 'loose'
  });
  
  mermaidInitialized = true;
}

export interface DiagramInstance {
  container: HTMLElement;
  svgElement: SVGElement | null;
  spec: ReadableSpec;
  options: VanillaRenderOptions;
  
  // Methods
  render(): Promise<void>;
  fit(): void;
  reset(): void;
  zoomIn(): void;
  zoomOut(): void;
  exportSVG(filename?: string): Promise<void>;
  exportPNG(filename?: string): Promise<void>;
  destroy(): void;
}

/**
 * Creates a new diagram instance
 */
export function createDiagram(spec: ReadableSpec, options: VanillaRenderOptions): DiagramInstance {
  initializeMermaid();
  
  // Get container element
  const container = typeof options.container === 'string' 
    ? document.querySelector(options.container) as HTMLElement
    : options.container;
    
  if (!container) {
    throw new Error(`Container not found: ${options.container}`);
  }
  
  let svgElement: SVGElement | null = null;
  let currentScale = 1;
  let currentTranslateX = 0;
  let currentTranslateY = 0;
  
  const instance: DiagramInstance = {
    container,
    svgElement,
    spec,
    options,
    
    async render() {
      try {
        // Validate spec
        const errors = validateSpec(spec);
        if (errors.length > 0) {
          throw new Error(`Spec validation failed: ${errors.join(', ')}`);
        }
        
        // Convert spec to Mermaid code
        const mermaidCode = specToMermaid(spec);
        
        // Generate unique ID
        const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render with Mermaid
        const { svg } = await mermaid.render(diagramId, mermaidCode);
        
        // Set container styles
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.border = '1px solid #e2e8f0';
        container.style.borderRadius = '8px';
        container.style.backgroundColor = '#ffffff';
        
        if (options.width) {
          container.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
        }
        if (options.height) {
          container.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height;
        }
        
        // Apply custom styles
        if (options.style) {
          Object.assign(container.style, options.style);
        }
        
        // Apply custom class
        if (options.className) {
          container.className = options.className;
        }
        
        // Insert SVG
        container.innerHTML = svg;
        svgElement = container.querySelector('svg');
        
        if (svgElement) {
          // Setup click handlers
          setupClickHandlers(svgElement);
          
          // Setup pan/zoom if enabled
          if (options.enablePanZoom) {
            setupPanZoom(svgElement);
          }
        }
        
      } catch (error) {
        container.innerHTML = `
          <div style="padding: 20px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin: 20px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Diagram Error</h4>
            <p style="margin: 0; font-size: 13px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        `;
      }
    },
    
    fit() {
      if (!svgElement) return;
      
      const containerRect = container.getBoundingClientRect();
      const svgRect = (svgElement as SVGGraphicsElement).getBBox();
      
      const scaleX = containerRect.width / svgRect.width;
      const scaleY = containerRect.height / svgRect.height;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some padding
      
      currentScale = scale;
      currentTranslateX = (containerRect.width - svgRect.width * scale) / 2;
      currentTranslateY = (containerRect.height - svgRect.height * scale) / 2;
      
      svgElement.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    },
    
    reset() {
      if (!svgElement) return;
      
      currentScale = 1;
      currentTranslateX = 0;
      currentTranslateY = 0;
      
      svgElement.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    },
    
    zoomIn() {
      if (!svgElement) return;
      
      currentScale = Math.min(5, currentScale * 1.2);
      svgElement.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    },
    
    zoomOut() {
      if (!svgElement) return;
      
      currentScale = Math.max(0.1, currentScale / 1.2);
      svgElement.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    },
    
    async exportSVG(filename = 'diagram.svg') {
      if (svgElement) {
        await exportAndDownloadSVG(svgElement, filename);
      }
    },
    
    async exportPNG(filename = 'diagram.png') {
      if (svgElement) {
        await exportAndDownloadPNG(svgElement, filename);
      }
    },
    
    destroy() {
      container.innerHTML = '';
      svgElement = null;
    }
  };
  
  function setupClickHandlers(svg: SVGElement) {
    if (!options.onNodeClick && !options.onEdgeClick) return;
    
    // Node click handlers
    if (options.onNodeClick) {
      spec.nodes.forEach(node => {
        const nodeSelectors = [
          `g[id*="${node.id}"]`,
          `[id="${node.id}"]`,
          `#${node.id}`
        ];
        
        for (const selector of nodeSelectors) {
          const nodeElements = svg.querySelectorAll(selector);
          if (nodeElements.length > 0) {
            nodeElements.forEach(nodeElement => {
              nodeElement.addEventListener('click', (event) => {
                event.stopPropagation();
                options.onNodeClick!(node.id, node);
              });
              
              (nodeElement as HTMLElement).style.cursor = 'pointer';
              
              nodeElement.addEventListener('mouseenter', () => {
                (nodeElement as HTMLElement).style.opacity = '0.8';
              });
              
              nodeElement.addEventListener('mouseleave', () => {
                (nodeElement as HTMLElement).style.opacity = '1';
              });
            });
            break;
          }
        }
      });
    }
    
    // Edge click handlers
    if (options.onEdgeClick) {
      spec.edges?.forEach(edge => {
        const edgeElements = svg.querySelectorAll('path, line');
        edgeElements.forEach(edgeElement => {
          edgeElement.addEventListener('click', (event) => {
            event.stopPropagation();
            options.onEdgeClick!(edge);
          });
          
          (edgeElement as HTMLElement).style.cursor = 'pointer';
          
          edgeElement.addEventListener('mouseenter', () => {
            (edgeElement as HTMLElement).style.opacity = '0.8';
          });
          
          edgeElement.addEventListener('mouseleave', () => {
            (edgeElement as HTMLElement).style.opacity = '1';
          });
        });
      });
    }
  }
  
  function setupPanZoom(svg: SVGElement) {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';
    
    // Wheel handler for zoom
    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      currentScale = Math.max(0.1, Math.min(5, currentScale * zoomFactor));
      
      svg.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    };
    
    // Mouse handlers for pan
    const mouseDownHandler = (event: MouseEvent) => {
      event.preventDefault();
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      container.style.cursor = 'grabbing';
    };
    
    const mouseMoveHandler = (event: MouseEvent) => {
      if (!isDragging) return;
      
      event.preventDefault();
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      
      currentTranslateX += deltaX;
      currentTranslateY += deltaY;
      
      svg.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
      
      lastX = event.clientX;
      lastY = event.clientY;
    };
    
    const mouseUpHandler = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };
    
    container.addEventListener('wheel', wheelHandler, { passive: false });
    container.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }
  
  return instance;
}

/**
 * Convenience function to create and render a diagram in one step
 */
export async function renderDiagram(spec: ReadableSpec, options: VanillaRenderOptions): Promise<DiagramInstance> {
  const instance = createDiagram(spec, options);
  await instance.render();
  return instance;
}
