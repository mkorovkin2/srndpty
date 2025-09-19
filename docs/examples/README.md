# 📚 Examples Gallery

A comprehensive collection of diagram examples showcasing different patterns, use cases, and features of Readable Mermaid.

## 🎯 Basic Examples

### Simple Linear Flow

A basic process flow with sequential steps.

```typescript
const linearFlow: ReadableSpec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'start', label: 'Start', shape: 'stadium' },
    { id: 'step1', label: 'Process Input' },
    { id: 'step2', label: 'Validate Data' },
    { id: 'step3', label: 'Save Result' },
    { id: 'end', label: 'Complete', shape: 'stadium' }
  ],
  edges: [
    { from: 'start', to: 'step1' },
    { from: 'step1', to: 'step2' },
    { from: 'step2', to: 'step3' },
    { from: 'step3', to: 'end' }
  ]
};
```

**Output:** A horizontal flow showing a simple 5-step process from start to completion.

**Use Cases:** Onboarding flows, simple workflows, process documentation

---

### Decision Tree

A flowchart with conditional branching.

```typescript
const decisionTree: ReadableSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'start', label: 'User Request', shape: 'stadium' },
    { id: 'auth', label: 'Authenticated?', shape: 'diamond' },
    { id: 'validate', label: 'Valid Input?', shape: 'diamond' },
    { id: 'process', label: 'Process Request' },
    { id: 'success', label: 'Return Success', shape: 'stadium' },
    { id: 'auth_error', label: 'Authentication\nError', shape: 'stadium' },
    { id: 'validation_error', label: 'Validation\nError', shape: 'stadium' }
  ],
  edges: [
    { from: 'start', to: 'auth' },
    { from: 'auth', to: 'validate', label: 'yes', style: 'solid' },
    { from: 'auth', to: 'auth_error', label: 'no', style: 'dotted' },
    { from: 'validate', to: 'process', label: 'valid', style: 'solid' },
    { from: 'validate', to: 'validation_error', label: 'invalid', style: 'dotted' },
    { from: 'process', to: 'success' }
  ]
};
```

**Output:** A vertical decision tree with multiple conditional branches and error paths.

**Use Cases:** API request flows, user input validation, error handling documentation

---

### System Components

A diagram showing system components and their relationships.

```typescript
const systemComponents: ReadableSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'user', label: 'User', shape: 'circle' },
    { id: 'frontend', label: 'React App\n(Frontend)' },
    { id: 'api', label: 'REST API\n(Backend)', shape: 'hexagon' },
    { id: 'auth', label: 'Auth Service', shape: 'hexagon' },
    { id: 'database', label: 'PostgreSQL\nDatabase', shape: 'cylinder' },
    { id: 'cache', label: 'Redis Cache', shape: 'cylinder' },
    { id: 'queue', label: 'Message Queue', shape: 'stadium' }
  ],
  edges: [
    { from: 'user', to: 'frontend', label: 'interacts' },
    { from: 'frontend', to: 'api', label: 'HTTP/JSON' },
    { from: 'api', to: 'auth', label: 'validate token' },
    { from: 'api', to: 'database', label: 'query/update' },
    { from: 'api', to: 'cache', label: 'read/write', style: 'dotted' },
    { from: 'api', to: 'queue', label: 'publish events', style: 'dashed' }
  ],
  groups: [
    {
      id: 'backend',
      label: 'Backend Services',
      nodes: ['api', 'auth', 'database', 'cache', 'queue']
    }
  ]
};
```

**Output:** A system architecture diagram with grouped backend services.

**Use Cases:** Architecture documentation, system overviews, technical presentations

---

## 🏢 Business Process Examples

### Customer Support Workflow

A customer support ticket processing workflow.

