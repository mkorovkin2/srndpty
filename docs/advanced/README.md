# 🚀 Advanced Features

Comprehensive guide to advanced features, performance optimization, and expert-level usage patterns.

## 📚 Advanced Topics

### 🎨 [Theming & Styling](./theming.md)
- Custom CSS styling for nodes and edges
- Theme customization and creation
- Responsive design patterns
- Dark mode and accessibility

### 🎯 [Interactivity](./interactivity.md)
- Pan and zoom controls
- Click handlers and event management
- Keyboard navigation
- Touch gesture support

### 📤 [Export & Integration](./export.md)
- SVG and PNG export functionality
- Embedding in other applications
- Server-side rendering
- Print optimization

### ⚡ [Performance](./performance.md)
- Optimization for large diagrams
- Virtualization techniques
- Memory management
- Rendering performance

## 🔧 Expert Usage Patterns

### Dynamic Diagram Generation

Create diagrams programmatically from data sources:

```typescript
interface DataSource {
  services: Array<{
    id: string;
    name: string;
    type: 'api' | 'database' | 'queue' | 'cache';
    dependencies: string[];
  }>;
}

const generateArchitectureDiagram = (data: DataSource): ReadableSpec => {
  const nodeShapes: Record<string, ReadableNode['shape']> = {
    api: 'hexagon',
    database: 'cylinder',
    queue: 'stadium',
    cache: 'cylinder'
  };

  const nodes: ReadableNode[] = data.services.map(service => ({
    id: service.id,
    label: service.name,
    shape: nodeShapes[service.type],
    className: `service-${service.type}`,
    meta: { type: service.type, service }
  }));

  const edges: ReadableEdge[] = data.services.flatMap(service =>
    service.dependencies.map(depId => ({
      from: service.id,
      to: depId,
      label: 'depends on'
    }))
  );

  return {
    type: 'flow',
    direction: 'TB',
    nodes,
    edges,
    groups: generateServiceGroups(data.services)
  };
};
```

### Conditional Rendering

Show different diagram views based on user permissions or context:

```tsx
const ConditionalDiagram: React.FC<{
  spec: ReadableSpec;
  userRole: 'admin' | 'developer' | 'viewer';
  showSensitive: boolean;
}> = ({ spec, userRole, showSensitive }) => {
  const filteredSpec = useMemo((): ReadableSpec => {
    let filteredNodes = spec.nodes;
    let filteredEdges = spec.edges;

    // Filter sensitive information based on user role
    if (!showSensitive && userRole !== 'admin') {
      filteredNodes = spec.nodes.filter(node => 
        !node.meta?.sensitive
      );
      
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = spec.edges.filter(edge => 
        nodeIds.has(edge.from) && nodeIds.has(edge.to)
      );
    }

    // Show different levels of detail based on role
    if (userRole === 'viewer') {
      filteredNodes = filteredNodes.map(node => ({
        ...node,
        label: node.meta?.publicLabel || node.label,
        meta: undefined // Remove metadata for viewers
      }));
    }

    return {
      ...spec,
      nodes: filteredNodes,
      edges: filteredEdges
    };
  }, [spec, userRole, showSensitive]);

  return <ReadableMermaid spec={filteredSpec} />;
};
```

### Multi-Level Drill-Down

Implement hierarchical diagrams with drill-down capabilities:

