# AI Agent Guide: Common Use Cases and Examples

## System Architecture Diagrams

### Microservices Architecture
```json
{
  "type": "flow",
  "direction": "TB",
  "nodes": [
    { 
      "id": "user", 
      "label": "User", 
      "shape": "circle",
      "meta": {
        "type": "actor",
        "description": "End user interacting with the system"
      }
    },
    { 
      "id": "loadbalancer", 
      "label": "Load Balancer", 
      "shape": "hexagon",
      "meta": {
        "type": "infrastructure",
        "technology": "nginx",
        "instances": 2
      }
    },
    { 
      "id": "apigateway", 
      "label": "API Gateway", 
      "shape": "hexagon",
      "meta": {
        "type": "gateway",
        "technology": "Kong",
        "port": 8080
      }
    },
    { 
      "id": "authservice", 
      "label": "Auth Service",
      "meta": {
        "type": "microservice",
        "technology": "Node.js",
        "database": "Redis",
        "port": 3001
      }
    },
    { 
      "id": "userservice", 
      "label": "User Service",
      "meta": {
        "type": "microservice",
        "technology": "Python",
        "database": "PostgreSQL",
        "port": 3002
      }
    },
    { 
      "id": "orderservice", 
      "label": "Order Service",
      "meta": {
        "type": "microservice",
        "technology": "Java",
        "database": "MongoDB",
        "port": 3003
      }
    },
    { 
      "id": "paymentservice", 
      "label": "Payment Service",
      "meta": {
        "type": "microservice",
        "technology": "Go",
        "database": "PostgreSQL",
        "port": 3004
      }
    },
    { 
      "id": "messagequeue", 
      "label": "Message Queue", 
      "shape": "cylinder",
      "meta": {
        "type": "infrastructure",
        "technology": "RabbitMQ",
        "purpose": "Async communication"
      }
    }
  ],
  "edges": [
    { "from": "user", "to": "loadbalancer", "label": "HTTPS" },
    { "from": "loadbalancer", "to": "apigateway", "label": "HTTP" },
    { "from": "apigateway", "to": "authservice", "label": "authenticate" },
    { "from": "apigateway", "to": "userservice", "label": "user ops" },
    { "from": "apigateway", "to": "orderservice", "label": "orders" },
    { "from": "orderservice", "to": "paymentservice", "label": "payment", "style": "thick" },
    { "from": "authservice", "to": "messagequeue", "label": "events", "style": "dotted" },
    { "from": "userservice", "to": "messagequeue", "label": "events", "style": "dotted" },
    { "from": "orderservice", "to": "messagequeue", "label": "events", "style": "dotted" }
  ],
  "groups": [
    {
      "id": "services",
      "label": "Microservices Layer",
      "nodes": ["authservice", "userservice", "orderservice", "paymentservice"]
    },
    {
      "id": "infrastructure",
      "label": "Infrastructure Layer", 
      "nodes": ["loadbalancer", "apigateway", "messagequeue"]
    }
  ],
  "legend": [
    { "swatch": "primary", "label": "Core Services" },
    { "swatch": "accent", "label": "Infrastructure" },
    { "swatch": "warning", "label": "External Actor" }
  ]
}
```