```typescript
const supportWorkflow: ReadableSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'ticket_created', label: 'Ticket Created', shape: 'stadium' },
    { id: 'auto_categorize', label: 'Auto-Categorize\nTicket' },
    { id: 'priority_check', label: 'High Priority?', shape: 'diamond' },
    { id: 'assign_specialist', label: 'Assign to\nSpecialist' },
    { id: 'assign_general', label: 'Assign to\nGeneral Queue' },
    { id: 'agent_review', label: 'Agent Reviews\nTicket' },
    { id: 'needs_escalation', label: 'Needs\nEscalation?', shape: 'diamond' },
    { id: 'escalate', label: 'Escalate to\nManager' },
    { id: 'resolve', label: 'Resolve Ticket' },
    { id: 'customer_satisfied', label: 'Customer\nSatisfied?', shape: 'diamond' },
    { id: 'reopen', label: 'Reopen Ticket' },
    { id: 'close', label: 'Close Ticket', shape: 'stadium' },
    { id: 'send_survey', label: 'Send Feedback\nSurvey' }
  ],
  edges: [
    { from: 'ticket_created', to: 'auto_categorize' },
    { from: 'auto_categorize', to: 'priority_check' },
    { from: 'priority_check', to: 'assign_specialist', label: 'high', style: 'thick' },
    { from: 'priority_check', to: 'assign_general', label: 'normal' },
    { from: 'assign_specialist', to: 'agent_review' },
    { from: 'assign_general', to: 'agent_review' },
    { from: 'agent_review', to: 'needs_escalation' },
    { from: 'needs_escalation', to: 'escalate', label: 'yes', style: 'dotted' },
    { from: 'needs_escalation', to: 'resolve', label: 'no' },
    { from: 'escalate', to: 'resolve' },
    { from: 'resolve', to: 'customer_satisfied' },
    { from: 'customer_satisfied', to: 'reopen', label: 'no', style: 'dotted' },
    { from: 'customer_satisfied', to: 'close', label: 'yes' },
    { from: 'reopen', to: 'agent_review' },
    { from: 'close', to: 'send_survey' }
  ],
  groups: [
    {
      id: 'intake',
      label: 'Ticket Intake',
      nodes: ['ticket_created', 'auto_categorize', 'priority_check']
    },
    {
      id: 'assignment',
      label: 'Assignment Logic',
      nodes: ['assign_specialist', 'assign_general']
    },
    {
      id: 'resolution',
      label: 'Resolution Process',
      nodes: ['agent_review', 'needs_escalation', 'escalate', 'resolve']
    },
    {
      id: 'closure',
      label: 'Ticket Closure',
      nodes: ['customer_satisfied', 'reopen', 'close', 'send_survey']
    }
  ]
};
```

**Output:** A comprehensive support workflow with multiple decision points and feedback loops.

**Use Cases:** Process documentation, training materials, workflow optimization

---

### E-commerce Order Processing

An e-commerce order fulfillment process.

```typescript
const orderProcessing: ReadableSpec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'order_placed', label: 'Order Placed', shape: 'stadium' },
    { id: 'payment_check', label: 'Payment\nProcessed?', shape: 'diamond' },
    { id: 'inventory_check', label: 'Items in\nStock?', shape: 'diamond' },
    { id: 'reserve_inventory', label: 'Reserve\nInventory' },
    { id: 'pick_items', label: 'Pick Items\nfrom Warehouse' },
    { id: 'quality_check', label: 'Quality\nInspection' },
    { id: 'pack_order', label: 'Pack Order' },
    { id: 'ship_order', label: 'Ship Order' },
    { id: 'track_shipment', label: 'Tracking\nGenerated' },
    { id: 'delivered', label: 'Delivered', shape: 'stadium' },
    { id: 'payment_failed', label: 'Payment\nFailed', shape: 'stadium' },
    { id: 'out_of_stock', label: 'Backorder\nCreated', shape: 'stadium' },
    { id: 'quality_failed', label: 'Return to\nInventory' }
  ],
  edges: [
    { from: 'order_placed', to: 'payment_check' },
    { from: 'payment_check', to: 'inventory_check', label: 'success', style: 'thick' },
    { from: 'payment_check', to: 'payment_failed', label: 'failed', style: 'dotted' },
    { from: 'inventory_check', to: 'reserve_inventory', label: 'available', style: 'thick' },
    { from: 'inventory_check', to: 'out_of_stock', label: 'unavailable', style: 'dotted' },
    { from: 'reserve_inventory', to: 'pick_items' },
    { from: 'pick_items', to: 'quality_check' },
    { from: 'quality_check', to: 'pack_order', label: 'pass' },
    { from: 'quality_check', to: 'quality_failed', label: 'fail', style: 'dotted' },
    { from: 'quality_failed', to: 'pick_items' },
    { from: 'pack_order', to: 'ship_order' },
    { from: 'ship_order', to: 'track_shipment' },
    { from: 'track_shipment', to: 'delivered' }
  ],
  legend: [
    { swatch: 'primary', label: 'Main Process' },
    { swatch: 'success', label: 'Success Path' },
    { swatch: 'warning', label: 'Error Handling' }
  ]
};
```