```tsx
interface DiagramLevel {
  id: string;
  title: string;
  spec: ReadableSpec;
  parent?: string;
  children: Record<string, DiagramLevel>;
}

const HierarchicalDiagram: React.FC<{ rootLevel: DiagramLevel }> = ({ 
  rootLevel 
}) => {
  const [currentLevel, setCurrentLevel] = useState<DiagramLevel>(rootLevel);
  const [breadcrumb, setBreadcrumb] = useState<DiagramLevel[]>([rootLevel]);

  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    // Check if this node has a drill-down target
    const drillDownTarget = node.meta?.drillDown;
    if (drillDownTarget && currentLevel.children[drillDownTarget]) {
      const nextLevel = currentLevel.children[drillDownTarget];
      setCurrentLevel(nextLevel);
      setBreadcrumb(prev => [...prev, nextLevel]);
    }
  }, [currentLevel]);

  const navigateToLevel = (level: DiagramLevel) => {
    setCurrentLevel(level);
    const levelIndex = breadcrumb.findIndex(l => l.id === level.id);
    setBreadcrumb(breadcrumb.slice(0, levelIndex + 1));
  };

  return (
    <div>
      {/* Breadcrumb navigation */}
      <nav style={{ marginBottom: '20px' }}>
        {breadcrumb.map((level, index) => (
          <span key={level.id}>
            <button 
              onClick={() => navigateToLevel(level)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#0ea5e9',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {level.title}
            </button>
            {index < breadcrumb.length - 1 && ' > '}
          </span>
        ))}
      </nav>

      {/* Current level diagram */}
      <ReadableMermaid 
        spec={currentLevel.spec}
        options={{
          onNodeClick: handleNodeClick,
          fitToContainer: true
        }}
      />

      {/* Drill-down hint */}
      <div style={{ 
        marginTop: '10px', 
        fontSize: '14px', 
        color: '#64748b',
        fontStyle: 'italic'
      }}>
        💡 Click on nodes with drill-down data to explore deeper levels
      </div>
    </div>
  );
};
```

### State Machine Visualization

Visualize complex state machines with transition animations:

