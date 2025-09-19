# 🔄 Use Case 1: Data Pipeline Visualization

**Scenario**: You're building a data engineering platform and need to visualize complex ETL (Extract, Transform, Load) pipelines for both technical documentation and stakeholder presentations.

## 📋 Overview

This use case demonstrates how to create interactive data pipeline diagrams that show:
- **Data sources and destinations**
- **Processing steps with clear labels**
- **Data flow with volume indicators**
- **Error handling and monitoring points**
- **Grouped logical components**

## 🎯 Implementation

### Complete Working Example

```tsx
import React, { useState, useCallback } from 'react';
import { ReadableMermaid, type ReadableSpec } from '@readable/mermaid';

const DataPipelineVisualization: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pipelineMetrics, setPipelineMetrics] = useState({
    ingestRate: '1.2M records/hour',
    errorRate: '0.01%',
    latency: '45ms avg'
  });

  // Define the data pipeline specification
  const pipelineSpec: ReadableSpec = {
    type: 'flow',
    direction: 'LR',
    theme: 'default',
    
    nodes: [
      // Data Sources
      {
        id: 'api_source',
        label: 'REST APIs\n(Customer Data)',
        shape: 'cylinder',
        className: 'data-source'
      },
      {
        id: 'file_source',
        label: 'CSV Files\n(Historical Data)',
        shape: 'cylinder',
        className: 'data-source'
      },
      {
        id: 'stream_source',
        label: 'Kafka Stream\n(Real-time Events)',
        shape: 'cylinder',
        className: 'data-source'
      },
      
      // Ingestion Layer
      {
        id: 'ingestion_service',
        label: 'Data Ingestion\nService',
        shape: 'hexagon',
        className: 'processing-node'
      },
      
      // Processing Steps
      {
        id: 'validation',
        label: 'Data Validation\n& Quality Checks',
        shape: 'diamond',
        className: 'validation-node'
      },
      {
        id: 'cleaning',
        label: 'Data Cleaning\n(Dedupe, Format)',
        shape: 'rect',
        className: 'processing-node'
      },
      {
        id: 'enrichment',
        label: 'Data Enrichment\n(Lookup, Calculate)',
        shape: 'rect',
        className: 'processing-node'
      },
      {
        id: 'transformation',
        label: 'Business Logic\nTransformation',
        shape: 'rect',
        className: 'processing-node'
      },
      
      // Error Handling
      {
        id: 'error_queue',
        label: 'Error Queue\n(Dead Letter)',
        shape: 'stadium',
        className: 'error-node'
      },
      
      // Storage Layer
      {
        id: 'data_lake',
        label: 'Data Lake\n(Raw Storage)',
        shape: 'cylinder',
        className: 'storage-node'
      },
      {
        id: 'data_warehouse',
        label: 'Data Warehouse\n(Analytics)',
        shape: 'cylinder',
        className: 'storage-node'
      },
      {
        id: 'cache',
        label: 'Redis Cache\n(Fast Access)',
        shape: 'cylinder',
        className: 'cache-node'
      },
      
      // Monitoring
      {
        id: 'monitoring',
        label: 'Pipeline Monitor\n& Alerting',
        shape: 'hexagon',
        className: 'monitoring-node'
      }
    ],
    
    edges: [
      // Data ingestion flows
      { from: 'api_source', to: 'ingestion_service', label: '~500K/hr', style: 'thick' },
      { from: 'file_source', to: 'ingestion_service', label: '~300K/hr', style: 'solid' },
      { from: 'stream_source', to: 'ingestion_service', label: '~400K/hr', style: 'thick' },
      
      // Processing pipeline
      { from: 'ingestion_service', to: 'validation', label: 'raw data' },
      { from: 'validation', to: 'cleaning', label: 'valid', style: 'thick' },
      { from: 'validation', to: 'error_queue', label: 'invalid', style: 'dotted' },
      { from: 'cleaning', to: 'enrichment', label: 'cleaned' },
      { from: 'enrichment', to: 'transformation', label: 'enriched' },
      
      // Storage flows
      { from: 'transformation', to: 'data_lake', label: 'archive', style: 'dashed' },
      { from: 'transformation', to: 'data_warehouse', label: 'analytics', style: 'thick' },
      { from: 'transformation', to: 'cache', label: 'hot data', style: 'solid' },
      
      // Monitoring flows
      { from: 'ingestion_service', to: 'monitoring', label: 'metrics', style: 'dotted' },
      { from: 'validation', to: 'monitoring', label: 'metrics', style: 'dotted' },
      { from: 'error_queue', to: 'monitoring', label: 'alerts', style: 'dotted' }
    ],
    
    groups: [
      {
        id: 'sources',
        label: 'Data Sources',
        nodes: ['api_source', 'file_source', 'stream_source']
      },
      {
        id: 'processing',
        label: 'Processing Pipeline',
        nodes: ['ingestion_service', 'validation', 'cleaning', 'enrichment', 'transformation']
      },
      {
        id: 'storage',
        label: 'Storage Layer',
        nodes: ['data_lake', 'data_warehouse', 'cache']
      },
      {
        id: 'ops',
        label: 'Operations',
        nodes: ['error_queue', 'monitoring']
      }
    ],
    
    legend: [
      { swatch: 'primary', label: 'Processing Nodes' },
      { swatch: 'accent', label: 'Storage Systems' },
      { swatch: 'warning', label: 'Error Handling' },
      { swatch: 'info', label: 'Monitoring' }
    ]
  };

  // Handle node clicks to show details
  const handleNodeClick = useCallback((nodeId: string, node: any) => {
    setSelectedNode(nodeId);
    console.log(`Clicked node: ${nodeId}`, node);
  }, []);

  // Handle edge clicks to show data flow details
  const handleEdgeClick = useCallback((edge: any) => {
    alert(`Data Flow: ${edge.from} → ${edge.to}${edge.label ? `\nVolume: ${edge.label}` : ''}`);
  }, []);

  // Get node details for the selected node
  const getNodeDetails = (nodeId: string) => {
    const nodeDetails: Record<string, any> = {
      'api_source': {
        type: 'REST API Source',
        description: 'Pulls customer data from various REST endpoints',
        sla: '99.9% uptime',
        dataFormat: 'JSON',
        updateFrequency: 'Real-time',
        constraints: ['Rate limited to 1000 req/min', 'Requires API keys']
      },
      'ingestion_service': {
        type: 'Data Ingestion Service',
        description: 'Orchestrates data collection from multiple sources',
        technology: 'Apache Kafka + Python',
        throughput: '1.2M records/hour',
        constraints: ['Memory intensive', 'Requires schema registry']
      },
      'validation': {
        type: 'Data Validation Engine',
        description: 'Validates data quality and business rules',
        rules: ['Schema validation', 'Business logic checks', 'Duplicate detection'],
        errorRate: '0.01%',
        constraints: ['CPU intensive', 'Requires reference data']
      },
      'data_warehouse': {
        type: 'Analytics Data Warehouse',
        description: 'Optimized for analytical queries and reporting',
        technology: 'PostgreSQL with columnar extensions',
        storage: '2.5TB',
        constraints: ['Query performance depends on indexing', 'Expensive for real-time queries']
      }
    };
    
    return nodeDetails[nodeId] || null;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>🔄 Data Pipeline Architecture</h2>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <strong>Ingestion Rate:</strong> {pipelineMetrics.ingestRate}
          </div>
          <div>
            <strong>Error Rate:</strong> {pipelineMetrics.errorRate}
          </div>
          <div>
            <strong>Avg Latency:</strong> {pipelineMetrics.latency}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
        {/* Main diagram */}
        <div style={{ flex: 1 }}>
          <ReadableMermaid
            spec={pipelineSpec}
            options={{
              fitToContainer: true,
              enablePanZoom: true,
              onNodeClick: handleNodeClick,
              onEdgeClick: handleEdgeClick,
              style: {
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff'
              }
            }}
          />
        </div>

        {/* Details panel */}
        <div style={{ 
          width: '300px', 
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3>Component Details</h3>
          {selectedNode ? (
            <div>
              <h4 style={{ color: '#0ea5e9', marginBottom: '10px' }}>
                {pipelineSpec.nodes.find(n => n.id === selectedNode)?.label}
              </h4>
              {(() => {
                const details = getNodeDetails(selectedNode);
                if (details) {
                  return (
                    <div>
                      <p><strong>Type:</strong> {details.type}</p>
                      <p><strong>Description:</strong> {details.description}</p>
                      {details.technology && <p><strong>Technology:</strong> {details.technology}</p>}
                      {details.throughput && <p><strong>Throughput:</strong> {details.throughput}</p>}
                      {details.sla && <p><strong>SLA:</strong> {details.sla}</p>}
                      {details.constraints && (
                        <div>
                          <strong>Constraints:</strong>
                          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                            {details.constraints.map((constraint: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{constraint}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }
                return <p>No detailed information available for this component.</p>;
              })()}
            </div>
          ) : (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>
              Click on any component in the diagram to see detailed information.
            </p>
          )}
        </div>
      </div>

      {/* CSS for custom styling */}
      <style jsx>{`
        .data-source {
          fill: #dbeafe !important;
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
        }
        
        .processing-node {
          fill: #f0f9ff !important;
          stroke: #0ea5e9 !important;
          stroke-width: 2px !important;
        }
        
        .validation-node {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 2px !important;
        }
        
        .storage-node {
          fill: #ecfdf5 !important;
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
        
        .error-node {
          fill: #fef2f2 !important;
          stroke: #ef4444 !important;
          stroke-width: 2px !important;
        }
        
        .cache-node {
          fill: #f3e8ff !important;
          stroke: #8b5cf6 !important;
          stroke-width: 2px !important;
        }
        
        .monitoring-node {
          fill: #fafaf9 !important;
          stroke: #6b7280 !important;
          stroke-width: 2px !important;
        }
      `}</style>
    </div>
  );
};

export default DataPipelineVisualization;
```

## 📊 Expected Output

The implementation above creates an interactive diagram showing:

1. **Data Sources** (left): REST APIs, CSV files, and Kafka streams
2. **Processing Pipeline** (center): Ingestion → Validation → Cleaning → Enrichment → Transformation
3. **Storage Layer** (right): Data lake, warehouse, and cache
4. **Operations** (bottom): Error handling and monitoring

**Visual Features:**
- **Color-coded components** by function (sources, processing, storage, etc.)
- **Flow labels** showing data volumes
- **Different edge styles** for different data flow types
- **Grouped components** with logical boundaries
- **Interactive details panel** showing component specifications

## ⚙️ Key Implementation Details

### 1. Node Classification System

```typescript
// Organize nodes by function with consistent styling
const nodeTypes = {
  dataSources: { 
    shape: 'cylinder' as const, 
    className: 'data-source' 
  },
  processing: { 
    shape: 'rect' as const, 
    className: 'processing-node' 
  },
  validation: { 
    shape: 'diamond' as const, 
    className: 'validation-node' 
  },
  storage: { 
    shape: 'cylinder' as const, 
    className: 'storage-node' 
  }
};
```

### 2. Data Flow Visualization

```typescript
// Use edge styles to indicate different data flows
const edgeStyles = {
  highVolume: 'thick',    // Main data paths
  normal: 'solid',        // Regular flows
  errors: 'dotted',       // Error/monitoring flows
  archive: 'dashed'       // Archive/backup flows
};
```

### 3. Interactive Component Details

```typescript
// Store metadata for each component
interface ComponentMetadata {
  type: string;
  description: string;
  technology?: string;
  throughput?: string;
  constraints: string[];
  sla?: string;
}

const componentDetails: Record<string, ComponentMetadata> = {
  // ... detailed specifications for each component
};
```

## 🚨 Constraints and Gotchas

### 1. **Performance with Large Pipelines**

**Issue**: Complex pipelines with 50+ components can become cluttered and slow.

```typescript
// ❌ Problematic: Too many nodes in one diagram
const hugePipeline = {
  nodes: [/* 100+ nodes */],  // Overwhelming
  edges: [/* 200+ edges */]   // Unreadable
};

// ✅ Solution: Break into logical sub-diagrams
const pipelineOverview = {
  nodes: [
    { id: 'ingestion', label: 'Ingestion Layer\n(5 services)' },
    { id: 'processing', label: 'Processing Layer\n(8 services)' },
    { id: 'storage', label: 'Storage Layer\n(4 systems)' }
  ]
};

const ingestionDetail = {
  // Detailed view of just the ingestion layer
  nodes: [/* 5 specific ingestion services */]
};
```

### 2. **Label Length and Readability**

**Issue**: Long service names or descriptions can overflow node shapes.

```typescript
// ❌ Problematic: Long labels
{ 
  id: 'service1', 
  label: 'Customer Data Validation and Enrichment Service with Business Rules Engine' 
}

// ✅ Solution: Use line breaks and abbreviations
{ 
  id: 'service1', 
  label: 'Customer Data\nValidation Service',
  meta: { 
    fullName: 'Customer Data Validation and Enrichment Service with Business Rules Engine' 
  }
}
```

### 3. **Real-time Data Integration**

**Constraint**: Diagrams are static; real-time metrics need separate handling.

```typescript
// ✅ Pattern: Separate state for dynamic data
const [pipelineMetrics, setPipelineMetrics] = useState({
  ingestRate: '1.2M records/hour',
  errorRate: '0.01%',
  latency: '45ms avg'
});

// Update metrics separately from diagram structure
useEffect(() => {
  const interval = setInterval(() => {
    fetchPipelineMetrics().then(setPipelineMetrics);
  }, 30000); // Update every 30 seconds
  
  return () => clearInterval(interval);
}, []);
```

### 4. **Cross-platform Styling Issues**

**Issue**: CSS-in-JS styling may not work consistently across different Mermaid themes.

```typescript
// ❌ Problematic: Complex CSS dependencies
const customStyles = `
  .my-node { 
    fill: var(--primary-color, #blue) !important; 
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
  }
`;

// ✅ Solution: Use simple, explicit colors
const customStyles = `
  .my-node { 
    fill: #dbeafe !important; 
    stroke: #3b82f6 !important;
    stroke-width: 2px !important;
  }
`;
```

## 🎯 Best Practices

### 1. **Hierarchical Design**

Start with high-level components, then drill down:

```typescript
// Level 1: System overview
const systemOverview = {
  nodes: [
    { id: 'sources', label: 'Data Sources\n(3 systems)' },
    { id: 'pipeline', label: 'Processing Pipeline\n(5 stages)' },
    { id: 'targets', label: 'Target Systems\n(4 destinations)' }
  ]
};

// Level 2: Detailed pipeline view (this use case)
// Level 3: Individual service internals (separate diagrams)
```

### 2. **Consistent Naming Conventions**

```typescript
// Use consistent ID patterns
const nodeIds = {
  sources: 'src_[system]',      // src_api, src_kafka
  processing: 'proc_[stage]',   // proc_validation, proc_transform
  storage: 'store_[type]',      // store_warehouse, store_cache
  monitoring: 'mon_[function]'  // mon_alerts, mon_metrics
};
```

### 3. **Progressive Disclosure**

Show details on demand rather than overwhelming users:

```typescript
// Start with essential information
const basicNode = {
  id: 'validation',
  label: 'Data Validation'
};

// Add details via interaction
const handleNodeClick = (nodeId: string) => {
  const details = getDetailedInfo(nodeId);
  showDetailsPanel(details);
};
```

## 📈 Scaling Considerations

### For Large Organizations

1. **Modular Diagrams**: Break complex pipelines into focused sub-diagrams
2. **Template System**: Create reusable node/edge templates for consistency
3. **Metadata Management**: Store detailed component info separately from visual structure
4. **Version Control**: Track diagram changes alongside code changes

### Performance Optimization

```typescript
// Lazy load component details
const getNodeDetails = useMemo(() => {
  return (nodeId: string) => {
    // Only load details when needed
    return nodeDetailsCache[nodeId] || loadNodeDetails(nodeId);
  };
}, []);

// Debounce interactions
const debouncedNodeClick = useCallback(
  debounce((nodeId: string, node: any) => {
    handleNodeClick(nodeId, node);
  }, 150),
  [handleNodeClick]
);
```

## 🔄 Integration Patterns

### With Monitoring Systems

```typescript
// Connect to real monitoring APIs
const useRealTimeMetrics = (pipelineId: string) => {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const ws = new WebSocket(`wss://monitoring.company.com/pipeline/${pipelineId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };
    
    return () => ws.close();
  }, [pipelineId]);
  
  return metrics;
};
```

### With Configuration Management

```typescript
// Generate diagrams from infrastructure code
const generatePipelineFromConfig = (configFile: string) => {
  const config = parseYamlConfig(configFile);
  
  return {
    type: 'flow' as const,
    nodes: config.services.map(service => ({
      id: service.name,
      label: service.displayName || service.name,
      shape: getShapeForServiceType(service.type)
    })),
    edges: config.connections.map(conn => ({
      from: conn.source,
      to: conn.target,
      label: conn.protocol
    }))
  };
};
```

This use case demonstrates how Readable Mermaid can create professional, interactive data pipeline visualizations that serve both technical documentation and stakeholder communication needs while handling the complexity and constraints of real-world data systems.
