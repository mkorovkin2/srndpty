# AI Agent Guide: React Component Implementation

## Core React Component

The main React component is `Srndpty` (exported from `srndpty`):

```tsx
import { Srndpty } from 'srndpty';
import type { ReadableSpec, SrndptyOptions } from 'srndpty';
```

## Component Interface

### Props
```typescript
interface SrndptyProps {
  spec: ReadableSpec;              // Diagram specification (required)
  options?: SrndptyOptions;        // Configuration options (optional)
}
```

### Options Interface
```typescript
interface SrndptyOptions {
  width?: number;                  // Container width in pixels
  height?: number;                 // Container height in pixels
  fitToContainer?: boolean;        // Auto-fit diagram to container (default: true)
  enablePanZoom?: boolean;         // Enable pan/zoom interactions (default: true)
  enableExport?: boolean;          // Enable export functionality (default: false)
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
  onEdgeClick?: (edge: ReadableEdge) => void;
  className?: string;              // CSS class for container
  style?: React.CSSProperties;     // Inline styles for container
}
```

### Ref Interface (Methods)
```typescript
interface SrndptyMethods {
  fit: () => void;                          // Fit diagram to container
  reset: () => void;                        // Reset zoom and pan
  zoomIn: () => void;                       // Zoom in programmatically
  zoomOut: () => void;                      // Zoom out programmatically
  exportSVG: (filename?: string) => Promise<void>;
  exportPNG: (filename?: string) => Promise<void>;
  getState: () => PanZoomState;             // Get current pan/zoom state
}
```

## Basic Usage Examples

### Simple Diagram
```tsx
import React from 'react';
import { Srndpty } from 'srndpty';

function BasicDiagram() {
  const spec = {
    type: 'flow' as const,
    direction: 'LR' as const,
    nodes: [
      { id: 'start', label: 'Start', shape: 'stadium' as const },
      { id: 'process', label: 'Process Data' },
      { id: 'end', label: 'End', shape: 'stadium' as const }
    ],
    edges: [
      { from: 'start', to: 'process', label: 'begin' },
      { from: 'process', to: 'end', label: 'finish' }
    ]
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Srndpty spec={spec} />
    </div>
  );
}
```

### With Click Handlers
```tsx
import React, { useCallback } from 'react';
import { Srndpty } from 'srndpty';

function InteractiveDiagram() {
  const spec = {
    type: 'flow' as const,
    nodes: [
      { 
        id: 'api', 
        label: 'API Server',
        meta: {
          port: 3000,
          status: 'healthy',
          description: 'Main API server'
        }
      },
      { 
        id: 'db', 
        label: 'Database', 
        shape: 'cylinder' as const,
        meta: {
          type: 'postgresql',
          connections: 45
        }
      }
    ],
    edges: [
      { 
        from: 'api', 
        to: 'db', 
        label: 'queries',
        meta: {
          avgLatency: '15ms',
          qps: 1200
        }
      }
    ]
  };

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    console.log(`Clicked node: ${nodeId}`);
    console.log('Node metadata:', node.meta);
    
    // Example: Show node details in a modal/sidebar
    if (node.meta) {
      alert(`${node.label}\nStatus: ${node.meta.status || 'unknown'}`);
    }
  }, []);

  const handleEdgeClick = useCallback((edge: ReadableEdge) => {
    console.log(`Clicked edge: ${edge.from} -> ${edge.to}`);
    if (edge.meta) {
      alert(`Connection: ${edge.label}\nLatency: ${edge.meta.avgLatency}`);
    }
  }, []);

  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick,
        onEdgeClick: handleEdgeClick,
        enablePanZoom: true,
        width: 800,
        height: 600
      }}
    />
  );
}
```

