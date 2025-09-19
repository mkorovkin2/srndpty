# AI Agent Guide: JSON Schema Definition

## Core Schema Structure

The `ReadableSpec` interface is the foundation of all diagrams:

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

## Node Definitions

### ReadableNode Interface
```typescript
interface ReadableNode {
  id: string;                    // Unique identifier (required)
  label: string;                 // Display text (required)
  shape?: 'rect' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon';
  className?: string;            // CSS class for styling
  meta?: Record<string, any>;    // Custom metadata for interactions
}
```

### Node Shapes and Use Cases

#### Rectangle (`rect`) - Default
```json
{ "id": "process", "label": "Process Data" }
```
- **Use for**: General processes, functions, operations
- **Visual**: Sharp corners, professional appearance
- **Best for**: Business processes, system operations

#### Round (`round`)
```json
{ "id": "transform", "label": "Transform", "shape": "round" }
```
- **Use for**: Data transformation, processing steps
- **Visual**: Rounded corners, softer appearance
- **Best for**: Data processing, intermediate steps

#### Stadium (`stadium`)
```json
{ "id": "start", "label": "Start", "shape": "stadium" }
```
- **Use for**: Start/end points, entry/exit nodes
- **Visual**: Pill-shaped, prominent
- **Best for**: Workflow endpoints, triggers

#### Cylinder (`cylinder`)
```json
{ "id": "database", "label": "Database", "shape": "cylinder" }
```
- **Use for**: Data storage, databases, repositories
- **Visual**: 3D cylinder appearance
- **Best for**: Databases, file systems, storage

#### Circle (`circle`)
```json
{ "id": "user", "label": "User", "shape": "circle" }
```
- **Use for**: Actors, users, external entities
- **Visual**: Perfect circle
- **Best for**: People, external systems, actors

#### Diamond (`diamond`)
```json
{ "id": "decision", "label": "Valid?", "shape": "diamond" }
```
- **Use for**: Decision points, conditionals, branching
- **Visual**: Diamond shape
- **Best for**: If/else logic, validation checks

#### Hexagon (`hexagon`)
```json
{ "id": "gateway", "label": "API Gateway", "shape": "hexagon" }
```
- **Use for**: Gateways, routers, middleware
- **Visual**: Six-sided polygon
- **Best for**: API gateways, load balancers, proxies

## Edge Definitions

### ReadableEdge Interface
```typescript
interface ReadableEdge {
  from: string;                  // Source node ID (required)
  to: string;                    // Target node ID (required)
  label?: string;                // Edge label text
  style?: 'solid' | 'thick' | 'dotted' | 'dashed';
  className?: string;            // CSS class for styling
  meta?: Record<string, any>;    // Custom metadata
}
```

### Edge Styles and Meanings

#### Solid (default)
```json
{ "from": "A", "to": "B" }
```
- **Use for**: Normal flow, standard connections
- **Visual**: Solid line
- **Best for**: Primary data flow, standard processes

#### Thick
```json
{ "from": "A", "to": "B", "style": "thick" }
```
- **Use for**: Primary paths, high-importance connections
- **Visual**: Bold, thick line
- **Best for**: Main data flow, critical paths

#### Dotted
```json
{ "from": "A", "to": "B", "style": "dotted" }
```
- **Use for**: Optional flows, weak relationships
- **Visual**: Dotted line
- **Best for**: Optional processes, fallback paths

#### Dashed
```json
{ "from": "A", "to": "B", "style": "dashed" }
```
- **Use for**: Conditional flows, temporary connections
- **Visual**: Dashed line
- **Best for**: Conditional logic, temporary states

## Advanced Features

### Groups
```typescript
interface ReadableGroup {
  id: string;
  label: string;
  nodes: string[];
  collapsible?: boolean;
  className?: string;
}
```

Example:
```json
{
  "groups": [
    {
      "id": "microservices",
      "label": "Microservices Layer",
      "nodes": ["auth", "users", "orders"],
      "collapsible": true
    }
  ]
}
```

### Legends
```typescript
interface LegendItem {
  swatch: string;    // Color identifier
  label: string;     // Description
}
```

