# AI Agent Guide: Integration Patterns and Best Practices

## Universal Framework Usage

### Environment Auto-Detection
```javascript
import ReadableMermaid from 'srndpty';

// Framework automatically detects React vs vanilla environment
const diagram = await ReadableMermaid.render(spec, {
  container: '#diagram-container',
  enablePanZoom: true
});

// Check environment capabilities
const info = ReadableMermaid.getEnvironmentInfo();
console.log(info);
// {
//   hasReact: true,
//   hasMermaid: true, 
//   isNode: false,
//   isBrowser: true
// }
```

### Forced Environment Selection
```javascript
import { SrndptyFramework } from 'srndpty';

// Force vanilla mode even in React environments
const diagram = SrndptyFramework.createVanilla(spec, {
  container: '#diagram'
});

// Force React component (throws if React not available)
const ReactComponent = SrndptyFramework.getReactComponent();
```

## React Integration Patterns

### Next.js Integration
```tsx
// pages/diagram.tsx or app/diagram/page.tsx
import dynamic from 'next/dynamic';
import { ReadableSpec } from 'srndpty';

// Dynamic import to avoid SSR issues
const Srndpty = dynamic(
  () => import('srndpty').then(mod => ({ default: mod.Srndpty })),
  { ssr: false }
);

export default function DiagramPage() {
  const spec: ReadableSpec = {
    type: 'flow',
    nodes: [
      { id: 'a', label: 'Node A' },
      { id: 'b', label: 'Node B' }
    ],
    edges: [{ from: 'a', to: 'b' }]
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Srndpty spec={spec} />
    </div>
  );
}
```

### Create React App Integration
```tsx
// src/components/DiagramViewer.tsx
import React, { useMemo } from 'react';
import { Srndpty } from 'srndpty';
import type { ReadableSpec } from 'srndpty';

interface DiagramViewerProps {
  data: any; // Your application data
}

export function DiagramViewer({ data }: DiagramViewerProps) {
  const spec = useMemo<ReadableSpec>(() => {
    // Transform your data into diagram spec
    return {
      type: 'flow',
      nodes: data.entities.map(entity => ({
        id: entity.id,
        label: entity.name,
        shape: entity.type === 'service' ? 'hexagon' : 'rect',
        meta: entity.metadata
      })),
      edges: data.relationships.map(rel => ({
        from: rel.source,
        to: rel.target,
        label: rel.type,
        meta: rel.properties
      }))
    };
  }, [data]);

  return (
    <div className="diagram-container">
      <Srndpty 
        spec={spec}
        options={{
          enablePanZoom: true,
          onNodeClick: (nodeId, node) => {
            console.log('Selected entity:', nodeId, node.meta);
          }
        }}
      />
    </div>
  );
}
```

### Vite + React Integration
```tsx
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['srndpty']
  }
});

// src/App.tsx
import { Srndpty } from 'srndpty';

function App() {
  return (
    <div className="App">
      <Srndpty spec={spec} />
    </div>
  );
}
```

### React + TypeScript Best Practices
```tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { Srndpty, SrndptyMethods } from 'srndpty';
import type { ReadableSpec, ReadableNode, ReadableEdge } from 'srndpty';

interface DiagramComponentProps {
  spec: ReadableSpec;
  onNodeSelect?: (node: ReadableNode) => void;
  onEdgeSelect?: (edge: ReadableEdge) => void;
  className?: string;
}

export const DiagramComponent: React.FC<DiagramComponentProps> = ({
  spec,
  onNodeSelect,
  onEdgeSelect,
  className
}) => {
  const diagramRef = useRef<SrndptyMethods>(null);

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  const handleEdgeClick = useCallback((edge: ReadableEdge) => {
    onEdgeSelect?.(edge);
  }, [onEdgeSelect]);

  const options = useMemo(() => ({
    onNodeClick: handleNodeClick,
    onEdgeClick: handleEdgeClick,
    enablePanZoom: true,
    fitToContainer: true
  }), [handleNodeClick, handleEdgeClick]);

  const exportDiagram = useCallback(async (format: 'svg' | 'png') => {
    if (!diagramRef.current) return;
    
    try {
      if (format === 'svg') {
        await diagramRef.current.exportSVG();
      } else {
        await diagramRef.current.exportPNG();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  return (
    <div className={className}>
      <Srndpty 
        ref={diagramRef}
        spec={spec}
        options={options}
      />
    </div>
  );
};
```

