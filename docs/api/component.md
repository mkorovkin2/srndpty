# ⚛️ React Component API

Complete reference for the ReadableMermaid React component and its options.

## 📦 ReadableMermaid Component

The main React component for rendering interactive Mermaid diagrams.

```tsx
import { ReadableMermaid } from '@readable/mermaid';

function MyDiagram() {
  return (
    <ReadableMermaid 
      spec={mySpec}
      options={{
        enablePanZoom: true,
        onNodeClick: handleNodeClick
      }}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `spec` | `ReadableSpec` | ✅ Yes | The diagram specification |
| `options` | `ReadableMermaidOptions` | ❌ No | Component configuration options |

---

## ⚙️ ReadableMermaidOptions

Configuration options for the ReadableMermaid component.

```typescript
interface ReadableMermaidOptions {
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
```

### Properties

#### Layout Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `number` | `undefined` | Fixed width in pixels. If not set, uses 100% |
| `height` | `number` | `400` | Fixed height in pixels |
| `fitToContainer` | `boolean` | `true` | Auto-fit diagram to container on load |

```tsx
// Fixed dimensions
<ReadableMermaid 
  spec={spec}
  options={{
    width: 800,
    height: 600,
    fitToContainer: false
  }}
/>

// Responsive with auto-fit
<ReadableMermaid 
  spec={spec}
  options={{
    fitToContainer: true
  }}
/>
```

#### Interactivity Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enablePanZoom` | `boolean` | `true` | Enable mouse wheel zoom and drag panning |
| `enableExport` | `boolean` | `false` | Show export controls (future feature) |

```tsx
// Interactive diagram
<ReadableMermaid 
  spec={spec}
  options={{
    enablePanZoom: true,
    enableExport: true
  }}
/>

// Static diagram
<ReadableMermaid 
  spec={spec}
  options={{
    enablePanZoom: false
  }}
/>
```

#### Event Handlers

| Property | Type | Description |
|----------|------|-------------|
| `onNodeClick` | `(nodeId: string, node: ReadableNode) => void` | Called when a node is clicked |
| `onEdgeClick` | `(edge: ReadableEdge) => void` | Called when an edge is clicked |

```tsx
const handleNodeClick = (nodeId: string, node: ReadableNode) => {
  console.log(`Clicked node: ${nodeId}`, node);
  // Show node details, navigate, etc.
};

const handleEdgeClick = (edge: ReadableEdge) => {
  console.log(`Clicked edge: ${edge.from} → ${edge.to}`, edge);
  // Show connection details, etc.
};

<ReadableMermaid 
  spec={spec}
  options={{
    onNodeClick: handleNodeClick,
    onEdgeClick: handleEdgeClick
  }}
/>
```

#### Styling Options

| Property | Type | Description |
|----------|------|-------------|
| `className` | `string` | CSS class applied to the container |
| `style` | `React.CSSProperties` | Inline styles for the container |

```tsx
// Custom styling
<ReadableMermaid 
  spec={spec}
  options={{
    className: 'my-diagram',
    style: {
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  }}
/>
```

---

## 🎯 Event Handler Details

### onNodeClick Handler

Called when a user clicks on a node in the diagram.

```typescript
type NodeClickHandler = (nodeId: string, node: ReadableNode) => void;
```

**Parameters:**
- `nodeId`: The unique ID of the clicked node
- `node`: The complete node object with all properties

**Example Use Cases:**
```tsx
const handleNodeClick = (nodeId: string, node: ReadableNode) => {
  // Show details panel
  setSelectedNode(node);
  
  // Navigate to detail page
  router.push(`/nodes/${nodeId}`);
  
  // Trigger action based on node type
  if (node.meta?.actionable) {
    executeNodeAction(nodeId);
  }
  
  // Analytics tracking
  analytics.track('node_clicked', { nodeId, nodeType: node.meta?.type });
};
```

### onEdgeClick Handler

Called when a user clicks on an edge in the diagram.

```typescript
type EdgeClickHandler = (edge: ReadableEdge) => void;
```

**Parameters:**
- `edge`: The complete edge object with all properties

**Example Use Cases:**
```tsx
const handleEdgeClick = (edge: ReadableEdge) => {
  // Show connection details
  setSelectedConnection({
    from: edge.from,
    to: edge.to,
    metadata: edge.meta
  });
  
  // Open integration documentation
  if (edge.meta?.documentationUrl) {
    window.open(edge.meta.documentationUrl, '_blank');
  }
  
  // Show data flow information
  showDataFlowDialog(edge);
};
```

---

## 🎨 Styling and Theming

### Container Styling

The ReadableMermaid component renders a container div that holds the SVG diagram. You can style this container using `className` and `style` props.

```tsx
// CSS class approach
<ReadableMermaid 
  spec={spec}
  options={{
    className: 'diagram-container'
  }}
/>

// CSS
.diagram-container {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.diagram-container:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### Node and Edge Styling

Use the `className` property in your ReadableSpec to apply custom styles to nodes and edges:

```typescript
const spec: ReadableSpec = {
  type: 'flow',
  nodes: [
    {
      id: 'important',
      label: 'Critical Process',
      className: 'critical-node'
    },
    {
      id: 'normal',
      label: 'Standard Process',
      className: 'standard-node'
    }
  ],
  edges: [
    {
      from: 'important',
      to: 'normal',
      className: 'critical-path'
    }
  ]
};
```

```css
/* Node styling */
.critical-node {
  fill: #fef2f2 !important;
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
  filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.3)) !important;
}