**Output:** A horizontal order processing flow with error handling and quality checks.

**Use Cases:** Operations documentation, process training, system design

---

## 🔧 Technical Examples

### CI/CD Pipeline

A continuous integration and deployment pipeline.

```typescript
const cicdPipeline: ReadableSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'code_commit', label: 'Code Commit', shape: 'stadium' },
    { id: 'trigger_build', label: 'Trigger Build' },
    { id: 'run_tests', label: 'Run Unit Tests' },
    { id: 'tests_pass', label: 'Tests Pass?', shape: 'diamond' },
    { id: 'build_image', label: 'Build Docker\nImage' },
    { id: 'security_scan', label: 'Security Scan' },
    { id: 'scan_clean', label: 'Scan Clean?', shape: 'diamond' },
    { id: 'deploy_staging', label: 'Deploy to\nStaging' },
    { id: 'integration_tests', label: 'Integration\nTests' },
    { id: 'manual_approval', label: 'Manual\nApproval', shape: 'diamond' },
    { id: 'deploy_prod', label: 'Deploy to\nProduction' },
    { id: 'health_check', label: 'Health Check' },
    { id: 'rollback', label: 'Rollback\nDeployment' },
    { id: 'notify_team', label: 'Notify Team' },
    { id: 'test_failed', label: 'Test Failed\nNotification', shape: 'stadium' },
    { id: 'security_failed', label: 'Security Issue\nFound', shape: 'stadium' },
    { id: 'deploy_success', label: 'Deployment\nComplete', shape: 'stadium' }
  ],
  edges: [
    { from: 'code_commit', to: 'trigger_build' },
    { from: 'trigger_build', to: 'run_tests' },
    { from: 'run_tests', to: 'tests_pass' },
    { from: 'tests_pass', to: 'build_image', label: 'pass', style: 'thick' },
    { from: 'tests_pass', to: 'test_failed', label: 'fail', style: 'dotted' },
    { from: 'build_image', to: 'security_scan' },
    { from: 'security_scan', to: 'scan_clean' },
    { from: 'scan_clean', to: 'deploy_staging', label: 'clean', style: 'thick' },
    { from: 'scan_clean', to: 'security_failed', label: 'issues', style: 'dotted' },
    { from: 'deploy_staging', to: 'integration_tests' },
    { from: 'integration_tests', to: 'manual_approval' },
    { from: 'manual_approval', to: 'deploy_prod', label: 'approved', style: 'thick' },
    { from: 'deploy_prod', to: 'health_check' },
    { from: 'health_check', to: 'deploy_success', label: 'healthy' },
    { from: 'health_check', to: 'rollback', label: 'unhealthy', style: 'dotted' },
    { from: 'rollback', to: 'notify_team' },
    { from: 'deploy_success', to: 'notify_team' }
  ],
  groups: [
    {
      id: 'build_phase',
      label: 'Build & Test',
      nodes: ['trigger_build', 'run_tests', 'tests_pass', 'build_image']
    },
    {
      id: 'security_phase',
      label: 'Security',
      nodes: ['security_scan', 'scan_clean']
    },
    {
      id: 'deploy_phase',
      label: 'Deployment',
      nodes: ['deploy_staging', 'integration_tests', 'manual_approval', 'deploy_prod']
    },
    {
      id: 'verification_phase',
      label: 'Verification',
      nodes: ['health_check', 'rollback', 'notify_team']
    }
  ]
};
```

**Output:** A comprehensive CI/CD pipeline with multiple stages, security checks, and rollback capabilities.

**Use Cases:** DevOps documentation, pipeline design, team onboarding

---

### Database Migration Process

A database schema migration workflow.

