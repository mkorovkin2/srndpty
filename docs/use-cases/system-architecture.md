# 🏗️ Use Case 2: Interactive System Architecture Diagrams

**Scenario**: You're a solutions architect documenting a microservices-based e-commerce platform for both development teams and business stakeholders. The diagram needs to show service relationships, data flows, external integrations, and be interactive for exploration.

## 📋 Overview

This use case demonstrates how to create comprehensive system architecture diagrams that show:
- **Microservices and their responsibilities**
- **External systems and third-party integrations**
- **Data flow patterns and API relationships**
- **Security boundaries and access patterns**
- **Scalability and deployment considerations**

## 🎯 Implementation

### Complete Working Example

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import { ReadableMermaid, type ReadableSpec } from '@readable/mermaid';

interface ServiceHealth {
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  uptime: number;
}

interface ArchitectureViewerProps {
  environment?: 'development' | 'staging' | 'production';
}

const SystemArchitectureViewer: React.FC<ArchitectureViewerProps> = ({ 
  environment = 'production' 
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showSecurityBoundaries, setShowSecurityBoundaries] = useState(true);
  const [serviceHealth, setServiceHealth] = useState<Record<string, ServiceHealth>>({});
  const [viewMode, setViewMode] = useState<'logical' | 'physical' | 'data'>('logical');

  // Mock service health data (in real app, this would come from monitoring)
  useEffect(() => {
    const mockHealthData: Record<string, ServiceHealth> = {
      'api_gateway': { status: 'healthy', responseTime: 45, uptime: 99.9 },
      'user_service': { status: 'healthy', responseTime: 32, uptime: 99.8 },
      'product_service': { status: 'warning', responseTime: 120, uptime: 99.5 },
      'order_service': { status: 'healthy', responseTime: 67, uptime: 99.7 },
      'payment_service': { status: 'healthy', responseTime: 89, uptime: 99.9 },
      'inventory_service': { status: 'error', responseTime: 0, uptime: 95.2 },
      'notification_service': { status: 'healthy', responseTime: 23, uptime: 99.6 }
    };
    
    setServiceHealth(mockHealthData);
  }, []);

  // Define the system architecture specification
  const architectureSpec: ReadableSpec = {
    type: 'flow',
    direction: 'TB',
    theme: 'default',
    
    nodes: [
      // External Users & Systems
      {
        id: 'web_users',
        label: 'Web Users\n(Customers)',
        shape: 'circle',
        className: 'external-user'
      },
      {
        id: 'mobile_users',
        label: 'Mobile Users\n(iOS/Android)',
        shape: 'circle',
        className: 'external-user'
      },
      {
        id: 'admin_users',
        label: 'Admin Users\n(Internal)',
        shape: 'circle',
        className: 'internal-user'
      },
      
      // Load Balancer & Gateway
      {
        id: 'load_balancer',
        label: 'Load Balancer\n(NGINX/HAProxy)',
        shape: 'hexagon',
        className: 'infrastructure'
      },
      {
        id: 'api_gateway',
        label: 'API Gateway\n(Kong/Zuul)',
        shape: 'hexagon',
        className: getServiceHealthClass('api_gateway', serviceHealth)
      },
      
      // Core Microservices
      {
        id: 'user_service',
        label: 'User Service\n(Authentication)',
        shape: 'rect',
        className: getServiceHealthClass('user_service', serviceHealth)
      },
      {
        id: 'product_service',
        label: 'Product Service\n(Catalog)',
        shape: 'rect',
        className: getServiceHealthClass('product_service', serviceHealth)
      },
      {
        id: 'order_service',
        label: 'Order Service\n(Processing)',
        shape: 'rect',
        className: getServiceHealthClass('order_service', serviceHealth)
      },
      {
        id: 'payment_service',
        label: 'Payment Service\n(Transactions)',
        shape: 'rect',
        className: getServiceHealthClass('payment_service', serviceHealth)
      },
      {
        id: 'inventory_service',
        label: 'Inventory Service\n(Stock Management)',
        shape: 'rect',
        className: getServiceHealthClass('inventory_service', serviceHealth)
      },
      {
        id: 'notification_service',
        label: 'Notification Service\n(Email/SMS)',
        shape: 'rect',
        className: getServiceHealthClass('notification_service', serviceHealth)
      },
      
      // Data Layer
      {
        id: 'user_db',
        label: 'User Database\n(PostgreSQL)',
        shape: 'cylinder',
        className: 'database'
      },
      {
        id: 'product_db',
        label: 'Product Database\n(MongoDB)',
        shape: 'cylinder',
        className: 'database'
      },
      {
        id: 'order_db',
        label: 'Order Database\n(PostgreSQL)',
        shape: 'cylinder',
        className: 'database'
      },
      {
        id: 'redis_cache',
        label: 'Redis Cache\n(Session/Product)',
        shape: 'cylinder',
        className: 'cache'
      },
      
      // Message Queue & Event Streaming
      {
        id: 'message_queue',
        label: 'Message Queue\n(RabbitMQ)',
        shape: 'stadium',
        className: 'messaging'
      },
      {
        id: 'event_stream',
        label: 'Event Stream\n(Apache Kafka)',
        shape: 'stadium',
        className: 'messaging'
      },
      
      // External Services
      {
        id: 'payment_gateway',
        label: 'Payment Gateway\n(Stripe/PayPal)',
        shape: 'hexagon',
        className: 'external-service'
      },
      {
        id: 'email_service',
        label: 'Email Service\n(SendGrid)',
        shape: 'hexagon',
        className: 'external-service'
      },
      {
        id: 'analytics',
        label: 'Analytics\n(Google Analytics)',
        shape: 'hexagon',
        className: 'external-service'
      },
      
      // Monitoring & Logging
      {
        id: 'monitoring',
        label: 'Monitoring\n(Prometheus)',
        shape: 'diamond',
        className: 'monitoring'
      },
      {
        id: 'logging',
        label: 'Centralized Logging\n(ELK Stack)',
        shape: 'diamond',
        className: 'monitoring'
      }
    ],
    
    edges: [
      // User traffic flows
      { from: 'web_users', to: 'load_balancer', label: 'HTTPS', style: 'thick' },
      { from: 'mobile_users', to: 'load_balancer', label: 'HTTPS', style: 'thick' },
      { from: 'admin_users', to: 'api_gateway', label: 'Admin API', style: 'solid' },
      { from: 'load_balancer', to: 'api_gateway', label: 'Route', style: 'thick' },
      
      // API Gateway to services
      { from: 'api_gateway', to: 'user_service', label: 'Auth/Profile' },
      { from: 'api_gateway', to: 'product_service', label: 'Catalog' },
      { from: 'api_gateway', to: 'order_service', label: 'Orders' },
      
      // Inter-service communication
      { from: 'order_service', to: 'user_service', label: 'Validate User' },
      { from: 'order_service', to: 'product_service', label: 'Product Info' },
      { from: 'order_service', to: 'inventory_service', label: 'Check Stock' },
      { from: 'order_service', to: 'payment_service', label: 'Process Payment' },
      { from: 'payment_service', to: 'payment_gateway', label: 'External Payment', style: 'dashed' },
      
      // Service to database connections
      { from: 'user_service', to: 'user_db', label: 'CRUD' },
      { from: 'product_service', to: 'product_db', label: 'CRUD' },
      { from: 'order_service', to: 'order_db', label: 'CRUD' },
      
      // Caching
      { from: 'user_service', to: 'redis_cache', label: 'Sessions', style: 'dotted' },
      { from: 'product_service', to: 'redis_cache', label: 'Hot Products', style: 'dotted' },
      
      // Asynchronous messaging
      { from: 'order_service', to: 'message_queue', label: 'Order Events' },
      { from: 'payment_service', to: 'event_stream', label: 'Payment Events' },
      { from: 'message_queue', to: 'notification_service', label: 'Notifications' },
      { from: 'message_queue', to: 'inventory_service', label: 'Stock Updates' },
      
      // External integrations
      { from: 'notification_service', to: 'email_service', label: 'Send Emails', style: 'dashed' },
      { from: 'api_gateway', to: 'analytics', label: 'Track Events', style: 'dotted' },
      
      // Monitoring flows
      { from: 'api_gateway', to: 'monitoring', label: 'Metrics', style: 'dotted' },
      { from: 'user_service', to: 'monitoring', label: 'Metrics', style: 'dotted' },
      { from: 'order_service', to: 'monitoring', label: 'Metrics', style: 'dotted' },
      { from: 'payment_service', to: 'logging', label: 'Audit Logs', style: 'dotted' }
    ],
    
    groups: showSecurityBoundaries ? [
      {
        id: 'dmz',
        label: 'DMZ (Public Network)',
        nodes: ['load_balancer', 'api_gateway']
      },
      {
        id: 'app_tier',
        label: 'Application Tier (Private Network)',
        nodes: ['user_service', 'product_service', 'order_service', 'payment_service', 'inventory_service', 'notification_service']
      },
      {
        id: 'data_tier',
        label: 'Data Tier (Isolated Network)',
        nodes: ['user_db', 'product_db', 'order_db', 'redis_cache']
      },
      {
        id: 'messaging_tier',
        label: 'Messaging Tier',
        nodes: ['message_queue', 'event_stream']
      },
      {
        id: 'external',
        label: 'External Services',
        nodes: ['payment_gateway', 'email_service', 'analytics']
      },
      {
        id: 'operations',
        label: 'Operations & Monitoring',
        nodes: ['monitoring', 'logging']
      }
    ] : [],
    
    legend: [
      { swatch: 'primary', label: 'Core Services' },
      { swatch: 'accent', label: 'Infrastructure' },
      { swatch: 'success', label: 'Healthy Services' },
      { swatch: 'warning', label: 'Warning Status' },
      { swatch: 'danger', label: 'Critical Issues' },
      { swatch: 'info', label: 'External Systems' }
    ]
  };

  // Handle service selection for details
  const handleNodeClick = useCallback((nodeId: string, node: any) => {
    setSelectedService(nodeId);
    console.log(`Selected service: ${nodeId}`, node);
  }, []);

  // Handle edge clicks to show integration details
  const handleEdgeClick = useCallback((edge: any) => {
    const integrationInfo = getIntegrationDetails(edge.from, edge.to);
    alert(`Integration: ${edge.from} → ${edge.to}\n${integrationInfo}`);
  }, []);

  // Get service details for the selected service
  const getServiceDetails = (serviceId: string) => {
    const serviceDetails: Record<string, any> = {
      'api_gateway': {
        name: 'API Gateway',
        technology: 'Kong Gateway',
        purpose: 'Central entry point for all client requests',
        responsibilities: [
          'Request routing and load balancing',
          'Authentication and authorization',
          'Rate limiting and throttling',
          'Request/response transformation',
          'API versioning and deprecation'
        ],
        endpoints: [
          'GET /api/v1/users',
          'POST /api/v1/orders',
          'GET /api/v1/products'
        ],
        constraints: [
          'Single point of failure if not properly clustered',
          'Can become a bottleneck under high load',
          'Requires careful configuration management'
        ],
        deployment: {
          instances: 3,
          cpu: '2 cores',
          memory: '4GB',
          storage: '20GB'
        }
      },
      'user_service': {
        name: 'User Service',
        technology: 'Node.js + Express',
        purpose: 'Manages user accounts, authentication, and profiles',
        responsibilities: [
          'User registration and login',
          'Profile management',
          'Password reset and recovery',
          'JWT token generation and validation',
          'User preferences and settings'
        ],
        database: 'PostgreSQL (user_db)',
        constraints: [
          'GDPR compliance required for EU users',
          'PII data must be encrypted at rest',
          'Session management requires Redis availability'
        ],
        deployment: {
          instances: 5,
          cpu: '1 core',
          memory: '2GB',
          storage: '10GB'
        }
      },
      'order_service': {
        name: 'Order Service',
        technology: 'Java Spring Boot',
        purpose: 'Handles order processing and workflow orchestration',
        responsibilities: [
          'Order creation and validation',
          'Inventory checking and reservation',
          'Payment processing coordination',
          'Order status tracking',
          'Order history and reporting'
        ],
        database: 'PostgreSQL (order_db)',
        constraints: [
          'Requires distributed transaction handling',
          'High consistency requirements',
          'Must handle payment failures gracefully'
        ],
        deployment: {
          instances: 4,
          cpu: '2 cores',
          memory: '4GB',
          storage: '50GB'
        }
      },
      'payment_service': {
        name: 'Payment Service',
        technology: 'Python Django + Celery',
        purpose: 'Secure payment processing and financial transactions',
        responsibilities: [
          'Payment method validation',
          'Transaction processing',
          'Refund and chargeback handling',
          'PCI compliance maintenance',
          'Financial reporting and reconciliation'
        ],
        constraints: [
          'PCI DSS compliance required',
          'No sensitive payment data storage',
          'Requires secure communication with payment gateways',
          'Must maintain detailed audit logs'
        ],
        deployment: {
          instances: 3,
          cpu: '2 cores',
          memory: '3GB',
          storage: '30GB'
        }
      }
    };
    
    return serviceDetails[serviceId] || null;
  };

  // Get integration details between services
  const getIntegrationDetails = (fromService: string, toService: string) => {
    const integrations: Record<string, string> = {
      'api_gateway_user_service': 'REST API calls for authentication and user profile operations',
      'order_service_payment_service': 'Synchronous API calls for payment processing with timeout handling',
      'payment_service_payment_gateway': 'HTTPS webhook integration with external payment providers',
      'order_service_message_queue': 'Asynchronous event publishing for order state changes',
      'notification_service_email_service': 'SMTP/API integration for transactional emails'
    };
    
    const key = `${fromService}_${toService}`;
    return integrations[key] || 'Direct service-to-service communication';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>🏗️ E-Commerce Platform Architecture ({environment})</h2>
        
        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          alignItems: 'center'
        }}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={showSecurityBoundaries}
                onChange={(e) => setShowSecurityBoundaries(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show Security Boundaries
            </label>
          </div>
          
          <div>
            <label style={{ marginRight: '8px' }}>View Mode:</label>
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as any)}
              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="logical">Logical View</option>
              <option value="physical">Physical Deployment</option>
              <option value="data">Data Flow</option>
            </select>
          </div>
          
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ 
              padding: '4px 8px', 
              backgroundColor: '#dcfce7', 
              color: '#166534',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Environment: {environment.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '700px' }}>
        {/* Main architecture diagram */}
        <div style={{ flex: 1 }}>
          <ReadableMermaid
            spec={architectureSpec}
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

        {/* Service details panel */}
        <div style={{ 
          width: '350px', 
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowY: 'auto'
        }}>
          <h3>Service Details</h3>
          
          {selectedService ? (
            <div>
              {(() => {
                const details = getServiceDetails(selectedService);
                const health = serviceHealth[selectedService];
                
                if (details) {
                  return (
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '15px' 
                      }}>
                        <h4 style={{ color: '#0ea5e9', margin: '0', marginRight: '10px' }}>
                          {details.name}
                        </h4>
                        {health && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: health.status === 'healthy' ? '#dcfce7' : 
                                           health.status === 'warning' ? '#fef3c7' : '#fef2f2',
                            color: health.status === 'healthy' ? '#166534' : 
                                   health.status === 'warning' ? '#92400e' : '#dc2626'
                          }}>
                            {health.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <p><strong>Technology:</strong> {details.technology}</p>
                        <p><strong>Purpose:</strong> {details.purpose}</p>
                      </div>
                      
                      {health && (
                        <div style={{ marginBottom: '15px' }}>
                          <h5>Health Metrics</h5>
                          <p><strong>Response Time:</strong> {health.responseTime}ms</p>
                          <p><strong>Uptime:</strong> {health.uptime}%</p>
                        </div>
                      )}
                      
                      <div style={{ marginBottom: '15px' }}>
                        <h5>Responsibilities</h5>
                        <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                          {details.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index} style={{ marginBottom: '3px', fontSize: '14px' }}>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {details.endpoints && (
                        <div style={{ marginBottom: '15px' }}>
                          <h5>Key Endpoints</h5>
                          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                            {details.endpoints.map((endpoint: string, index: number) => (
                              <li key={index} style={{ 
                                marginBottom: '3px', 
                                fontSize: '13px', 
                                fontFamily: 'monospace',
                                backgroundColor: '#f1f5f9',
                                padding: '2px 4px',
                                borderRadius: '3px'
                              }}>
                                {endpoint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div style={{ marginBottom: '15px' }}>
                        <h5>Deployment</h5>
                        <p><strong>Instances:</strong> {details.deployment.instances}</p>
                        <p><strong>Resources:</strong> {details.deployment.cpu}, {details.deployment.memory}</p>
                        <p><strong>Storage:</strong> {details.deployment.storage}</p>
                      </div>
                      
                      <div>
                        <h5>Constraints & Considerations</h5>
                        <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                          {details.constraints.map((constraint: string, index: number) => (
                            <li key={index} style={{ 
                              marginBottom: '3px', 
                              fontSize: '13px',
                              color: '#dc2626'
                            }}>
                              {constraint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div>
                    <h4 style={{ color: '#0ea5e9' }}>
                      {architectureSpec.nodes.find(n => n.id === selectedService)?.label}
                    </h4>
                    <p>No detailed information available for this component.</p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>
              Click on any service in the diagram to see detailed information including 
              health status, deployment details, and architectural constraints.
            </p>
          )}
        </div>
      </div>

      {/* CSS for custom styling */}
      <style jsx>{`
        .external-user {
          fill: #dbeafe !important;
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
        }
        
        .internal-user {
          fill: #f0f9ff !important;
          stroke: #0ea5e9 !important;
          stroke-width: 2px !important;
        }
        
        .infrastructure {
          fill: #f3f4f6 !important;
          stroke: #6b7280 !important;
          stroke-width: 2px !important;
        }
        
        .service-healthy {
          fill: #dcfce7 !important;
          stroke: #16a34a !important;
          stroke-width: 2px !important;
        }
        
        .service-warning {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 2px !important;
        }
        
        .service-error {
          fill: #fef2f2 !important;
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
        }
        
        .database {
          fill: #ecfdf5 !important;
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
        
        .cache {
          fill: #f3e8ff !important;
          stroke: #8b5cf6 !important;
          stroke-width: 2px !important;
        }
        
        .messaging {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 2px !important;
        }
        
        .external-service {
          fill: #fff7ed !important;
          stroke: #ea580c !important;
          stroke-width: 2px !important;
          stroke-dasharray: 5,5 !important;
        }
        
        .monitoring {
          fill: #fafaf9 !important;
          stroke: #6b7280 !important;
          stroke-width: 2px !important;
        }
      `}</style>
    </div>
  );
};

// Helper function to determine service health CSS class
function getServiceHealthClass(serviceId: string, healthData: Record<string, ServiceHealth>): string {
  const health = healthData[serviceId];
  if (!health) return 'infrastructure';
  
  switch (health.status) {
    case 'healthy': return 'service-healthy';
    case 'warning': return 'service-warning';
    case 'error': return 'service-error';
    default: return 'infrastructure';
  }
}

export default SystemArchitectureViewer;
```

## 📊 Expected Output

The implementation creates a comprehensive system architecture diagram showing:

1. **User Layer**: Web users, mobile users, and admin users
2. **Infrastructure Layer**: Load balancer and API gateway
3. **Service Layer**: Core microservices (User, Product, Order, Payment, Inventory, Notification)
4. **Data Layer**: Databases and caching systems
5. **Integration Layer**: Message queues and event streams
6. **External Layer**: Third-party services and integrations
7. **Operations Layer**: Monitoring and logging systems

**Interactive Features:**
- **Health-based color coding** for services
- **Security boundary groupings** (toggleable)
- **Detailed service information** on click
- **Integration details** for service connections
- **Environment-specific configurations**

## ⚙️ Key Implementation Details

### 1. Health-Aware Visualization

```typescript
// Dynamic styling based on service health
const getServiceHealthClass = (serviceId: string, healthData: Record<string, ServiceHealth>) => {
  const health = healthData[serviceId];
  return health?.status === 'healthy' ? 'service-healthy' :
         health?.status === 'warning' ? 'service-warning' :
         health?.status === 'error' ? 'service-error' : 'infrastructure';
};

// Real-time health updates
useEffect(() => {
  const healthInterval = setInterval(async () => {
    const healthData = await fetchServiceHealth();
    setServiceHealth(healthData);
  }, 30000); // Update every 30 seconds
  
  return () => clearInterval(healthInterval);
}, []);
```

### 2. Multi-View Architecture

```typescript
// Different architectural views for different audiences
const getArchitectureSpec = (viewMode: string) => {
  switch (viewMode) {
    case 'logical':
      return logicalArchitectureSpec;  // Service relationships
    case 'physical':
      return physicalDeploymentSpec;   // Infrastructure and deployment
    case 'data':
      return dataFlowSpec;            // Data movement and storage
    default:
      return logicalArchitectureSpec;
  }
};
```

### 3. Security Boundary Visualization

```typescript
// Conditional grouping for security zones
const securityGroups = showSecurityBoundaries ? [
  {
    id: 'dmz',
    label: 'DMZ (Public Network)',
    nodes: ['load_balancer', 'api_gateway']
  },
  {
    id: 'app_tier',
    label: 'Application Tier (Private Network)',
    nodes: ['user_service', 'product_service', /* ... */]
  },
  // ... more security zones
] : [];
```

### 4. Comprehensive Service Metadata

```typescript
interface ServiceMetadata {
  name: string;
  technology: string;
  purpose: string;
  responsibilities: string[];
  constraints: string[];
  deployment: {
    instances: number;
    cpu: string;
    memory: string;
    storage: string;
  };
  endpoints?: string[];
  database?: string;
}
```

## 🚨 Constraints and Gotchas

### 1. **Diagram Complexity Management**

**Issue**: Large systems can result in overwhelming diagrams with 30+ services.

```typescript
// ❌ Problematic: Everything in one diagram
const monolithicDiagram = {
  nodes: [/* 50+ services */],
  edges: [/* 100+ connections */]
};

// ✅ Solution: Hierarchical views with drill-down
const systemOverview = {
  nodes: [
    { id: 'frontend', label: 'Frontend Layer\n(3 applications)' },
    { id: 'api_layer', label: 'API Layer\n(5 services)' },
    { id: 'business_layer', label: 'Business Services\n(12 services)' },
    { id: 'data_layer', label: 'Data Layer\n(8 systems)' }
  ]
};

// Separate detailed views for each layer
const apiLayerDetail = {
  nodes: [/* Detailed API services */]
};
```

### 2. **Real-time Data Integration Challenges**

**Issue**: Service health and metrics change frequently but diagrams are static.

```typescript
// ❌ Problematic: Trying to update diagram structure for data changes
const updateDiagramForHealth = (health: ServiceHealth) => {
  // Don't modify the diagram structure for data changes
  setArchitectureSpec(prev => ({
    ...prev,
    nodes: prev.nodes.map(node => ({
      ...node,
      label: `${node.label}\n${health.status}` // This gets messy
    }))
  }));
};

// ✅ Solution: Separate data state from diagram structure
const [serviceHealth, setServiceHealth] = useState<Record<string, ServiceHealth>>({});

// Use CSS classes for visual changes
const getServiceClass = (serviceId: string) => {
  const health = serviceHealth[serviceId];
  return `service-${health?.status || 'unknown'}`;
};
```

### 3. **Cross-Service Communication Complexity**

**Issue**: Modern microservices have complex interaction patterns that can clutter diagrams.

```typescript
// ❌ Problematic: Showing every possible service interaction
const allInteractions = {
  edges: [
    { from: 'service_a', to: 'service_b' },
    { from: 'service_a', to: 'service_c' },
    { from: 'service_b', to: 'service_c' },
    // ... 50+ more edges
  ]
};

// ✅ Solution: Show only primary flows, use interaction details on demand
const primaryFlows = {
  edges: [
    { from: 'api_gateway', to: 'user_service', label: 'Primary Auth' },
    { from: 'order_service', to: 'payment_service', label: 'Critical Path' }
  ]
};

// Show secondary interactions in details panel or separate views
const getServiceInteractions = (serviceId: string) => {
  return secondaryInteractions.filter(edge => 
    edge.from === serviceId || edge.to === serviceId
  );
};
```

### 4. **Environment-Specific Differences**

**Constraint**: Different environments (dev/staging/prod) have different architectures.

```typescript
// ❌ Problematic: Single diagram for all environments
const staticDiagram = {
  nodes: [/* Fixed structure */]
};

// ✅ Solution: Environment-aware diagram generation
const getEnvironmentSpec = (environment: string): ReadableSpec => {
  const baseSpec = getBaseArchitecture();
  
  switch (environment) {
    case 'development':
      return {
        ...baseSpec,
        nodes: baseSpec.nodes.filter(node => !node.id.includes('load_balancer')),
        // Remove load balancer in dev
      };
    case 'production':
      return {
        ...baseSpec,
        nodes: [
          ...baseSpec.nodes,
          { id: 'cdn', label: 'CDN\n(CloudFlare)', shape: 'hexagon' }
        ]
        // Add CDN in production
      };
    default:
      return baseSpec;
  }
};
```

### 5. **Performance with Large Diagrams**

**Issue**: Rendering performance degrades with many nodes and complex styling.

```typescript
// ❌ Problematic: Complex CSS and many DOM manipulations
const complexStyling = `
  .service-node {
    fill: linear-gradient(45deg, #color1, #color2);
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    transition: all 0.3s ease;
  }
  .service-node:hover {
    transform: scale(1.1);
  }
`;

// ✅ Solution: Simple, efficient styling
const simpleStyling = `
  .service-healthy { fill: #dcfce7 !important; stroke: #16a34a !important; }
  .service-warning { fill: #fef3c7 !important; stroke: #f59e0b !important; }
  .service-error { fill: #fef2f2 !important; stroke: #ef4444 !important; }
`;

// Lazy load detailed information
const getServiceDetails = useMemo(() => {
  return (serviceId: string) => {
    if (detailsCache[serviceId]) {
      return detailsCache[serviceId];
    }
    // Load only when needed
    return loadServiceDetails(serviceId);
  };
}, []);
```

## 🎯 Best Practices

### 1. **Layered Architecture Representation**

```typescript
// Organize services by architectural layers
const architectureLayers = {
  presentation: ['web_app', 'mobile_app', 'admin_portal'],
  api: ['api_gateway', 'bff_web', 'bff_mobile'],
  business: ['user_service', 'order_service', 'payment_service'],
  data: ['user_db', 'order_db', 'cache', 'message_queue']
};

// Use consistent positioning and grouping
const getNodePosition = (serviceId: string) => {
  const layer = findServiceLayer(serviceId);
  return layerPositions[layer];
};
```

### 2. **Consistent Service Categorization**

```typescript
// Define service types with consistent styling
const serviceTypes = {
  gateway: { shape: 'hexagon', className: 'infrastructure' },
  business: { shape: 'rect', className: 'business-service' },
  data: { shape: 'cylinder', className: 'data-service' },
  external: { shape: 'hexagon', className: 'external-service' },
  monitoring: { shape: 'diamond', className: 'monitoring-service' }
};

const createServiceNode = (id: string, label: string, type: keyof typeof serviceTypes) => ({
  id,
  label,
  ...serviceTypes[type]
});
```

### 3. **Progressive Disclosure Pattern**

```typescript
// Start with high-level view
const systemOverview = {
  nodes: [
    { id: 'frontend_tier', label: 'Frontend Applications' },
    { id: 'backend_tier', label: 'Backend Services' },
    { id: 'data_tier', label: 'Data Systems' }
  ]
};

// Drill down on user interaction
const handleTierClick = (tierId: string) => {
  const detailedView = getDetailedViewForTier(tierId);
  setCurrentView(detailedView);
};
```

### 4. **Integration Pattern Documentation**

```typescript
// Document integration patterns in edge metadata
const integrationPatterns = {
  'api_gateway_user_service': {
    pattern: 'Synchronous REST API',
    protocol: 'HTTPS',
    authentication: 'JWT Bearer Token',
    timeout: '5 seconds',
    retryPolicy: '3 attempts with exponential backoff',
    circuitBreaker: true
  },
  'order_service_message_queue': {
    pattern: 'Asynchronous Event Publishing',
    protocol: 'AMQP',
    durability: 'Persistent messages',
    ordering: 'Per-customer ordering guaranteed'
  }
};
```

## 📈 Advanced Features

### 1. **Multi-Environment Comparison**

```typescript
const EnvironmentComparison: React.FC = () => {
  const [environments] = useState(['development', 'staging', 'production']);
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {environments.map(env => (
        <div key={env}>
          <h3>{env.toUpperCase()}</h3>
          <ReadableMermaid 
            spec={getEnvironmentSpec(env)}
            options={{ height: 400 }}
          />
        </div>
      ))}
    </div>
  );
};
```

### 2. **Service Dependency Analysis**

```typescript
// Analyze service dependencies for impact assessment
const analyzeServiceDependencies = (serviceId: string) => {
  const dependencies = {
    upstream: getUpstreamServices(serviceId),
    downstream: getDownstreamServices(serviceId),
    criticalPath: isCriticalPath(serviceId)
  };
  
  return dependencies;
};

// Highlight dependency chains
const highlightDependencyChain = (serviceId: string) => {
  const chain = getDependencyChain(serviceId);
  
  setArchitectureSpec(prev => ({
    ...prev,
    edges: prev.edges.map(edge => ({
      ...edge,
      className: chain.includes(edge.from) && chain.includes(edge.to) 
        ? 'critical-path' 
        : edge.className
    }))
  }));
};
```

### 3. **Capacity and Scaling Visualization**

```typescript
// Show service capacity and scaling information
const getServiceCapacityInfo = (serviceId: string) => {
  return {
    currentInstances: 3,
    maxInstances: 10,
    cpuUtilization: 65,
    memoryUtilization: 78,
    scalingTriggers: ['CPU > 80%', 'Memory > 85%', 'Queue depth > 100']
  };
};

// Visual indicators for capacity
const getCapacityIndicator = (utilization: number) => {
  if (utilization > 80) return '🔴'; // High utilization
  if (utilization > 60) return '🟡'; // Medium utilization
  return '🟢'; // Low utilization
};
```

This use case demonstrates how to create comprehensive, interactive system architecture diagrams that serve both technical teams and business stakeholders while handling the complexity and real-world constraints of modern distributed systems.