### Cloud Infrastructure
```json
{
  "type": "flow",
  "direction": "LR", 
  "nodes": [
    { 
      "id": "internet", 
      "label": "Internet", 
      "shape": "circle",
      "meta": { "type": "external" }
    },
    { 
      "id": "cloudfront", 
      "label": "CloudFront CDN", 
      "shape": "hexagon",
      "meta": { "service": "AWS CloudFront", "type": "cdn" }
    },
    { 
      "id": "alb", 
      "label": "Application Load Balancer", 
      "shape": "hexagon",
      "meta": { "service": "AWS ALB", "type": "loadbalancer" }
    },
    { 
      "id": "ec2", 
      "label": "EC2 Instances\n(Auto Scaling)", 
      "shape": "round",
      "meta": { "service": "AWS EC2", "instances": "2-10", "type": "compute" }
    },
    { 
      "id": "rds", 
      "label": "RDS Database", 
      "shape": "cylinder",
      "meta": { "service": "AWS RDS", "engine": "PostgreSQL", "type": "database" }
    },
    { 
      "id": "redis", 
      "label": "ElastiCache Redis", 
      "shape": "cylinder",
      "meta": { "service": "AWS ElastiCache", "type": "cache" }
    },
    { 
      "id": "s3", 
      "label": "S3 Storage", 
      "shape": "cylinder",
      "meta": { "service": "AWS S3", "type": "storage" }
    }
  ],
  "edges": [
    { "from": "internet", "to": "cloudfront", "label": "HTTPS" },
    { "from": "cloudfront", "to": "alb", "label": "origin" },
    { "from": "alb", "to": "ec2", "label": "distribute" },
    { "from": "ec2", "to": "rds", "label": "queries" },
    { "from": "ec2", "to": "redis", "label": "cache" },
    { "from": "ec2", "to": "s3", "label": "assets", "style": "dotted" }
  ]
}
```

## Data Pipeline Diagrams