Example:
```json
{
  "legend": [
    { "swatch": "primary", "label": "Core Services" },
    { "swatch": "accent", "label": "Data Layer" },
    { "swatch": "warning", "label": "External APIs" }
  ]
}
```

### Metadata Usage
The `meta` field allows custom data for interactivity:

```json
{
  "id": "api",
  "label": "API Server",
  "meta": {
    "type": "service",
    "port": 3000,
    "health": "healthy",
    "description": "Main API server handling user requests",
    "metrics": {
      "uptime": "99.9%",
      "responseTime": "150ms"
    }
  }
}
```

This metadata can be accessed in click handlers:
```javascript
onNodeClick: (nodeId, node) => {
  console.log(`Port: ${node.meta?.port}`);
  console.log(`Health: ${node.meta?.health}`);
}
```

## Schema Validation

The framework validates schemas automatically:

```typescript
import { validateSpec } from 'srndpty';

const errors = validateSpec(spec);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

### Common Validation Errors

1. **Missing required fields**:
   ```
   Node missing required 'id' field
   Node missing required 'label' field
   ```

2. **Invalid references**:
   ```
   Edge references non-existent node: 'invalid-id'
   ```

3. **Invalid enum values**:
   ```
   Invalid node shape: 'triangle' (must be one of: rect, round, stadium, cylinder, circle, diamond, hexagon)
   ```

## Complete Example Schemas

### Basic Flow
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { "id": "start", "label": "Start", "shape": "stadium" },
    { "id": "process", "label": "Process Data" },
    { "id": "end", "label": "End", "shape": "stadium" }
  ],
  "edges": [
    { "from": "start", "to": "process", "label": "begin" },
    { "from": "process", "to": "end", "label": "complete" }
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
    { "id": "orders", "label": "Order Service" },
    { "id": "db", "label": "Database", "shape": "cylinder" }
  ],
  "edges": [
    { "from": "user", "to": "gateway" },
    { "from": "gateway", "to": "auth", "label": "authenticate" },
    { "from": "gateway", "to": "users", "label": "user ops" },
    { "from": "gateway", "to": "orders", "label": "orders" },
    { "from": "auth", "to": "db", "style": "dotted" },
    { "from": "users", "to": "db" },
    { "from": "orders", "to": "db" }
  ],
  "groups": [
    {
      "id": "services",
      "label": "Microservices",
      "nodes": ["auth", "users", "orders"]
    }
  ],
  "legend": [
    { "swatch": "primary", "label": "Core Services" },
    { "swatch": "accent", "label": "Data Layer" }
  ]
}
```

### Data Pipeline
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { "id": "ingest", "label": "Data Ingestion", "shape": "stadium" },
    { "id": "validate", "label": "Validate & Clean" },
    { "id": "transform", "label": "Transform" },
    { "id": "enrich", "label": "Enrich Data" },
    { "id": "store", "label": "Data Lake", "shape": "cylinder" },
    { "id": "api", "label": "API Layer", "shape": "hexagon" }
  ],
  "edges": [
    { "from": "ingest", "to": "validate", "label": "raw data", "style": "thick" },
    { "from": "validate", "to": "transform", "label": "clean data" },
    { "from": "transform", "to": "enrich", "label": "structured" },
    { "from": "enrich", "to": "store", "label": "enriched" },
    { "from": "store", "to": "api", "label": "query", "style": "dashed" }
  ]
}
```

## Best Practices

### 1. Label Wrapping
Labels automatically wrap at 20 characters. For custom wrapping:
```json
{ "id": "long", "label": "Very Long Process\nName Here" }
```

### 2. Consistent Naming
- Use kebab-case for IDs: `"user-service"`
- Use descriptive labels: `"User Authentication Service"`
- Keep labels concise but clear

### 3. Logical Grouping
- Group related nodes together
- Use meaningful group labels
- Consider collapsible groups for complex diagrams

### 4. Edge Styling
- Use `thick` for primary flows
- Use `dotted` for optional/fallback paths
- Use `dashed` for conditional flows
- Add labels to clarify relationships

### 5. Metadata Strategy
- Include relevant technical details in `meta`
- Use consistent metadata structure across nodes
- Include data useful for click handlers and tooltips
