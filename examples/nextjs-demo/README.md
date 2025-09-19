# Srndpty Next.js Demo

This is a comprehensive Next.js example demonstrating how to use `@readable/mermaid` (Srndpty) to create interactive diagrams in a React application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd srndpty/examples/nextjs-demo
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📖 What's Included

This demo showcases four different diagram examples:

### 1. Simple Flow Diagram
- Basic process flow with start/end nodes
- Demonstrates node shapes and labeled edges
- Shows click handlers for nodes and edges

### 2. System Architecture
- Complex web application architecture
- Multiple node shapes (circle, hexagon, cylinder, diamond)
- Different edge styles (solid, dotted, dashed)
- Programmatic control via ref methods
- Export functionality (SVG/PNG)

### 3. Data Pipeline with Metadata
- Nodes with rich metadata displayed in tooltips
- Real-world data processing pipeline example
- Enhanced hover interactions

### 4. Microservices with Groups & Legend
- Complex service architecture
- Logical grouping of related nodes
- Legend for visual organization
- Realistic microservices example

## 🛠️ How to Use in Your Project

### Basic Usage

```tsx
'use client' // for Next.js app directory

import { Srndpty } from '@readable/mermaid'

export default function MyComponent() {
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
  }

  return (
    <Srndpty 
      spec={spec}
      options={{
        height: 400,
        enablePanZoom: true,
        onNodeClick: (nodeId, node) => {
          console.log('Clicked:', nodeId, node)
        }
      }}
    />
  )
}
```

### Advanced Usage with Ref Control

```tsx
import { useRef } from 'react'
import { Srndpty, type SrndptyMethods } from '@readable/mermaid'

export default function MyComponent() {
  const diagramRef = useRef<SrndptyMethods>(null)

  return (
    <>
      <Srndpty 
        ref={diagramRef} 
        spec={spec}
        options={{
          height: 500,
          enablePanZoom: true,
          onNodeClick: handleNodeClick,
          onEdgeClick: handleEdgeClick
        }}
      />
      
      {/* Control buttons */}
      <button onClick={() => diagramRef.current?.fit()}>
        Fit to Container
      </button>
      <button onClick={() => diagramRef.current?.exportPNG()}>
        Export PNG
      </button>
    </>
  )
}
```

## 🎨 Schema Reference

### Basic Spec Structure

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

### Node Types

```typescript
interface ReadableNode {
  id: string;
  label: string;
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;
  meta?: Record<string, any>; // Displayed in tooltips
}
```

### Edge Types

```typescript
interface ReadableEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'thick' | 'dotted' | 'dashed';
  className?: string;
  meta?: Record<string, any>;
}
```

## ✨ Key Features

- **JSON-first schema** - No Mermaid syntax to learn
- **Full TypeScript support** - IntelliSense and type safety
- **Interactive features** - Pan, zoom, click handlers
- **Export capabilities** - SVG and PNG export
- **Accessible design** - 16px+ fonts, high contrast colors
- **Rich tooltips** - Display metadata on hover
- **Programmatic control** - Fit, reset, zoom via ref methods
- **Universal** - Works in React, vanilla JS, and Node.js

## 🎯 Interactive Features

### Pan & Zoom
- **Mouse wheel** to zoom in/out
- **Drag** to pan around large diagrams
- **Keyboard shortcuts**: 
  - `Ctrl/Cmd + F` - Fit to container
  - `Ctrl/Cmd + R` - Reset zoom
  - `Ctrl/Cmd + +/-` - Zoom in/out
  - `Escape` - Clear selections

### Click Handlers
- **Node clicks** - Select nodes and highlight connections
- **Edge clicks** - Highlight specific paths
- **Right-click** - Context menu with options
- **Tooltips** - Rich metadata display on hover

### Export
- **SVG export** - Vector graphics for scalability
- **PNG export** - Raster images for presentations
- **Programmatic** - Export via ref methods
- **Download** - Automatic file download

## 🔧 Configuration

### Next.js Configuration

Make sure your `next.config.js` includes:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@readable/mermaid'],
}

module.exports = nextConfig
```

### Package Dependencies

```json
{
  "dependencies": {
    "@readable/mermaid": "workspace:*",
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🌟 Examples in the Demo

The demo includes several real-world examples:

1. **Simple Process Flow** - Basic workflow diagram
2. **System Architecture** - Web application infrastructure
3. **Data Pipeline** - ETL process with metadata
4. **Microservices** - Service architecture with groupings

Each example demonstrates different features and use cases to help you understand how to implement Srndpty in your own projects.

## 🤝 Contributing

Found an issue or want to improve the demo? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This demo is part of the Srndpty project and is licensed under the MIT License.

---

**Happy diagramming!** 🎨✨

For more information, visit the [main Srndpty repository](../../README.md) or check out the [documentation](../../docs/).
