import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import type { ReadableSpec, SrndptyOptions, PanZoomState, ReadableNode, ReadableEdge } from './types.js';
import { specToMermaid, validateSpec } from './compiler.js';
import {
  createPanZoomState,
  applyTransform,
  fitToContainer,
  resetTransform,
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} from './interactivity.js';
import { exportAndDownloadSVG, exportAndDownloadPNG } from './export.js';

// Initialize Mermaid with readable defaults
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
  securityLevel: 'loose' // Required for click handlers
});

export interface SrndptyMethods {
  fit: () => void;
  reset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  exportSVG: (filename?: string) => Promise<void>;
  exportPNG: (filename?: string) => Promise<void>;
  getState: () => PanZoomState;
}

export interface SrndptyProps {
  spec: ReadableSpec;
  options?: SrndptyOptions;
}

export const Srndpty = React.forwardRef<SrndptyMethods, SrndptyProps>(
  ({ spec, options = {} }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGElement | null>(null);
  const [panZoomState, setPanZoomState] = useState<PanZoomState>(createPanZoomState());
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const [tooltip, setTooltip] = useState<{visible: boolean; x: number; y: number; content: React.ReactNode; nodeId?: string}>({visible: false, x: 0, y: 0, content: null, nodeId: undefined});
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTooltipUpdate = useRef<number>(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedPaths, setHighlightedPaths] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{visible: boolean; x: number; y: number; type: 'node' | 'edge'; data: any}>({visible: false, x: 0, y: 0, type: 'node', data: null});

  const {
    width,
    height,
    fitToContainer: shouldFitToContainer = true,
    enablePanZoom = true,
    onNodeClick,
    onEdgeClick,
    className,
    style,
  } = options;

  // Validate spec and render diagram
  const renderDiagram = useCallback(async () => {
    if (isRendering) return;
    
    setIsRendering(true);
    setError(null);

    // Validate spec
    const errors = validateSpec(spec);
    if (errors.length > 0) {
      throw new Error(`Spec validation failed: ${errors.join(', ')}`);
    }

    // Convert spec to Mermaid code
    const mermaidCode = specToMermaid(spec);
    console.log('Generated Mermaid code:', mermaidCode);
    
    // Generate unique ID for this diagram
    const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Render with Mermaid
    const { svg } = await mermaid.render(diagramId, mermaidCode);
    
    // Set the SVG content via React state instead of direct DOM manipulation
    setSvgContent(svg);
    setIsRendering(false);
  }, [spec, isRendering]);

  // Optimized tooltip show/hide functions with debouncing
  const showTooltip = useCallback((x: number, y: number, content: React.ReactNode, nodeId?: string) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Throttle tooltip updates to avoid excessive re-renders
    const now = Date.now();
    if (now - lastTooltipUpdate.current < 16) { // ~60fps
      return;
    }
    lastTooltipUpdate.current = now;
    
    setTooltip({
      visible: true,
      x,
      y,
      content,
      nodeId
    });
  }, []);
  
  const hideTooltip = useCallback(() => {
    // Clear any pending show timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Add small delay to prevent flickering when moving between elements
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 50);
  }, []);
  
  const updateTooltipPosition = useCallback((x: number, y: number) => {
    // Only update if tooltip is visible and we're not updating too frequently
    const now = Date.now();
    if (now - lastTooltipUpdate.current < 32) { // ~30fps for position updates
      return;
    }
    lastTooltipUpdate.current = now;
    
    setTooltip(prev => prev.visible ? { ...prev, x, y } : prev);
  }, []);

  // Create tooltip content for nodes (memoized)
  const createNodeTooltip = useCallback((node: ReadableNode) => {
    const connections = spec.edges?.filter(edge => edge.from === node.id || edge.to === node.id) || [];
    const incoming = connections.filter(edge => edge.to === node.id);
    const outgoing = connections.filter(edge => edge.from === node.id);
    
    return (
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        pointerEvents: 'none' // Prevent tooltip from interfering with mouse events
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#60a5fa' }}>
          {node.label}
        </div>
        <div style={{ marginBottom: '6px', opacity: 0.8 }}>
          ID: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '3px' }}>{node.id}</code>
        </div>
        {node.shape && (
          <div style={{ marginBottom: '6px', opacity: 0.8 }}>
            Shape: <span style={{ textTransform: 'capitalize' }}>{node.shape}</span>
          </div>
        )}
        {connections.length > 0 && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Connections:</div>
            {incoming.length > 0 && (
              <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                ← {incoming.length} incoming
              </div>
            )}
            {outgoing.length > 0 && (
              <div style={{ fontSize: '12px' }}>
                → {outgoing.length} outgoing
              </div>
            )}
          </div>
        )}
        {node.meta && Object.keys(node.meta).length > 0 && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Metadata:</div>
            {Object.entries(node.meta).slice(0, 3).map(([key, value]) => (
              <div key={key} style={{ fontSize: '12px', marginBottom: '2px' }}>
                {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </div>
            ))}
            {Object.keys(node.meta).length > 3 && (
              <div style={{ fontSize: '11px', opacity: 0.6, fontStyle: 'italic' }}>
                +{Object.keys(node.meta).length - 3} more...
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.6 }}>
          Click to select • Right-click for options
        </div>
      </div>
    );
  }, [spec.edges]);
  
  // Create tooltip content for edges (memoized)
  const createEdgeTooltip = useCallback((edge: ReadableEdge) => {
    const fromNode = spec.nodes.find(n => n.id === edge.from);
    const toNode = spec.nodes.find(n => n.id === edge.to);
    
    return (
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        pointerEvents: 'none' // Prevent tooltip from interfering with mouse events
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#34d399' }}>
          {edge.label || 'Connection'}
        </div>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ color: '#60a5fa' }}>{fromNode?.label || edge.from}</span>
          <span style={{ margin: '0 8px', opacity: 0.7 }}>→</span>
          <span style={{ color: '#f472b6' }}>{toNode?.label || edge.to}</span>
        </div>
        {edge.style && (
          <div style={{ marginBottom: '6px', opacity: 0.8 }}>
            Style: <span style={{ textTransform: 'capitalize' }}>{edge.style}</span>
          </div>
        )}
        {edge.meta && Object.keys(edge.meta).length > 0 && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Metadata:</div>
            {Object.entries(edge.meta).slice(0, 2).map(([key, value]) => (
              <div key={key} style={{ fontSize: '12px', marginBottom: '2px' }}>
                {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </div>
            ))}
            {Object.keys(edge.meta).length > 2 && (
              <div style={{ fontSize: '11px', opacity: 0.6, fontStyle: 'italic' }}>
                +{Object.keys(edge.meta).length - 2} more...
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.6 }}>
          Click to highlight path
        </div>
      </div>
    );
  }, [spec.nodes]);

  // Setup click handlers for nodes and edges
  const setupClickHandlers = useCallback((svgElement: SVGElement) => {
    console.log('🎯 Setting up click handlers for SVG:', svgElement);
    
    // Node click handlers
      spec.nodes.forEach(node => {
        console.log(`🔍 Looking for node: ${node.id}`);
        
        // Try the most likely selectors first
        const nodeSelectors = [
          `g[id*="${node.id}"]`,
          `[id="${node.id}"]`,
          `#${node.id}`,
          `g:has([id*="${node.id}"])`,
          `g:has(text:contains("${node.label}"))`,
        ];
        
        let found = false;
        for (const selector of nodeSelectors) {
          try {
            const nodeElements = svgElement.querySelectorAll(selector);
            
            if (nodeElements.length > 0) {
            nodeElements.forEach((nodeElement) => {
              console.log(`✅ Found node element for ${node.id}:`, nodeElement);
                
              // Click handler
                nodeElement.addEventListener('click', (event) => {
                  event.stopPropagation();
                  console.log(`🎯 NODE CLICKED: ${node.id}`, node);
                
                // Hide context menu
                setContextMenu(prev => ({ ...prev, visible: false }));
                
                // Toggle selection
                if (selectedNode === node.id) {
                  setSelectedNode(null);
                  setHighlightedPaths(new Set());
                } else {
                  setSelectedNode(node.id);
                  // Highlight connected paths
                  const connectedEdges = spec.edges?.filter(edge => 
                    edge.from === node.id || edge.to === node.id
                  ) || [];
                  const pathIds = connectedEdges.map(edge => `${edge.from}-${edge.to}`);
                  setHighlightedPaths(new Set(pathIds));
                }
                
                if (onNodeClick) {
                  onNodeClick(node.id, node);
                }
              });

              // Right-click context menu
              nodeElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const mouseEvent = event as MouseEvent;
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setContextMenu({
                    visible: true,
                    x: mouseEvent.clientX - rect.left,
                    y: mouseEvent.clientY - rect.top,
                    type: 'node',
                    data: node
                  });
                }
                });
                
                (nodeElement as HTMLElement).style.cursor = 'pointer';
                
              // Enhanced hover effects with optimized tooltip
              nodeElement.addEventListener('mouseenter', (event) => {
                console.log(`🖱️ Mouse enter node: ${node.id}`);
                
                // Add visual highlight
                (nodeElement as HTMLElement).style.filter = 'brightness(1.1) drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))';
                (nodeElement as HTMLElement).style.transform = 'scale(1.05)';
                (nodeElement as HTMLElement).style.transition = 'all 0.2s ease';
                
                // Show tooltip with optimized positioning
                const mouseEvent = event as MouseEvent;
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (containerRect) {
                  const x = mouseEvent.clientX - containerRect.left;
                  const y = mouseEvent.clientY - containerRect.top - 10;
                  showTooltip(x, y, createNodeTooltip(node), node.id);
                }
              });
                
              // Update tooltip position on mouse move (throttled)
              nodeElement.addEventListener('mousemove', (event) => {
                const mouseEvent = event as MouseEvent;
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (containerRect) {
                  const x = mouseEvent.clientX - containerRect.left;
                  const y = mouseEvent.clientY - containerRect.top - 10;
                  updateTooltipPosition(x, y);
                }
              });
                
              nodeElement.addEventListener('mouseleave', () => {
                console.log(`🖱️ Mouse leave node: ${node.id}`);
                
                // Remove visual highlight
                (nodeElement as HTMLElement).style.filter = '';
                (nodeElement as HTMLElement).style.transform = '';
                
                // Hide tooltip with delay to prevent flickering
                hideTooltip();
              });
                
                found = true;
              });
              break;
            }
          } catch (e) {
            console.log(`❌ Selector "${selector}" failed:`, e);
            continue;
          }
        }
        
        if (!found) {
          console.warn(`❌ Could not find node element for: ${node.id}`);
        }
      });

    // Edge click handlers
      spec.edges?.forEach((edge) => {
        console.log(`🔍 Looking for edge: ${edge.from} → ${edge.to}`);
        
        // Try different selectors for edges
        const edgeSelectors = [
          `path[id*="${edge.from}"]`,
          `path[id*="${edge.to}"]`,
          `path`,
          `line`,
          `.flowchart-link`,
          `.edge`,
        ];
        
        let found = false;
        for (const selector of edgeSelectors) {
          try {
            const edgeElements = svgElement.querySelectorAll(selector);
            
            if (edgeElements.length > 0) {
              // For now, just attach to all path elements
              edgeElements.forEach((edgeElement, elemIndex) => {
                console.log(`✅ Found edge element ${elemIndex}:`, edgeElement);
                
              // Click handler
                edgeElement.addEventListener('click', (event) => {
                  event.stopPropagation();
                  console.log(`🎯 EDGE CLICKED:`, edge);
                
                // Hide context menu
                setContextMenu(prev => ({ ...prev, visible: false }));
                
                // Highlight the path
                const pathId = `${edge.from}-${edge.to}`;
                if (highlightedPaths.has(pathId)) {
                  setHighlightedPaths(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(pathId);
                    return newSet;
                  });
                } else {
                  setHighlightedPaths(prev => new Set(prev).add(pathId));
                }
                
                if (onEdgeClick) {
                  onEdgeClick(edge);
                }
              });

              // Right-click context menu for edges
              edgeElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const mouseEvent = event as MouseEvent;
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setContextMenu({
                    visible: true,
                    x: mouseEvent.clientX - rect.left,
                    y: mouseEvent.clientY - rect.top,
                    type: 'edge',
                    data: edge
                  });
                }
                });
                
                (edgeElement as HTMLElement).style.cursor = 'pointer';
                
              // Enhanced hover effects with optimized tooltip
              edgeElement.addEventListener('mouseenter', (event) => {
                console.log(`🖱️ Mouse enter edge: ${edge.from} → ${edge.to}`);
                
                // Add visual highlight
                (edgeElement as HTMLElement).style.filter = 'brightness(1.2) drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))';
                (edgeElement as HTMLElement).style.strokeWidth = '3px';
                (edgeElement as HTMLElement).style.transition = 'all 0.2s ease';
                
                // Show tooltip with optimized positioning
                const mouseEvent = event as MouseEvent;
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (containerRect) {
                  const x = mouseEvent.clientX - containerRect.left;
                  const y = mouseEvent.clientY - containerRect.top - 10;
                  showTooltip(x, y, createEdgeTooltip(edge), `${edge.from}-${edge.to}`);
                }
              });
                
              // Update tooltip position on mouse move (throttled)
              edgeElement.addEventListener('mousemove', (event) => {
                const mouseEvent = event as MouseEvent;
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (containerRect) {
                  const x = mouseEvent.clientX - containerRect.left;
                  const y = mouseEvent.clientY - containerRect.top - 10;
                  updateTooltipPosition(x, y);
                }
              });
                
              edgeElement.addEventListener('mouseleave', () => {
                console.log(`🖱️ Mouse leave edge: ${edge.from} → ${edge.to}`);
                
                // Remove visual highlight
                (edgeElement as HTMLElement).style.filter = '';
                (edgeElement as HTMLElement).style.strokeWidth = '';
                
                // Hide tooltip with delay to prevent flickering
                hideTooltip();
              });
                
                found = true;
              });
              
              // Only attach to the first selector that works
              if (selector === 'path' || selector === 'line') {
                break;
              }
            }
          } catch (e) {
            console.log(`❌ Edge selector "${selector}" failed:`, e);
            continue;
          }
        }
        
        if (!found) {
          console.warn(`❌ Could not find edge element for: ${edge.from} → ${edge.to}`);
        }
      });
  }, [spec.nodes, spec.edges, onNodeClick, onEdgeClick, showTooltip, hideTooltip, updateTooltipPosition, createNodeTooltip, createEdgeTooltip]);

  // Setup pan/zoom event handlers
  const setupPanZoom = useCallback((svgElement: SVGElement) => {
    const container = containerRef.current;
    if (!container) {
      console.log('❌ No container for pan/zoom setup');
      return;
    }

    console.log('✅ Setting up pan/zoom on container:', container);
    console.log('✅ SVG element:', svgElement);

    // Make sure the container can capture mouse events
    container.style.overflow = 'hidden';
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';

    // Use a ref to track current state to avoid stale closures
    let currentState = { ...panZoomState };
    let isDragging = false;

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('🎯 WHEEL EVENT:', event.deltaY);
      
      const containerRect = container.getBoundingClientRect();
      const newState = handleWheel(event, currentState, { enableZoom: true }, containerRect);
      currentState = newState;
      
      // Update React state
      setPanZoomState(newState);
      applyTransform(svgElement, newState);
    };

    const mouseDownHandler = (event: MouseEvent) => {
      // Only handle left mouse button
      if (event.button !== 0) return;
      
      // Check if we're clicking on an interactive element
      const target = event.target as Element;
      if (target.closest('g[id*="node"]') || target.closest('path') || target.closest('text')) {
        return; // Let the click handlers handle this
      }
      
      event.preventDefault();
      event.stopPropagation();
      console.log('🖱️ MOUSE DOWN for pan:', event.clientX, event.clientY);
      
      container.style.cursor = 'grabbing';
      isDragging = true;
      
      const newState = handleMouseDown(event, currentState);
      currentState = newState;
      setPanZoomState(newState);
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!isDragging) return;
      
      event.preventDefault();
      event.stopPropagation();
      console.log('🖱️ MOUSE MOVE for pan:', event.clientX, event.clientY);
      
      const newState = handleMouseMove(event, currentState);
      currentState = newState;
      setPanZoomState(newState);
      applyTransform(svgElement, newState);
    };

    const mouseUpHandler = () => {
      if (!isDragging) return;
      
      console.log('🖱️ MOUSE UP for pan');
      container.style.cursor = 'grab';
      isDragging = false;
      
      const newState = handleMouseUp(currentState);
      currentState = newState;
      setPanZoomState(newState);
    };

    // Sync state when panZoomState prop changes
    const syncState = () => {
      currentState = { ...panZoomState };
    };

    // Add event listeners
    console.log('🎯 Adding pan/zoom event listeners');
    container.addEventListener('wheel', wheelHandler, { passive: false });
    container.addEventListener('mousedown', mouseDownHandler, { passive: false });
    document.addEventListener('mousemove', mouseMoveHandler, { passive: false });
    document.addEventListener('mouseup', mouseUpHandler, { passive: false });

    // Initial sync
    syncState();

    // Return cleanup function
    return () => {
      console.log('🧹 Cleaning up pan/zoom event listeners');
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [panZoomState]);

  // Render diagram when spec changes
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Hide context menu on outside clicks
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // Cleanup tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Setup interactivity after SVG content is rendered
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    // Use setTimeout to ensure DOM is fully updated
    const timeoutId = setTimeout(() => {
      const svgElement = containerRef.current?.querySelector('svg') as SVGElement;
      if (!svgElement) {
        console.log('❌ SVG element not found in container');
        return;
      }
      console.log('✅ Found SVG element:', svgElement);

      // Store reference to SVG element
      svgRef.current = svgElement;
      
      // Set dimensions if specified
      if (width) svgElement.setAttribute('width', width.toString());
      if (height) svgElement.setAttribute('height', height.toString());
      
      // Setup click handlers
      setupClickHandlers(svgElement);
      
      // Setup pan/zoom if enabled
      if (enablePanZoom) {
        const cleanup = setupPanZoom(svgElement);
        // Store cleanup function for later use
        return cleanup;
      }
      
      // Fit to container if enabled
      if (shouldFitToContainer && containerRef.current) {
        const newState = fitToContainer(svgElement, containerRef.current);
        setPanZoomState(newState);
        applyTransform(svgElement, newState);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [svgContent, width, height, shouldFitToContainer, enablePanZoom, setupClickHandlers, setupPanZoom]);

  // Public methods for controlling the diagram
  const fit = useCallback(() => {
    if (svgRef.current && containerRef.current) {
      const newState = fitToContainer(svgRef.current, containerRef.current);
      setPanZoomState(newState);
      applyTransform(svgRef.current, newState);
    }
  }, []);

  const reset = useCallback(() => {
    const newState = resetTransform();
    setPanZoomState(newState);
    if (svgRef.current) {
      applyTransform(svgRef.current, newState);
    }
  }, []);

  const zoomIn = useCallback(() => {
    if (svgRef.current) {
      setPanZoomState((currentState) => {
        const newScale = Math.min(5, currentState.scale * 1.2);
        const newState = { ...currentState, scale: newScale };
        applyTransform(svgRef.current!, newState);
        return newState;
      });
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (svgRef.current) {
      setPanZoomState((currentState) => {
        const newScale = Math.max(0.1, currentState.scale / 1.2);
        const newState = { ...currentState, scale: newScale };
        applyTransform(svgRef.current!, newState);
        return newState;
      });
    }
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events when the container or its children have focus
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }
      
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setSelectedNode(null);
          setHighlightedPaths(new Set());
          setTooltip(prev => ({ ...prev, visible: false }));
          setContextMenu(prev => ({ ...prev, visible: false }));
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            // Fit to container
            if (svgRef.current && containerRef.current) {
              const newState = fitToContainer(svgRef.current, containerRef.current);
              setPanZoomState(newState);
              applyTransform(svgRef.current, newState);
            }
          }
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            // Reset transform
            const newState = resetTransform();
            setPanZoomState(newState);
            if (svgRef.current) {
              applyTransform(svgRef.current, newState);
            }
          }
          break;
         case '+':
         case '=':
           if (event.ctrlKey || event.metaKey) {
             event.preventDefault();
             // Zoom in
             zoomIn();
           }
           break;
         case '-':
         case '_':
           if (event.ctrlKey || event.metaKey) {
             event.preventDefault();
             // Zoom out
             zoomOut();
           }
           break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, zoomIn, zoomOut]);

  const exportSVG = useCallback(async (filename?: string) => {
    if (svgRef.current) {
      await exportAndDownloadSVG(svgRef.current, filename);
    }
  }, []);

  const exportPNG = useCallback(async (filename?: string) => {
    if (svgRef.current) {
      await exportAndDownloadPNG(svgRef.current, filename);
    }
  }, []);

  // Create a separate ref for imperative methods
  const methodsRef = useRef({
    fit,
    reset,
    zoomIn,
    zoomOut,
    exportSVG,
    exportPNG,
    getState: () => panZoomState,
  });

  // Update methods ref when functions change
  useEffect(() => {
    methodsRef.current = {
      fit,
      reset,
      zoomIn,
      zoomOut,
      exportSVG,
      exportPNG,
      getState: () => panZoomState,
    };
  }, [fit, reset, zoomIn, zoomOut, exportSVG, exportPNG, panZoomState]);

  // Expose methods through imperative ref
  React.useImperativeHandle(ref, () => ({
    fit,
    reset,
    zoomIn,
    zoomOut,
    exportSVG,
    exportPNG,
    getState: () => panZoomState,
  }), [fit, reset, zoomIn, zoomOut, exportSVG, exportPNG, panZoomState]);

  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '400px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff',
    ...style,
  };

  if (error) {
    return (
      <div className={className} style={containerStyle}>
        <div style={{
          padding: '20px',
          color: '#dc2626',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          margin: '20px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
            Diagram Error
          </h4>
          <p style={{ margin: 0, fontSize: '13px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      style={containerStyle}
      data-testid="srndpty-container"
      tabIndex={0}
      role="img"
      aria-label="Interactive diagram"
    >
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      
      {/* Optimized Tooltip */}
      <div
        style={{
          position: 'absolute',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
          zIndex: 1000,
          opacity: tooltip.visible ? 1 : 0,
          visibility: tooltip.visible ? 'visible' : 'hidden',
          transition: 'opacity 0.15s ease-in-out, visibility 0.15s ease-in-out',
          willChange: 'opacity, transform'
        }}
      >
        {tooltip.content}
      </div>
      
      {/* Selection info panel */}
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            maxWidth: '250px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 999
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1e40af' }}>
            Selected: {spec.nodes.find(n => n.id === selectedNode)?.label}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
            {highlightedPaths.size} connection{highlightedPaths.size !== 1 ? 's' : ''} highlighted
          </div>
          <button
            onClick={() => {
              setSelectedNode(null);
              setHighlightedPaths(new Set());
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            minWidth: '160px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'node' ? (
            <>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', fontSize: '13px', color: '#475569' }}>
                {contextMenu.data?.label}
              </div>
              <button
                onClick={() => {
                  // Show connections
                  const connectedEdges = spec.edges?.filter(edge => 
                    edge.from === contextMenu.data.id || edge.to === contextMenu.data.id
                  ) || [];
                  const pathIds = connectedEdges.map(edge => `${edge.from}-${edge.to}`);
                  setHighlightedPaths(new Set(pathIds));
                  setSelectedNode(contextMenu.data.id);
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                🔗 Show Connections
              </button>
              <button
                onClick={() => {
                  // Export node data
                  const nodeData = JSON.stringify(contextMenu.data, null, 2);
                  navigator.clipboard?.writeText(nodeData);
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                📋 Copy Node Data
              </button>
              <button
                onClick={() => {
                  // Focus on this node
                  setSelectedNode(contextMenu.data.id);
                  setHighlightedPaths(new Set());
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                🎯 Focus Node
              </button>
            </>
          ) : (
            <>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', fontSize: '13px', color: '#475569' }}>
                {contextMenu.data?.label || 'Connection'}
              </div>
              <button
                onClick={() => {
                  // Highlight this path
                  const pathId = `${contextMenu.data.from}-${contextMenu.data.to}`;
                  setHighlightedPaths(new Set([pathId]));
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                ✨ Highlight Path
              </button>
              <button
                onClick={() => {
                  // Export edge data
                  const edgeData = JSON.stringify(contextMenu.data, null, 2);
                  navigator.clipboard?.writeText(edgeData);
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                📋 Copy Edge Data
              </button>
              <button
                onClick={() => {
                  // Show connected nodes
                  const fromNode = spec.nodes.find(n => n.id === contextMenu.data.from);
                  if (fromNode) setSelectedNode(fromNode.id);
                  setContextMenu(prev => ({ ...prev, visible: false }));
                }}
                style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                🔍 Show Source Node
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Srndpty.displayName = 'Srndpty';

// Legacy exports for backwards compatibility
export const ReadableMermaid = Srndpty;

// Export additional utilities
export { specToMermaid as makeDiagram } from './compiler.js';
export { validateSpec } from './compiler.js';
export { exportSVG, exportPNG, exportAndDownloadSVG, exportAndDownloadPNG } from './export.js';
