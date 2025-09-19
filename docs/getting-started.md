# 🚀 Getting Started with Readable Mermaid

This guide will help you set up Readable Mermaid and create your first interactive diagram in minutes.

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **React** 18+ (for React components)
- **TypeScript** 5+ (optional but recommended)

### Package Installation

```bash
# Using npm
npm install @readable/mermaid

# Using pnpm (recommended)
pnpm add @readable/mermaid

# Using yarn
yarn add @readable/mermaid
```

### Peer Dependencies

If you're using the React component, ensure you have React installed:

```bash
# React is a peer dependency
npm install react react-dom
# or
pnpm add react react-dom
```

## 🎯 Your First Diagram

### React Component Usage

Create a simple flowchart with the React component:

```tsx
import React from 'react';
import { ReadableMermaid } from '@readable/mermaid';
import type { ReadableSpec } from '@readable/mermaid';

function App() {
  const spec: ReadableSpec = {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { 
        id: 'start', 
        label: 'Start Process', 
        shape: 'stadium' 
      },
      { 
        id: 'process', 
        label: 'Transform Data' 
      },
      { 
        id: 'end', 
        label: 'Complete', 
        shape: 'stadium' 
      }
    ],
    edges: [
      { 
        from: 'start', 
        to: 'process', 
        label: 'begin' 
      },
      { 
        from: 'process', 
        to: 'end', 
        label: 'finish' 
      }
    ]
  };

  return (
    <div>
      <h1>My First Diagram</h1>
      <ReadableMermaid 
        spec={spec}
        options={{
          width: 600,
          height: 400,
          enablePanZoom: true
        }}
      />
    </div>
  );
}

export default App;
```

### Standalone Usage

Generate Mermaid code without React:

```typescript
import { makeMermaid, validateSpec } from '@readable/mermaid';

const spec = {
  type: 'flow' as const,
  nodes: [
    { id: 'A', label: 'Hello World' },
    { id: 'B', label: 'Goodbye World' }
  ],
  edges: [
    { from: 'A', to: 'B', label: 'transition' }
  ]
};

// Validate the spec first
const errors = validateSpec(spec);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
} else {
  // Generate Mermaid code
  const mermaidCode = makeMermaid(spec);
  console.log(mermaidCode);
  
  // Output:
  // graph TD
  //   A["Hello World"]
  //   B["Goodbye World"]
  //   A -->|"transition"| B
}
```

## 📋 Understanding the JSON Schema

### Basic Structure

Every diagram starts with a `ReadableSpec`:

```typescript
interface ReadableSpec {
  type: 'flow' | 'sequence' | 'class' | 'state';  // Diagram type
  direction?: 'TB' | 'BT' | 'RL' | 'LR';          // Flow direction
  nodes: ReadableNode[];                           // Required nodes
  edges: ReadableEdge[];                           // Connections
  groups?: ReadableGroup[];                        // Optional grouping
  legend?: LegendItem[];                           // Optional legend
  theme?: 'default' | 'dark' | 'neutral' | 'forest' | 'base';
}
```

### Nodes

Define the elements in your diagram:

```typescript
interface ReadableNode {
  id: string;           // Unique identifier
  label: string;        // Display text
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;   // CSS class for styling
  meta?: Record<string, any>; // Custom metadata
}
```

**Shape Examples:**
- `rect` (default): `[Text]`
- `round`: `(Text)`
- `stadium`: `([Text])`
- `cylinder`: `[(Text)]`
- `circle`: `((Text))`
- `diamond`: `{Text}`
- `hexagon`: `{{Text}}`

### Edges

Connect nodes with labeled relationships:

```typescript
interface ReadableEdge {
  from: string;         // Source node ID
  to: string;           // Target node ID
  label?: string;       // Optional edge label
  style?: 'solid' | 'thick' | 'dotted' | 'dashed';
  className?: string;   // CSS class for styling
  meta?: Record<string, any>; // Custom metadata
}
```

**Style Examples:**
- `solid` (default): `--->`
- `thick`: `===>`
- `dotted`: `-.->` 
- `dashed`: `-->`

## 🎨 Styling and Themes

### Built-in Themes

Choose from Mermaid's built-in themes:

```typescript
const spec: ReadableSpec = {
  type: 'flow',
  theme: 'dark',  // 'default', 'dark', 'neutral', 'forest', 'base'
  nodes: [/* ... */],
  edges: [/* ... */]
};
```

### Custom Styling

Add CSS classes to nodes and edges:

```typescript
const spec: ReadableSpec = {
  type: 'flow',
  nodes: [
    { 
      id: 'important', 
      label: 'Critical Step',
      className: 'highlight-node'
    }
  ],
  edges: [
    { 
      from: 'a', 
      to: 'important',
      className: 'critical-path'
    }
  ]
};
```

Then define your CSS:

```css
.highlight-node {
  fill: #fef3c7 !important;
  stroke: #f59e0b !important;
  stroke-width: 3px !important;
}

.critical-path {
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
}
```

## 🎯 Interactive Features

### Click Handlers

Add interactivity to your diagrams:

