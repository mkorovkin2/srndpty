'use client'

import { useState, useCallback, useRef } from 'react';
import { Srndpty, type ReadableSpec, type SrndptyMethods } from '@readable/mermaid';

// Example specs for the demo with richer metadata
const exampleSpecs: Record<string, ReadableSpec> = {
  basic: {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { 
        id: 'start', 
        label: 'Start', 
        shape: 'stadium',
        meta: { 
          type: 'entry-point',
          description: 'Application entry point',
          priority: 'high'
        }
      },
      { 
        id: 'process', 
        label: 'Process Data',
        meta: {
          type: 'processing',
          description: 'Validates and transforms input data',
          avgTime: '200ms'
        }
      },
      { 
        id: 'decision', 
        label: 'Valid?', 
        shape: 'diamond',
        meta: {
          type: 'decision',
          description: 'Checks if processed data meets requirements',
          successRate: '85%'
        }
      },
      { 
        id: 'save', 
        label: 'Save', 
        shape: 'cylinder',
        meta: {
          type: 'storage',
          description: 'Persists valid data to database',
          database: 'PostgreSQL'
        }
      },
      { 
        id: 'error', 
        label: 'Show Error',
        meta: {
          type: 'error-handling',
          description: 'Displays user-friendly error message',
          logLevel: 'warn'
        }
      }
    ],
    edges: [
      { 
        from: 'start', 
        to: 'process', 
        label: 'begin',
        meta: { trigger: 'user-action', frequency: 'high' }
      },
      { 
        from: 'process', 
        to: 'decision',
        meta: { dataFlow: 'processed-data', size: 'variable' }
      },
      { 
        from: 'decision', 
        to: 'save', 
        label: 'yes', 
        style: 'thick',
        meta: { condition: 'validation-passed', probability: '85%' }
      },
      { 
        from: 'decision', 
        to: 'error', 
        label: 'no', 
        style: 'dotted',
        meta: { condition: 'validation-failed', probability: '15%' }
      }
    ]
  },
  
  pipeline: {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { id: 'ingest', label: 'Ingest', shape: 'stadium' },
      { id: 'clean', label: 'Clean\n(validate, dedupe)' },
      { id: 'transform', label: 'Transform' },
      { id: 'store', label: 'Store', shape: 'cylinder' },
      { id: 'api', label: 'API Gateway', shape: 'hexagon' },
      { id: 'frontend', label: 'Frontend' }
    ],
    edges: [
      { from: 'ingest', to: 'clean', label: 'raw data', style: 'thick' },
      { from: 'clean', to: 'transform', label: 'validated' },
      { from: 'transform', to: 'store', label: 'processed' },
      { from: 'store', to: 'api', label: 'serves' },
      { from: 'api', to: 'frontend', label: 'JSON' }
    ],
    groups: [
      { 
        id: 'pipeline', 
        label: 'Data Pipeline', 
        nodes: ['ingest', 'clean', 'transform', 'store'],
        collapsible: true 
      }
    ],
    legend: [
      { swatch: 'primary', label: 'Core processing' },
      { swatch: 'accent', label: 'External interface' }
    ]
  },

  microservices: {
    type: 'flow',
    direction: 'TB',
    nodes: [
      { id: 'user', label: 'User', shape: 'circle' },
      { id: 'gateway', label: 'API Gateway', shape: 'hexagon' },
      { id: 'auth', label: 'Auth Service' },
      { id: 'user-svc', label: 'User Service' },
      { id: 'order-svc', label: 'Order Service' },
      { id: 'payment-svc', label: 'Payment Service' },
      { id: 'db-users', label: 'Users DB', shape: 'cylinder' },
      { id: 'db-orders', label: 'Orders DB', shape: 'cylinder' },
      { id: 'queue', label: 'Message Queue', shape: 'stadium' }
    ],
    edges: [
      { from: 'user', to: 'gateway' },
      { from: 'gateway', to: 'auth', label: 'authenticate' },
      { from: 'gateway', to: 'user-svc', label: 'user ops' },
      { from: 'gateway', to: 'order-svc', label: 'orders' },
      { from: 'user-svc', to: 'db-users' },
      { from: 'order-svc', to: 'db-orders' },
      { from: 'order-svc', to: 'payment-svc', label: 'process payment' },
      { from: 'payment-svc', to: 'queue', label: 'events', style: 'dotted' }
    ],
    groups: [
      { 
        id: 'services', 
        label: 'Microservices', 
        nodes: ['auth', 'user-svc', 'order-svc', 'payment-svc'] 
      },
      { 
        id: 'storage', 
        label: 'Data Layer', 
        nodes: ['db-users', 'db-orders', 'queue'] 
      }
    ]
  }
};

