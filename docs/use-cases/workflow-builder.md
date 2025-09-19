# 🔧 Use Case 3: Dynamic Workflow Builder

**Scenario**: You're building a business process automation platform where users can create, edit, and visualize custom workflows. The system needs to support drag-and-drop editing, real-time validation, conditional logic, and integration with external systems.

## 📋 Overview

This use case demonstrates how to create a dynamic workflow builder that provides:
- **Interactive workflow creation and editing**
- **Real-time validation and error checking**
- **Conditional branching and parallel processing**
- **Integration with external systems and APIs**
- **Workflow execution monitoring and debugging**

## 🎯 Implementation

### Complete Working Example

```tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReadableMermaid, type ReadableSpec, validateSpec } from '@readable/mermaid';

// Workflow node types and their configurations
interface WorkflowNodeType {
  id: string;
  name: string;
  shape: 'rect' | 'round' | 'stadium' | 'diamond' | 'hexagon' | 'cylinder';
  category: 'trigger' | 'action' | 'condition' | 'integration' | 'end';
  color: string;
  icon: string;
  configurable: boolean;
  description: string;
}

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  condition?: string;
  label?: string;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, any>;
  status: 'draft' | 'active' | 'paused' | 'archived';
}

const WorkflowBuilder: React.FC = () => {
  // Available node types
  const nodeTypes: WorkflowNodeType[] = [
    {
      id: 'webhook_trigger',
      name: 'Webhook Trigger',
      shape: 'stadium',
      category: 'trigger',
      color: '#10b981',
      icon: '🔗',
      configurable: true,
      description: 'Triggers workflow when webhook receives data'
    },
    {
      id: 'schedule_trigger',
      name: 'Schedule Trigger',
      shape: 'stadium',
      category: 'trigger',
      color: '#10b981',
      icon: '⏰',
      configurable: true,
      description: 'Triggers workflow on a schedule'
    },
    {
      id: 'http_request',
      name: 'HTTP Request',
      shape: 'rect',
      category: 'action',
      color: '#3b82f6',
      icon: '🌐',
      configurable: true,
      description: 'Makes HTTP request to external API'
    },
    {
      id: 'data_transform',
      name: 'Data Transform',
      shape: 'rect',
      category: 'action',
      color: '#3b82f6',
      icon: '🔄',
      configurable: true,
      description: 'Transforms data using JavaScript expressions'
    },
    {
      id: 'send_email',
      name: 'Send Email',
      shape: 'rect',
      category: 'action',
      color: '#3b82f6',
      icon: '📧',
      configurable: true,
      description: 'Sends email notification'
    },
    {
      id: 'condition_check',
      name: 'Condition',
      shape: 'diamond',
      category: 'condition',
      color: '#f59e0b',
      icon: '❓',
      configurable: true,
      description: 'Conditional branching based on data'
    },
    {
      id: 'parallel_split',
      name: 'Parallel Split',
      shape: 'diamond',
      category: 'condition',
      color: '#8b5cf6',
      icon: '⚡',
      configurable: false,
      description: 'Splits workflow into parallel branches'
    },
    {
      id: 'database_query',
      name: 'Database Query',
      shape: 'cylinder',
      category: 'integration',
      color: '#06b6d4',
      icon: '🗄️',
      configurable: true,
      description: 'Queries database for information'
    },
    {
      id: 'slack_notification',
      name: 'Slack Notification',
      shape: 'hexagon',
      category: 'integration',
      color: '#ef4444',
      icon: '💬',
      configurable: true,
      description: 'Sends message to Slack channel'
    },
    {
      id: 'end_success',
      name: 'Success End',
      shape: 'stadium',
      category: 'end',
      color: '#10b981',
      icon: '✅',
      configurable: false,
      description: 'Successful workflow completion'
    },
    {
      id: 'end_error',
      name: 'Error End',
      shape: 'stadium',
      category: 'end',
      color: '#ef4444',
      icon: '❌',
      configurable: false,
      description: 'Error workflow termination'
    }
  ];

  // Current workflow state
  const [workflow, setWorkflow] = useState<WorkflowDefinition>({
    id: 'workflow_1',
    name: 'Customer Onboarding Process',
    description: 'Automated customer onboarding workflow',
    nodes: [
      {
        id: 'start',
        type: 'webhook_trigger',
        label: 'New Customer\nWebhook',
        config: { url: '/webhooks/new-customer', method: 'POST' }
      },
      {
        id: 'validate',
        type: 'condition_check',
        label: 'Valid Customer\nData?',
        config: { condition: 'email != null && name.length > 0' }
      },
      {
        id: 'create_account',
        type: 'http_request',
        label: 'Create Account\nin CRM',
        config: { 
          url: 'https://api.crm.com/accounts', 
          method: 'POST',
          headers: { 'Authorization': 'Bearer ${API_KEY}' }
        }
      },
      {
        id: 'send_welcome',
        type: 'send_email',
        label: 'Send Welcome\nEmail',
        config: { 
          template: 'welcome_email',
          to: '${customer.email}',
          subject: 'Welcome to our platform!'
        }
      },
      {
        id: 'notify_team',
        type: 'slack_notification',
        label: 'Notify Sales\nTeam',
        config: { 
          channel: '#sales',
          message: 'New customer: ${customer.name} (${customer.email})'
        }
      },
      {
        id: 'success',
        type: 'end_success',
        label: 'Onboarding\nComplete',
        config: {}
      },
      {
        id: 'error_invalid',
        type: 'end_error',
        label: 'Invalid Data\nError',
        config: {}
      }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'validate', label: 'customer data' },
      { id: 'e2', from: 'validate', to: 'create_account', condition: 'true', label: 'valid' },
      { id: 'e3', from: 'validate', to: 'error_invalid', condition: 'false', label: 'invalid' },
      { id: 'e4', from: 'create_account', to: 'send_welcome', label: 'account created' },
      { id: 'e5', from: 'send_welcome', to: 'notify_team', label: 'email sent' },
      { id: 'e6', from: 'notify_team', to: 'success', label: 'team notified' }
    ],
    variables: {
      API_KEY: 'crm_api_key_here',
      SLACK_TOKEN: 'slack_token_here'
    },
    status: 'draft'
  });

  // UI state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<Array<{
    nodeId: string;
    timestamp: Date;
    status: 'success' | 'error' | 'running';
    message: string;
    data?: any;
  }>>([]);

  // Convert workflow to ReadableSpec for visualization
  const workflowToSpec = useCallback((): ReadableSpec => {
    const spec: ReadableSpec = {
      type: 'flow',
      direction: 'TB',
      theme: 'default',
      nodes: workflow.nodes.map(node => {
        const nodeType = nodeTypes.find(nt => nt.id === node.type);
        const isExecuting = executionLog.some(log => 
          log.nodeId === node.id && log.status === 'running'
        );
        const hasError = executionLog.some(log => 
          log.nodeId === node.id && log.status === 'error'
        );
        
        return {
          id: node.id,
          label: `${nodeType?.icon || ''} ${node.label}`,
          shape: nodeType?.shape || 'rect',
          className: `node-${nodeType?.category} ${
            isExecuting ? 'node-executing' : 
            hasError ? 'node-error' :
            selectedNode === node.id ? 'node-selected' : ''
          }`.trim()
        };
      }),
      edges: workflow.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        label: edge.condition ? `${edge.label || ''} (${edge.condition})` : edge.label,
        style: edge.condition === 'false' ? 'dotted' : 'solid'
      })),
      groups: [
        {
          id: 'triggers',
          label: 'Triggers',
          nodes: workflow.nodes
            .filter(node => nodeTypes.find(nt => nt.id === node.type)?.category === 'trigger')
            .map(node => node.id)
        },
        {
          id: 'actions',
          label: 'Actions',
          nodes: workflow.nodes
            .filter(node => nodeTypes.find(nt => nt.id === node.type)?.category === 'action')
            .map(node => node.id)
        },
        {
          id: 'conditions',
          label: 'Conditions',
          nodes: workflow.nodes
            .filter(node => nodeTypes.find(nt => nt.id === node.type)?.category === 'condition')
            .map(node => node.id)
        }
      ],
      legend: [
        { swatch: 'success', label: 'Triggers' },
        { swatch: 'primary', label: 'Actions' },
        { swatch: 'warning', label: 'Conditions' },
        { swatch: 'info', label: 'Integrations' },
        { swatch: 'danger', label: 'End States' }
      ]
    };

    return spec;
  }, [workflow, nodeTypes, selectedNode, executionLog]);

  // Validate workflow
  const validateWorkflow = useCallback(() => {
    const errors: string[] = [];
    const spec = workflowToSpec();
    const specErrors = validateSpec(spec);
    errors.push(...specErrors);

    // Custom workflow validation
    const triggerNodes = workflow.nodes.filter(node => 
      nodeTypes.find(nt => nt.id === node.type)?.category === 'trigger'
    );
    if (triggerNodes.length === 0) {
      errors.push('Workflow must have at least one trigger');
    }

    const endNodes = workflow.nodes.filter(node => 
      nodeTypes.find(nt => nt.id === node.type)?.category === 'end'
    );
    if (endNodes.length === 0) {
      errors.push('Workflow must have at least one end node');
    }

    // Check for unreachable nodes
    const reachableNodes = new Set<string>();
    const visited = new Set<string>();
    
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      reachableNodes.add(nodeId);
      
      workflow.edges
        .filter(edge => edge.from === nodeId)
        .forEach(edge => traverse(edge.to));
    };

    triggerNodes.forEach(trigger => traverse(trigger.id));
    
    const unreachableNodes = workflow.nodes.filter(node => !reachableNodes.has(node.id));
    if (unreachableNodes.length > 0) {
      errors.push(`Unreachable nodes: ${unreachableNodes.map(n => n.label).join(', ')}`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [workflow, workflowToSpec, nodeTypes]);

  // Handle node selection
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
  }, []);

  // Add new node
  const addNode = useCallback((nodeTypeId: string) => {
    if (!selectedNodeType) return;
    
    const nodeType = nodeTypes.find(nt => nt.id === nodeTypeId);
    if (!nodeType) return;

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: nodeTypeId,
      label: nodeType.name,
      config: {}
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, [selectedNodeType, nodeTypes]);

  // Update node configuration
  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, config } : node
      )
    }));
  }, []);

  // Add edge between nodes
  const addEdge = useCallback((from: string, to: string, condition?: string) => {
    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}`,
      from,
      to,
      condition,
      label: condition ? (condition === 'true' ? 'yes' : 'no') : undefined
    };

    setWorkflow(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }));
  }, []);

  // Simulate workflow execution
  const executeWorkflow = useCallback(async (inputData: any = {}) => {
    setIsExecuting(true);
    setExecutionLog([]);
    
    const log = (nodeId: string, status: 'success' | 'error' | 'running', message: string, data?: any) => {
      setExecutionLog(prev => [...prev, {
        nodeId,
        timestamp: new Date(),
        status,
        message,
        data
      }]);
    };

    try {
      // Find trigger nodes
      const triggerNodes = workflow.nodes.filter(node => 
        nodeTypes.find(nt => nt.id === node.type)?.category === 'trigger'
      );

      if (triggerNodes.length === 0) {
        throw new Error('No trigger nodes found');
      }

      // Start execution from first trigger
      const startNode = triggerNodes[0];
      let currentData = { ...inputData };
      
      const executeNode = async (nodeId: string, data: any): Promise<any> => {
        const node = workflow.nodes.find(n => n.id === nodeId);
        if (!node) {
          throw new Error(`Node ${nodeId} not found`);
        }

        const nodeType = nodeTypes.find(nt => nt.id === node.type);
        log(nodeId, 'running', `Executing ${nodeType?.name || node.type}`);

        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate node execution based on type
        try {
          let result = data;
          
          switch (node.type) {
            case 'webhook_trigger':
              result = { ...data, triggeredAt: new Date().toISOString() };
              break;
              
            case 'condition_check':
              const condition = node.config.condition || 'true';
              // Simple condition evaluation (in real app, use safe evaluator)
              result = { ...data, conditionResult: condition.includes('email') ? data.email != null : true };
              break;
              
            case 'http_request':
              // Simulate API call
              result = { 
                ...data, 
                apiResponse: { 
                  id: Math.random().toString(36).substr(2, 9),
                  status: 'created',
                  timestamp: new Date().toISOString()
                }
              };
              break;
              
            case 'send_email':
              result = { ...data, emailSent: true, emailId: `email_${Date.now()}` };
              break;
              
            case 'slack_notification':
              result = { ...data, slackMessageId: `msg_${Date.now()}` };
              break;
              
            default:
              // No transformation for other node types
              break;
          }

          log(nodeId, 'success', `${nodeType?.name || node.type} completed`, result);
          return result;
          
        } catch (error) {
          log(nodeId, 'error', `${nodeType?.name || node.type} failed: ${error}`);
          throw error;
        }
      };

      // Execute workflow
      const visited = new Set<string>();
      
      const traverseAndExecute = async (nodeId: string, data: any): Promise<void> => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const result = await executeNode(nodeId, data);
        
        // Find next nodes
        const outgoingEdges = workflow.edges.filter(edge => edge.from === nodeId);
        
        for (const edge of outgoingEdges) {
          // Check edge condition
          if (edge.condition) {
            if (edge.condition === 'true' && result.conditionResult) {
              await traverseAndExecute(edge.to, result);
            } else if (edge.condition === 'false' && !result.conditionResult) {
              await traverseAndExecute(edge.to, result);
            }
          } else {
            await traverseAndExecute(edge.to, result);
          }
        }
      };

      await traverseAndExecute(startNode.id, currentData);
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [workflow, nodeTypes]);

  // Validate workflow on changes
  useEffect(() => {
    validateWorkflow();
  }, [validateWorkflow]);

  // Get selected node details
  const getSelectedNodeDetails = () => {
    if (!selectedNode) return null;
    
    const node = workflow.nodes.find(n => n.id === selectedNode);
    const nodeType = node ? nodeTypes.find(nt => nt.id === node.type) : null;
    
    return { node, nodeType };
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>🔧 Workflow Builder: {workflow.name}</h2>
        <p style={{ color: '#64748b' }}>{workflow.description}</p>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          alignItems: 'center'
        }}>
          <button
            onClick={() => executeWorkflow({ 
              email: 'test@example.com', 
              name: 'John Doe',
              company: 'Test Corp'
            })}
            disabled={isExecuting || validationErrors.length > 0}
            style={{
              padding: '8px 16px',
              backgroundColor: isExecuting ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isExecuting ? '⏳ Executing...' : '▶️ Test Workflow'}
          </button>
          
          <button
            onClick={() => setWorkflow(prev => ({ ...prev, status: 'active' }))}
            disabled={validationErrors.length > 0}
            style={{
              padding: '8px 16px',
              backgroundColor: validationErrors.length > 0 ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: validationErrors.length > 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            🚀 Deploy Workflow
          </button>
          
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: workflow.status === 'active' ? '#dcfce7' : '#fef3c7', 
              color: workflow.status === 'active' ? '#166534' : '#92400e',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {workflow.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#dc2626', fontSize: '14px' }}>
              Validation Errors:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index} style={{ color: '#dc2626', fontSize: '13px' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '700px' }}>
        {/* Node palette */}
        <div style={{ 
          width: '200px', 
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Node Types</h3>
          
          {Object.entries(
            nodeTypes.reduce((acc, nodeType) => {
              if (!acc[nodeType.category]) acc[nodeType.category] = [];
              acc[nodeType.category].push(nodeType);
              return acc;
            }, {} as Record<string, WorkflowNodeType[]>)
          ).map(([category, types]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '13px', 
                textTransform: 'uppercase',
                color: '#6b7280',
                fontWeight: '600'
              }}>
                {category}
              </h4>
              {types.map(nodeType => (
                <div
                  key={nodeType.id}
                  onClick={() => addNode(nodeType.id)}
                  style={{
                    padding: '8px',
                    marginBottom: '6px',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <span>{nodeType.icon}</span>
                  <span>{nodeType.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main workflow diagram */}
        <div style={{ flex: 1 }}>
          <ReadableMermaid
            spec={workflowToSpec()}
            options={{
              fitToContainer: true,
              enablePanZoom: true,
              onNodeClick: handleNodeClick,
              style: {
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff'
              }
            }}
          />
        </div>

        {/* Configuration panel */}
        <div style={{ 
          width: '300px', 
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowY: 'auto'
        }}>
          <h3>Configuration</h3>
          
          {(() => {
            const details = getSelectedNodeDetails();
            if (details?.node && details?.nodeType) {
              return (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0ea5e9', margin: '0 0 8px 0' }}>
                      {details.nodeType.icon} {details.nodeType.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>
                      {details.nodeType.description}
                    </p>
                  </div>

                  {details.nodeType.configurable && (
                    <div>
                      <h5>Configuration</h5>
                      {Object.entries(details.node.config).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            display: 'block', 
                            fontSize: '13px', 
                            fontWeight: '500',
                            marginBottom: '4px'
                          }}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={String(value)}
                            onChange={(e) => {
                              const newConfig = { ...details.node.config, [key]: e.target.value };
                              updateNodeConfig(details.node.id, newConfig);
                            }}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <div>
                <p style={{ color: '#64748b', fontStyle: 'italic' }}>
                  Select a node to configure its properties, or drag node types from the palette to add them to the workflow.
                </p>
                
                {executionLog.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4>Execution Log</h4>
                    <div style={{ 
                      maxHeight: '300px', 
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}>
                      {executionLog.map((entry, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          borderBottom: index < executionLog.length - 1 ? '1px solid #f1f5f9' : 'none',
                          fontSize: '12px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            marginBottom: '2px'
                          }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 
                                entry.status === 'success' ? '#10b981' :
                                entry.status === 'error' ? '#ef4444' : '#f59e0b'
                            }} />
                            <span style={{ fontWeight: '500' }}>{entry.nodeId}</span>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div style={{ color: '#64748b', marginLeft: '14px' }}>
                            {entry.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* CSS for custom styling */}
      <style jsx>{`
        .node-trigger {
          fill: #dcfce7 !important;
          stroke: #10b981 !important;
          stroke-width: 2px !important;
        }
        
        .node-action {
          fill: #dbeafe !important;
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
        }
        
        .node-condition {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 2px !important;
        }
        
        .node-integration {
          fill: #ecfeff !important;
          stroke: #06b6d4 !important;
          stroke-width: 2px !important;
        }
        
        .node-end {
          fill: #f1f5f9 !important;
          stroke: #64748b !important;
          stroke-width: 2px !important;
        }
        
        .node-selected {
          stroke-width: 3px !important;
          stroke: #8b5cf6 !important;
          filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.3)) !important;
        }
        
        .node-executing {
          fill: #fef3c7 !important;
          stroke: #f59e0b !important;
          stroke-width: 3px !important;
          animation: pulse 1s infinite !important;
        }
        
        .node-error {
          fill: #fef2f2 !important;
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default WorkflowBuilder;
```

## 📊 Expected Output

The implementation creates a comprehensive workflow builder featuring:

1. **Node Palette**: Categorized workflow components (triggers, actions, conditions, integrations, end states)
2. **Visual Workflow**: Interactive diagram showing workflow structure with real-time validation
3. **Configuration Panel**: Dynamic property editing for selected nodes
4. **Execution Engine**: Simulated workflow execution with real-time logging
5. **Validation System**: Real-time error checking and constraint validation

**Key Features:**
- **Drag-and-drop workflow creation** (simulated via palette clicks)
- **Real-time visual feedback** during execution
- **Conditional branching** with visual indicators
- **Integration configurations** for external systems
- **Execution monitoring** with detailed logging

## ⚙️ Key Implementation Details

### 1. Node Type System

```typescript
interface WorkflowNodeType {
  id: string;
  name: string;
  shape: 'rect' | 'round' | 'stadium' | 'diamond' | 'hexagon' | 'cylinder';
  category: 'trigger' | 'action' | 'condition' | 'integration' | 'end';
  color: string;
  icon: string;
  configurable: boolean;
  description: string;
}

// Extensible node type registry
const registerNodeType = (nodeType: WorkflowNodeType) => {
  nodeTypes.push(nodeType);
};
```

### 2. Dynamic Workflow Validation

```typescript
const validateWorkflow = () => {
  const errors: string[] = [];
  
  // Structural validation
  if (triggerNodes.length === 0) {
    errors.push('Workflow must have at least one trigger');
  }
  
  // Reachability analysis
  const reachableNodes = new Set<string>();
  const traverse = (nodeId: string) => {
    // ... traverse and mark reachable nodes
  };
  
  // Detect unreachable nodes
  const unreachableNodes = workflow.nodes.filter(node => !reachableNodes.has(node.id));
  
  return errors;
};
```

### 3. Execution Engine with Logging

```typescript
const executeWorkflow = async (inputData: any) => {
  const log = (nodeId: string, status: 'success' | 'error' | 'running', message: string) => {
    setExecutionLog(prev => [...prev, { nodeId, timestamp: new Date(), status, message }]);
  };
  
  const executeNode = async (nodeId: string, data: any) => {
    log(nodeId, 'running', `Executing ${nodeType.name}`);
    
    try {
      const result = await simulateNodeExecution(node, data);
      log(nodeId, 'success', `${nodeType.name} completed`);
      return result;
    } catch (error) {
      log(nodeId, 'error', `${nodeType.name} failed: ${error}`);
      throw error;
    }
  };
};
```

### 4. Visual State Management

```typescript
// Dynamic CSS class assignment based on execution state
const getNodeClassName = (nodeId: string) => {
  const isExecuting = executionLog.some(log => 
    log.nodeId === nodeId && log.status === 'running'
  );
  const hasError = executionLog.some(log => 
    log.nodeId === nodeId && log.status === 'error'
  );
  
  return `node-${nodeType.category} ${
    isExecuting ? 'node-executing' : 
    hasError ? 'node-error' :
    selectedNode === nodeId ? 'node-selected' : ''
  }`.trim();
};
```

## 🚨 Constraints and Gotchas

### 1. **Workflow Complexity Management**

**Issue**: Complex workflows with many branches become visually overwhelming.

```typescript
// ❌ Problematic: Everything in one view
const complexWorkflow = {
  nodes: [/* 50+ nodes with complex branching */],
  edges: [/* 100+ edges with conditions */]
};

// ✅ Solution: Hierarchical workflows with sub-processes
const workflowHierarchy = {
  mainWorkflow: {
    nodes: [
      { id: 'subprocess1', type: 'subprocess', label: 'Customer Validation\n(5 steps)' },
      { id: 'subprocess2', type: 'subprocess', label: 'Payment Processing\n(8 steps)' }
    ]
  },
  subprocesses: {
    'subprocess1': { /* detailed subprocess definition */ },
    'subprocess2': { /* detailed subprocess definition */ }
  }
};

// Navigate between levels
const drillDown = (subprocessId: string) => {
  setCurrentWorkflow(workflowHierarchy.subprocesses[subprocessId]);
};
```

### 2. **Real-time Execution Visualization**

**Issue**: Long-running workflows need continuous state updates without re-rendering the entire diagram.

```typescript
// ❌ Problematic: Re-rendering entire diagram for state changes
const updateExecutionState = (nodeId: string, status: string) => {
  setWorkflow(prev => ({
    ...prev,
    nodes: prev.nodes.map(node => 
      node.id === nodeId ? { ...node, executionStatus: status } : node
    )
  }));
};

// ✅ Solution: Separate execution state from workflow definition
const [executionState, setExecutionState] = useState<Record<string, ExecutionStatus>>({});

// Update only execution state, use CSS classes for visual changes
const updateNodeExecutionState = (nodeId: string, status: ExecutionStatus) => {
  setExecutionState(prev => ({ ...prev, [nodeId]: status }));
};
```

### 3. **Configuration Persistence and Validation**

**Issue**: Complex node configurations need validation and proper serialization.

```typescript
// ❌ Problematic: No validation of configuration values
const updateNodeConfig = (nodeId: string, config: any) => {
  // Direct assignment without validation
  setWorkflow(prev => ({
    ...prev,
    nodes: prev.nodes.map(node => 
      node.id === nodeId ? { ...node, config } : node
    )
  }));
};

// ✅ Solution: Schema-based configuration validation
interface NodeConfigSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array';
    required: boolean;
    validation?: (value: any) => string | null;
  };
}

const validateNodeConfig = (nodeType: string, config: any): string[] => {
  const schema = nodeConfigSchemas[nodeType];
  const errors: string[] = [];
  
  Object.entries(schema).forEach(([key, rules]) => {
    const value = config[key];
    
    if (rules.required && (value === undefined || value === '')) {
      errors.push(`${key} is required`);
    }
    
    if (rules.validation && value !== undefined) {
      const error = rules.validation(value);
      if (error) errors.push(error);
    }
  });
  
  return errors;
};
```

### 4. **Conditional Logic Complexity**

**Issue**: Complex conditional expressions are hard to visualize and debug.

```typescript
// ❌ Problematic: Complex conditions in edge labels
const complexCondition = {
  from: 'validation',
  to: 'next_step',
  condition: 'user.age >= 18 && user.country === "US" && user.hasValidEmail === true'
};

// ✅ Solution: Structured condition builder
interface ConditionRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface StructuredCondition {
  rules: ConditionRule[];
  expression: string; // Generated from rules
}

const buildConditionExpression = (rules: ConditionRule[]): string => {
  return rules.map(rule => 
    `${rule.field} ${operatorMap[rule.operator]} ${JSON.stringify(rule.value)}`
  ).join(` ${rule.logicalOperator || 'AND'} `);
};
```

### 5. **Performance with Large Workflows**

**Issue**: Workflows with 100+ nodes cause rendering and interaction performance issues.

```typescript
// ❌ Problematic: Rendering all nodes at once
const renderAllNodes = () => {
  return workflow.nodes.map(node => (
    <WorkflowNode key={node.id} node={node} />
  ));
};

// ✅ Solution: Virtualization and lazy loading
const useVirtualizedWorkflow = (workflow: WorkflowDefinition) => {
  const [visibleNodes, setVisibleNodes] = useState<WorkflowNode[]>([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, width: 800, height: 600 });
  
  useEffect(() => {
    // Only render nodes within viewport
    const visible = workflow.nodes.filter(node => 
      isNodeInViewport(node, viewport)
    );
    setVisibleNodes(visible);
  }, [workflow.nodes, viewport]);
  
  return { visibleNodes, setViewport };
};
```

## 🎯 Best Practices

### 1. **Modular Node System**

```typescript
// Create reusable node types with consistent interfaces
abstract class WorkflowNode {
  abstract execute(input: any): Promise<any>;
  abstract validate(config: any): string[];
  abstract getConfigSchema(): NodeConfigSchema;
}

class HttpRequestNode extends WorkflowNode {
  async execute(input: any): Promise<any> {
    const { url, method, headers } = this.config;
    const response = await fetch(url, { method, headers });
    return { ...input, httpResponse: await response.json() };
  }
  
  validate(config: any): string[] {
    const errors: string[] = [];
    if (!config.url) errors.push('URL is required');
    if (!config.method) errors.push('HTTP method is required');
    return errors;
  }
}
```

### 2. **Workflow Version Control**

```typescript
interface WorkflowVersion {
  id: string;
  version: number;
  workflow: WorkflowDefinition;
  createdAt: Date;
  createdBy: string;
  changelog: string;
}

const saveWorkflowVersion = async (workflow: WorkflowDefinition, changelog: string) => {
  const version: WorkflowVersion = {
    id: `${workflow.id}_v${Date.now()}`,
    version: await getNextVersion(workflow.id),
    workflow: { ...workflow },
    createdAt: new Date(),
    createdBy: getCurrentUser().id,
    changelog
  };
  
  await saveVersion(version);
  return version;
};
```

### 3. **Error Handling and Recovery**

```typescript
// Implement comprehensive error handling
const executeNodeWithRetry = async (node: WorkflowNode, input: any, retries = 3): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await node.execute(input);
    } catch (error) {
      if (attempt === retries) {
        // Final attempt failed, log and propagate error
        logExecutionError(node.id, error, attempt);
        throw error;
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};
```

### 4. **Testing and Debugging**

```typescript
// Implement workflow testing utilities
const testWorkflow = async (workflow: WorkflowDefinition, testCases: TestCase[]) => {
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    try {
      const result = await executeWorkflow(workflow, testCase.input);
      const passed = validateTestResult(result, testCase.expected);
      
      results.push({
        testCase: testCase.name,
        passed,
        result,
        expected: testCase.expected,
        executionTime: performance.now() - startTime
      });
    } catch (error) {
      results.push({
        testCase: testCase.name,
        passed: false,
        error: error.message
      });
    }
  }
  
  return results;
};
```

## 📈 Advanced Features

### 1. **Real-time Collaboration**

```typescript
// Multi-user workflow editing with conflict resolution
const useCollaborativeWorkflow = (workflowId: string) => {
  const [workflow, setWorkflow] = useState<WorkflowDefinition>();
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://api/workflows/${workflowId}/collaborate`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      switch (update.type) {
        case 'workflow_update':
          handleRemoteWorkflowUpdate(update);
          break;
        case 'user_joined':
          setCollaborators(prev => [...prev, update.user]);
          break;
        case 'conflict_detected':
          setConflicts(prev => [...prev, update.conflict]);
          break;
      }
    };
    
    return () => ws.close();
  }, [workflowId]);
};
```

### 2. **Workflow Templates and Marketplace**

```typescript
// Template system for common workflow patterns
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  workflow: WorkflowDefinition;
  parameters: TemplateParameter[];
}

const instantiateTemplate = (template: WorkflowTemplate, parameters: Record<string, any>) => {
  const workflow = JSON.parse(JSON.stringify(template.workflow));
  
  // Replace template variables with actual values
  const replaceVariables = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/\{\{(\w+)\}\}/g, (match, key) => parameters[key] || match);
    }
    if (typeof obj === 'object' && obj !== null) {
      const result: any = Array.isArray(obj) ? [] : {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = replaceVariables(value);
      }
      return result;
    }
    return obj;
  };
  
  return replaceVariables(workflow);
};
```

### 3. **Performance Monitoring and Analytics**

```typescript
// Workflow performance tracking
interface WorkflowMetrics {
  workflowId: string;
  executionTime: number;
  nodeExecutionTimes: Record<string, number>;
  errorRate: number;
  throughput: number;
  bottlenecks: string[];
}

const analyzeWorkflowPerformance = (executionLogs: ExecutionLog[]): WorkflowMetrics => {
  const metrics: WorkflowMetrics = {
    workflowId: executionLogs[0]?.workflowId,
    executionTime: calculateAverageExecutionTime(executionLogs),
    nodeExecutionTimes: calculateNodePerformance(executionLogs),
    errorRate: calculateErrorRate(executionLogs),
    throughput: calculateThroughput(executionLogs),
    bottlenecks: identifyBottlenecks(executionLogs)
  };
  
  return metrics;
};
```

This use case demonstrates how to build a comprehensive, interactive workflow builder that handles the complexity of business process automation while providing an intuitive visual interface for both technical and non-technical users.
