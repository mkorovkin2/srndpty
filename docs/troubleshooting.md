# 🔧 Troubleshooting Guide

Common issues, solutions, and best practices for working with Readable Mermaid.

## 🚨 Common Issues

### 1. Diagram Not Rendering

**Symptoms:**
- Empty container where diagram should appear
- Console errors about invalid specifications
- Blank white space with border only

**Causes & Solutions:**

#### Empty or Invalid Spec
```typescript
// ❌ Problem: Empty nodes array
const badSpec = {
  type: 'flow',
  nodes: [],  // Empty!
  edges: []
};

// ✅ Solution: Ensure at least one node
const goodSpec = {
  type: 'flow',
  nodes: [
    { id: 'start', label: 'Start' }
  ],
  edges: []
};
```

#### Duplicate Node IDs
```typescript
// ❌ Problem: Duplicate IDs
const badSpec = {
  type: 'flow',
  nodes: [
    { id: 'node1', label: 'First' },
    { id: 'node1', label: 'Duplicate' }  // Same ID!
  ],
  edges: []
};

// ✅ Solution: Unique IDs
const goodSpec = {
  type: 'flow',
  nodes: [
    { id: 'node1', label: 'First' },
    { id: 'node2', label: 'Second' }
  ],
  edges: []
};
```

#### Invalid Edge References
```typescript
// ❌ Problem: Edge references non-existent node
const badSpec = {
  type: 'flow',
  nodes: [
    { id: 'a', label: 'Node A' }
  ],
  edges: [
    { from: 'a', to: 'nonexistent' }  // 'nonexistent' node doesn't exist!
  ]
};

// ✅ Solution: All edge references must be valid
const goodSpec = {
  type: 'flow',
  nodes: [
    { id: 'a', label: 'Node A' },
    { id: 'b', label: 'Node B' }
  ],
  edges: [
    { from: 'a', to: 'b' }
  ]
};
```

#### Debug Steps
1. **Validate your spec:**
   ```typescript
   import { validateSpec } from '@readable/mermaid';
   
   const errors = validateSpec(mySpec);
   if (errors.length > 0) {
     console.error('Validation errors:', errors);
   }
   ```

2. **Check browser console** for Mermaid parsing errors

3. **Test with minimal spec:**
   ```typescript
   const minimalSpec = {
     type: 'flow' as const,
     nodes: [{ id: 'test', label: 'Test Node' }],
     edges: []
   };
   ```

---

### 2. Click Handlers Not Working

**Symptoms:**
- `onNodeClick` or `onEdgeClick` callbacks not being called
- Nodes/edges don't appear clickable (no cursor change)

**Causes & Solutions:**

#### Mermaid Security Configuration
```typescript
// ✅ Ensure Mermaid allows interactions
import mermaid from 'mermaid';

mermaid.initialize({
  securityLevel: 'loose'  // Required for click handlers
});
```

#### Invalid Node IDs for DOM Selection
```typescript
// ❌ Problem: Node IDs with spaces or special characters
const badSpec = {
  nodes: [
    { id: 'my node', label: 'Bad ID' },  // Spaces cause issues
    { id: 'node@special', label: 'Special chars' }  // @ causes issues
  ]
};

// ✅ Solution: Use valid identifier characters
const goodSpec = {
  nodes: [
    { id: 'my_node', label: 'Good ID' },
    { id: 'node_special', label: 'No special chars' }
  ]
};
```

#### Unstable Event Handler References
```typescript
// ❌ Problem: New function on every render
function BadComponent() {
  return (
    <ReadableMermaid 
      spec={spec}
      options={{
        onNodeClick: (nodeId, node) => {  // New function each render!
          console.log('Clicked:', nodeId);
        }
      }}
    />
  );
}

// ✅ Solution: Use useCallback or stable reference
function GoodComponent() {
  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    console.log('Clicked:', nodeId);
  }, []);

  return (
    <ReadableMermaid 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick
      }}
    />
  );
}
```

#### Debug Steps
1. **Check node ID format:**
   ```typescript
   // Valid ID patterns
   const validIds = ['node1', 'my_node', 'node-123', 'nodeABC'];
   
   // Invalid ID patterns  
   const invalidIds = ['my node', 'node@special', 'node.with.dots'];
   ```

2. **Test click detection:**
   ```typescript
   const debugNodeClick = (nodeId: string, node: ReadableNode) => {
     console.log('Node clicked successfully:', nodeId, node);
     alert(`Clicked: ${nodeId}`);  // Visual confirmation
   };
   ```

3. **Inspect generated SVG** in browser dev tools to verify node elements exist

---

### 3. Performance Issues

**Symptoms:**
- Slow initial rendering (> 3 seconds)
- Laggy pan/zoom interactions
- Browser freezing with large diagrams

**Causes & Solutions:**

