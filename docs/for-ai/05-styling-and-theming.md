# AI Agent Guide: Styling and Visual Experience

## Built-in Accessible Design

Srndpty comes with accessibility-first defaults that ensure optimal visual experience:

### Default Theme Variables
```typescript
// Automatically applied theme variables
{
  fontSize: '16px',                    // Minimum readable font size
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  primaryColor: '#f0f9ff',            // Light blue background
  primaryTextColor: '#0f172a',        // High contrast dark text
  primaryBorderColor: '#0ea5e9',      // Blue borders
  lineColor: '#64748b',               // Gray connection lines
}
```

### Automatic Features
- **Label Wrapping**: Long labels automatically wrap at 20 characters
- **Generous Spacing**: Adequate padding between elements
- **High Contrast**: Colors meet WCAG accessibility standards
- **Responsive Text**: Font sizes scale appropriately
- **Modern Typography**: System font stack for optimal readability

## Theme Selection

### Available Themes
```typescript
interface ReadableSpec {
  theme?: 'default' | 'dark' | 'neutral' | 'forest' | 'base';
}
```

#### Default Theme
```json
{
  "type": "flow",
  "theme": "default",
  "nodes": [...]
}
```
- Light background with blue accents
- High contrast black text
- Professional appearance
- Best for: Business diagrams, documentation

#### Dark Theme
```json
{
  "type": "flow", 
  "theme": "dark",
  "nodes": [...]
}
```
- Dark background with light text
- Blue/cyan accents
- Reduced eye strain
- Best for: Development environments, presentations

#### Neutral Theme
```json
{
  "type": "flow",
  "theme": "neutral", 
  "nodes": [...]
}
```
- Grayscale color palette
- Minimal visual distractions
- Clean, professional look
- Best for: Technical documentation, wireframes

#### Forest Theme
```json
{
  "type": "flow",
  "theme": "forest",
  "nodes": [...]
}
```
- Green color palette
- Nature-inspired colors
- Calming appearance
- Best for: Environmental topics, organic processes

#### Base Theme
```json
{
  "type": "flow",
  "theme": "base",
  "nodes": [...]
}
```
- Minimal styling
- Clean, simple appearance
- Maximum customization potential
- Best for: Custom styling, branding

## Custom CSS Classes

### Node-Level Styling
```json
{
  "nodes": [
    {
      "id": "critical-service",
      "label": "Critical Service",
      "className": "critical-node"
    },
    {
      "id": "optional-service", 
      "label": "Optional Service",
      "className": "optional-node"
    }
  ]
}
```

```css
/* Custom node styles */
.critical-node {
  fill: #fef2f2 !important;
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
}

.critical-node text {
  fill: #7f1d1d !important;
  font-weight: bold !important;
}

.optional-node {
  fill: #f0f9ff !important;
  stroke: #0ea5e9 !important;
  stroke-dasharray: 5,5 !important;
}

.optional-node text {
  fill: #0c4a6e !important;
  font-style: italic !important;
}
```

### Edge-Level Styling
```json
{
  "edges": [
    {
      "from": "api",
      "to": "db",
      "label": "critical path",
      "className": "critical-edge"
    },
    {
      "from": "api", 
      "to": "cache",
      "label": "optional",
      "className": "optional-edge"
    }
  ]
}
```

```css
/* Custom edge styles */
.critical-edge {
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
  marker-end: url(#critical-arrowhead) !important;
}

.optional-edge {
  stroke: #6b7280 !important;
  stroke-dasharray: 8,4 !important;
  opacity: 0.7 !important;
}

.critical-edge text {
  fill: #7f1d1d !important;
  font-weight: bold !important;
  font-size: 14px !important;
}
```

### Container-Level Styling
```tsx
// React
<Srndpty 
  spec={spec}
  options={{
    className: 'custom-diagram',
    style: {
      backgroundColor: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  }}
/>
```

```javascript
// Vanilla JS
const diagram = await renderDiagram(spec, {
  container: '#diagram',
  className: 'custom-diagram',
  style: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
});
```