## Vanilla JavaScript Patterns

### HTML + Script Tag
```html
<!DOCTYPE html>
<html>
<head>
  <title>Diagram Integration</title>
</head>
<body>
  <div id="diagram" style="width: 100%; height: 500px;"></div>
  
  <script type="module">
    import ReadableMermaid from 'https://unpkg.com/srndpty@latest/dist/index.js';
    
    const spec = {
      type: 'flow',
      nodes: [
        { id: 'start', label: 'Start', shape: 'stadium' },
        { id: 'end', label: 'End', shape: 'stadium' }
      ],
      edges: [{ from: 'start', to: 'end' }]
    };
    
    ReadableMermaid.render(spec, {
      container: '#diagram',
      enablePanZoom: true
    });
  </script>
</body>
</html>
```

### Webpack Integration
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  resolve: {
    fallback: {
      "fs": false,
      "path": false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};

// src/index.js
import { renderDiagram } from 'srndpty';

async function initDiagram() {
  const spec = {
    type: 'flow',
    nodes: [
      { id: 'webpack', label: 'Webpack' },
      { id: 'bundle', label: 'Bundle' }
    ],
    edges: [{ from: 'webpack', to: 'bundle' }]
  };

  await renderDiagram(spec, {
    container: '#app',
    enablePanZoom: true
  });
}

initDiagram();
```

### Express.js Server Integration
```javascript
// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static('public'));

// API endpoint to generate diagram data
app.get('/api/diagram/:id', (req, res) => {
  const diagramId = req.params.id;
  
  // Fetch data from database/service
  const data = getDiagramData(diagramId);
  
  // Transform to ReadableSpec format
  const spec = {
    type: 'flow',
    nodes: data.nodes.map(node => ({
      id: node.id,
      label: node.name,
      shape: node.type,
      meta: node.properties
    })),
    edges: data.edges.map(edge => ({
      from: edge.source,
      to: edge.target,
      label: edge.relationship,
      meta: edge.properties
    }))
  };
  
  res.json(spec);
});

// Serve diagram page
app.get('/diagram/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'diagram.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

```html
<!-- public/diagram.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Dynamic Diagram</title>
</head>
<body>
  <div id="diagram" style="width: 100%; height: 600px;"></div>
  
  <script type="module">
    import { renderDiagram } from 'https://unpkg.com/srndpty@latest/dist/index.js';
    
    async function loadDiagram() {
      const pathParts = window.location.pathname.split('/');
      const diagramId = pathParts[pathParts.length - 1];
      
      try {
        const response = await fetch(`/api/diagram/${diagramId}`);
        const spec = await response.json();
        
        await renderDiagram(spec, {
          container: '#diagram',
          enablePanZoom: true,
          onNodeClick: (nodeId, node) => {
            console.log('Node clicked:', nodeId, node.meta);
          }
        });
      } catch (error) {
        console.error('Failed to load diagram:', error);
        document.getElementById('diagram').innerHTML = 
          '<p>Failed to load diagram</p>';
      }
    }
    
    loadDiagram();
  </script>
</body>
</html>
```

## State Management Integration

### Redux Integration
```typescript
// store/diagramSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ReadableSpec, ReadableNode } from 'srndpty';

interface DiagramState {
  spec: ReadableSpec | null;
  selectedNodeId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DiagramState = {
  spec: null,
  selectedNodeId: null,
  isLoading: false,
  error: null
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    setSpec: (state, action: PayloadAction<ReadableSpec>) => {
      state.spec = action.payload;
    },
    selectNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setSpec, selectNode, setLoading, setError } = diagramSlice.actions;
export default diagramSlice.reducer;

// components/DiagramContainer.tsx
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Srndpty } from 'srndpty';
import { selectNode } from '../store/diagramSlice';
import type { RootState } from '../store';

export function DiagramContainer() {
  const dispatch = useDispatch();
  const { spec, selectedNodeId, isLoading, error } = useSelector(
    (state: RootState) => state.diagram
  );

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    dispatch(selectNode(nodeId));
  }, [dispatch]);

  if (isLoading) return <div>Loading diagram...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!spec) return <div>No diagram data</div>;

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

### Zustand Integration
```typescript
// store/diagramStore.ts
import { create } from 'zustand';
import type { ReadableSpec, ReadableNode } from 'srndpty';

interface DiagramStore {
  spec: ReadableSpec | null;
  selectedNode: ReadableNode | null;
  setSpec: (spec: ReadableSpec) => void;
  selectNode: (node: ReadableNode | null) => void;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  spec: null,
  selectedNode: null,
  setSpec: (spec) => set({ spec }),
  selectNode: (selectedNode) => set({ selectedNode })
}));

