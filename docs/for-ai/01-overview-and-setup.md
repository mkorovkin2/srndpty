# AI Agent Guide: Overview and Setup

## Project Overview

**Srndpty (formerly Readable Mermaid)** is a universal interactive diagram framework that transforms JSON schemas into beautiful, interactive Mermaid diagrams. It works across React, vanilla JavaScript, and Node.js environments with automatic environment detection.

### Key Features
- **Universal Framework**: Auto-detects React vs vanilla JS environments
- **JSON-First Schema**: Define diagrams with clean, validated JSON instead of learning Mermaid syntax
- **Accessibility-First**: 16px+ fonts, high contrast colors, semantic markup, keyboard navigation
- **Interactive by Default**: Built-in pan/zoom, click handlers, export functionality
- **Beautiful Styling**: Automatic label wrapping, generous spacing, modern typography
- **TypeScript Native**: Full type safety with IntelliSense support

### Architecture

```
srndpty/
├── packages/readable-mermaid/     # Main library package
│   ├── src/
│   │   ├── ReadableMermaid.tsx    # React component (976 lines)
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── compiler.ts            # JSON to Mermaid conversion
│   │   ├── interactivity.ts       # Pan/zoom/click handling
│   │   ├── export.ts              # SVG/PNG export functions
│   │   ├── framework.ts           # Universal environment detection
│   │   ├── vanilla.ts             # Vanilla JS implementation
│   │   └── index.ts               # Main exports
│   └── package.json               # Library dependencies
├── apps/demo/                     # Demo application
│   ├── src/App.tsx                # Example usage patterns
│   └── package.json               # Demo dependencies
└── docs/                          # Documentation
```

## Installation and Setup

### For New Projects

#### React Projects
```bash
npm install srndpty
# or
pnpm add srndpty
# or
yarn add srndpty
```

#### Vanilla JavaScript Projects
```bash
npm install srndpty
```

#### Via CDN
```html
<script type="module">
  import ReadableMermaid from 'https://unpkg.com/srndpty@latest/dist/index.js';
</script>
```

### Development Environment Setup

#### Prerequisites
- Node.js 16+
- pnpm (preferred package manager)
- TypeScript knowledge for development

#### Clone and Setup
```bash
git clone <repository-url>
cd srndpty
pnpm install
```

#### Development Commands
```bash
# Start demo app
pnpm dev

# Build library
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run linting
pnpm --filter readable-mermaid lint
```

### Package Structure

#### Main Package (`packages/readable-mermaid/`)
- **Entry Point**: `src/index.ts`
- **React Component**: `src/ReadableMermaid.tsx` (exports `Srndpty`)
- **Vanilla API**: `src/vanilla.ts` (exports `createDiagram`, `renderDiagram`)
- **Universal API**: `src/framework.ts` (exports `SrndptyFramework`)
- **Types**: `src/types.ts` (all TypeScript interfaces)

#### Build Outputs
- **ESM**: `dist/index.js`
- **CJS**: `dist/index.cjs`
- **Types**: `dist/index.d.ts`

### Environment Detection

The framework automatically detects the environment:

```typescript
import SrndptyFramework from 'srndpty';

// Check environment capabilities
const info = SrndptyFramework.getEnvironmentInfo();
console.log(info);
// {
//   hasReact: true,
//   hasMermaid: true,
//   isNode: false,
//   isBrowser: true
// }
```

### Dependencies

#### Runtime Dependencies
- **mermaid**: `^10.9.0` (core diagramming engine)

#### Peer Dependencies (Optional)
- **react**: `>=16.8.0` (for React components)
- **react-dom**: `>=16.8.0` (for React components)

#### Development Dependencies
- **TypeScript**: `^5` (type safety)
- **Vitest**: `^3.2.4` (testing)
- **tsup**: `^8` (bundling)

### Common Setup Issues

#### React Not Detected
If you're in a React environment but the framework falls back to vanilla mode:
```javascript
// Force React mode
import { Srndpty } from 'srndpty';
// Use the React component directly
<Srndpty spec={spec} options={options} />
```

#### Container Not Found
```javascript
// Make sure container exists before rendering
const container = document.getElementById('my-diagram');
if (!container) {
  console.error('Container #my-diagram not found');
}
```

#### TypeScript Configuration
Ensure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

### Next Steps

After setup, proceed to:
1. **Schema Definition**: Learn the JSON schema structure
2. **Component Implementation**: Understand React vs vanilla usage
3. **Styling and Theming**: Customize visual appearance
4. **Integration Patterns**: Best practices for different environments

### Quick Verification

Test your setup with this minimal example:

```javascript
import ReadableMermaid from 'srndpty';

const spec = {
  type: 'flow',
  nodes: [
    { id: 'A', label: 'Hello' },
    { id: 'B', label: 'World' }
  ],
  edges: [
    { from: 'A', to: 'B' }
  ]
};

// This should work in any environment
ReadableMermaid.render(spec, {
  container: '#diagram-container'
});
```

If this renders a diagram, your setup is complete.