```typescript
const dbMigration: ReadableSpec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'migration_request', label: 'Migration\nRequest', shape: 'stadium' },
    { id: 'backup_db', label: 'Backup Current\nDatabase', shape: 'cylinder' },
    { id: 'validate_migration', label: 'Validate\nMigration Script' },
    { id: 'dry_run', label: 'Dry Run on\nTest Environment' },
    { id: 'dry_run_success', label: 'Dry Run\nSuccess?', shape: 'diamond' },
    { id: 'schedule_maintenance', label: 'Schedule\nMaintenance Window' },
    { id: 'enable_maintenance', label: 'Enable\nMaintenance Mode' },
    { id: 'run_migration', label: 'Execute\nMigration' },
    { id: 'verify_schema', label: 'Verify Schema\nChanges' },
    { id: 'run_tests', label: 'Run Integration\nTests' },
    { id: 'migration_success', label: 'Migration\nSuccessful?', shape: 'diamond' },
    { id: 'disable_maintenance', label: 'Disable\nMaintenance Mode' },
    { id: 'restore_backup', label: 'Restore from\nBackup', shape: 'cylinder' },
    { id: 'investigate_failure', label: 'Investigate\nFailure' },
    { id: 'migration_complete', label: 'Migration\nComplete', shape: 'stadium' },
    { id: 'fix_script', label: 'Fix Migration\nScript' }
  ],
  edges: [
    { from: 'migration_request', to: 'backup_db' },
    { from: 'backup_db', to: 'validate_migration' },
    { from: 'validate_migration', to: 'dry_run' },
    { from: 'dry_run', to: 'dry_run_success' },
    { from: 'dry_run_success', to: 'schedule_maintenance', label: 'success', style: 'thick' },
    { from: 'dry_run_success', to: 'fix_script', label: 'failure', style: 'dotted' },
    { from: 'fix_script', to: 'validate_migration' },
    { from: 'schedule_maintenance', to: 'enable_maintenance' },
    { from: 'enable_maintenance', to: 'run_migration' },
    { from: 'run_migration', to: 'verify_schema' },
    { from: 'verify_schema', to: 'run_tests' },
    { from: 'run_tests', to: 'migration_success' },
    { from: 'migration_success', to: 'disable_maintenance', label: 'success', style: 'thick' },
    { from: 'migration_success', to: 'restore_backup', label: 'failure', style: 'dotted' },
    { from: 'restore_backup', to: 'investigate_failure' },
    { from: 'disable_maintenance', to: 'migration_complete' }
  ]
};
```

**Output:** A database migration process with backup/restore and testing phases.

**Use Cases:** Database administration, deployment procedures, risk management

---

## 🎨 Styling Examples

### Color-Coded Process Flow

A process flow with custom color coding for different types of activities.

```typescript
const colorCodedFlow: ReadableSpec = {
  type: 'flow',
  direction: 'TB',
  nodes: [
    { id: 'start', label: 'Start Process', shape: 'stadium', className: 'trigger-node' },
    { id: 'input', label: 'Collect User\nInput', className: 'input-node' },
    { id: 'validate', label: 'Validate Data', className: 'validation-node' },
    { id: 'process', label: 'Process Business\nLogic', className: 'business-node' },
    { id: 'save', label: 'Save to\nDatabase', shape: 'cylinder', className: 'data-node' },
    { id: 'notify', label: 'Send\nNotification', className: 'integration-node' },
    { id: 'end', label: 'Process\nComplete', shape: 'stadium', className: 'success-node' }
  ],
  edges: [
    { from: 'start', to: 'input', className: 'primary-flow' },
    { from: 'input', to: 'validate', className: 'primary-flow' },
    { from: 'validate', to: 'process', className: 'primary-flow' },
    { from: 'process', to: 'save', className: 'primary-flow' },
    { from: 'save', to: 'notify', className: 'secondary-flow' },
    { from: 'notify', to: 'end', className: 'primary-flow' }
  ],
  legend: [
    { swatch: '#10b981', label: 'Trigger Events' },
    { swatch: '#3b82f6', label: 'User Interactions' },
    { swatch: '#f59e0b', label: 'Validation Steps' },
    { swatch: '#8b5cf6', label: 'Business Logic' },
    { swatch: '#06b6d4', label: 'Data Operations' },
    { swatch: '#ef4444', label: 'External Integrations' }
  ]
};

// Accompanying CSS
const customStyles = `
  .trigger-node {
    fill: #dcfce7 !important;
    stroke: #10b981 !important;
    stroke-width: 3px !important;
  }
  
  .input-node {
    fill: #dbeafe !important;
    stroke: #3b82f6 !important;
    stroke-width: 2px !important;
  }
  
  .validation-node {
    fill: #fef3c7 !important;
    stroke: #f59e0b !important;
    stroke-width: 2px !important;
  }
  
  .business-node {
    fill: #f3e8ff !important;
    stroke: #8b5cf6 !important;
    stroke-width: 2px !important;
  }
  
  .data-node {
    fill: #ecfeff !important;
    stroke: #06b6d4 !important;
    stroke-width: 2px !important;
  }
  
  .integration-node {
    fill: #fef2f2 !important;
    stroke: #ef4444 !important;
    stroke-width: 2px !important;
  }
  
  .success-node {
    fill: #dcfce7 !important;
    stroke: #10b981 !important;
    stroke-width: 3px !important;
  }
  
  .primary-flow {
    stroke: #374151 !important;
    stroke-width: 2px !important;
  }
  
  .secondary-flow {
    stroke: #9ca3af !important;
    stroke-width: 1px !important;
    stroke-dasharray: 5,5 !important;
  }