// components/DiagramWithStore.tsx
import React, { useCallback } from 'react';
import { Srndpty } from 'srndpty';
import { useDiagramStore } from '../store/diagramStore';

export function DiagramWithStore() {
  const { spec, selectNode } = useDiagramStore();

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    selectNode(node);
  }, [selectNode]);

  if (!spec) return <div>No diagram loaded</div>;

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

### Context API Integration
```tsx
// contexts/DiagramContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ReadableSpec, ReadableNode, ReadableEdge } from 'srndpty';

interface DiagramContextValue {
  spec: ReadableSpec | null;
  selectedNode: ReadableNode | null;
  selectedEdge: ReadableEdge | null;
  setSpec: (spec: ReadableSpec) => void;
  selectNode: (node: ReadableNode | null) => void;
  selectEdge: (edge: ReadableEdge | null) => void;
}

const DiagramContext = createContext<DiagramContextValue | undefined>(undefined);

export function DiagramProvider({ children }: { children: ReactNode }) {
  const [spec, setSpec] = useState<ReadableSpec | null>(null);
  const [selectedNode, setSelectedNode] = useState<ReadableNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<ReadableEdge | null>(null);

  const selectNode = (node: ReadableNode | null) => {
    setSelectedNode(node);
    setSelectedEdge(null); // Clear edge selection
  };

  const selectEdge = (edge: ReadableEdge | null) => {
    setSelectedEdge(edge);
    setSelectedNode(null); // Clear node selection
  };

  return (
    <DiagramContext.Provider value={{
      spec,
      selectedNode,
      selectedEdge,
      setSpec,
      selectNode,
      selectEdge
    }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagram must be used within DiagramProvider');
  }
  return context;
}

// components/DiagramWithContext.tsx
import React, { useCallback } from 'react';
import { Srndpty } from 'srndpty';
import { useDiagram } from '../contexts/DiagramContext';

export function DiagramWithContext() {
  const { spec, selectNode, selectEdge } = useDiagram();

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    selectNode(node);
  }, [selectNode]);

  const handleEdgeClick = useCallback((edge: ReadableEdge) => {
    selectEdge(edge);
  }, [selectEdge]);

  if (!spec) return <div>No diagram loaded</div>;

  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick,
        onEdgeClick: handleEdgeClick,
        enablePanZoom: true
      }}
    />
  );
}
```

## API Integration Patterns