#### Too Many Nodes/Edges
```typescript
// ❌ Problem: Overwhelming complexity
const hugeSpec = {
  type: 'flow',
  nodes: Array.from({ length: 200 }, (_, i) => ({  // Too many nodes!
    id: `node${i}`,
    label: `Node ${i}`
  })),
  edges: [/* hundreds of edges */]
};

// ✅ Solution: Break into hierarchical views
const systemOverview = {
  type: 'flow',
  nodes: [
    { id: 'frontend', label: 'Frontend Layer\n(15 components)', meta: { drillDown: 'frontend-detail' } },
    { id: 'backend', label: 'Backend Services\n(25 services)', meta: { drillDown: 'backend-detail' } },
    { id: 'database', label: 'Data Layer\n(8 databases)', meta: { drillDown: 'database-detail' } }
  ],
  edges: [
    { from: 'frontend', to: 'backend' },
    { from: 'backend', to: 'database' }
  ]
};

// Separate detailed views
const frontendDetail = {
  // Detailed frontend components
};
```

#### Inefficient React Rendering
```typescript
// ❌ Problem: Unnecessary re-renders
function BadComponent() {
  const spec = generateSpec();  // New object every render!
  const options = {  // New object every render!
    onNodeClick: (nodeId: string) => console.log(nodeId)
  };

  return <ReadableMermaid spec={spec} options={options} />;
}

// ✅ Solution: Memoize expensive computations
function GoodComponent() {
  const spec = useMemo(() => generateSpec(), [dependencies]);
  
  const options = useMemo(() => ({
    onNodeClick: handleNodeClick
  }), [handleNodeClick]);

  return <ReadableMermaid spec={spec} options={options} />;
}
```

#### Complex CSS Styling
```typescript
// ❌ Problem: Complex CSS with animations
const heavyStyles = `
  .node {
    fill: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
    filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)) blur(1px);
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .node:hover {
    transform: scale(1.2) rotate(5deg);
    filter: drop-shadow(0 0 20px rgba(0,0,0,0.8)) blur(2px);
  }