`;
```

**Output:** A visually rich process flow with consistent color coding and custom styling.

**Use Cases:** Process visualization, training materials, stakeholder presentations

---

## 📊 Interactive Examples

### Clickable Service Map

An interactive service architecture with click handlers.

```tsx
import React, { useState, useCallback } from 'react';
import { ReadableMermaid, type ReadableSpec } from '@readable/mermaid';

const InteractiveServiceMap: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({});

  const serviceMap: ReadableSpec = {
    type: 'flow',
    direction: 'TB',
    nodes: [
      { id: 'users', label: 'Users', shape: 'circle' },
      { id: 'lb', label: 'Load Balancer', shape: 'hexagon' },
      { id: 'api', label: 'API Gateway', shape: 'hexagon' },
      { id: 'auth', label: 'Auth Service' },
      { id: 'user_svc', label: 'User Service' },
      { id: 'order_svc', label: 'Order Service' },
      { id: 'payment_svc', label: 'Payment Service' },
      { id: 'notification_svc', label: 'Notification Service' },
      { id: 'user_db', label: 'User DB', shape: 'cylinder' },
      { id: 'order_db', label: 'Order DB', shape: 'cylinder' },
      { id: 'cache', label: 'Redis Cache', shape: 'cylinder' }
    ],
    edges: [
      { from: 'users', to: 'lb' },
      { from: 'lb', to: 'api' },
      { from: 'api', to: 'auth', label: 'authenticate' },
      { from: 'api', to: 'user_svc', label: 'user ops' },
      { from: 'api', to: 'order_svc', label: 'orders' },
      { from: 'order_svc', to: 'payment_svc', label: 'payments' },
      { from: 'order_svc', to: 'notification_svc', label: 'notifications' },
      { from: 'user_svc', to: 'user_db' },
      { from: 'order_svc', to: 'order_db' },
      { from: 'user_svc', to: 'cache', style: 'dotted' },
      { from: 'order_svc', to: 'cache', style: 'dotted' }
    ],
    groups: [
      {
        id: 'services',
        label: 'Microservices',
        nodes: ['auth', 'user_svc', 'order_svc', 'payment_svc', 'notification_svc']
      },
      {
        id: 'data',
        label: 'Data Layer',
        nodes: ['user_db', 'order_db', 'cache']
      }
    ]
  };

  const handleServiceClick = useCallback((nodeId: string, node: any) => {
    setSelectedService(nodeId);
    
    // Simulate fetching service details
    const mockDetails = {
      auth: { status: 'healthy', instances: 3, cpu: '45%', memory: '67%' },
      user_svc: { status: 'healthy', instances: 5, cpu: '32%', memory: '54%' },
      order_svc: { status: 'warning', instances: 4, cpu: '78%', memory: '82%' },
      payment_svc: { status: 'healthy', instances: 2, cpu: '23%', memory: '41%' }
    };
    
    setServiceDetails(mockDetails[nodeId as keyof typeof mockDetails] || {});
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <ReadableMermaid 
          spec={serviceMap}
          options={{
            onNodeClick: handleServiceClick,
            fitToContainer: true
          }}
        />
      </div>
      
      {selectedService && (
        <div style={{ 
          width: '300px', 
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3>Service Details</h3>
          <h4>{selectedService}</h4>
          {Object.entries(serviceDetails).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Output:** An interactive service map where clicking on services shows their health and performance metrics.

**Use Cases:** Operations dashboards, system monitoring, interactive documentation

---

## 🔄 Dynamic Examples

### Real-time Status Dashboard

A diagram that updates based on real-time data.

```tsx
import React, { useState, useEffect } from 'react';
import { ReadableMermaid, type ReadableSpec } from '@readable/mermaid';