### REST API Integration
```typescript
// services/diagramService.ts
import type { ReadableSpec } from 'srndpty';

export class DiagramService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getDiagram(id: string): Promise<ReadableSpec> {
    const response = await fetch(`${this.baseUrl}/diagrams/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch diagram: ${response.statusText}`);
    }
    return response.json();
  }

  async saveDiagram(id: string, spec: ReadableSpec): Promise<void> {
    const response = await fetch(`${this.baseUrl}/diagrams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec)
    });
    if (!response.ok) {
      throw new Error(`Failed to save diagram: ${response.statusText}`);
    }
  }

  async createDiagram(spec: ReadableSpec): Promise<string> {
    const response = await fetch(`${this.baseUrl}/diagrams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec)
    });
    if (!response.ok) {
      throw new Error(`Failed to create diagram: ${response.statusText}`);
    }
    const { id } = await response.json();
    return id;
  }
}

// hooks/useDiagramApi.ts
import { useState, useEffect } from 'react';
import { DiagramService } from '../services/diagramService';
import type { ReadableSpec } from 'srndpty';

export function useDiagramApi(diagramId: string) {
  const [spec, setSpec] = useState<ReadableSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const diagramService = new DiagramService('/api');

  useEffect(() => {
    async function loadDiagram() {
      try {
        setLoading(true);
        const diagramSpec = await diagramService.getDiagram(diagramId);
        setSpec(diagramSpec);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (diagramId) {
      loadDiagram();
    }
  }, [diagramId]);

  const saveDiagram = async (updatedSpec: ReadableSpec) => {
    try {
      await diagramService.saveDiagram(diagramId, updatedSpec);
      setSpec(updatedSpec);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return { spec, loading, error, saveDiagram };
}
```

### GraphQL Integration
```typescript
// graphql/diagramQueries.ts
import { gql } from '@apollo/client';

export const GET_DIAGRAM = gql`
  query GetDiagram($id: ID!) {
    diagram(id: $id) {
      id
      name
      spec
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_DIAGRAM = gql`
  mutation UpdateDiagram($id: ID!, $spec: JSON!) {
    updateDiagram(id: $id, spec: $spec) {
      id
      spec
      updatedAt
    }
  }
`;

// components/GraphQLDiagram.tsx
import React, { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Srndpty } from 'srndpty';
import { GET_DIAGRAM, UPDATE_DIAGRAM } from '../graphql/diagramQueries';
import type { ReadableSpec, ReadableNode } from 'srndpty';

interface Props {
  diagramId: string;
}

export function GraphQLDiagram({ diagramId }: Props) {
  const { data, loading, error } = useQuery(GET_DIAGRAM, {
    variables: { id: diagramId }
  });

  const [updateDiagram] = useMutation(UPDATE_DIAGRAM);

  const handleNodeClick = useCallback(async (nodeId: string, node: ReadableNode) => {
    // Update node metadata
    const updatedSpec: ReadableSpec = {
      ...data.diagram.spec,
      nodes: data.diagram.spec.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, meta: { ...n.meta, lastClicked: new Date().toISOString() } }
          : n
      )
    };

    try {
      await updateDiagram({
        variables: { id: diagramId, spec: updatedSpec }
      });
    } catch (err) {
      console.error('Failed to update diagram:', err);
    }
  }, [data, diagramId, updateDiagram]);

  if (loading) return <div>Loading diagram...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.diagram) return <div>Diagram not found</div>;

  return (
    <Srndpty 
      spec={data.diagram.spec}
      options={{
        onNodeClick: handleNodeClick,
        enablePanZoom: true
      }}
    />
  );
}
```

## Real-time Updates

### WebSocket Integration
```typescript
// hooks/useRealtimeDiagram.ts
import { useState, useEffect, useRef } from 'react';
import type { ReadableSpec } from 'srndpty';

export function useRealtimeDiagram(diagramId: string) {
  const [spec, setSpec] = useState<ReadableSpec | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/diagrams/${diagramId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to diagram updates');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'DIAGRAM_UPDATE':
          setSpec(message.spec);
          break;
        case 'NODE_UPDATE':
          setSpec(prevSpec => {
            if (!prevSpec) return prevSpec;
            return {
              ...prevSpec,
              nodes: prevSpec.nodes.map(node =>
                node.id === message.nodeId
                  ? { ...node, ...message.updates }
                  : node
              )
            };
          });
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from diagram updates');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [diagramId]);

  const sendUpdate = (update: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(update));
    }
  };

  return { spec, connected, sendUpdate };
}