### With Ref for Programmatic Control
```tsx
import React, { useRef, useCallback } from 'react';
import { Srndpty, SrndptyMethods } from 'srndpty';

function ControllableDiagram() {
  const diagramRef = useRef<SrndptyMethods>(null);

  const handleFit = useCallback(() => {
    diagramRef.current?.fit();
  }, []);

  const handleReset = useCallback(() => {
    diagramRef.current?.reset();
  }, []);

  const handleZoomIn = useCallback(() => {
    diagramRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    diagramRef.current?.zoomOut();
  }, []);

  const handleExportSVG = useCallback(async () => {
    try {
      await diagramRef.current?.exportSVG('my-diagram.svg');
      console.log('SVG exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  const handleExportPNG = useCallback(async () => {
    try {
      await diagramRef.current?.exportPNG('my-diagram.png');
      console.log('PNG exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  const spec = {
    type: 'flow' as const,
    direction: 'TB' as const,
    nodes: [
      { id: 'user', label: 'User', shape: 'circle' as const },
      { id: 'app', label: 'Application' },
      { id: 'db', label: 'Database', shape: 'cylinder' as const }
    ],
    edges: [
      { from: 'user', to: 'app' },
      { from: 'app', to: 'db' }
    ]
  };

  return (
    <div>
      {/* Control Panel */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={handleFit}>Fit to Container</button>
        <button onClick={handleReset}>Reset View</button>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleExportSVG}>Export SVG</button>
        <button onClick={handleExportPNG}>Export PNG</button>
      </div>

      {/* Diagram */}
      <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
        <Srndpty 
          ref={diagramRef}
          spec={spec}
          options={{
            enablePanZoom: true,
            fitToContainer: true
          }}
        />
      </div>
    </div>
  );
}
```

## Advanced Usage Patterns

### Dynamic Spec Updates
```tsx
import React, { useState, useMemo } from 'react';
import { Srndpty } from 'srndpty';

function DynamicDiagram() {
  const [nodeCount, setNodeCount] = useState(3);
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');

  const spec = useMemo(() => ({
    type: 'flow' as const,
    direction,
    nodes: Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      label: `Node ${i + 1}`,
      shape: i === 0 ? 'stadium' as const : 
             i === nodeCount - 1 ? 'stadium' as const : 
             'rect' as const
    })),
    edges: Array.from({ length: nodeCount - 1 }, (_, i) => ({
      from: `node-${i}`,
      to: `node-${i + 1}`,
      label: `step ${i + 1}`
    }))
  }), [nodeCount, direction]);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Node Count: 
          <input 
            type="number" 
            value={nodeCount} 
            onChange={(e) => setNodeCount(parseInt(e.target.value) || 3)}
            min={2}
            max={10}
          />
        </label>
        <label style={{ marginLeft: '16px' }}>
          Direction: 
          <select 
            value={direction} 
            onChange={(e) => setDirection(e.target.value as 'LR' | 'TB')}
          >
            <option value="LR">Left to Right</option>
            <option value="TB">Top to Bottom</option>
          </select>
        </label>
      </div>

      <div style={{ width: '100%', height: '400px' }}>
        <Srndpty spec={spec} />
      </div>
    </div>
  );
}
```

### With Custom Styling
```tsx
import React from 'react';
import { Srndpty } from 'srndpty';
import './DiagramStyles.css'; // Custom CSS file

function StyledDiagram() {
  const spec = {
    type: 'flow' as const,
    theme: 'dark' as const,
    nodes: [
      { id: 'input', label: 'Input', className: 'input-node' },
      { id: 'process', label: 'Process', className: 'process-node' },
      { id: 'output', label: 'Output', className: 'output-node' }
    ],
    edges: [
      { from: 'input', to: 'process', className: 'primary-edge' },
      { from: 'process', to: 'output', className: 'primary-edge' }
    ]
  };

  return (
    <div className="diagram-container">
      <Srndpty 
        spec={spec}
        options={{
          className: 'custom-diagram',
          style: {
            backgroundColor: '#1a1a1a',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '16px'
          }
        }}
      />
    </div>
  );
}
```