.standard-node {
  fill: #f0f9ff !important;
  stroke: #0ea5e9 !important;
  stroke-width: 2px !important;
}

/* Edge styling */
.critical-path {
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
  marker-end: url(#critical-arrowhead) !important;
}
```

### Responsive Design

Make your diagrams responsive across different screen sizes:

```tsx
const useResponsiveDiagram = () => {
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setContainerSize({ width: width - 40, height: 400 });
      } else if (width < 1024) {
        setContainerSize({ width: width - 80, height: 500 });
      } else {
        setContainerSize({ width: 800, height: 600 });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return containerSize;
};

function ResponsiveDiagram({ spec }: { spec: ReadableSpec }) {
  const { width, height } = useResponsiveDiagram();
  
  return (
    <ReadableMermaid 
      spec={spec}
      options={{
        width,
        height,
        fitToContainer: true
      }}
    />
  );
}
```

---

## 🔧 Advanced Usage Patterns

### Controlled Component Pattern

Manage diagram state externally for complex applications:

```tsx
interface DiagramState {
  selectedNodeId: string | null;
  highlightedPath: string[];
  showDetails: boolean;
}

function ControlledDiagram() {
  const [diagramState, setDiagramState] = useState<DiagramState>({
    selectedNodeId: null,
    highlightedPath: [],
    showDetails: false
  });
  
  // Generate spec with dynamic styling based on state
  const spec = useMemo((): ReadableSpec => {
    return {
      type: 'flow',
      nodes: baseNodes.map(node => ({
        ...node,
        className: `${node.className || ''} ${
          node.id === diagramState.selectedNodeId ? 'selected' : ''
        } ${
          diagramState.highlightedPath.includes(node.id) ? 'highlighted' : ''
        }`.trim()
      })),
      edges: baseEdges.map(edge => ({
        ...edge,
        className: `${edge.className || ''} ${
          diagramState.highlightedPath.includes(edge.from) && 
          diagramState.highlightedPath.includes(edge.to) ? 'highlighted' : ''
        }`.trim()
      }))
    };
  }, [diagramState]);
  
  const handleNodeClick = (nodeId: string, node: ReadableNode) => {
    setDiagramState(prev => ({
      ...prev,
      selectedNodeId: nodeId,
      showDetails: true,
      highlightedPath: findPathToNode(nodeId)
    }));
  };
  
  return (
    <div>
      <ReadableMermaid 
        spec={spec}
        options={{
          onNodeClick: handleNodeClick,
          fitToContainer: true
        }}
      />
      {diagramState.showDetails && (
        <NodeDetailsPanel 
          nodeId={diagramState.selectedNodeId}
          onClose={() => setDiagramState(prev => ({ ...prev, showDetails: false }))}
        />
      )}
    </div>
  );
}
```

### Integration with State Management

Use with Redux, Zustand, or other state management libraries:

```tsx
// With Redux
import { useSelector, useDispatch } from 'react-redux';

function ReduxDiagram() {
  const spec = useSelector(selectDiagramSpec);
  const dispatch = useDispatch();
  
  const handleNodeClick = (nodeId: string, node: ReadableNode) => {
    dispatch(nodeClicked({ nodeId, node }));
  };
  
  return (
    <ReadableMermaid 
      spec={spec}
      options={{ onNodeClick: handleNodeClick }}
    />
  );
}

// With Zustand
import { useStore } from './store';

function ZustandDiagram() {
  const { spec, selectNode } = useStore();
  
  return (
    <ReadableMermaid 
      spec={spec}
      options={{ onNodeClick: selectNode }}
    />
  );
}
```

### Performance Optimization

Optimize for large diagrams and frequent updates:

```tsx
import { memo, useMemo, useCallback } from 'react';

const OptimizedDiagram = memo<{ 
  spec: ReadableSpec; 
  onNodeClick: (nodeId: string, node: ReadableNode) => void;
}>(({ spec, onNodeClick }) => {
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => ({
    fitToContainer: true,
    enablePanZoom: true,
    onNodeClick,
    style: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px'
    }
  }), [onNodeClick]);
  
  return (
    <ReadableMermaid 
      spec={spec}
      options={options}
    />
  );
});

