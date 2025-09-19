# 📋 JSON Schema Reference

Complete reference for the ReadableSpec JSON schema and all related types.

## 🎯 ReadableSpec

The root interface for defining diagrams.

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

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `'flow' \| 'sequence' \| 'class' \| 'state'` | ✅ Yes | - | The type of diagram to generate |
| `direction` | `'TB' \| 'BT' \| 'RL' \| 'LR'` | ❌ No | `'TB'` | Flow direction for the diagram |
| `nodes` | `ReadableNode[]` | ✅ Yes | - | Array of nodes in the diagram |
| `edges` | `ReadableEdge[]` | ✅ Yes | - | Array of edges connecting nodes |
| `groups` | `ReadableGroup[]` | ❌ No | `[]` | Optional groupings of nodes |
| `legend` | `LegendItem[]` | ❌ No | `[]` | Optional legend for the diagram |
| `theme` | `'default' \| 'dark' \| 'neutral' \| 'forest' \| 'base'` | ❌ No | `'default'` | Mermaid theme to use |

### Direction Values

- **`TB`** (Top to Bottom) - Vertical flow from top to bottom
- **`BT`** (Bottom to Top) - Vertical flow from bottom to top  
- **`LR`** (Left to Right) - Horizontal flow from left to right
- **`RL`** (Right to Left) - Horizontal flow from right to left

### Example

```json
{
  "type": "flow",
  "direction": "LR",
  "theme": "default",
  "nodes": [
    { "id": "start", "label": "Start", "shape": "stadium" },
    { "id": "process", "label": "Process" },
    { "id": "end", "label": "End", "shape": "stadium" }
  ],
  "edges": [
    { "from": "start", "to": "process" },
    { "from": "process", "to": "end" }
  ]
}
```

---

## 🔵 ReadableNode

Defines individual nodes (elements) in the diagram.

```typescript
interface ReadableNode {
  id: string;
  label: string;
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;
  meta?: Record<string, any>;
}
```

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | `string` | ✅ Yes | - | Unique identifier for the node |
| `label` | `string` | ✅ Yes | - | Display text for the node |
| `shape` | `NodeShape` | ❌ No | `'rect'` | Visual shape of the node |
| `className` | `string` | ❌ No | - | CSS class for custom styling |
| `meta` | `Record<string, any>` | ❌ No | `{}` | Custom metadata for the node |

### Node Shapes

| Shape | Visual | Use Case | Example |
|-------|--------|----------|---------|
| `rect` | `[Text]` | Default, processes, actions | Process steps |
| `round` | `(Text)` | Start/end points, states | State transitions |
| `stadium` | `([Text])` | Start/end terminals | Workflow start/end |
| `cylinder` | `[(Text)]` | Databases, storage | Data stores |
| `circle` | `((Text))` | Users, actors | User interactions |
| `diamond` | `{Text}` | Decisions, conditions | Conditional logic |
| `hexagon` | `{{Text}}` | External systems, APIs | Service integrations |

### Examples

```typescript
// Basic node
{
  id: 'process1',
  label: 'Process Data'
}

// Node with shape and styling
{
  id: 'database',
  label: 'User Database',
  shape: 'cylinder',
  className: 'database-node'
}

// Node with metadata
{
  id: 'api_call',
  label: 'External API',
  shape: 'hexagon',
  meta: {
    url: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  }
}

// Multi-line label
{
  id: 'complex_process',
  label: 'Data Validation\n& Transformation'
}
```

---

## ➡️ ReadableEdge

Defines connections between nodes.

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

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `from` | `string` | ✅ Yes | - | Source node ID |
| `to` | `string` | ✅ Yes | - | Target node ID |
| `label` | `string` | ❌ No | - | Text label for the edge |
| `style` | `EdgeStyle` | ❌ No | `'solid'` | Visual style of the edge |
| `className` | `string` | ❌ No | - | CSS class for custom styling |
| `meta` | `Record<string, any>` | ❌ No | `{}` | Custom metadata for the edge |

### Edge Styles

| Style | Visual | Use Case | Example |
|-------|--------|----------|---------|
| `solid` | `--->` | Default connections | Standard flow |
| `thick` | `===>` | Primary/important paths | Main data flow |
| `dotted` | `-.->` | Optional/conditional | Error handling |
| `dashed` | `- ->` | Async/background | Background processes |

