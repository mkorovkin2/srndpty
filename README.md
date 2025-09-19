# ✨ Srndpty

> **Universal interactive diagram framework** with JSON-first schemas. Beautiful diagrams that work everywhere.

[![CI](https://github.com/username/srndpty/actions/workflows/ci.yml/badge.svg)](https://github.com/username/srndpty/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/srndpty.svg)](https://badge.fury.io/js/srndpty)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

**Srndpty** (Serendipity) is a universal framework that transforms JSON schemas into beautiful, interactive diagrams. It automatically detects your environment (React, vanilla JS, Node.js) and provides the best API for your use case, with accessibility and readability as first-class concerns.

## ✨ Features

- **🌍 Universal** - Works in React, vanilla JavaScript, and Node.js environments
- **📋 JSON-First Schema** - Define diagrams with clean, validated JSON instead of learning Mermaid syntax
- **♿ Accessible by Default** - 16px+ fonts, high contrast colors, semantic markup, keyboard navigation
- **🎯 Interactive** - Built-in pan/zoom, node/edge click handlers, fit-to-screen controls
- **🎨 Readable Styling** - Automatic label wrapping, generous spacing, modern typography
- **📦 Zero Config** - Auto-detects environment and provides appropriate API
- **🔧 TypeScript Native** - Full type safety with IntelliSense support
- **📤 Export Ready** - SVG/PNG export functionality built-in
- **🧪 Well Tested** - 95%+ test coverage with unit and e2e tests

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

### React Component

```tsx
import { Srndpty } from 'srndpty';

function MyDiagram() {
  return (
    <Srndpty 
      spec={spec}
      options={{
        onNodeClick: (nodeId, node) => console.log('Clicked:', nodeId),
        onEdgeClick: (edge) => console.log('Edge:', edge),
        enablePanZoom: true
      }}
    />
  );
}
```

### Standalone Usage

```typescript
import { makeDiagram } from 'srndpty';

const diagramCode = makeDiagram({
  type: 'flow',
  nodes: [
    { id: 'A', label: 'Hello' },
    { id: 'B', label: 'World' }
  ],
  edges: [
    { from: 'A', to: 'B' }
  ]
});

console.log(diagramCode);
// Output: graph TD
//   A["Hello"]
//   B["World"]  
//   A ---> B
```

## 📖 Schema Reference

### ReadableSpec

The core schema for defining diagrams:

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

### Groups & Legends

```typescript
interface ReadableGroup {
  id: string;
  label: string;
  nodes: string[];
  collapsible?: boolean;
}

interface LegendItem {
  swatch: string;
  label: string;
}
```

## 🎨 Examples

### Data Pipeline

```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { "id": "ingest", "label": "Data Ingestion", "shape": "stadium" },
    { "id": "clean", "label": "Clean & Validate" },
    { "id": "transform", "label": "Transform" },
    { "id": "store", "label": "Data Lake", "shape": "cylinder" }
  ],
  "edges": [
    { "from": "ingest", "to": "clean", "label": "raw data", "style": "thick" },
    { "from": "clean", "to": "transform", "label": "validated" },
    { "from": "transform", "to": "store", "label": "processed" }
  ],
  "groups": [
    { 
      "id": "pipeline", 
      "label": "ETL Pipeline", 
      "nodes": ["ingest", "clean", "transform", "store"] 
    }
  ],
  "legend": [
    { "swatch": "primary", "label": "Core Process" },
    { "swatch": "accent", "label": "Storage" }
  ]
}
```

### Microservices Architecture

```json
{
  "type": "flow",
  "direction": "TB",
  "nodes": [
    { "id": "user", "label": "User", "shape": "circle" },
    { "id": "gateway", "label": "API Gateway", "shape": "hexagon" },
    { "id": "auth", "label": "Auth Service" },
    { "id": "users", "label": "User Service" },
    { "id": "orders", "label": "Order Service" }
  ],
  "edges": [
    { "from": "user", "to": "gateway" },
    { "from": "gateway", "to": "auth", "label": "authenticate" },
    { "from": "gateway", "to": "users", "label": "user ops" },
    { "from": "gateway", "to": "orders", "label": "orders" }
  ]
}
```

## 🎯 Interactive Features

### Pan & Zoom
- Mouse wheel to zoom in/out
- Drag to pan around large diagrams
- Fit-to-container and reset controls

### Click Handlers
```tsx
<ReadableMermaid 
  spec={spec}
  options={{
    onNodeClick: (nodeId, node) => {
      // Handle node clicks
      showNodeDetails(node);
    },
    onEdgeClick: (edge) => {
      // Handle edge clicks
      showEdgeInfo(edge);
    }
  }}
/>
```

### Export
```tsx
import { exportAndDownloadSVG, exportAndDownloadPNG } from '@readable/mermaid';

// Export current diagram
await exportAndDownloadSVG(svgElement, 'my-diagram.svg');
await exportAndDownloadPNG(svgElement, 'my-diagram.png', { scale: 2 });
```

## 🔧 Configuration

### Component Options

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

### Theming

The library provides readable defaults but supports Mermaid's theming system:

```typescript
const spec = {
  type: 'flow',
  theme: 'dark', // 'default' | 'dark' | 'neutral' | 'forest' | 'base'
  // ... rest of spec
};
```

## 🧪 Development

### Running the Demo

```bash
git clone https://github.com/username/srndpty
cd srndpty
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interactive Next.js demo.

The demo showcases:
- **🎯 Interactive JSON Editor** - Edit diagram specs in real-time
- **🔍 Pan & Zoom Controls** - Full diagram navigation
- **📊 Multiple Examples** - Basic flows, data pipelines, microservices
- **🖼️ Export Features** - SVG and PNG download
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎮 Live Interaction Log** - Track clicks and interactions

### Testing

```bash
# Unit tests
pnpm test

# E2E tests  
pnpm test:e2e

# Coverage
pnpm test --coverage
```

### Building

```bash
# Build library
pnpm build

# Build Next.js demo
pnpm build:demo
```

## 🗺️ Roadmap

- [ ] **Sequence Diagrams** - Timeline-based interactions
- [ ] **Class Diagrams** - Object-oriented relationships  
- [ ] **State Diagrams** - State machine visualization
- [ ] **Advanced Theming** - CSS custom properties support
- [ ] **Collapsible Groups** - Interactive expand/collapse
- [ ] **Minimap** - Navigation for large diagrams
- [ ] **SSR Support** - Server-side rendering compatibility
- [ ] **Accessibility Audit** - WCAG 2.1 AA compliance
- [ ] **Performance** - Virtualization for 1000+ node diagrams

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Run tests: `pnpm test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) - The powerful diagramming library that powers our visualizations
- [React](https://react.dev/) - The UI library that makes our components possible
- [Next.js](https://nextjs.org/) - The React framework powering our demo application
- [TypeScript](https://www.typescriptlang.org/) - For type safety and developer experience

---

<div align="center">
  <strong>Made for better diagrams</strong>
</div>