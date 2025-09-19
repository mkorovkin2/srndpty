# AI Agent Documentation for Srndpty

This directory contains comprehensive documentation specifically designed for AI agents to understand and implement the Srndpty (Readable Mermaid) framework effectively.

## Documentation Structure

### 📚 **01-overview-and-setup.md**
- Project overview and architecture
- Installation and setup instructions
- Development environment configuration
- Package structure and dependencies
- Common setup issues and solutions

### 🎨 **02-json-schema-guide.md**
- Complete JSON schema reference
- Node shapes and their use cases
- Edge styles and meanings
- Advanced features (groups, legends, metadata)
- Schema validation and common errors

### ⚛️ **03-react-implementation.md**
- React component usage patterns
- Props and configuration options
- Ref methods for programmatic control
- State management integration
- Performance optimization techniques

### 🌐 **04-vanilla-javascript.md**
- Vanilla JavaScript API reference
- HTML integration examples
- Build tool configurations
- Event handling and interactivity
- Error handling patterns

### 🎭 **05-styling-and-theming.md**
- Built-in accessibility features
- Theme selection and customization
- CSS class-based styling
- Responsive design patterns
- Animation and visual effects

### 🔧 **06-integration-patterns.md**
- Universal framework usage
- Environment auto-detection
- State management integration (Redux, Zustand, Context)
- API integration patterns (REST, GraphQL)
- Real-time updates and WebSocket integration

### 💼 **07-common-use-cases.md**
- System architecture diagrams
- Data pipeline visualizations
- Business process flows
- Development workflows
- Interactive examples with code

## Quick Reference

### Core Imports
```typescript
// React
import { Srndpty } from 'srndpty';
import type { ReadableSpec, SrndptyOptions } from 'srndpty';

// Vanilla JS
import { renderDiagram, createDiagram } from 'srndpty';

// Universal
import ReadableMermaid from 'srndpty';
```

### Basic Spec Structure
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { "id": "a", "label": "Node A", "shape": "rect" }
  ],
  "edges": [
    { "from": "a", "to": "b", "label": "connection" }
  ]
}
```

### Essential Options
```typescript
{
  enablePanZoom: true,
  onNodeClick: (nodeId, node) => console.log(nodeId),
  onEdgeClick: (edge) => console.log(edge),
  width: 800,
  height: 600
}
```

## Key Features for AI Implementation

### 🌍 **Universal Framework**
- Automatic React vs vanilla environment detection
- Consistent API across all environments
- Framework-agnostic core functionality

### 📋 **JSON-First Schema**
- No need to learn Mermaid syntax
- Validated TypeScript interfaces
- Rich metadata support for interactivity

### ♿ **Accessibility Built-in**
- 16px+ fonts by default
- High contrast colors
- Keyboard navigation support
- WCAG compliance ready

### 🎯 **Interactive by Default**
- Built-in pan/zoom functionality
- Click handlers for nodes and edges
- Export capabilities (SVG/PNG)
- Programmatic control methods

### 🎨 **Beautiful Styling**
- Automatic label wrapping
- Professional color schemes
- Modern typography
- Customizable themes

## Implementation Guidelines

### For System Architecture Diagrams
1. Use `hexagon` for gateways/load balancers
2. Use `cylinder` for databases/storage
3. Use `circle` for external actors
4. Include technology stack in `meta`
5. Group related services

### For Data Pipelines
1. Use `stadium` for start/end points
2. Use `thick` edges for primary flows
3. Use `dotted` edges for async/optional flows
4. Include volume/frequency in labels
5. Use left-to-right direction

### For Business Processes
1. Use `diamond` for decision points
2. Include timing/SLA in `meta`
3. Use different edge styles for outcomes
4. Group process phases
5. Add legends for clarity

### For Interactive Applications
1. Implement click handlers for details
2. Use CSS classes for status styling
3. Update specs for real-time data
4. Provide export functionality
5. Handle errors gracefully

## Common Patterns

### Status-Based Styling
```css
.status-healthy { fill: #dcfce7 !important; stroke: #16a34a !important; }
.status-warning { fill: #fef3c7 !important; stroke: #d97706 !important; }
.status-error { fill: #fecaca !important; stroke: #dc2626 !important; }
```

### Click Handler with Details
```typescript
const handleNodeClick = (nodeId: string, node: ReadableNode) => {
  setSelectedNode(node);
  showDetailsPanel(node.meta);
};
```

### Dynamic Updates
```typescript
const updateNodeStatus = (nodeId: string, status: string) => {
  setSpec(prev => ({
    ...prev,
    nodes: prev.nodes.map(n => 
      n.id === nodeId 
        ? { ...n, className: `status-${status}`, meta: { ...n.meta, status } }
        : n
    )
  }));
};
```

## Best Practices

1. **Always validate specs** before rendering
2. **Use TypeScript** for type safety
3. **Handle errors gracefully** with boundaries
4. **Optimize for performance** with memoization
5. **Make diagrams accessible** with proper ARIA labels
6. **Test across environments** (React, vanilla, Node.js)
7. **Use meaningful metadata** for rich interactions
8. **Follow responsive design** principles
9. **Implement proper loading states**
10. **Provide export capabilities** for users

## Troubleshooting

### React Not Detected
Force React mode: `import { Srndpty } from 'srndpty';`

### Container Not Found
Ensure container exists before rendering

### Validation Errors
Use `validateSpec()` to check for issues

### Performance Issues
- Use `useMemo` for specs
- Implement virtualization for large diagrams
- Debounce updates

### Styling Issues
- Use `!important` for CSS overrides
- Check theme compatibility
- Verify class names are applied

## Support

For implementation questions or issues:
1. Check the specific guide for your use case
2. Review the TypeScript interfaces
3. Look at the demo application examples
4. Validate your spec structure
5. Test in a minimal environment first

---

This documentation is designed to provide AI agents with comprehensive, actionable information for implementing Srndpty effectively in any environment or use case.