### Examples

```typescript
// Basic edge
{
  from: 'start',
  to: 'process'
}

// Labeled edge with style
{
  from: 'validate',
  to: 'save',
  label: 'valid data',
  style: 'thick'
}

// Conditional edge
{
  from: 'check',
  to: 'error',
  label: 'invalid',
  style: 'dotted',
  className: 'error-path'
}

// Edge with metadata
{
  from: 'service_a',
  to: 'service_b',
  label: 'API call',
  meta: {
    protocol: 'HTTPS',
    timeout: '5s',
    retry_policy: 'exponential_backoff'
  }
}
```

---

## 📦 ReadableGroup

Groups related nodes together visually.

```typescript
interface ReadableGroup {
  id: string;
  label: string;
  nodes: string[];
  collapsible?: boolean;
  className?: string;
}
```

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | `string` | ✅ Yes | - | Unique identifier for the group |
| `label` | `string` | ✅ Yes | - | Display label for the group |
| `nodes` | `string[]` | ✅ Yes | - | Array of node IDs in this group |
| `collapsible` | `boolean` | ❌ No | `false` | Whether group can be collapsed (future feature) |
| `className` | `string` | ❌ No | - | CSS class for custom styling |

### Examples

```typescript
// Basic grouping
{
  id: 'data_layer',
  label: 'Data Layer',
  nodes: ['user_db', 'product_db', 'cache']
}

// Security boundary grouping
{
  id: 'dmz',
  label: 'DMZ (Public Network)',
  nodes: ['load_balancer', 'api_gateway'],
  className: 'security-zone-dmz'
}

// Collapsible group (future feature)
{
  id: 'microservices',
  label: 'Microservices (12 services)',
  nodes: ['user_service', 'order_service', /* ... */],
  collapsible: true
}
```

---

## 🏷️ LegendItem

Defines legend entries for the diagram.

```typescript
interface LegendItem {
  swatch: string;
  label: string;
}
```

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `swatch` | `string` | ✅ Yes | - | Color identifier or CSS variable name |
| `label` | `string` | ✅ Yes | - | Description text for the legend item |

### Predefined Swatches

| Swatch | Color | Use Case |
|--------|-------|----------|
| `primary` | Blue | Core functionality |
| `secondary` | Gray | Supporting elements |
| `success` | Green | Successful states |
| `warning` | Yellow/Orange | Warnings, conditions |
| `danger` | Red | Errors, critical states |
| `info` | Light Blue | Information, external |

### Examples

```typescript
// Basic legend
[
  { swatch: 'primary', label: 'Core Services' },
  { swatch: 'secondary', label: 'Supporting Systems' },
  { swatch: 'danger', label: 'Error States' }
]

// Custom color legend
[
  { swatch: 'var(--database-color)', label: 'Databases' },
  { swatch: '#10b981', label: 'Healthy Services' },
  { swatch: '#ef4444', label: 'Failed Services' }
]
```

---

## 🎨 Theme Options

Available Mermaid themes for styling diagrams.

### Built-in Themes

| Theme | Description | Use Case |
|-------|-------------|----------|
| `default` | Clean, professional look | Business documentation |
| `dark` | Dark background, light text | Dark mode interfaces |
| `neutral` | Minimal, grayscale | Technical documentation |
| `forest` | Green accent colors | Natural, organic feel |
| `base` | Mermaid's base theme | Standard diagrams |

### Theme Examples

```typescript
// Light theme for presentations
{
  type: 'flow',
  theme: 'default',
  // ... nodes and edges
}

// Dark theme for development tools
{
  type: 'flow',
  theme: 'dark',
  // ... nodes and edges
}

// Minimal theme for documentation
{
  type: 'flow',
  theme: 'neutral',
  // ... nodes and edges
}
```

---

## ✅ Validation Rules

### Node Validation

1. **Unique IDs**: All node IDs must be unique within a diagram
2. **Valid Labels**: Labels cannot be empty strings
3. **Valid Shapes**: Shape must be one of the supported values
4. **ID Format**: Node IDs should be valid identifiers (alphanumeric, underscore, hyphen)

