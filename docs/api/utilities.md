# 🛠️ Utility Functions API

Complete reference for standalone utility functions and helper methods.

## 🔧 Core Utilities

### makeMermaid (specToMermaid)

Converts a ReadableSpec to Mermaid diagram code.

```typescript
function makeMermaid(spec: ReadableSpec): string
// Alias: specToMermaid
```

**Parameters:**
- `spec: ReadableSpec` - The diagram specification to convert

**Returns:**
- `string` - Generated Mermaid diagram code

**Example:**
```typescript
import { makeMermaid } from '@readable/mermaid';

const spec: ReadableSpec = {
  type: 'flow',
  nodes: [
    { id: 'A', label: 'Start' },
    { id: 'B', label: 'End' }
  ],
  edges: [
    { from: 'A', to: 'B' }
  ]
};

const mermaidCode = makeMermaid(spec);
console.log(mermaidCode);
// Output:
// graph TD
//   A["Start"]
//   B["End"]
//   A ---> B
```

---

### validateSpec

Validates a ReadableSpec for structural correctness and common issues.

```typescript
function validateSpec(spec: ReadableSpec): string[]
```

**Parameters:**
- `spec: ReadableSpec` - The diagram specification to validate

**Returns:**
- `string[]` - Array of validation error messages (empty if valid)

**Validation Rules:**
1. Spec must be defined
2. Must have at least one node
3. All node IDs must be unique
4. All edge references must point to existing nodes
5. All group node references must be valid

**Example:**
```typescript
import { validateSpec } from '@readable/mermaid';

const spec: ReadableSpec = {
  type: 'flow',
  nodes: [
    { id: 'A', label: 'Node A' }
  ],
  edges: [
    { from: 'A', to: 'nonexistent' }  // Invalid reference
  ]
};

const errors = validateSpec(spec);
console.log(errors);
// Output: ["Edge references unknown node: nonexistent"]
```

---

### wrapLabel

Wraps long text labels at specified character limits with smart word breaking.

```typescript
function wrapLabel(text: string, maxChars?: number): string
```

**Parameters:**
- `text: string` - The text to wrap
- `maxChars?: number` - Maximum characters per line (default: 20)

**Returns:**
- `string` - Text with line breaks (`<br/>` tags) inserted

**Features:**
- Preserves existing line breaks
- Handles long words by breaking them
- Uses `<br/>` tags for Mermaid compatibility

**Example:**
```typescript
import { wrapLabel } from '@readable/mermaid';

const longText = "This is a very long label that needs to be wrapped";
const wrapped = wrapLabel(longText, 15);
console.log(wrapped);
// Output: "This is a very<br/>long label that<br/>needs to be<br/>wrapped"
```

---

## 📤 Export Functions

### exportSVG

Exports an SVG element as an SVG data URL.

```typescript
function exportSVG(
  svgElement: SVGElement,
  options?: ExportOptions
): Promise<string>
```

**Parameters:**
- `svgElement: SVGElement` - The SVG element to export
- `options?: ExportOptions` - Export configuration

**Returns:**
- `Promise<string>` - SVG data URL

**Example:**
```typescript
import { exportSVG } from '@readable/mermaid';

const svgElement = document.querySelector('.readable-mermaid svg');
const dataUrl = await exportSVG(svgElement, {
  backgroundColor: 'white'
});
```

---

### exportPNG

Exports an SVG element as a PNG data URL.

```typescript
function exportPNG(
  svgElement: SVGElement,
  options?: ExportOptions
): Promise<string>
```

**Parameters:**
- `svgElement: SVGElement` - The SVG element to export
- `options?: ExportOptions` - Export configuration

**Returns:**
- `Promise<string>` - PNG data URL

**Example:**
```typescript
import { exportPNG } from '@readable/mermaid';

const svgElement = document.querySelector('.readable-mermaid svg');
const dataUrl = await exportPNG(svgElement, {
  scale: 2,  // High DPI
  backgroundColor: 'white'
});
```

---

### exportAndDownloadSVG

Exports an SVG element and triggers a download.

```typescript
function exportAndDownloadSVG(
  svgElement: SVGElement,
  filename?: string,
  options?: Omit<ExportOptions, 'format'>
): Promise<void>
```