```tsx
interface StateMachine {
  states: Array<{
    id: string;
    name: string;
    type: 'initial' | 'normal' | 'final';
  }>;
  transitions: Array<{
    from: string;
    to: string;
    trigger: string;
    condition?: string;
  }>;
  currentState?: string;
}

const StateMachineVisualization: React.FC<{
  stateMachine: StateMachine;
  onTransition?: (from: string, to: string, trigger: string) => void;
}> = ({ stateMachine, onTransition }) => {
  const [currentState, setCurrentState] = useState(
    stateMachine.currentState || stateMachine.states[0]?.id
  );
  const [transitionHistory, setTransitionHistory] = useState<string[]>([]);

  const spec: ReadableSpec = useMemo(() => ({
    type: 'flow',
    direction: 'TB',
    nodes: stateMachine.states.map(state => ({
      id: state.id,
      label: state.name,
      shape: state.type === 'initial' ? 'stadium' :
             state.type === 'final' ? 'stadium' : 'rect',
      className: `state-${state.type} ${
        state.id === currentState ? 'state-current' : ''
      } ${
        transitionHistory.includes(state.id) ? 'state-visited' : ''
      }`.trim()
    })),
    edges: stateMachine.transitions.map(transition => ({
      from: transition.from,
      to: transition.to,
      label: `${transition.trigger}${
        transition.condition ? `\n[${transition.condition}]` : ''
      }`,
      className: currentState === transition.from ? 'transition-available' : ''
    }))
  }), [stateMachine, currentState, transitionHistory]);

  const handleStateClick = useCallback((stateId: string) => {
    // Find available transitions from current state
    const availableTransitions = stateMachine.transitions.filter(
      t => t.from === currentState
    );
    
    const transition = availableTransitions.find(t => t.to === stateId);
    if (transition) {
      setCurrentState(stateId);
      setTransitionHistory(prev => [...prev, currentState]);
      onTransition?.(currentState, stateId, transition.trigger);
    }
  }, [currentState, stateMachine.transitions, onTransition]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>State Machine: Current State = {currentState}</h3>
        <div>
          <strong>Available Transitions:</strong>
          {stateMachine.transitions
            .filter(t => t.from === currentState)
            .map(t => (
              <span 
                key={`${t.from}-${t.to}`}
                style={{ 
                  marginLeft: '10px',
                  padding: '2px 6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {t.trigger} → {t.to}
              </span>
            ))}
        </div>
      </div>

      <ReadableMermaid 
        spec={spec}
        options={{
          onNodeClick: handleStateClick,
          fitToContainer: true
        }}
      />

      <style jsx>{`
        .state-initial {
          fill: #dcfce7 !important;
          stroke: #10b981 !important;
          stroke-width: 3px !important;
        }
        
        .state-final {
          fill: #fef2f2 !important;
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
        }
        
        .state-current {
          fill: #dbeafe !important;
          stroke: #3b82f6 !important;
          stroke-width: 4px !important;
          animation: pulse 2s infinite;
        }
        
        .state-visited {
          fill: #f3f4f6 !important;
          stroke: #9ca3af !important;
        }
        
        .transition-available {
          stroke: #10b981 !important;
          stroke-width: 3px !important;
          animation: flow 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes flow {
          0% { stroke-dasharray: 0, 10; }
          100% { stroke-dasharray: 10, 0; }
        }
      `}</style>
    </div>
  );
};
```

### Integration with External APIs

Connect diagrams to live data sources:

```tsx
const LiveDataDiagram: React.FC<{ apiEndpoint: string }> = ({ apiEndpoint }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [apiEndpoint]);

  const spec: ReadableSpec | null = useMemo(() => {
    if (!data) return null;

    // Transform API data into ReadableSpec
    return {
      type: 'flow',
      direction: 'TB',
      nodes: data.services?.map((service: any) => ({
        id: service.id,
        label: `${service.name}\n${service.status}`,
        shape: service.type === 'database' ? 'cylinder' : 'rect',
        className: `status-${service.status.toLowerCase()}`,
        meta: service
      })) || [],
      edges: data.connections?.map((conn: any) => ({
        from: conn.source,
        to: conn.target,
        label: conn.type,
        style: conn.active ? 'solid' : 'dotted'
      })) || []
    };
  }, [data]);

  if (loading) {
    return <div>Loading live data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  if (!spec) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>
        Last updated: {new Date().toLocaleTimeString()}
      </div>
      <ReadableMermaid spec={spec} />
    </div>
  );
};
```

## 🎯 Advanced Patterns

### Diagram Composition

Combine multiple diagrams into complex layouts:

```tsx
const CompositeDiagram: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h3>Frontend Architecture</h3>
        <ReadableMermaid spec={frontendSpec} />
      </div>
      <div>
        <h3>Backend Services</h3>
        <ReadableMermaid spec={backendSpec} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <h3>Data Flow</h3>
        <ReadableMermaid spec={dataFlowSpec} />
      </div>
    </div>
  );
};
```

### Custom Node Rendering

Extend nodes with custom content:

```tsx
const CustomNodeDiagram: React.FC = () => {
  const handleNodeClick = useCallback((nodeId: string, node: ReadableNode) => {
    // Custom node interaction logic
    const customData = node.meta?.customData;
    if (customData) {
      showCustomModal(customData);
    }
  }, []);

  return (
    <ReadableMermaid 
      spec={spec}
      options={{
        onNodeClick: handleNodeClick,
        className: 'custom-diagram'
      }}
    />
  );
};
```

### Performance Monitoring

Monitor diagram performance and optimize accordingly:

```tsx
const PerformanceOptimizedDiagram: React.FC<{ spec: ReadableSpec }> = ({ spec }) => {
  const renderTimeRef = useRef<number>(0);
  
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      renderTimeRef.current = end - start;
      
      if (renderTimeRef.current > 1000) {
        console.warn(`Slow diagram render: ${renderTimeRef.current}ms`);
      }
    };
  });

  // Optimize spec for performance
  const optimizedSpec = useMemo(() => {
    if (spec.nodes.length > 50) {
      console.warn('Large diagram detected, consider using hierarchical views');
    }
    
    return spec;
  }, [spec]);

  return <ReadableMermaid spec={optimizedSpec} />;
};
```

This advanced features guide provides the foundation for building sophisticated, production-ready diagram applications with Readable Mermaid.