function ParentComponent() {
  // Memoize callback to prevent child re-renders
  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    // Handle click
  }, []);
  
  // Memoize spec to prevent unnecessary processing
  const spec = useMemo(() => generateSpec(data), [data]);
  
  return (
    <OptimizedDiagram 
      spec={spec} 
      onNodeClick={handleNodeClick}
    />
  );
}
```

---

## 🚨 Common Issues and Solutions

### Issue: Diagram Not Rendering

**Symptoms:** Empty container, no diagram visible

**Solutions:**
1. Check that `spec.nodes` is not empty
2. Verify all node IDs are unique
3. Ensure edges reference valid node IDs
4. Check browser console for validation errors

```tsx
// Debug rendering issues
const DebugDiagram = ({ spec }: { spec: ReadableSpec }) => {
  useEffect(() => {
    console.log('Spec:', spec);
    const errors = validateSpec(spec);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
    }
  }, [spec]);
  
  return <ReadableMermaid spec={spec} />;
};
```

### Issue: Click Handlers Not Working

**Symptoms:** onNodeClick/onEdgeClick not being called

**Solutions:**
1. Ensure Mermaid security level allows interactions
2. Check that node IDs don't contain special characters
3. Verify event handlers are properly bound

```tsx
// Ensure handlers are stable references
const stableHandleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
  console.log('Node clicked:', nodeId);
}, []);

<ReadableMermaid 
  spec={spec}
  options={{
    onNodeClick: stableHandleNodeClick  // Don't use inline functions
  }}
/>
```

### Issue: Performance Problems

**Symptoms:** Slow rendering, laggy interactions

**Solutions:**
1. Use React.memo for the component
2. Memoize spec and options objects
3. Limit diagram complexity (< 50 nodes recommended)
4. Use stable references for event handlers

```tsx
// Performance monitoring
const PerformanceDiagram = ({ spec }: { spec: ReadableSpec }) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Diagram render time: ${end - start}ms`);
    };
  });
  
  return <ReadableMermaid spec={spec} />;
};
```

This component API reference provides everything needed to effectively use the ReadableMermaid React component in your applications.