### ETL Pipeline
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { 
      "id": "sources", 
      "label": "Data Sources\n(APIs, Files, DBs)", 
      "shape": "stadium",
      "meta": {
        "type": "input",
        "sources": ["REST APIs", "CSV Files", "MySQL", "MongoDB"]
      }
    },
    { 
      "id": "ingest", 
      "label": "Data Ingestion\nService",
      "meta": {
        "type": "service",
        "technology": "Apache Kafka",
        "throughput": "10k events/sec"
      }
    },
    { 
      "id": "validate", 
      "label": "Data Validation\n& Cleansing",
      "meta": {
        "type": "processing",
        "technology": "Apache Spark",
        "rules": ["schema validation", "data quality checks"]
      }
    },
    { 
      "id": "transform", 
      "label": "Data\nTransformation",
      "meta": {
        "type": "processing",
        "technology": "dbt",
        "operations": ["normalization", "aggregation", "enrichment"]
      }
    },
    { 
      "id": "warehouse", 
      "label": "Data Warehouse", 
      "shape": "cylinder",
      "meta": {
        "type": "storage",
        "technology": "Snowflake",
        "capacity": "100TB"
      }
    },
    { 
      "id": "mart", 
      "label": "Data Marts", 
      "shape": "cylinder",
      "meta": {
        "type": "storage",
        "purpose": "department-specific views",
        "marts": ["sales", "marketing", "finance"]
      }
    },
    { 
      "id": "bi", 
      "label": "BI Tools", 
      "shape": "hexagon",
      "meta": {
        "type": "visualization",
        "tools": ["Tableau", "Power BI", "Looker"]
      }
    }
  ],
  "edges": [
    { "from": "sources", "to": "ingest", "label": "raw data", "style": "thick" },
    { "from": "ingest", "to": "validate", "label": "stream" },
    { "from": "validate", "to": "transform", "label": "clean data" },
    { "from": "transform", "to": "warehouse", "label": "processed" },
    { "from": "warehouse", "to": "mart", "label": "subset" },
    { "from": "mart", "to": "bi", "label": "queries" }
  ],
  "groups": [
    {
      "id": "ingestion",
      "label": "Data Ingestion Layer",
      "nodes": ["sources", "ingest"]
    },
    {
      "id": "processing", 
      "label": "Processing Layer",
      "nodes": ["validate", "transform"]
    },
    {
      "id": "storage",
      "label": "Storage Layer", 
      "nodes": ["warehouse", "mart"]
    }
  ]
}
```

### Real-time Analytics Pipeline
```json
{
  "type": "flow",
  "direction": "TB",
  "nodes": [
    { 
      "id": "events", 
      "label": "Event Sources\n(Apps, IoT, Logs)", 
      "shape": "stadium",
      "meta": { "volume": "1M events/min" }
    },
    { 
      "id": "kafka", 
      "label": "Kafka Streams", 
      "shape": "hexagon",
      "meta": { "partitions": 100, "retention": "7 days" }
    },
    { 
      "id": "processor", 
      "label": "Stream Processor\n(Flink)",
      "meta": { "windows": "1min, 5min, 1hr", "operations": ["filter", "aggregate", "join"] }
    },
    { 
      "id": "timeseries", 
      "label": "Time Series DB\n(InfluxDB)", 
      "shape": "cylinder",
      "meta": { "retention": "30 days", "compression": "snappy" }
    },
    { 
      "id": "dashboard", 
      "label": "Real-time\nDashboard", 
      "shape": "hexagon",
      "meta": { "technology": "Grafana", "refresh": "5 seconds" }
    }
  ],
  "edges": [
    { "from": "events", "to": "kafka", "label": "publish", "style": "thick" },
    { "from": "kafka", "to": "processor", "label": "consume" },
    { "from": "processor", "to": "timeseries", "label": "metrics" },
    { "from": "timeseries", "to": "dashboard", "label": "query" }
  ]
}
```

## Business Process Flows

### Order Processing Workflow
```json
{
  "type": "flow",
  "direction": "TB",
  "nodes": [
    { 
      "id": "start", 
      "label": "Customer Places Order", 
      "shape": "stadium",
      "meta": { "trigger": "user action", "channel": "web/mobile" }
    },
    { 
      "id": "validate", 
      "label": "Validate Order", 
      "shape": "diamond",
      "meta": { "checks": ["inventory", "payment method", "shipping address"] }
    },
    { 
      "id": "inventory", 
      "label": "Check Inventory",
      "meta": { "system": "WMS", "timeout": "5s" }
    },
    { 
      "id": "payment", 
      "label": "Process Payment",
      "meta": { "gateway": "Stripe", "methods": ["card", "paypal", "bank"] }
    },
    { 
      "id": "fulfill", 
      "label": "Fulfill Order",
      "meta": { "warehouse": "automated", "sla": "24 hours" }
    },
    { 
      "id": "ship", 
      "label": "Ship Order",
      "meta": { "carriers": ["UPS", "FedEx", "DHL"], "tracking": true }
    },
    { 
      "id": "notify", 
      "label": "Notify Customer",
      "meta": { "channels": ["email", "SMS", "push"], "templates": "dynamic" }
    },
    { 
      "id": "complete", 
      "label": "Order Complete", 
      "shape": "stadium",
      "meta": { "status": "delivered", "feedback_request": true }
    },
    { 
      "id": "reject", 
      "label": "Reject Order",
      "meta": { "reasons": ["insufficient inventory", "payment failed", "invalid address"] }
    }
  ],
  "edges": [
    { "from": "start", "to": "validate" },
    { "from": "validate", "to": "inventory", "label": "valid" },
    { "from": "validate", "to": "reject", "label": "invalid", "style": "dashed" },
    { "from": "inventory", "to": "payment", "label": "available" },
    { "from": "inventory", "to": "reject", "label": "out of stock", "style": "dashed" },
    { "from": "payment", "to": "fulfill", "label": "success" },
    { "from": "payment", "to": "reject", "label": "failed", "style": "dashed" },
    { "from": "fulfill", "to": "ship" },
    { "from": "ship", "to": "notify" },
    { "from": "notify", "to": "complete" }
  ]
}
```

### User Onboarding Flow
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { 
      "id": "signup", 
      "label": "User Signup", 
      "shape": "stadium",
      "meta": { "form_fields": ["email", "password", "name"] }
    },
    { 
      "id": "verify", 
      "label": "Email Verification",
      "meta": { "method": "token", "expiry": "24 hours" }
    },
    { 
      "id": "profile", 
      "label": "Complete Profile",
      "meta": { "optional_fields": ["avatar", "bio", "preferences"] }
    },
    { 
      "id": "tutorial", 
      "label": "Interactive Tutorial",
      "meta": { "steps": 5, "completion_rate": "78%" }
    },
    { 
      "id": "trial", 
      "label": "Start Free Trial", 
      "shape": "diamond",
      "meta": { "duration": "14 days", "features": "full access" }
    },
    { 
      "id": "active", 
      "label": "Active User", 
      "shape": "stadium",
      "meta": { "status": "onboarded" }
    }
  ],
  "edges": [
    { "from": "signup", "to": "verify", "label": "email sent" },
    { "from": "verify", "to": "profile", "label": "verified" },
    { "from": "profile", "to": "tutorial", "label": "continue" },
    { "from": "tutorial", "to": "trial", "label": "completed" },
    { "from": "trial", "to": "active", "label": "engaged" }
  ]
}
```