```css
.custom-diagram {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.custom-diagram svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
```

## Advanced Styling Patterns

### Status-Based Node Styling
```json
{
  "nodes": [
    {
      "id": "healthy-service",
      "label": "API Server",
      "className": "status-healthy",
      "meta": { "status": "healthy" }
    },
    {
      "id": "warning-service", 
      "label": "Cache Server",
      "className": "status-warning",
      "meta": { "status": "warning" }
    },
    {
      "id": "error-service",
      "label": "Queue Server", 
      "className": "status-error",
      "meta": { "status": "error" }
    }
  ]
}
```

```css
/* Status-based styling */
.status-healthy {
  fill: #f0fdf4 !important;
  stroke: #16a34a !important;
  stroke-width: 2px !important;
}

.status-healthy text {
  fill: #15803d !important;
}

.status-warning {
  fill: #fffbeb !important;
  stroke: #d97706 !important;
  stroke-width: 2px !important;
}

.status-warning text {
  fill: #92400e !important;
}

.status-error {
  fill: #fef2f2 !important;
  stroke: #dc2626 !important;
  stroke-width: 3px !important;
  animation: pulse-error 2s infinite;
}

.status-error text {
  fill: #7f1d1d !important;
  font-weight: bold !important;
}

@keyframes pulse-error {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Interactive Hover States
```css
/* Enhanced hover effects */
.diagram-node {
  transition: all 0.2s ease;
  cursor: pointer;
}

.diagram-node:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.diagram-node:hover text {
  font-weight: bold;
}

/* Edge hover effects */
.diagram-edge {
  transition: all 0.2s ease;
  cursor: pointer;
}

.diagram-edge:hover {
  stroke-width: 3px !important;
  opacity: 1 !important;
}

