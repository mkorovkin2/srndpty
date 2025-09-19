# ✨ Srndpty

> **Universal interactive diagram framework** with JSON-first schemas. Beautiful diagrams that work everywhere.

[![npm version](https://badge.fury.io/js/srndpty.svg)](https://badge.fury.io/js/srndpty)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

**Srndpty** (Serendipity) is a universal framework that transforms JSON schemas into beautiful, interactive diagrams. It automatically detects your environment (React, vanilla JS, Node.js) and provides the best API for your use case.

## ✨ Key Features

- **🌍 Universal** - Works in React, vanilla JavaScript, and Node.js
- **📋 JSON-First** - Define diagrams with clean, validated JSON instead of learning Mermaid syntax
- **♿ Accessible** - 16px+ fonts, high contrast colors, keyboard navigation
- **🎯 Interactive** - Built-in pan/zoom, click handlers, export functionality
- **🎨 Beautiful** - Automatic label wrapping, generous spacing, modern typography
- **📦 Zero Config** - Auto-detects environment and provides appropriate API
- **🔧 TypeScript** - Full type safety with IntelliSense support

## 🚀 Quick Start

### Installation

```bash
npm install srndpty
# or
pnpm add srndpty
# or
yarn add srndpty
```

### Universal Usage (Auto-Detection)

The framework automatically detects your environment and provides the best API:

```javascript
import Srndpty from 'srndpty';

const spec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'start', label: 'Start Process', shape: 'stadium' },
    { id: 'process', label: 'Transform Data' },
    { id: 'end', label: 'Complete', shape: 'stadium' }
  ],
  edges: [
    { from: 'start', to: 'process', label: 'begin' },
    { from: 'process', to: 'end', label: 'finish' }
  ]
};

// Auto-detects environment and renders appropriately
const diagram = await Srndpty.render(spec, {
  container: '#my-diagram',
  enablePanZoom: true,
  onNodeClick: (nodeId, node) => console.log('Clicked:', nodeId)
});
```

## 📖 Usage Examples

### 1. React Component

```tsx
import { Srndpty } from 'srndpty';

function MyDiagram() {
  const spec = {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { id: 'A', label: 'Hello' },
      { id: 'B', label: 'World' }
    ],
    edges: [
      { from: 'A', to: 'B', label: 'connects to' }
    ]
  };

  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: (nodeId, node) => alert(`Clicked: ${node.label}`),
        enablePanZoom: true,
        width: 800,
        height: 600
      }}
    />
  );
}
```

### 2. Vanilla JavaScript

```javascript
import { renderDiagram } from 'srndpty';

const spec = {
  type: 'flow',
  nodes: [
    { id: 'user', label: 'User', shape: 'circle' },
    { id: 'api', label: 'API', shape: 'hexagon' },
    { id: 'db', label: 'Database', shape: 'cylinder' }
  ],
  edges: [
    { from: 'user', to: 'api' },
    { from: 'api', to: 'db' }
  ]
};

// Render to any container
const diagram = await renderDiagram(spec, {
  container: document.getElementById('diagram-container'),
  enablePanZoom: true,
  onNodeClick: (nodeId, node) => {
    console.log('Node clicked:', node);
  }
});

// Control the diagram
diagram.fit();
diagram.zoomIn();
await diagram.exportPNG('my-diagram.png');
```

### 3. HTML + Script Tag

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Diagram</title>
</head>
<body>
  <div id="diagram" style="width: 100%; height: 500px;"></div>
  
  <script type="module">
    import Srndpty from 'https://unpkg.com/@readable/mermaid@latest/dist/index.js';
    
    const spec = {
      type: 'flow',
      direction: 'TB',
      nodes: [
        { id: 'start', label: 'Start', shape: 'stadium' },
        { id: 'end', label: 'End', shape: 'stadium' }
      ],
      edges: [
        { from: 'start', to: 'end' }
      ]
    };
    
    Srndpty.render(spec, {
      container: '#diagram',
      enablePanZoom: true
    });
  </script>
</body>
</html>
```

### 4. Node.js (Generate Mermaid Code)

```javascript
import { makeMermaid, validateSpec } from 'srndpty';

const spec = {
  type: 'flow',
  nodes: [
    { id: 'A', label: 'Process A' },
    { id: 'B', label: 'Process B' }
  ],
  edges: [
    { from: 'A', to: 'B', style: 'thick' }
  ]
};

// Validate the spec
const errors = validateSpec(spec);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
}

// Generate Mermaid code
const mermaidCode = makeMermaid(spec);
console.log(mermaidCode);
// Output:
// graph TD
//   A["Process A"]
//   B["Process B"]
//   A ===> B
```

## 🎨 Schema Reference

### ReadableSpec

```typescript
interface ReadableSpec {
  type: 'flow' | 'sequence' | 'class' | 'state';
  direction?: 'TB' | 'BT' | 'RL' | 'LR';
  nodes: ReadableNode[];
  edges: ReadableEdge[];
  groups?: ReadableGroup[];
  legend?: LegendItem[];
  theme?: 'default' | 'dark' | 'neutral' | 'forest' | 'base';
}
```

### Node Shapes

```typescript
interface ReadableNode {
  id: string;
  label: string;
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;
  meta?: Record<string, any>;
}
```

### Edge Styles

```typescript
interface ReadableEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'thick' | 'dotted' | 'dashed';
  className?: string;
}
```

## 🎯 Interactive Features

### Pan & Zoom
- Mouse wheel to zoom in/out
- Drag to pan around large diagrams
- Programmatic control with `fit()`, `reset()`, `zoomIn()`, `zoomOut()`

### Click Handlers
```javascript
const diagram = await renderDiagram(spec, {
  container: '#diagram',
  onNodeClick: (nodeId, node) => {
    console.log('Node clicked:', nodeId, node);
  },
  onEdgeClick: (edge) => {
    console.log('Edge clicked:', edge);
  }
});
```

### Export
```javascript
// Export as SVG
await diagram.exportSVG('my-diagram.svg');