## Development Workflows

### CI/CD Pipeline
```json
{
  "type": "flow",
  "direction": "TB",
  "nodes": [
    { 
      "id": "commit", 
      "label": "Code Commit", 
      "shape": "stadium",
      "meta": { "trigger": "git push", "branch": "feature/*" }
    },
    { 
      "id": "build", 
      "label": "Build & Test",
      "meta": { "runner": "GitHub Actions", "steps": ["lint", "test", "build"] }
    },
    { 
      "id": "security", 
      "label": "Security Scan",
      "meta": { "tools": ["Snyk", "SonarQube"], "gate": "blocking" }
    },
    { 
      "id": "staging", 
      "label": "Deploy to Staging",
      "meta": { "environment": "staging", "auto_deploy": true }
    },
    { 
      "id": "e2e", 
      "label": "E2E Tests",
      "meta": { "framework": "Playwright", "browsers": ["Chrome", "Firefox", "Safari"] }
    },
    { 
      "id": "approval", 
      "label": "Manual Approval", 
      "shape": "diamond",
      "meta": { "reviewers": ["tech lead", "product owner"] }
    },
    { 
      "id": "production", 
      "label": "Deploy to Production",
      "meta": { "strategy": "blue-green", "rollback": "automatic" }
    },
    { 
      "id": "monitor", 
      "label": "Monitor & Alert",
      "meta": { "tools": ["DataDog", "PagerDuty"], "sla": "99.9%" }
    }
  ],
  "edges": [
    { "from": "commit", "to": "build" },
    { "from": "build", "to": "security" },
    { "from": "security", "to": "staging" },
    { "from": "staging", "to": "e2e" },
    { "from": "e2e", "to": "approval" },
    { "from": "approval", "to": "production", "label": "approved" },
    { "from": "production", "to": "monitor" }
  ]
}
```

### Git Workflow
```json
{
  "type": "flow",
  "direction": "LR",
  "nodes": [
    { 
      "id": "main", 
      "label": "main branch", 
      "shape": "cylinder",
      "meta": { "protection": "required reviews", "auto_merge": false }
    },
    { 
      "id": "develop", 
      "label": "develop branch", 
      "shape": "cylinder",
      "meta": { "integration": "continuous", "testing": "automated" }
    },
    { 
      "id": "feature", 
      "label": "feature branch",
      "meta": { "naming": "feature/ticket-123", "lifetime": "short" }
    },
    { 
      "id": "pr", 
      "label": "Pull Request", 
      "shape": "diamond",
      "meta": { "checks": ["CI", "code review", "approval"] }
    },
    { 
      "id": "release", 
      "label": "release branch",
      "meta": { "versioning": "semantic", "testing": "regression" }
    }
  ],
  "edges": [
    { "from": "develop", "to": "feature", "label": "branch from" },
    { "from": "feature", "to": "pr", "label": "create PR" },
    { "from": "pr", "to": "develop", "label": "merge", "style": "thick" },
    { "from": "develop", "to": "release", "label": "cut release" },
    { "from": "release", "to": "main", "label": "deploy", "style": "thick" }
  ]
}
```

## Interactive Usage Examples