interface SystemStatus {
  [serviceId: string]: 'healthy' | 'warning' | 'error';
}

const RealTimeStatusDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    web_server: 'healthy',
    api_server: 'healthy',
    database: 'warning',
    cache: 'healthy',
    queue: 'error'
  });

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const services = Object.keys(systemStatus);
      const randomService = services[Math.floor(Math.random() * services.length)];
      const statuses: Array<'healthy' | 'warning' | 'error'> = ['healthy', 'warning', 'error'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      setSystemStatus(prev => ({
        ...prev,
        [randomService]: randomStatus
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  const getStatusClass = (serviceId: string): string => {
    const status = systemStatus[serviceId];
    return `status-${status}`;
  };

  const statusDashboard: ReadableSpec = {
    type: 'flow',
    direction: 'TB',
    nodes: [
      { id: 'users', label: 'Users', shape: 'circle' },
      { id: 'web_server', label: 'Web Server', className: getStatusClass('web_server') },
      { id: 'api_server', label: 'API Server', className: getStatusClass('api_server') },
      { id: 'database', label: 'Database', shape: 'cylinder', className: getStatusClass('database') },
      { id: 'cache', label: 'Cache', shape: 'cylinder', className: getStatusClass('cache') },
      { id: 'queue', label: 'Message Queue', shape: 'stadium', className: getStatusClass('queue') }
    ],
    edges: [
      { from: 'users', to: 'web_server' },
      { from: 'web_server', to: 'api_server' },
      { from: 'api_server', to: 'database' },
      { from: 'api_server', to: 'cache', style: 'dotted' },
      { from: 'api_server', to: 'queue', style: 'dashed' }
    ],
    legend: [
      { swatch: '#10b981', label: 'Healthy' },
      { swatch: '#f59e0b', label: 'Warning' },
      { swatch: '#ef4444', label: 'Error' }
    ]
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>System Status Dashboard</h3>
        <p>Status updates every 3 seconds</p>
      </div>
      
      <ReadableMermaid 
        spec={statusDashboard}
        options={{
          fitToContainer: true
        }}
      />
      
      <style jsx>{`
        .status-healthy {
          fill: #dcfce7 !important;
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
        
        .status-warning {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 3px !important;
        }
        
        .status-error {
          fill: #fef2f2 !important;
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
```

**Output:** A system status dashboard that updates node colors and styles based on real-time service health.

**Use Cases:** Operations monitoring, real-time dashboards, alerting systems

---

## 📋 Usage Guidelines

### When to Use Each Pattern

1. **Linear Flow**: Simple sequential processes, tutorials, basic workflows
2. **Decision Tree**: Complex logic with multiple paths, error handling, conditional processes
3. **System Components**: Architecture documentation, system overviews, component relationships
4. **Business Processes**: Workflow documentation, training materials, process optimization
5. **Technical Flows**: DevOps processes, deployment pipelines, technical procedures
6. **Interactive Examples**: Dashboards, monitoring tools, exploratory interfaces
7. **Dynamic Examples**: Real-time systems, status monitoring, live data visualization

### Best Practices

1. **Keep it Simple**: Start with basic flows and add complexity gradually
2. **Use Consistent Styling**: Maintain color coding and shape conventions
3. **Add Meaningful Labels**: Use clear, descriptive text for nodes and edges
4. **Group Related Elements**: Use groups to organize complex diagrams
5. **Provide Context**: Include legends and descriptions for complex diagrams
6. **Test Interactivity**: Ensure click handlers and dynamic updates work smoothly
7. **Consider Performance**: Limit complexity for large diagrams (< 50 nodes recommended)

### Customization Tips

1. **Color Coding**: Use consistent colors for similar types of components
2. **Shape Selection**: Choose shapes that match the semantic meaning (cylinders for databases, diamonds for decisions)
3. **Edge Styles**: Use different styles to indicate different types of relationships
4. **Grouping**: Organize related components into logical groups
5. **Legends**: Always provide legends for complex color-coded diagrams

This examples gallery provides a comprehensive foundation for creating effective diagrams with Readable Mermaid across various use cases and complexity levels.