```typescript
// ✅ Valid nodes
{ id: 'start_process', label: 'Start Process', shape: 'stadium' }
{ id: 'db-01', label: 'Primary Database', shape: 'cylinder' }

// ❌ Invalid nodes
{ id: 'start process', label: '', shape: 'invalid' }  // Spaces in ID, empty label, invalid shape
{ id: 'duplicate', label: 'First' }  // If another node has same ID
```

### Edge Validation

1. **Valid References**: `from` and `to` must reference existing node IDs
2. **No Self-loops**: Edges cannot connect a node to itself (unless specifically needed)
3. **Valid Styles**: Style must be one of the supported values

```typescript
// ✅ Valid edges (assuming nodes 'a' and 'b' exist)
{ from: 'a', to: 'b', label: 'process', style: 'thick' }
{ from: 'b', to: 'c' }  // Assuming 'c' exists

// ❌ Invalid edges
{ from: 'nonexistent', to: 'b' }  // 'nonexistent' node doesn't exist
{ from: 'a', to: 'a' }  // Self-loop (generally avoided)
{ from: 'a', to: 'b', style: 'invalid' }  // Invalid style
```

### Group Validation

1. **Valid Node References**: All nodes in `nodes` array must exist
2. **No Empty Groups**: Groups should contain at least one node
3. **Unique Group IDs**: Group IDs must be unique

```typescript
// ✅ Valid groups
{ id: 'services', label: 'Microservices', nodes: ['user_svc', 'order_svc'] }

// ❌ Invalid groups
{ id: 'empty', label: 'Empty Group', nodes: [] }  // No nodes
{ id: 'invalid', label: 'Invalid', nodes: ['nonexistent'] }  // Node doesn't exist
```

---

## 🔧 Advanced Schema Features

### Custom Metadata Usage

Store additional data with nodes and edges for application-specific functionality:

```typescript
// Node with rich metadata
{
  id: 'api_service',
  label: 'User API',
  shape: 'hexagon',
  meta: {
    // Deployment information
    deployment: {
      replicas: 3,
      cpu: '500m',
      memory: '1Gi'
    },
    // Health check configuration
    healthCheck: {
      path: '/health',
      interval: '30s',
      timeout: '5s'
    },
    // Documentation links
    docs: {
      api: 'https://docs.company.com/user-api',
      runbook: 'https://runbooks.company.com/user-api'
    }
  }
}

// Edge with integration metadata
{
  from: 'frontend',
  to: 'api_service',
  label: 'GraphQL',
  meta: {
    protocol: 'HTTPS',
    authentication: 'JWT Bearer',
    rateLimit: '1000/min',
    timeout: '10s',
    retryPolicy: {
      attempts: 3,
      backoff: 'exponential'
    }
  }
}
```

### Dynamic Label Generation

Use metadata to generate dynamic labels:

```typescript
// Node with template label
{
  id: 'service_1',
  label: '{{name}}\n({{status}})',  // Template syntax
  meta: {
    name: 'User Service',
    status: 'healthy',
    instances: 3
  }
}

// Application code to resolve templates
const resolveNodeLabel = (node: ReadableNode): string => {
  let label = node.label;
  if (node.meta) {
    Object.entries(node.meta).forEach(([key, value]) => {
      label = label.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    });
  }
  return label;
};
```

### Conditional Styling

Use metadata for conditional CSS class assignment:

```typescript
// Node with conditional styling
{
  id: 'database',
  label: 'User DB',
  shape: 'cylinder',
  className: 'database-node',  // Base class
  meta: {
    status: 'warning',
    utilization: 85
  }
}

// Application code for dynamic classes
const getNodeClasses = (node: ReadableNode): string => {
  const classes = [node.className || 'default-node'];
  
  if (node.meta?.status) {
    classes.push(`status-${node.meta.status}`);
  }
  
  if (node.meta?.utilization > 80) {
    classes.push('high-utilization');
  }
  
  return classes.join(' ');
};
```

This schema reference provides the complete specification for creating ReadableSpec JSON objects that generate beautiful, interactive Mermaid diagrams with full type safety and validation.