### Node Click Handler with Details Panel
```tsx
import React, { useState } from 'react';
import { Srndpty } from 'srndpty';
import type { ReadableNode } from 'srndpty';

function SystemArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<ReadableNode | null>(null);

  const spec = {
    type: 'flow' as const,
    direction: 'TB' as const,
    nodes: [
      { 
        id: 'api', 
        label: 'API Server',
        meta: {
          technology: 'Node.js',
          version: '18.x',
          port: 3000,
          health: 'healthy',
          cpu: '45%',
          memory: '2.1GB',
          requests_per_minute: 1250,
          uptime: '99.95%'
        }
      },
      { 
        id: 'db', 
        label: 'Database', 
        shape: 'cylinder' as const,
        meta: {
          technology: 'PostgreSQL',
          version: '14.2',
          connections: 45,
          size: '125GB',
          backup_status: 'completed 2h ago',
          performance: 'optimal'
        }
      }
    ],
    edges: [
      { 
        from: 'api', 
        to: 'db', 
        label: 'queries',
        meta: {
          protocol: 'TCP',
          avg_latency: '15ms',
          queries_per_second: 850,
          connection_pool: 20
        }
      }
    ]
  };

  const handleNodeClick = (nodeId: string, node: ReadableNode) => {
    setSelectedNode(node);
  };

  return (
    <div style={{ display: 'flex', height: '600px' }}>
      <div style={{ flex: 1 }}>
        <Srndpty 
          spec={spec}
          options={{
            onNodeClick: handleNodeClick,
            enablePanZoom: true
          }}
        />
      </div>
      
      {selectedNode && (
        <div style={{ 
          width: '300px', 
          padding: '20px', 
          backgroundColor: '#f8fafc',
          borderLeft: '1px solid #e2e8f0'
        }}>
          <h3>{selectedNode.label}</h3>
          <div style={{ marginBottom: '16px' }}>
            <strong>Technology:</strong> {selectedNode.meta?.technology}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Status:</strong> 
            <span style={{ 
              color: selectedNode.meta?.health === 'healthy' ? '#16a34a' : '#dc2626',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              {selectedNode.meta?.health}
            </span>
          </div>
          
          {selectedNode.meta?.port && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Port:</strong> {selectedNode.meta.port}
            </div>
          )}
          
          {selectedNode.meta?.cpu && (
            <div style={{ marginBottom: '8px' }}>
              <strong>CPU Usage:</strong> {selectedNode.meta.cpu}
            </div>
          )}
          
          {selectedNode.meta?.memory && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Memory:</strong> {selectedNode.meta.memory}
            </div>
          )}
          
          {selectedNode.meta?.uptime && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Uptime:</strong> {selectedNode.meta.uptime}
            </div>
          )}
          
          <button 
            onClick={() => setSelectedNode(null)}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}
```

