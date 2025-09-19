# AI Agent Guide: Vanilla JavaScript Implementation

## Core Vanilla API

The vanilla JavaScript API provides framework-agnostic diagram rendering:

```javascript
import { createDiagram, renderDiagram } from 'srndpty';
// or
import ReadableMermaid from 'srndpty';
```

## API Functions

### createDiagram()
Creates a diagram instance without rendering:

```javascript
import { createDiagram } from 'srndpty';

const diagram = createDiagram(spec, options);
await diagram.render();
```

### renderDiagram()
Creates and immediately renders a diagram:

```javascript
import { renderDiagram } from 'srndpty';

const diagram = await renderDiagram(spec, options);
```

### Universal API (Auto-Detection)
```javascript
import ReadableMermaid from 'srndpty';

// Automatically detects environment and uses appropriate API
const diagram = await ReadableMermaid.render(spec, options);
```

## Options Interface

```typescript
interface VanillaRenderOptions {
  container: string | HTMLElement;     // Target container (required)
  width?: number;                      // Container width in pixels
  height?: number;                     // Container height in pixels
  enablePanZoom?: boolean;             // Enable pan/zoom (default: true)
  enableExport?: boolean;              // Enable export functionality
  onNodeClick?: (nodeId: string, node: ReadableNode) => void;
  onEdgeClick?: (edge: ReadableEdge) => void;
  className?: string;                  // CSS class for container
  style?: Partial<CSSStyleDeclaration>; // Inline styles
}
```

## DiagramInstance Interface

```typescript
interface DiagramInstance {
  container: HTMLElement;
  svgElement: SVGElement | null;
  spec: ReadableSpec;
  options: VanillaRenderOptions;
  
  // Methods
  render(): Promise<void>;             // Render the diagram
  fit(): void;                         // Fit to container
  reset(): void;                       // Reset zoom/pan
  zoomIn(): void;                      // Zoom in
  zoomOut(): void;                     // Zoom out
  exportSVG(filename?: string): Promise<void>;
  exportPNG(filename?: string): Promise<void>;
  destroy(): void;                     // Clean up
}
```

## Basic Usage Examples

### Simple Rendering
```javascript
import { renderDiagram } from 'srndpty';

const spec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'start', label: 'Start', shape: 'stadium' },
    { id: 'process', label: 'Process Data' },
    { id: 'end', label: 'End', shape: 'stadium' }
  ],
  edges: [
    { from: 'start', to: 'process', label: 'begin' },
    { from: 'process', to: 'end', label: 'finish' }
  ]
};

// Render to a container
const diagram = await renderDiagram(spec, {
  container: '#diagram-container',
  width: 800,
  height: 400
});

console.log('Diagram rendered successfully');
```

### With Click Handlers
```javascript
import { renderDiagram } from 'srndpty';

const spec = {
  type: 'flow',
  nodes: [
    { 
      id: 'api', 
      label: 'API Server',
      meta: {
        port: 3000,
        status: 'healthy',
        uptime: '99.9%'
      }
    },
    { 
      id: 'db', 
      label: 'Database', 
      shape: 'cylinder',
      meta: {
        type: 'postgresql',
        connections: 45
      }
    }
  ],
  edges: [
    { 
      from: 'api', 
      to: 'db', 
      label: 'queries',
      meta: {
        avgLatency: '15ms'
      }
    }
  ]
};

const diagram = await renderDiagram(spec, {
  container: '#my-diagram',
  enablePanZoom: true,
  onNodeClick: (nodeId, node) => {
    console.log(`Clicked: ${nodeId}`);
    console.log('Metadata:', node.meta);
    
    // Show details in a popup or sidebar
    showNodeDetails(node);
  },
  onEdgeClick: (edge) => {
    console.log(`Edge: ${edge.from} -> ${edge.to}`);
    if (edge.meta) {
      alert(`Latency: ${edge.meta.avgLatency}`);
    }
  }
});

function showNodeDetails(node) {
  const modal = document.getElementById('node-modal');
  modal.querySelector('.node-title').textContent = node.label;
  modal.querySelector('.node-details').innerHTML = `
    <p>Status: ${node.meta?.status || 'Unknown'}</p>
    <p>Port: ${node.meta?.port || 'N/A'}</p>
    <p>Uptime: ${node.meta?.uptime || 'N/A'}</p>
  `;
  modal.style.display = 'block';
}
```