**Parameters:**
- `svgElement: SVGElement` - The SVG element to export
- `filename?: string` - Download filename (default: 'diagram.svg')
- `options?: ExportOptions` - Export configuration (excluding format)

**Example:**
```typescript
import { exportAndDownloadSVG } from '@readable/mermaid';

const svgElement = document.querySelector('.readable-mermaid svg');
await exportAndDownloadSVG(svgElement, 'my-architecture.svg');
```

---

### exportAndDownloadPNG

Exports an SVG element as PNG and triggers a download.

```typescript
function exportAndDownloadPNG(
  svgElement: SVGElement,
  filename?: string,
  options?: Omit<ExportOptions, 'format'>
): Promise<void>
```

**Parameters:**
- `svgElement: SVGElement` - The SVG element to export
- `filename?: string` - Download filename (default: 'diagram.png')
- `options?: ExportOptions` - Export configuration (excluding format)

**Example:**
```typescript
import { exportAndDownloadPNG } from '@readable/mermaid';

const svgElement = document.querySelector('.readable-mermaid svg');
await exportAndDownloadPNG(svgElement, 'my-architecture.png', {
  scale: 3,
  backgroundColor: '#f8fafc'
});
```

---

### downloadDataUrl

Downloads a data URL as a file.

```typescript
function downloadDataUrl(dataUrl: string, filename: string): void
```

**Parameters:**
- `dataUrl: string` - The data URL to download
- `filename: string` - The filename for the download

**Example:**
```typescript
import { downloadDataUrl } from '@readable/mermaid';

const dataUrl = 'data:image/svg+xml;base64,...';
downloadDataUrl(dataUrl, 'my-diagram.svg');
```

---

## 🎯 Interactivity Utilities

### createPanZoomState

Creates an initial pan/zoom state object.

```typescript
function createPanZoomState(): PanZoomState
```

**Returns:**
- `PanZoomState` - Initial state with default values

**Example:**
```typescript
import { createPanZoomState } from '@readable/mermaid';

const initialState = createPanZoomState();
console.log(initialState);
// Output: { scale: 1, translateX: 0, translateY: 0, isDragging: false, ... }
```

---

### applyTransform

Applies pan/zoom transformation to an SVG element.

```typescript
function applyTransform(element: SVGElement, state: PanZoomState): void
```

**Parameters:**
- `element: SVGElement` - The SVG element to transform
- `state: PanZoomState` - The transformation state to apply

**Example:**
```typescript
import { applyTransform } from '@readable/mermaid';

const svgElement = document.querySelector('svg');
const state = { scale: 1.5, translateX: 100, translateY: 50, ... };
applyTransform(svgElement, state);
```

---

### fitToContainer

Calculates transformation to fit diagram within container bounds.

```typescript
function fitToContainer(
  svgElement: SVGElement,
  containerElement: HTMLElement,
  padding?: number
): PanZoomState
```

**Parameters:**
- `svgElement: SVGElement` - The SVG element to fit
- `containerElement: HTMLElement` - The container element
- `padding?: number` - Padding around the diagram (default: 20)

**Returns:**
- `PanZoomState` - Transformation state to fit the diagram

**Example:**
```typescript
import { fitToContainer, applyTransform } from '@readable/mermaid';

const svg = document.querySelector('svg');
const container = document.querySelector('.diagram-container');
const fitState = fitToContainer(svg, container, 30);
applyTransform(svg, fitState);
```

---

### resetTransform

Creates a reset transformation state (scale: 1, no translation).

```typescript
function resetTransform(): PanZoomState
```

**Returns:**
- `PanZoomState` - Reset transformation state

**Example:**
```typescript
import { resetTransform, applyTransform } from '@readable/mermaid';

const svg = document.querySelector('svg');
const resetState = resetTransform();
applyTransform(svg, resetState);
```

---

## 📊 ExportOptions Interface

Configuration options for export functions.