### Dynamic Diagram Updates
```tsx
import React, { useState, useEffect } from 'react';
import { Srndpty } from 'srndpty';
import type { ReadableSpec, ReadableNode } from 'srndpty';

function LiveSystemMonitor() {
  const [spec, setSpec] = useState<ReadableSpec>({
    type: 'flow',
    direction: 'TB',
    nodes: [
      { 
        id: 'web', 
        label: 'Web Server',
        className: 'status-unknown',
        meta: { status: 'unknown', load: 0 }
      },
      { 
        id: 'api', 
        label: 'API Server',
        className: 'status-unknown',
        meta: { status: 'unknown', load: 0 }
      },
      { 
        id: 'db', 
        label: 'Database', 
        shape: 'cylinder',
        className: 'status-unknown',
        meta: { status: 'unknown', connections: 0 }
      }
    ],
    edges: [
      { from: 'web', to: 'api', label: 'requests' },
      { from: 'api', to: 'db', label: 'queries' }
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpec(prevSpec => ({
        ...prevSpec,
        nodes: prevSpec.nodes.map(node => {
          const statuses = ['healthy', 'warning', 'error'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            ...node,
            className: `status-${randomStatus}`,
            meta: {
              ...node.meta,
              status: randomStatus,
              lastUpdate: new Date().toLocaleTimeString(),
              load: Math.floor(Math.random() * 100)
            }
          };
        })
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (nodeId: string, node: ReadableNode) => {
    alert(`${node.label}\nStatus: ${node.meta?.status}\nLoad: ${node.meta?.load}%\nLast Update: ${node.meta?.lastUpdate}`);
  };

  return (
    <div>
      <h2>Live System Monitor</h2>
      <p>Status updates every 3 seconds</p>
      
      <style>{`
        .status-healthy { fill: #dcfce7 !important; stroke: #16a34a !important; }
        .status-warning { fill: #fef3c7 !important; stroke: #d97706 !important; }
        .status-error { fill: #fecaca !important; stroke: #dc2626 !important; animation: pulse 2s infinite; }
        .status-unknown { fill: #f1f5f9 !important; stroke: #64748b !important; }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div style={{ width: '100%', height: '500px' }}>
        <Srndpty 
          spec={spec}
          options={{
            onNodeClick: handleNodeClick,
            enablePanZoom: true
          }}
        />
      </div>
    </div>
  );
}
```

### Export and Sharing Features
```tsx
import React, { useRef, useCallback } from 'react';
import { Srndpty, SrndptyMethods } from 'srndpty';

function ExportableDiagram() {
  const diagramRef = useRef<SrndptyMethods>(null);

  const handleExportSVG = useCallback(async () => {
    try {
      await diagramRef.current?.exportSVG('system-architecture.svg');
      console.log('SVG exported successfully');
    } catch (error) {
      console.error('SVG export failed:', error);
    }
  }, []);

  const handleExportPNG = useCallback(async () => {
    try {
      await diagramRef.current?.exportPNG('system-architecture.png');
      console.log('PNG exported successfully');
    } catch (error) {
      console.error('PNG export failed:', error);
    }
  }, []);

  const handleShare = useCallback(() => {
    const specData = JSON.stringify(spec, null, 2);
    const blob = new Blob([specData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram-spec.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  const spec = {
    type: 'flow' as const,
    direction: 'LR' as const,
    nodes: [
      { id: 'frontend', label: 'Frontend\n(React)' },
      { id: 'backend', label: 'Backend\n(Node.js)' },
      { id: 'database', label: 'Database\n(PostgreSQL)', shape: 'cylinder' as const }
    ],
    edges: [
      { from: 'frontend', to: 'backend', label: 'API calls' },
      { from: 'backend', to: 'database', label: 'SQL queries' }
    ]
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={handleExportSVG}>Export as SVG</button>
        <button onClick={handleExportPNG}>Export as PNG</button>
        <button onClick={handleShare}>Share Spec</button>
      </div>
      
      <div style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}>
        <Srndpty 
          ref={diagramRef}
          spec={spec}
          options={{ enablePanZoom: true }}
        />
      </div>
    </div>
  );
}
```

## Best Practices for Common Use Cases

### 1. **System Architecture Diagrams**
- Use `hexagon` shapes for gateways and load balancers
- Use `cylinder` shapes for databases and storage
- Use `circle` shapes for external actors/users
- Group related services with `groups`
- Include technology stack in `meta` for click handlers

### 2. **Data Flow Diagrams**
- Use `stadium` shapes for start/end points
- Use `thick` edges for primary data flows
- Use `dotted` edges for optional or async flows
- Include data volume/frequency in edge labels
- Use `direction: 'LR'` for linear pipelines

### 3. **Business Process Flows**
- Use `diamond` shapes for decision points
- Use `stadium` shapes for start/end events
- Include SLA/timing information in `meta`
- Use different edge styles to show different outcomes
- Add `groups` to separate process phases

### 4. **Development Workflows**
- Use consistent naming for branch/environment nodes
- Include tool names and versions in `meta`
- Use `diamond` shapes for approval/gate steps
- Show parallel processes with appropriate grouping
- Include timing/SLA information for each step

### 5. **Interactive Monitoring Dashboards**
- Use CSS classes for status-based styling
- Update `meta` with real-time metrics
- Implement click handlers for detailed views
- Use animations for critical alerts
- Provide export capabilities for reporting