.diagram-edge:hover text {
  font-weight: bold;
  font-size: 14px !important;
}
```

### Gradient Backgrounds
```css
/* Gradient node backgrounds */
.gradient-primary {
  fill: url(#primaryGradient) !important;
}

.gradient-secondary {
  fill: url(#secondaryGradient) !important;
}

/* Define gradients in SVG */
.custom-diagram svg defs {
  /* Added via JavaScript after render */
}
```

```javascript
// Add gradients after diagram renders
function addCustomGradients(svgElement) {
  const defs = svgElement.querySelector('defs') || svgElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'));
  
  // Primary gradient
  const primaryGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  primaryGrad.id = 'primaryGradient';
  primaryGrad.innerHTML = `
    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
  `;
  defs.appendChild(primaryGrad);
  
  // Secondary gradient  
  const secondaryGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  secondaryGrad.id = 'secondaryGradient';
  secondaryGrad.innerHTML = `
    <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
  `;
  defs.appendChild(secondaryGrad);
}

// Apply after diagram renders
const diagram = await renderDiagram(spec, options);
addCustomGradients(diagram.svgElement);
```

## Responsive Design

### Container Responsiveness
```css
.responsive-diagram {
  width: 100%;
  height: 60vh;
  min-height: 400px;
  max-height: 800px;
}

@media (max-width: 768px) {
  .responsive-diagram {
    height: 50vh;
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .responsive-diagram {
    height: 40vh;
    min-height: 250px;
  }
}
```

### Font Size Scaling
```css
/* Responsive font sizes */
@media (max-width: 768px) {
  .custom-diagram text {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  .custom-diagram text {
    font-size: 12px !important;
  }
  
  .custom-diagram .node-label {
    font-size: 11px !important;
  }
}
```

### Mobile-Optimized Interactions
```css
/* Touch-friendly interactions */
@media (max-width: 768px) {
  .diagram-node {
    stroke-width: 3px !important; /* Thicker borders for touch */
  }
  
  .diagram-node text {
    font-weight: 600 !important; /* Bolder text for readability */
  }
  
  /* Larger touch targets */
  .diagram-node {
    transform: scale(1.1);
    transform-origin: center;
  }
}
```

## Dark Mode Support

### CSS Custom Properties Approach
```css
:root {
  --diagram-bg: #ffffff;
  --diagram-text: #1f2937;
  --diagram-border: #e5e7eb;
  --diagram-accent: #3b82f6;
  --diagram-node-bg: #f9fafb;
}

[data-theme="dark"] {
  --diagram-bg: #1f2937;
  --diagram-text: #f9fafb;
  --diagram-border: #374151;
  --diagram-accent: #60a5fa;
  --diagram-node-bg: #374151;
}

.themed-diagram {
  background-color: var(--diagram-bg);
  border: 1px solid var(--diagram-border);
}

.themed-diagram .diagram-node {
  fill: var(--diagram-node-bg) !important;
  stroke: var(--diagram-border) !important;
}

.themed-diagram .diagram-node text {
  fill: var(--diagram-text) !important;
}

.themed-diagram .diagram-edge {
  stroke: var(--diagram-accent) !important;
}
```

### JavaScript Theme Switching
```javascript
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Re-render diagram with appropriate theme
  const spec = {
    ...currentSpec,
    theme: theme === 'dark' ? 'dark' : 'default'
  };
  
  updateDiagram(spec);
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});
```

## Animation and Transitions

### Node Entrance Animations
```css
@keyframes nodeEnter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.diagram-node {
  animation: nodeEnter 0.3s ease-out;
}

/* Staggered animation for multiple nodes */
.diagram-node:nth-child(1) { animation-delay: 0.1s; }
.diagram-node:nth-child(2) { animation-delay: 0.2s; }
.diagram-node:nth-child(3) { animation-delay: 0.3s; }
```

### Edge Drawing Animation
```css
@keyframes edgeDraw {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

.diagram-edge {
  animation: edgeDraw 1s ease-in-out;
}
```

### Loading States
```css
.diagram-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
}

.diagram-loading::after {
  content: '';
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Print Styles

### Print-Optimized CSS
```css
@media print {
  .custom-diagram {
    background: white !important;
    border: 1px solid #000 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
  
  .diagram-node {
    fill: white !important;
    stroke: #000 !important;
    stroke-width: 1px !important;
  }
  
  .diagram-node text {
    fill: #000 !important;
    font-size: 12px !important;
  }
  
  .diagram-edge {
    stroke: #000 !important;
    stroke-width: 1px !important;
  }
  
  .diagram-edge text {
    fill: #000 !important;
    font-size: 10px !important;
  }
  
  /* Hide interactive elements */
  .diagram-controls {
    display: none !important;
  }
}
```

## Accessibility Enhancements

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .diagram-node {
    stroke-width: 3px !important;
    fill: white !important;
    stroke: #000 !important;
  }
  
  .diagram-node text {
    fill: #000 !important;
    font-weight: bold !important;
  }
  
  .diagram-edge {
    stroke: #000 !important;
    stroke-width: 2px !important;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .diagram-node,
  .diagram-edge {
    animation: none !important;
    transition: none !important;
  }
  
  .diagram-node:hover {
    transform: none !important;
  }
}
```

### Focus Indicators
```css
.diagram-node:focus,
.diagram-edge:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.diagram-node:focus-visible {
  stroke: #3b82f6 !important;
  stroke-width: 3px !important;
}
```

## Performance Optimization

### CSS Containment
```css
.custom-diagram {
  contain: layout style paint;
}

.diagram-node {
  contain: layout paint;
}
```

### Hardware Acceleration
```css
.diagram-node {
  will-change: transform;
  transform: translateZ(0);
}

.diagram-edge {
  will-change: stroke-width;
}
```

### Efficient Selectors
```css
/* Efficient - targets specific classes */
.status-error { /* styles */ }
.status-warning { /* styles */ }

/* Avoid - expensive universal selectors */
.custom-diagram * { /* avoid */ }
.custom-diagram [class*="status"] { /* less efficient */ }
```