`;

// ✅ Solution: Simple, efficient styles
const lightStyles = `
  .node-healthy { fill: #dcfce7; stroke: #16a34a; }
  .node-warning { fill: #fef3c7; stroke: #f59e0b; }
  .node-error { fill: #fef2f2; stroke: #ef4444; }
`;
```

#### Performance Monitoring
```typescript
const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const start = performance.now();
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 100) {  // Log slow operations
          console.warn(`Slow operation: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => {
      const end = performance.now();
      console.log(`Component lifecycle: ${end - start}ms`);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};
```

---

### 4. Styling Issues

**Symptoms:**
- Custom CSS not applying to nodes/edges
- Inconsistent appearance across browsers
- Styles being overridden

**Causes & Solutions:**

#### CSS Specificity Problems
```css
/* ❌ Problem: Not specific enough */
.my-node {
  fill: red;
}

/* ✅ Solution: Use !important or higher specificity */
.my-node {
  fill: red !important;
  stroke: darkred !important;
}

/* Or increase specificity */
.readable-mermaid .my-node {
  fill: red;
  stroke: darkred;
}
```

#### Mermaid Theme Conflicts
```typescript
// ❌ Problem: Theme overriding custom styles
const spec = {
  type: 'flow',
  theme: 'dark',  // This might override your custom colors
  nodes: [
    { id: 'node1', label: 'Node', className: 'custom-node' }
  ]
};

// ✅ Solution: Use neutral theme or override theme variables
const spec = {
  type: 'flow',
  theme: 'base',  // Less opinionated theme
  nodes: [
    { id: 'node1', label: 'Node', className: 'custom-node' }
  ]
};
```

#### SVG Styling Gotchas
```css
/* ❌ Problem: Using CSS properties that don't work on SVG */
.svg-node {
  background-color: red;  /* Doesn't work on SVG elements */
  border: 1px solid black;  /* Use stroke instead */
}

/* ✅ Solution: Use SVG-specific properties */
.svg-node {
  fill: red;  /* SVG background */
  stroke: black;  /* SVG border */
  stroke-width: 1px;
}
```

#### Debug Styling
```typescript
const debugStyles = () => {
  // Log all applied styles
  const nodes = document.querySelectorAll('.readable-mermaid svg .node');
  nodes.forEach((node, index) => {
    const styles = window.getComputedStyle(node);
    console.log(`Node ${index} styles:`, {
      fill: styles.fill,
      stroke: styles.stroke,
      strokeWidth: styles.strokeWidth
    });
  });
};

// Call after diagram renders
useEffect(() => {
  setTimeout(debugStyles, 1000);
}, []);
```

---

### 5. TypeScript Issues

**Symptoms:**
- Type errors when using the library
- Missing type definitions
- Incompatible prop types

**Causes & Solutions:**

#### Missing Type Imports
```typescript
// ❌ Problem: Not importing types
import { ReadableMermaid } from '@readable/mermaid';

const spec = {  // TypeScript can't infer proper types
  type: 'flow',
  nodes: [/* ... */]
};

// ✅ Solution: Import and use types
import { ReadableMermaid, type ReadableSpec } from '@readable/mermaid';

const spec: ReadableSpec = {
  type: 'flow',
  nodes: [/* ... */]
};
```

#### Strict Type Checking Issues
```typescript
// ❌ Problem: Type assertion needed for literals
const spec = {
  type: 'flow',  // TypeScript infers as string, not 'flow'
  direction: 'LR'  // TypeScript infers as string, not 'LR'
};

// ✅ Solution: Use const assertions or explicit typing
const spec = {
  type: 'flow' as const,
  direction: 'LR' as const
} satisfies ReadableSpec;

// Or explicit typing
const spec: ReadableSpec = {
  type: 'flow',
  direction: 'LR'
};
```

#### Event Handler Type Issues
```typescript
// ❌ Problem: Incorrect event handler types
const handleNodeClick = (nodeId: any, node: any) => {  // Loose typing
  console.log(nodeId, node);
};

// ✅ Solution: Use proper types
import { type ReadableNode } from '@readable/mermaid';

const handleNodeClick = (nodeId: string, node: ReadableNode) => {
  console.log(nodeId, node);
};
```

---

## 🎯 Best Practices

### 1. Spec Validation

Always validate your specs before rendering:

```typescript
import { validateSpec } from '@readable/mermaid';

const useValidatedSpec = (spec: ReadableSpec) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  useEffect(() => {
    const errors = validateSpec(spec);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      console.warn('Spec validation errors:', errors);
    }
  }, [spec]);
  
  return { validationErrors, isValid: validationErrors.length === 0 };
};
```

### 2. Error Boundaries

Wrap components in error boundaries to handle failures gracefully:

```typescript
class DiagramErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Diagram error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ef4444', 
          borderRadius: '8px',
          backgroundColor: '#fef2f2'
        }}>
          <h3>Diagram Error</h3>
          <p>Failed to render diagram: {this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
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
  <ReadableMermaid spec={spec} />
</DiagramErrorBoundary>
```

### 3. Loading States

Show loading indicators for better UX:

```typescript
const DiagramWithLoading: React.FC<{ spec: ReadableSpec }> = ({ spec }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [spec]);
  
  if (isLoading) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <div>Loading diagram...</div>
      </div>
    );
  }
  
  return <ReadableMermaid spec={spec} />;
};
```

### 4. Accessibility

Ensure your diagrams are accessible:

```typescript
const AccessibleDiagram: React.FC<{ 
  spec: ReadableSpec; 
  title: string;
  description?: string;
}> = ({ spec, title, description }) => {
  return (
    <div role="img" aria-label={title}>
      {description && (
        <div className="sr-only">{description}</div>
      )}
      <ReadableMermaid 
        spec={spec}
        options={{
          style: {
            // Ensure sufficient contrast
            border: '2px solid #374151',
          }
        }}
      />
      {/* Provide text alternative */}
      <details style={{ marginTop: '10px' }}>
        <summary>Diagram Description</summary>
        <div>
          <h4>Nodes:</h4>
          <ul>
            {spec.nodes.map(node => (
              <li key={node.id}>{node.label}</li>
            ))}
          </ul>
          <h4>Connections:</h4>
          <ul>
            {spec.edges.map((edge, index) => (
              <li key={index}>
                {spec.nodes.find(n => n.id === edge.from)?.label} → {' '}
                {spec.nodes.find(n => n.id === edge.to)?.label}
                {edge.label && ` (${edge.label})`}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
};
```

## 🆘 Getting Help

### Community Resources

1. **GitHub Issues**: Report bugs and request features
   - [https://github.com/username/readable-mermaid/issues](https://github.com/username/readable-mermaid/issues)

2. **GitHub Discussions**: Ask questions and share ideas
   - [https://github.com/username/readable-mermaid/discussions](https://github.com/username/readable-mermaid/discussions)

3. **Documentation**: Complete guides and examples
   - [Getting Started](./getting-started.md)
   - [API Reference](./api/schema.md)
   - [Use Cases](./use-cases/data-pipeline.md)

### Creating Good Bug Reports

When reporting issues, include:

1. **Minimal reproduction case:**
   ```typescript
   const problematicSpec: ReadableSpec = {
     // Minimal spec that reproduces the issue
   };
   ```

2. **Environment information:**
   - React version
   - TypeScript version (if applicable)
   - Browser and version
   - Operating system

3. **Expected vs actual behavior:**
   - What you expected to happen
   - What actually happened
   - Screenshots if visual issues

4. **Console errors:**
   - Full error messages from browser console
   - Stack traces if available

### Performance Debugging

Use these tools to diagnose performance issues:

```typescript
// React DevTools Profiler
import { Profiler } from 'react';

const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
};

<Profiler id="ReadableMermaid" onRender={onRenderCallback}>
  <ReadableMermaid spec={spec} />
</Profiler>

// Browser Performance API
const measureDiagramRender = () => {
  performance.mark('diagram-start');
  // ... render diagram
  performance.mark('diagram-end');
  performance.measure('diagram-render', 'diagram-start', 'diagram-end');
  
  const measures = performance.getEntriesByName('diagram-render');
  console.log(`Diagram render took ${measures[0].duration}ms`);
};
```

This troubleshooting guide should help you resolve most common issues and implement best practices for reliable, performant diagrams.