### Error Handling
```tsx
import React, { useState, useCallback } from 'react';
import { Srndpty } from 'srndpty';
import { validateSpec } from 'srndpty';

function SafeDiagram({ spec }: { spec: ReadableSpec }) {
  const [error, setError] = useState<string | null>(null);

  const validatedSpec = useMemo(() => {
    const errors = validateSpec(spec);
    if (errors.length > 0) {
      setError(`Validation errors: ${errors.join(', ')}`);
      return null;
    }
    setError(null);
    return spec;
  }, [spec]);

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fee', 
        border: '1px solid #fcc',
        borderRadius: '8px',
        color: '#c33'
      }}>
        <h4>Diagram Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!validatedSpec) {
    return <div>Loading...</div>;
  }

  return <Srndpty spec={validatedSpec} />;
}
```

## Integration with State Management

### With Redux
```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Srndpty } from 'srndpty';
import { selectDiagramSpec, updateNodeStatus } from './diagramSlice';

function ReduxDiagram() {
  const spec = useSelector(selectDiagramSpec);
  const dispatch = useDispatch();

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    dispatch(updateNodeStatus({ nodeId, status: 'selected' }));
  }, [dispatch]);

  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick,
        enablePanZoom: true
      }}
    />
  );
}
```

### With Context API
```tsx
import React, { createContext, useContext, useCallback } from 'react';
import { Srndpty } from 'srndpty';

const DiagramContext = createContext({
  onNodeSelect: (nodeId: string) => {},
  selectedNode: null as string | null
});

function DiagramWithContext() {
  const { onNodeSelect } = useContext(DiagramContext);

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    onNodeSelect(nodeId);
  }, [onNodeSelect]);

  const spec = {
    type: 'flow' as const,
    nodes: [
      { id: 'a', label: 'Node A' },
      { id: 'b', label: 'Node B' }
    ],
    edges: [
      { from: 'a', to: 'b' }
    ]
  };

  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick
      }}
    />
  );
}
```

## Performance Considerations

### Memoization
```tsx
import React, { memo, useMemo } from 'react';
import { Srndpty } from 'srndpty';

const OptimizedDiagram = memo(function OptimizedDiagram({ 
  nodes, 
  edges, 
  onNodeClick 
}: {
  nodes: ReadableNode[];
  edges: ReadableEdge[];
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
}) {
  const spec = useMemo(() => ({
    type: 'flow' as const,
    nodes,
    edges
  }), [nodes, edges]);

  const options = useMemo(() => ({
    onNodeClick,
    enablePanZoom: true
  }), [onNodeClick]);

  return <Srndpty spec={spec} options={options} />;
});
```

### Large Diagrams
For diagrams with many nodes (100+), consider:
1. **Virtualization**: Only render visible portions
2. **Lazy Loading**: Load diagram data on demand
3. **Simplified Interactions**: Disable pan/zoom for performance
4. **Chunked Updates**: Update spec incrementally

## Common Patterns

### 1. **Modal Integration**
```tsx
const [selectedNode, setSelectedNode] = useState<ReadableNode | null>(null);

const handleNodeClick = (nodeId: string, node: ReadableNode) => {
  setSelectedNode(node);
};

return (
  <>
    <Srndpty spec={spec} options={{ onNodeClick: handleNodeClick }} />
    {selectedNode && (
      <NodeDetailsModal 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    )}
  </>
);
```

### 2. **Sidebar Details**
```tsx
const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
const selectedNode = spec.nodes.find(n => n.id === selectedNodeId);

return (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: 1 }}>
      <Srndpty 
        spec={spec} 
        options={{ onNodeClick: (id) => setSelectedNodeId(id) }} 
      />
    </div>
    <div style={{ width: '300px', padding: '16px' }}>
      {selectedNode ? (
        <NodeDetails node={selectedNode} />
      ) : (
        <p>Click a node to see details</p>
      )}
    </div>
  </div>
);
```

### 3. **Toolbar Integration**
```tsx
const diagramRef = useRef<SrndptyMethods>(null);

return (
  <div>
    <DiagramToolbar 
      onFit={() => diagramRef.current?.fit()}
      onReset={() => diagramRef.current?.reset()}
      onExport={() => diagramRef.current?.exportPNG()}
    />
    <Srndpty ref={diagramRef} spec={spec} />
  </div>
);
```