```typescript
interface ExportOptions {
  format: 'svg' | 'png';
  filename?: string;
  backgroundColor?: string;
  scale?: number;
}
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `format` | `'svg' \| 'png'` | - | Export format |
| `filename` | `string` | `'diagram.svg'` or `'diagram.png'` | Output filename |
| `backgroundColor` | `string` | `transparent` | Background color for export |
| `scale` | `number` | `1` | Scale factor for PNG export (higher = better quality) |

### Examples

```typescript
// High-quality PNG export
const pngOptions: ExportOptions = {
  format: 'png',
  scale: 3,
  backgroundColor: 'white'
};

// SVG with custom background
const svgOptions: ExportOptions = {
  format: 'svg',
  backgroundColor: '#f8fafc'
};
```

---

## 🎨 PanZoomState Interface

State object for pan/zoom transformations.

```typescript
interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `scale` | `number` | Current zoom level (1.0 = 100%) |
| `translateX` | `number` | Horizontal translation in pixels |
| `translateY` | `number` | Vertical translation in pixels |
| `isDragging` | `boolean` | Whether user is currently dragging |
| `lastMouseX` | `number` | Last recorded mouse X position |
| `lastMouseY` | `number` | Last recorded mouse Y position |

---

## 🔧 Usage Patterns

### Validation Pipeline

Create a robust validation pipeline for user-generated specs:

```typescript
import { validateSpec, makeMermaid } from '@readable/mermaid';

const processUserSpec = (userInput: any): { 
  success: boolean; 
  result?: string; 
  errors?: string[] 
} => {
  try {
    // Basic type checking
    if (!userInput || typeof userInput !== 'object') {
      return { success: false, errors: ['Invalid input format'] };
    }

    // Validate structure
    const errors = validateSpec(userInput as ReadableSpec);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Generate Mermaid code
    const mermaidCode = makeMermaid(userInput as ReadableSpec);
    return { success: true, result: mermaidCode };

  } catch (error) {
    return { 
      success: false, 
      errors: [error instanceof Error ? error.message : 'Unknown error'] 
    };
  }
};
```

### Export Workflow

Implement a complete export workflow with error handling:

```typescript
import { exportSVG, exportPNG, downloadDataUrl } from '@readable/mermaid';

const exportDiagram = async (
  format: 'svg' | 'png',
  filename: string,
  options: Partial<ExportOptions> = {}
): Promise<boolean> => {
  try {
    const svgElement = document.querySelector('.readable-mermaid svg') as SVGElement;
    
    if (!svgElement) {
      throw new Error('No diagram found to export');
    }

    let dataUrl: string;
    
    if (format === 'svg') {
      dataUrl = await exportSVG(svgElement, { ...options, format });
    } else {
      dataUrl = await exportPNG(svgElement, { 
        scale: 2, 
        backgroundColor: 'white',
        ...options, 
        format 
      });
    }

    downloadDataUrl(dataUrl, filename);
    return true;

  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

// Usage
const success = await exportDiagram('png', 'architecture-diagram.png');
if (success) {
  console.log('Export completed successfully');
}
```

### Interactive Pan/Zoom Implementation

Build custom pan/zoom controls:

```typescript
import { 
  createPanZoomState, 
  applyTransform, 
  fitToContainer, 
  resetTransform 
} from '@readable/mermaid';

class DiagramController {
  private state: PanZoomState;
  private svgElement: SVGElement;
  private containerElement: HTMLElement;

  constructor(svgElement: SVGElement, containerElement: HTMLElement) {
    this.svgElement = svgElement;
    this.containerElement = containerElement;
    this.state = createPanZoomState();
    this.setupEventListeners();
  }

  fit(): void {
    this.state = fitToContainer(this.svgElement, this.containerElement);
    this.applyCurrentTransform();
  }

  reset(): void {
    this.state = resetTransform();
    this.applyCurrentTransform();
  }

  zoom(factor: number): void {
    this.state = {
      ...this.state,
      scale: Math.max(0.1, Math.min(5, this.state.scale * factor))
    };
    this.applyCurrentTransform();
  }

  private applyCurrentTransform(): void {
    applyTransform(this.svgElement, this.state);
  }

  private setupEventListeners(): void {
    // Implement mouse and touch event handlers
    // ... event handling code
  }
}
```

This utility functions API reference provides all the tools needed for advanced diagram manipulation, export functionality, and custom interactivity implementation.