// components/RealtimeDiagram.tsx
import React, { useCallback } from 'react';
import { Srndpty } from 'srndpty';
import { useRealtimeDiagram } from '../hooks/useRealtimeDiagram';
import type { ReadableNode } from 'srndpty';

export function RealtimeDiagram({ diagramId }: { diagramId: string }) {
  const { spec, connected, sendUpdate } = useRealtimeDiagram(diagramId);

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    // Send node interaction to other connected clients
    sendUpdate({
      type: 'NODE_INTERACTION',
      nodeId,
      timestamp: Date.now(),
      user: 'current-user'
    });
  }, [sendUpdate]);

  if (!spec) return <div>Loading real-time diagram...</div>;

  return (
    <div>
      <div style={{ padding: '8px', background: connected ? '#d4edda' : '#f8d7da' }}>
        Status: {connected ? 'Connected' : 'Disconnected'}
      </div>
      <Srndpty 
        spec={spec}
        options={{
          onNodeClick: handleNodeClick,
          enablePanZoom: true
        }}
      />
    </div>
  );
}
```

## Error Handling Patterns

### Comprehensive Error Boundary
```tsx
// components/DiagramErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DiagramErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Diagram error:', error, errorInfo);
    
    // Report to error tracking service
    // reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          backgroundColor: '#fef2f2',
          color: '#7f1d1d'
        }}>
          <h3>Diagram Error</h3>
          <p>Something went wrong while rendering the diagram.</p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<DiagramErrorBoundary>
  <Srndpty spec={spec} />
</DiagramErrorBoundary>
```

### Validation and Error Recovery
```typescript
// utils/diagramValidation.ts
import { validateSpec } from 'srndpty';
import type { ReadableSpec } from 'srndpty';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedSpec?: ReadableSpec;
}

export function validateAndFixSpec(spec: ReadableSpec): ValidationResult {
  const errors = validateSpec(spec);
  const warnings: string[] = [];
  let fixedSpec = { ...spec };

  // Auto-fix common issues
  if (errors.some(e => e.includes('missing nodes'))) {
    // Remove edges that reference non-existent nodes
    const nodeIds = new Set(spec.nodes.map(n => n.id));
    fixedSpec.edges = spec.edges.filter(edge => {
      const valid = nodeIds.has(edge.from) && nodeIds.has(edge.to);
      if (!valid) {
        warnings.push(`Removed edge ${edge.from} -> ${edge.to} (references missing nodes)`);
      }
      return valid;
    });
  }

  // Validate fixed spec
  const finalErrors = validateSpec(fixedSpec);

  return {
    isValid: finalErrors.length === 0,
    errors: finalErrors,
    warnings,
    fixedSpec: finalErrors.length === 0 ? fixedSpec : undefined
  };
}

// components/SafeDiagram.tsx
import React, { useMemo } from 'react';
import { Srndpty } from 'srndpty';
import { validateAndFixSpec } from '../utils/diagramValidation';
import type { ReadableSpec } from 'srndpty';

interface SafeDiagramProps {
  spec: ReadableSpec;
  onValidationError?: (errors: string[]) => void;
  onValidationWarning?: (warnings: string[]) => void;
}

export function SafeDiagram({ spec, onValidationError, onValidationWarning }: SafeDiagramProps) {
  const validation = useMemo(() => validateAndFixSpec(spec), [spec]);

  React.useEffect(() => {
    if (!validation.isValid) {
      onValidationError?.(validation.errors);
    }
    if (validation.warnings.length > 0) {
      onValidationWarning?.(validation.warnings);
    }
  }, [validation, onValidationError, onValidationWarning]);

  if (!validation.isValid || !validation.fixedSpec) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
        <h4>Invalid Diagram Specification</h4>
        <ul>
          {validation.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <Srndpty spec={validation.fixedSpec} />;
}
```