// Export as PNG with custom scale
await diagram.exportPNG('my-diagram.png');
```

## 🔧 Advanced Usage

### Environment Detection

```javascript
import Srndpty from 'srndpty';

// Check what's available in your environment
const info = Srndpty.getEnvironmentInfo();
console.log(info);
// {
//   hasReact: true,
//   hasMermaid: true,
//   isNode: false,
//   isBrowser: true
// }

// Force vanilla mode even in React environments
const diagram = Srndpty.createVanilla(spec, {
  container: '#diagram'
});
```

### Custom Styling

```javascript
const diagram = await renderDiagram(spec, {
  container: '#diagram',
  className: 'my-diagram',
  style: {
    border: '2px solid #3b82f6',
    borderRadius: '12px',
    backgroundColor: '#f8fafc'
  }
});
```

### Groups and Legends

```json
{
  "type": "flow",
  "nodes": [
    { "id": "api", "label": "API Gateway" },
    { "id": "auth", "label": "Auth Service" },
    { "id": "db", "label": "Database", "shape": "cylinder" }
  ],
  "edges": [
    { "from": "api", "to": "auth" },
    { "from": "auth", "to": "db" }
  ],
  "groups": [
    {
      "id": "services",
      "label": "Microservices",
      "nodes": ["api", "auth"]
    }
  ],
  "legend": [
    { "swatch": "primary", "label": "Core Services" },
    { "swatch": "accent", "label": "Data Layer" }
  ]
}
```

## 📦 API Reference

### SrndptyFramework

- `SrndptyFramework.render(spec, options)` - Auto-detect and render
- `SrndptyFramework.create(spec, options)` - Auto-detect and create instance
- `SrndptyFramework.renderVanilla(spec, options)` - Force vanilla rendering
- `SrndptyFramework.getReactComponent()` - Get React component
- `SrndptyFramework.getEnvironmentInfo()` - Environment detection

### DiagramInstance (Vanilla)

- `render()` - Render the diagram
- `fit()` - Fit diagram to container
- `reset()` - Reset zoom and pan
- `zoomIn()` / `zoomOut()` - Zoom controls
- `exportSVG(filename?)` - Export as SVG
- `exportPNG(filename?)` - Export as PNG
- `destroy()` - Clean up the diagram

### Utilities

- `makeMermaid(spec)` - Convert spec to Mermaid code
- `validateSpec(spec)` - Validate a spec
- `wrapLabel(text, maxChars)` - Wrap long labels

## 🌟 Examples

### Data Pipeline
```javascript
const pipelineSpec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'ingest', label: 'Data Ingestion', shape: 'stadium' },
    { id: 'clean', label: 'Clean & Validate' },
    { id: 'transform', label: 'Transform' },
    { id: 'store', label: 'Data Lake', shape: 'cylinder' }
  ],
  edges: [
    { from: 'ingest', to: 'clean', label: 'raw data', style: 'thick' },
    { from: 'clean', to: 'transform', label: 'validated' },
    { from: 'transform', to: 'store', label: 'processed' }
  ]
};
```

### Microservices Architecture
```javascript
const microservicesSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'user', label: 'User', shape: 'circle' },
    { id: 'gateway', label: 'API Gateway', shape: 'hexagon' },
    { id: 'auth', label: 'Auth Service' },
    { id: 'users', label: 'User Service' },
    { id: 'orders', label: 'Order Service' }
  ],
  edges: [
    { from: 'user', to: 'gateway' },
    { from: 'gateway', to: 'auth', label: 'authenticate' },
    { from: 'gateway', to: 'users', label: 'user ops' },
    { from: 'gateway', to: 'orders', label: 'orders' }
  ]
};
```

## 🔍 Troubleshooting

### React Not Detected
If you're in a React environment but the framework falls back to vanilla mode:

```javascript
// Force React mode
import { Srndpty } from 'srndpty';

// Use the React component directly
<Srndpty spec={spec} options={options} />
```

### Container Not Found
```javascript
// Make sure container exists before rendering
const container = document.getElementById('my-diagram');
if (!container) {
  console.error('Container #my-diagram not found');
}
```

### Mermaid Rendering Issues
```javascript
// Validate your spec first
import { validateSpec } from 'srndpty';

const errors = validateSpec(spec);
if (errors.length > 0) {
  console.error('Spec validation errors:', errors);
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

<div align="center">
  <strong>Made with ❤️ for better diagrams everywhere</strong>
</div>