### Programmatic Control
```javascript
import { createDiagram } from 'srndpty';

const diagram = createDiagram(spec, {
  container: '#diagram-container',
  enablePanZoom: true
});

// Render the diagram
await diagram.render();

// Add control buttons
document.getElementById('fit-btn').addEventListener('click', () => {
  diagram.fit();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  diagram.reset();
});

document.getElementById('zoom-in-btn').addEventListener('click', () => {
  diagram.zoomIn();
});

document.getElementById('zoom-out-btn').addEventListener('click', () => {
  diagram.zoomOut();
});

document.getElementById('export-svg-btn').addEventListener('click', async () => {
  try {
    await diagram.exportSVG('my-diagram.svg');
    console.log('SVG exported successfully');
  } catch (error) {
    console.error('Export failed:', error);
  }
});

document.getElementById('export-png-btn').addEventListener('click', async () => {
  try {
    await diagram.exportPNG('my-diagram.png');
    console.log('PNG exported successfully');
  } catch (error) {
    console.error('Export failed:', error);
  }
});
```

## HTML Integration Examples

### Basic HTML Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagram Example</title>
  <style>
    #diagram-container {
      width: 100%;
      height: 500px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .controls {
      margin: 16px 0;
      display: flex;
      gap: 8px;
    }
    
    .controls button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    .controls button:hover {
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <h1>Interactive Diagram</h1>
  
  <div class="controls">
    <button id="fit-btn">Fit to Container</button>
    <button id="reset-btn">Reset View</button>
    <button id="zoom-in-btn">Zoom In</button>
    <button id="zoom-out-btn">Zoom Out</button>
    <button id="export-svg-btn">Export SVG</button>
    <button id="export-png-btn">Export PNG</button>
  </div>
  
  <div id="diagram-container"></div>
  
  <!-- Node Details Modal -->
  <div id="node-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000;">
    <h3 class="node-title"></h3>
    <div class="node-details"></div>
    <button onclick="document.getElementById('node-modal').style.display='none'">Close</button>
  </div>
  
  <!-- Overlay for modal -->
  <div id="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999;"></div>

  <script type="module">
    import { renderDiagram } from 'https://unpkg.com/srndpty@latest/dist/index.js';
    
    const spec = {
      type: 'flow',
      direction: 'TB',
      nodes: [
        { id: 'user', label: 'User', shape: 'circle' },
        { id: 'app', label: 'Web Application' },
        { id: 'api', label: 'API Gateway', shape: 'hexagon' },
        { id: 'auth', label: 'Auth Service' },
        { id: 'db', label: 'Database', shape: 'cylinder' }
      ],
      edges: [
        { from: 'user', to: 'app', label: 'interacts' },
        { from: 'app', to: 'api', label: 'requests' },
        { from: 'api', to: 'auth', label: 'authenticate' },
        { from: 'api', to: 'db', label: 'query' }
      ]
    };
    
    const diagram = await renderDiagram(spec, {
      container: '#diagram-container',
      enablePanZoom: true,
      onNodeClick: (nodeId, node) => {
        const modal = document.getElementById('node-modal');
        const overlay = document.getElementById('modal-overlay');
        
        modal.querySelector('.node-title').textContent = node.label;
        modal.querySelector('.node-details').innerHTML = `
          <p><strong>ID:</strong> ${node.id}</p>
          <p><strong>Shape:</strong> ${node.shape || 'rectangle'}</p>
          <p><strong>Type:</strong> ${node.meta?.type || 'Unknown'}</p>
        `;
        
        modal.style.display = 'block';
        overlay.style.display = 'block';
      }
    });
    
    // Setup controls
    document.getElementById('fit-btn').addEventListener('click', () => diagram.fit());
    document.getElementById('reset-btn').addEventListener('click', () => diagram.reset());
    document.getElementById('zoom-in-btn').addEventListener('click', () => diagram.zoomIn());
    document.getElementById('zoom-out-btn').addEventListener('click', () => diagram.zoomOut());
    document.getElementById('export-svg-btn').addEventListener('click', () => diagram.exportSVG());
    document.getElementById('export-png-btn').addEventListener('click', () => diagram.exportPNG());
    
    // Close modal when clicking overlay
    document.getElementById('modal-overlay').addEventListener('click', () => {
      document.getElementById('node-modal').style.display = 'none';
      document.getElementById('modal-overlay').style.display = 'none';
    });
  </script>
</body>
</html>
```

### Dynamic Diagram Builder
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dynamic Diagram Builder</title>
  <style>
    .builder {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }
    
    .controls {
      width: 300px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .diagram-area {
      flex: 1;
      height: 600px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .form-group {
      margin: 12px 0;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: bold;
    }
    
    .form-group input, 
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .form-group button {
      width: 100%;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .form-group button:hover {
      background: #0056b3;
    }
    
    .node-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 8px;
    }
    
    .node-item {
      padding: 4px 8px;
      margin: 2px 0;
      background: #f8f9fa;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .remove-btn {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 2px;
      padding: 2px 6px;
      cursor: pointer;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>Dynamic Diagram Builder</h1>
  
  <div class="builder">
    <div class="controls">
      <h3>Add Node</h3>
      <div class="form-group">
        <label>Node ID:</label>
        <input type="text" id="node-id" placeholder="e.g., user-service">
      </div>
      <div class="form-group">
        <label>Node Label:</label>
        <input type="text" id="node-label" placeholder="e.g., User Service">
      </div>
      <div class="form-group">
        <label>Node Shape:</label>
        <select id="node-shape">
          <option value="rect">Rectangle</option>
          <option value="round">Round</option>
          <option value="stadium">Stadium</option>
          <option value="cylinder">Cylinder</option>
          <option value="circle">Circle</option>
          <option value="diamond">Diamond</option>
          <option value="hexagon">Hexagon</option>
        </select>
      </div>
      <div class="form-group">
        <button onclick="addNode()">Add Node</button>
      </div>
      
      <h3>Current Nodes</h3>
      <div id="node-list" class="node-list"></div>
      
      <h3>Add Edge</h3>
      <div class="form-group">
        <label>From:</label>
        <select id="edge-from"></select>
      </div>
      <div class="form-group">
        <label>To:</label>
        <select id="edge-to"></select>
      </div>
      <div class="form-group">
        <label>Label (optional):</label>
        <input type="text" id="edge-label" placeholder="e.g., requests">
      </div>
      <div class="form-group">
        <button onclick="addEdge()">Add Edge</button>
      </div>
      
      <h3>Diagram Options</h3>
      <div class="form-group">
        <label>Direction:</label>
        <select id="direction" onchange="updateDiagram()">
          <option value="TB">Top to Bottom</option>
          <option value="LR">Left to Right</option>
          <option value="BT">Bottom to Top</option>
          <option value="RL">Right to Left</option>
        </select>
      </div>
      
      <div class="form-group">
        <button onclick="clearDiagram()">Clear All</button>
      </div>
    </div>
    
    <div id="diagram-container" class="diagram-area"></div>
  </div>

  <script type="module">
    import { renderDiagram } from 'https://unpkg.com/srndpty@latest/dist/index.js';
    
    let currentDiagram = null;
    let nodes = [];
    let edges = [];
    
    window.addNode = function() {
      const id = document.getElementById('node-id').value.trim();
      const label = document.getElementById('node-label').value.trim();
      const shape = document.getElementById('node-shape').value;
      
      if (!id || !label) {
        alert('Please enter both ID and label');
        return;
      }
      
      if (nodes.find(n => n.id === id)) {
        alert('Node with this ID already exists');
        return;
      }
      
      const node = { id, label, shape: shape === 'rect' ? undefined : shape };
      nodes.push(node);
      
      // Clear inputs
      document.getElementById('node-id').value = '';
      document.getElementById('node-label').value = '';
      
      updateNodeList();
      updateEdgeSelects();
      updateDiagram();
    };
    
    window.addEdge = function() {
      const from = document.getElementById('edge-from').value;
      const to = document.getElementById('edge-to').value;
      const label = document.getElementById('edge-label').value.trim();
      
      if (!from || !to) {
        alert('Please select both from and to nodes');
        return;
      }
      
      if (from === to) {
        alert('Cannot connect node to itself');
        return;
      }
      
      if (edges.find(e => e.from === from && e.to === to)) {
        alert('Edge already exists');
        return;
      }
      
      const edge = { from, to };
      if (label) edge.label = label;
      
      edges.push(edge);
      
      // Clear inputs
      document.getElementById('edge-label').value = '';
      
      updateDiagram();
    };
    
    window.removeNode = function(nodeId) {
      nodes = nodes.filter(n => n.id !== nodeId);
      edges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);
      
      updateNodeList();
      updateEdgeSelects();
      updateDiagram();
    };
    
    window.clearDiagram = function() {
      nodes = [];
      edges = [];
      
      updateNodeList();
      updateEdgeSelects();
      updateDiagram();
    };
    
    window.updateDiagram = async function() {
      if (nodes.length === 0) {
        document.getElementById('diagram-container').innerHTML = 
          '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Add some nodes to get started</div>';
        return;
      }
      
      const direction = document.getElementById('direction').value;
      
      const spec = {
        type: 'flow',
        direction,
        nodes: [...nodes],
        edges: [...edges]
      };
      
      try {
        if (currentDiagram) {
          currentDiagram.destroy();
        }
        
        currentDiagram = await renderDiagram(spec, {
          container: '#diagram-container',
          enablePanZoom: true,
          onNodeClick: (nodeId, node) => {
            alert(`Clicked: ${node.label} (${nodeId})`);
          }
        });
      } catch (error) {
        console.error('Failed to render diagram:', error);
        document.getElementById('diagram-container').innerHTML = 
          `<div style="padding: 20px; color: red;">Error: ${error.message}</div>`;
      }
    };
    
    function updateNodeList() {
      const list = document.getElementById('node-list');
      list.innerHTML = nodes.map(node => `
        <div class="node-item">
          <span>${node.label} (${node.id})</span>
          <button class="remove-btn" onclick="removeNode('${node.id}')">×</button>
        </div>
      `).join('');
    }
    
    function updateEdgeSelects() {
      const fromSelect = document.getElementById('edge-from');
      const toSelect = document.getElementById('edge-to');
      
      const options = nodes.map(node => 
        `<option value="${node.id}">${node.label}</option>`
      ).join('');
      
      fromSelect.innerHTML = '<option value="">Select node...</option>' + options;
      toSelect.innerHTML = '<option value="">Select node...</option>' + options;
    }
    
    // Initialize
    updateNodeList();
    updateEdgeSelects();
    updateDiagram();
  </script>
</body>
</html>
```

## Advanced Patterns

### Multiple Diagrams on One Page
```javascript
import { renderDiagram } from 'srndpty';

const diagrams = [
  {
    container: '#diagram-1',
    spec: { /* first diagram spec */ }
  },
  {
    container: '#diagram-2', 
    spec: { /* second diagram spec */ }
  }
];

const instances = await Promise.all(
  diagrams.map(({ container, spec }) => 
    renderDiagram(spec, { container, enablePanZoom: true })
  )
);

console.log(`Rendered ${instances.length} diagrams`);
```

### Responsive Diagrams
```javascript
function createResponsiveDiagram(spec, container) {
  let diagram = null;
  
  async function render() {
    const containerEl = document.querySelector(container);
    const rect = containerEl.getBoundingClientRect();
    
    if (diagram) {
      diagram.destroy();
    }
    
    diagram = await renderDiagram(spec, {
      container,
      width: rect.width,
      height: rect.height,
      enablePanZoom: true
    });
  }
  
  // Initial render
  render();
  
  // Re-render on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(render, 250);
  });
  
  return diagram;
}

// Usage
const responsiveDiagram = createResponsiveDiagram(spec, '#responsive-container');
```

### Error Handling
```javascript
import { renderDiagram, validateSpec } from 'srndpty';

async function safeRenderDiagram(spec, options) {
  try {
    // Validate spec first
    const errors = validateSpec(spec);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    // Render diagram
    const diagram = await renderDiagram(spec, options);
    return { success: true, diagram };
    
  } catch (error) {
    console.error('Failed to render diagram:', error);
    
    // Show error in container
    const container = typeof options.container === 'string' 
      ? document.querySelector(options.container)
      : options.container;
      
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0;">Diagram Error</h4>
          <p style="margin: 0; font-size: 14px;">${error.message}</p>
        </div>
      `;
    }
    
    return { success: false, error: error.message };
  }
}

// Usage
const result = await safeRenderDiagram(spec, { container: '#diagram' });
if (result.success) {
  console.log('Diagram rendered successfully');
} else {
  console.error('Rendering failed:', result.error);
}
```

## Integration with Build Tools

### Webpack
```javascript
// webpack.config.js
module.exports = {
  // ... other config
  resolve: {
    fallback: {
      // Required for Mermaid in browser environments
      "fs": false,
      "path": false
    }
  }
};
```

### Vite
```javascript
// vite.config.js
export default {
  // ... other config
  optimizeDeps: {
    include: ['srndpty']
  }
};
```

### Rollup
```javascript
// rollup.config.js
export default {
  // ... other config
  external: ['mermaid'], // Mark as external if needed
  output: {
    globals: {
      'mermaid': 'mermaid'
    }
  }
};
```
