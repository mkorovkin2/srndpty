# 🔄 Rebranding Summary: Readable Mermaid → Srndpty

## Overview

The framework has been successfully rebranded from **"Readable Mermaid"** to **"Srndpty"** (Serendipity) with all explicit Mermaid references removed from user-facing documentation and APIs.

## What Changed

### 🏷️ Branding & Naming
- **Product Name**: "Readable Mermaid" → "Srndpty" (Serendipity)
- **Published Package**: `@readable/mermaid` → `srndpty`
- **Main Component**: `ReadableMermaid` → `Srndpty` (with backwards compatibility)
- **Framework Class**: `ReadableMermaidFramework` → `SrndptyFramework`
- **Options Interface**: `ReadableMermaidOptions` → `SrndptyOptions`

### 📦 Package Configuration
- **Internal Name**: `@readable/mermaid` (for workspace development)
- **Published Name**: `srndpty` (via `publishConfig`)
- **Repository**: Updated to reflect "srndpty" branding
- **Keywords**: Removed "mermaid", added "serendipity", "universal"

### 🎨 User Interface
- **Demo Title**: "🧜‍♀️ Readable Mermaid" → "✨ Srndpty"
- **Descriptions**: Removed Mermaid references, focused on "universal framework"
- **Documentation**: Updated all examples and usage instructions

### 🔧 API Changes
- **Main Export**: `makeMermaid()` → `makeDiagram()` (with backwards compatibility)
- **Component Props**: Updated to use `SrndptyOptions`
- **Test IDs**: `readable-mermaid-container` → `srndpty-container`

## Backwards Compatibility

✅ **Maintained for smooth migration**:

```typescript
// Legacy imports still work
import { ReadableMermaid, makeMermaid } from 'srndpty';

// New preferred imports
import { Srndpty, makeDiagram } from 'srndpty';
```

## Usage Examples

### Installation
```bash
npm install srndpty
```

### React Component
```tsx
import { Srndpty } from 'srndpty';

function MyDiagram() {
  return <Srndpty spec={spec} options={{ enablePanZoom: true }} />;
}
```

### Universal API
```javascript
import Srndpty from 'srndpty';

const diagram = await Srndpty.render(spec, {
  container: '#my-diagram',
  enablePanZoom: true
});
```

### Vanilla JavaScript
```javascript
import { renderDiagram } from 'srndpty';

const diagram = await renderDiagram(spec, {
  container: document.getElementById('diagram')
});
```

## Development vs Production

### Development (Monorepo)
- Internal package name: `@readable/mermaid`
- Import: `import { Srndpty } from '@readable/mermaid'`

### Production (Published)
- Published package name: `srndpty`
- Import: `import { Srndpty } from 'srndpty'`

## Key Features Emphasized

1. **🌍 Universal** - Works everywhere (React, vanilla JS, Node.js)
2. **📦 Zero Config** - Auto-detects environment
3. **🎯 Interactive** - Built-in pan/zoom, click handlers
4. **♿ Accessible** - WCAG compliant by default
5. **🎨 Beautiful** - Modern, readable styling

## Files Updated

### Core Package
- `packages/readable-mermaid/package.json` - Package metadata
- `packages/readable-mermaid/src/ReadableMermaid.tsx` - Main component
- `packages/readable-mermaid/src/framework.ts` - Framework class
- `packages/readable-mermaid/src/types.ts` - Type definitions
- `packages/readable-mermaid/src/index.ts` - Exports

### Documentation
- `README.md` - Main repository README
- `packages/readable-mermaid/README.md` - Package README
- All documentation examples updated

### Demo Application
- `apps/demo/src/App.tsx` - Demo interface
- `apps/demo/package.json` - Dependencies

### Tests & Integration
- `packages/readable-mermaid/test-integration.html` - Integration tests

## Migration Guide for Users

### From Previous Versions
```typescript
// Old way
import { ReadableMermaid, makeMermaid } from '@readable/mermaid';

// New way (both work, new is preferred)
import { Srndpty, makeDiagram } from 'srndpty';
```

### Component Usage
```tsx
// Old (still works)
<ReadableMermaid spec={spec} options={options} />

// New (preferred)
<Srndpty spec={spec} options={options} />
```

## Technical Implementation

- ✅ **No Breaking Changes** - All existing APIs maintained
- ✅ **Smooth Migration** - Legacy exports provided
- ✅ **Type Safety** - Full TypeScript support maintained
- ✅ **Build System** - Works with all bundlers
- ✅ **Testing** - All tests pass with new branding

## Summary

The rebranding is complete and maintains full backwards compatibility while establishing "Srndpty" as a standalone, universal diagram framework that works everywhere without requiring users to know or understand the underlying implementation details.