export default function HomePage() {
  const [currentSpec, setCurrentSpec] = useState<ReadableSpec>(exampleSpecs.basic);
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(exampleSpecs.basic, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('basic');
  const srndptyRef = useRef<SrndptyMethods>(null);
  
  const handleJsonChange = useCallback((value: string) => {
    setJsonInput(value);
    setError(null);
    
    try {
      const parsed = JSON.parse(value);
      setCurrentSpec(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }, []);

  const handleExampleChange = useCallback((exampleKey: string) => {
    setSelectedExample(exampleKey);
    const spec = exampleSpecs[exampleKey];
    setCurrentSpec(spec);
    setJsonInput(JSON.stringify(spec, null, 2));
    setError(null);
  }, []);

  const [interactionLog, setInteractionLog] = useState<string[]>([]);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{id: string, label: string, connections: number} | null>(null);

  const addToLog = useCallback((message: string) => {
    setInteractionLog(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 entries
  }, []);

  const handleNodeClick = useCallback((nodeId: string, node: any) => {
    console.log('Node clicked:', nodeId, node);
    const connections = currentSpec.edges?.filter((edge: any) => 
      edge.from === nodeId || edge.to === nodeId
    ).length || 0;
    
    setSelectedNodeInfo({ id: nodeId, label: node.label, connections });
    addToLog(`🎯 Selected node: ${node.label} (${connections} connections)`);
  }, [currentSpec.edges, addToLog]);

  const handleEdgeClick = useCallback((edge: any) => {
    console.log('Edge clicked:', edge);
    const fromNode = currentSpec.nodes.find((n: any) => n.id === edge.from);
    const toNode = currentSpec.nodes.find((n: any) => n.id === edge.to);
    addToLog(`🔗 Clicked edge: ${fromNode?.label || edge.from} → ${toNode?.label || edge.to}`);
  }, [currentSpec.nodes, addToLog]);

  const handleZoomIn = useCallback(() => {
    srndptyRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    srndptyRef.current?.zoomOut();
  }, []);

  const handleFit = useCallback(() => {
    srndptyRef.current?.fit();
  }, []);

  const handleReset = useCallback(() => {
    srndptyRef.current?.reset();
  }, []);

  const handleExportSVG = useCallback(async () => {
    srndptyRef.current?.exportSVG();
  }, []);

  const handleExportPNG = useCallback(async () => {
    srndptyRef.current?.exportPNG();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ Srndpty</h1>
        <p>Universal interactive diagram framework with JSON-first schemas. Beautiful diagrams that work everywhere.</p>
        <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
          <strong>🎯 Features:</strong> Auto-detects environment • Works without React • Vanilla JS API • Universal framework
        </div>
        {error && <div style={{color: 'red', marginTop: '1rem'}}>Error: {error}</div>}
      </header>

      <div className="toolbar">
        <div className="examples">
          <label htmlFor="example-select">Examples:</label>
          <select 
            id="example-select"
            value={selectedExample} 
            onChange={(e) => handleExampleChange(e.target.value)}
          >
            <option value="basic">Basic Flow</option>
            <option value="pipeline">Data Pipeline</option>
            <option value="microservices">Microservices</option>
          </select>
        </div>

        <div className="controls">
          <button onClick={handleZoomIn} title="Zoom in">
            🔍+ Zoom In
          </button>
          <button onClick={handleZoomOut} title="Zoom out">
            🔍- Zoom Out
          </button>
          <button onClick={handleFit} title="Fit diagram to container">
            📐 Fit
          </button>
          <button onClick={handleReset} title="Reset zoom and pan">
            🔄 Reset
          </button>
          <button onClick={handleExportSVG} title="Export as SVG">
            📄 Export SVG
          </button>
          <button onClick={handleExportPNG} title="Export as PNG">
            🖼️ Export PNG
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="editor-panel">
          <h3>JSON Schema</h3>
          <textarea
            value={jsonInput}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder="Enter your ReadableSpec JSON here..."
            spellCheck={false}
          />
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="preview-panel">
          <h3>Live Preview</h3>
          <div className="diagram-container">
            <Srndpty
              ref={srndptyRef}
              spec={currentSpec}
              options={{
                fitToContainer: true,
                enablePanZoom: true,
                onNodeClick: handleNodeClick,
                onEdgeClick: handleEdgeClick,
                style: {
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff'
                }
              }}
            />
            
            {/* Interaction info panel */}
            <div className="interaction-info">
              {selectedNodeInfo && (
                <div className="selected-node-info">
                  <h4>📍 Selected Node</h4>
                  <p><strong>{selectedNodeInfo.label}</strong></p>
                  <p>{selectedNodeInfo.connections} connection{selectedNodeInfo.connections !== 1 ? 's' : ''}</p>
                  <button 
                    onClick={() => setSelectedNodeInfo(null)}
                    className="clear-btn"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
              
              {interactionLog.length > 0 && (
                <div className="interaction-log">
                  <h4>🎮 Recent Interactions</h4>
                  <div className="log-entries">
                    {interactionLog.map((entry, index) => (
                      <div key={index} className="log-entry">
                        {entry}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setInteractionLog([])}
                    className="clear-btn"
                  >
                    Clear Log
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <div className="interaction-guide">
          <h3>🎮 Interaction Guide</h3>
          <div className="guide-grid">
            <div className="guide-item">
              <strong>🖱️ Hover:</strong> Rich tooltips with metadata, connections, and details
            </div>
            <div className="guide-item">
              <strong>🎯 Click Nodes:</strong> Select and highlight connected paths
            </div>
            <div className="guide-item">
              <strong>🔗 Click Edges:</strong> Highlight specific connections
            </div>
            <div className="guide-item">
              <strong>🖱️ Right-Click:</strong> Context menu with actions and data export
            </div>
            <div className="guide-item">
              <strong>🔍 Mouse Wheel:</strong> Zoom in/out on the diagram
            </div>
            <div className="guide-item">
              <strong>✋ Drag:</strong> Pan around large diagrams
            </div>
            <div className="guide-item">
              <strong>📍 Selection Panel:</strong> Shows details for selected nodes
            </div>
            <div className="guide-item">
              <strong>⌨️ ESC Key:</strong> Clear selection and hide tooltips
            </div>
            <div className="guide-item">
              <strong>⌨️ Ctrl/Cmd + F:</strong> Fit diagram to container
            </div>
            <div className="guide-item">
              <strong>⌨️ Ctrl/Cmd + R:</strong> Reset zoom and pan
            </div>
            <div className="guide-item">
              <strong>⌨️ Ctrl/Cmd + +/-:</strong> Zoom in/out
            </div>
          </div>
        </div>
        <p>
          Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js</a> 
          {' '}&amp; <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a>
        </p>
      </footer>
    </div>
  );
}