```tsx
import { ReadableMermaid } from '@readable/mermaid';

function InteractiveDiagram() {
  const handleNodeClick = (nodeId: string, node: ReadableNode) => {
    console.log(`Clicked node: ${nodeId}`);
    alert(`You clicked: ${node.label}`);
  };

  const handleEdgeClick = (edge: ReadableEdge) => {
    console.log(`Clicked edge: ${edge.from} → ${edge.to}`);
    alert(`Edge: ${edge.from} to ${edge.to}`);
  };

  return (
    <ReadableMermaid
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

### Pan & Zoom

Enable mouse wheel zoom and drag panning:

```tsx
<ReadableMermaid
  spec={spec}
  options={{
    enablePanZoom: true,     // Enable pan/zoom
    fitToContainer: true,    // Auto-fit on load
  }}
/>
```

**Controls:**
- **Mouse wheel**: Zoom in/out
- **Click + drag**: Pan around
- **Double-click**: Fit to container (planned)

## 📤 Export Functionality

Export your diagrams as SVG or PNG:

```tsx
import { 
  ReadableMermaid, 
  exportAndDownloadSVG, 
  exportAndDownloadPNG 
} from '@readable/mermaid';

function DiagramWithExport() {
  const svgRef = useRef<SVGElement>(null);

  const handleExportSVG = async () => {
    if (svgRef.current) {
      await exportAndDownloadSVG(svgRef.current, 'my-diagram.svg');
    }
  };

  const handleExportPNG = async () => {
    if (svgRef.current) {
      await exportAndDownloadPNG(svgRef.current, 'my-diagram.png', {
        scale: 2,  // High DPI
        backgroundColor: 'white'
      });
    }
  };

  return (
    <div>
      <ReadableMermaid spec={spec} />
      <button onClick={handleExportSVG}>Export SVG</button>
      <button onClick={handleExportPNG}>Export PNG</button>
    </div>
  );
}
```

## ✅ Validation and Error Handling

Always validate your specs to catch errors early:

```typescript
import { validateSpec } from '@readable/mermaid';

const spec = {
  type: 'flow' as const,
  nodes: [
    { id: 'A', label: 'Node A' },
    { id: 'B', label: 'Node B' }
  ],
  edges: [
    { from: 'A', to: 'C' }  // Error: Node C doesn't exist
  ]
};

const errors = validateSpec(spec);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  // Output: ["Edge references unknown node: C"]
} else {
  console.log('Spec is valid!');
}
```

## 🔧 Configuration Options

### Component Options

Customize the React component behavior:

```typescript
interface ReadableMermaidOptions {
  width?: number;                    // Container width
  height?: number;                   // Container height
  fitToContainer?: boolean;          // Auto-fit on load
  enablePanZoom?: boolean;           // Enable pan/zoom
  enableExport?: boolean;            // Show export controls
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
  onEdgeClick?: (edge: ReadableEdge) => void;
  className?: string;                // Container CSS class
  style?: React.CSSProperties;       // Container inline styles
}
```

### Example with All Options

```tsx
<ReadableMermaid
  spec={spec}
  options={{
    width: 800,
    height: 600,
    fitToContainer: true,
    enablePanZoom: true,
    onNodeClick: handleNodeClick,
    onEdgeClick: handleEdgeClick,
    className: 'my-diagram',
    style: {
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      backgroundColor: '#f8fafc'
    }
  }}
/>
```

## 🚨 Common Gotchas

### 1. Node ID Uniqueness
```typescript
// ❌ Bad: Duplicate IDs
const spec = {
  nodes: [
    { id: 'node1', label: 'First' },
    { id: 'node1', label: 'Second' }  // Error!
  ]
};

// ✅ Good: Unique IDs
const spec = {
  nodes: [
    { id: 'node1', label: 'First' },
    { id: 'node2', label: 'Second' }
  ]
};
```

### 2. Edge References
```typescript
// ❌ Bad: Edge to non-existent node
const spec = {
  nodes: [
    { id: 'A', label: 'Node A' }
  ],
  edges: [
    { from: 'A', to: 'B' }  // Error: B doesn't exist
  ]
};

// ✅ Good: All referenced nodes exist
const spec = {
  nodes: [
    { id: 'A', label: 'Node A' },
    { id: 'B', label: 'Node B' }
  ],
  edges: [
    { from: 'A', to: 'B' }
  ]
};
```

### 3. Long Labels
```typescript
// ❌ Bad: Very long labels without breaks
const spec = {
  nodes: [
    { id: 'long', label: 'This is a very long label that will overflow and look bad' }
  ]
};

// ✅ Good: Use line breaks for long text
const spec = {
  nodes: [
    { id: 'long', label: 'This is a long label\nwith proper line breaks' }
  ]
};
```

## 🎯 Next Steps

Now that you've created your first diagram, explore these topics:

1. **[Complete Examples](./examples/README.md)** - More diagram patterns
2. **[Use Case: Data Pipeline](./use-cases/data-pipeline.md)** - Real-world implementation
3. **[API Reference](./api/schema.md)** - Complete type documentation
4. **[Advanced Features](./advanced/interactivity.md)** - Pan/zoom, theming, export

## 🤝 Need Help?

- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions
- **[GitHub Discussions](https://github.com/username/readable-mermaid/discussions)** - Community Q&A
- **[GitHub Issues](https://github.com/username/readable-mermaid/issues)** - Bug reports and feature requests
