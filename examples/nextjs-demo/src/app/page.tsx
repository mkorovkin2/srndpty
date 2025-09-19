'use client'

import React, { useRef } from 'react'
import { Srndpty, type SrndptyMethods, type ReadableSpec } from '@readable/mermaid'

export default function Home() {
  const diagramRef = useRef<SrndptyMethods>(null)

  // Example 1: Simple flow diagram
  const simpleFlowSpec: ReadableSpec = {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { id: 'start', label: 'Start Process', shape: 'stadium' },
      { id: 'process', label: 'Transform Data' },
      { id: 'end', label: 'Complete', shape: 'stadium' }
    ],
    edges: [
      { from: 'start', to: 'process', label: 'begin' },
      { from: 'process', to: 'end', label: 'finish' }
    ]
  }

  // Example 2: Complex system architecture
  const systemArchitectureSpec: ReadableSpec = {
    type: 'flow',
    direction: 'TB',
    nodes: [
      { id: 'user', label: 'User', shape: 'circle' },
      { id: 'cdn', label: 'CDN', shape: 'hexagon' },
      { id: 'loadbalancer', label: 'Load Balancer', shape: 'hexagon' },
      { id: 'api1', label: 'API Server 1' },
      { id: 'api2', label: 'API Server 2' },
      { id: 'cache', label: 'Redis Cache', shape: 'cylinder' },
      { id: 'db', label: 'Database', shape: 'cylinder' },
      { id: 'queue', label: 'Message Queue', shape: 'diamond' }
    ],
    edges: [
      { from: 'user', to: 'cdn', label: 'request' },
      { from: 'cdn', to: 'loadbalancer', label: 'route' },
      { from: 'loadbalancer', to: 'api1', label: 'distribute' },
      { from: 'loadbalancer', to: 'api2', label: 'distribute' },
      { from: 'api1', to: 'cache', label: 'check cache', style: 'dotted' },
      { from: 'api2', to: 'cache', label: 'check cache', style: 'dotted' },
      { from: 'api1', to: 'db', label: 'query' },
      { from: 'api2', to: 'db', label: 'query' },
      { from: 'api1', to: 'queue', label: 'async tasks', style: 'dashed' },
      { from: 'api2', to: 'queue', label: 'async tasks', style: 'dashed' }
    ]
  }

  // Example 3: Data pipeline with metadata
  const dataPipelineSpec: ReadableSpec = {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { 
        id: 'ingest', 
        label: 'Data Ingestion', 
        shape: 'stadium',
        meta: {
          technology: 'Apache Kafka',
          throughput: '1M events/sec',
          team: 'Data Platform'
        }
      },
      { 
        id: 'clean', 
        label: 'Data Cleaning',
        meta: {
          technology: 'Apache Spark',
          language: 'Python',
          team: 'Data Engineering'
        }
      },
      { 
        id: 'transform', 
        label: 'Data Transform',
        meta: {
          technology: 'dbt',
          models: 47,
          team: 'Analytics'
        }
      },
      { 
        id: 'warehouse', 
        label: 'Data Warehouse', 
        shape: 'cylinder',
        meta: {
          technology: 'Snowflake',
          size: '50TB',
          team: 'Data Platform'
        }
      },
      { 
        id: 'ml', 
        label: 'ML Models', 
        shape: 'diamond',
        meta: {
          technology: 'TensorFlow',
          models: 12,
          team: 'ML Engineering'
        }
      }
    ],
    edges: [
      { from: 'ingest', to: 'clean', label: 'raw data', style: 'thick' },
      { from: 'clean', to: 'transform', label: 'validated' },
      { from: 'transform', to: 'warehouse', label: 'processed' },
      { from: 'warehouse', to: 'ml', label: 'features', style: 'dotted' }
    ]
  }

  // Example 4: Microservices with groups
  const microservicesSpec: ReadableSpec = {
    type: 'flow',
    direction: 'TB',
    nodes: [
      { id: 'gateway', label: 'API Gateway', shape: 'hexagon' },
      { id: 'auth', label: 'Auth Service' },
      { id: 'users', label: 'User Service' },
      { id: 'orders', label: 'Order Service' },
      { id: 'payments', label: 'Payment Service' },
      { id: 'notifications', label: 'Notification Service' },
      { id: 'userdb', label: 'User DB', shape: 'cylinder' },
      { id: 'orderdb', label: 'Order DB', shape: 'cylinder' },
      { id: 'paymentdb', label: 'Payment DB', shape: 'cylinder' }
    ],
    edges: [
      { from: 'gateway', to: 'auth', label: 'authenticate' },
      { from: 'gateway', to: 'users', label: 'user ops' },
      { from: 'gateway', to: 'orders', label: 'orders' },
      { from: 'gateway', to: 'payments', label: 'payments' },
      { from: 'users', to: 'userdb' },
      { from: 'orders', to: 'orderdb' },
      { from: 'orders', to: 'payments', label: 'process payment' },
      { from: 'payments', to: 'paymentdb' },
      { from: 'payments', to: 'notifications', label: 'notify' },
      { from: 'orders', to: 'notifications', label: 'order updates' }
    ],
    groups: [
      {
        id: 'core-services',
        label: 'Core Services',
        nodes: ['auth', 'users', 'orders', 'payments']
      },
      {
        id: 'databases',
        label: 'Databases',
        nodes: ['userdb', 'orderdb', 'paymentdb']
      }
    ],
    legend: [
      { swatch: 'primary', label: 'Core Services' },
      { swatch: 'accent', label: 'Data Layer' },
      { swatch: 'secondary', label: 'External Services' }
    ]
  }

  const handleNodeClick = (nodeId: string, node: any) => {
    console.log('Node clicked:', nodeId, node)
    alert(`Clicked node: ${node.label} (${nodeId})`)
  }

  const handleEdgeClick = (edge: any) => {
    console.log('Edge clicked:', edge)
    alert(`Clicked edge: ${edge.from} → ${edge.to}`)
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
          Srndpty Next.js Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Interactive diagrams with <code>@readable/mermaid</code> (Srndpty) in Next.js. 
          Click nodes and edges, pan/zoom, and explore the features!
        </p>
      </header>

      {/* Example 1: Simple Flow */}
      <section className="demo-section">
        <h2>1. Simple Flow Diagram</h2>
        <p>A basic process flow with start and end nodes. Click on nodes to interact!</p>
        
        <div className="code-block">
{`import { Srndpty } from '@readable/mermaid'

const spec = {
  type: 'flow',
  direction: 'LR',
  nodes: [
    { id: 'start', label: 'Start Process', shape: 'stadium' },
    { id: 'process', label: 'Transform Data' },
    { id: 'end', label: 'Complete', shape: 'stadium' }
  ],
  edges: [
    { from: 'start', to: 'process', label: 'begin' },
    { from: 'process', to: 'end', label: 'finish' }
  ]
}

<Srndpty 
  spec={spec}
  options={{
    height: 300,
    onNodeClick: (nodeId, node) => console.log('Clicked:', nodeId),
    enablePanZoom: true
  }}
/>`}
        </div>

        <Srndpty 
          spec={simpleFlowSpec}
          options={{
            height: 300,
            onNodeClick: handleNodeClick,
            onEdgeClick: handleEdgeClick,
            enablePanZoom: true,
            style: { marginBottom: '1rem' }
          }}
        />

        <div className="info-panel">
          <h4>Features Demonstrated:</h4>
          <ul className="feature-list">
            <li>Basic node shapes (stadium, rectangle)</li>
            <li>Labeled edges</li>
            <li>Click handlers for nodes and edges</li>
            <li>Pan and zoom functionality</li>
          </ul>
        </div>
      </section>

      {/* Example 2: System Architecture */}
      <section className="demo-section">
        <h2>2. System Architecture</h2>
        <p>A more complex diagram showing a typical web application architecture with load balancing, caching, and databases.</p>
        
        <Srndpty 
          ref={diagramRef}
          spec={systemArchitectureSpec}
          options={{
            height: 500,
            onNodeClick: handleNodeClick,
            onEdgeClick: handleEdgeClick,
            enablePanZoom: true,
            fitToContainer: true
          }}
        />

        <div className="controls">
          <button 
            className="btn"
            onClick={() => diagramRef.current?.fit()}
          >
            Fit to Container
          </button>
          <button 
            className="btn"
            onClick={() => diagramRef.current?.reset()}
          >
            Reset Zoom
          </button>
          <button 
            className="btn"
            onClick={() => diagramRef.current?.zoomIn()}
          >
            Zoom In
          </button>
          <button 
            className="btn"
            onClick={() => diagramRef.current?.zoomOut()}
          >
            Zoom Out
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => diagramRef.current?.exportSVG('architecture.svg')}
          >
            Export SVG
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => diagramRef.current?.exportPNG('architecture.png')}
          >
            Export PNG
          </button>
        </div>

        <div className="info-panel">
          <h4>Features Demonstrated:</h4>
          <ul className="feature-list">
            <li>Multiple node shapes (circle, hexagon, cylinder, diamond)</li>
            <li>Different edge styles (solid, dotted, dashed)</li>
            <li>Programmatic control via ref methods</li>
            <li>Export functionality (SVG/PNG)</li>
          </ul>
        </div>
      </section>

      {/* Example 3: Data Pipeline with Metadata */}
      <section className="demo-section">
        <h2>3. Data Pipeline with Metadata</h2>
        <p>Nodes with rich metadata that shows in tooltips. Hover over nodes to see additional information!</p>
        
        <Srndpty 
          spec={dataPipelineSpec}
          options={{
            height: 350,
            onNodeClick: handleNodeClick,
            onEdgeClick: handleEdgeClick,
            enablePanZoom: true
          }}
        />

        <div className="info-panel">
          <h4>Features Demonstrated:</h4>
          <ul className="feature-list">
            <li>Node metadata displayed in tooltips</li>
            <li>Rich hover interactions</li>
            <li>Different edge styles (thick, dotted)</li>
            <li>Real-world data pipeline example</li>
          </ul>
        </div>
      </section>

      {/* Example 4: Microservices with Groups */}
      <section className="demo-section">
        <h2>4. Microservices with Groups & Legend</h2>
        <p>Complex service architecture with logical groupings and a legend for better organization.</p>
        
        <Srndpty 
          spec={microservicesSpec}
          options={{
            height: 600,
            onNodeClick: handleNodeClick,
            onEdgeClick: handleEdgeClick,
            enablePanZoom: true,
            fitToContainer: true
          }}
        />

        <div className="info-panel">
          <h4>Features Demonstrated:</h4>
          <ul className="feature-list">
            <li>Logical grouping of related nodes</li>
            <li>Legend for visual organization</li>
            <li>Complex interconnected services</li>
            <li>Realistic microservices architecture</li>
          </ul>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="demo-section">
        <h2>How to Use in Your Project</h2>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
          1. Installation
        </h3>
        <div className="code-block">
{`npm install @readable/mermaid
# or
pnpm add @readable/mermaid
# or  
yarn add @readable/mermaid`}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
          2. Basic Usage
        </h3>
        <div className="code-block">
{`'use client' // for Next.js app directory

import { Srndpty } from '@readable/mermaid'

export default function MyComponent() {
  const spec = {
    type: 'flow',
    direction: 'LR',
    nodes: [
      { id: 'A', label: 'Hello' },
      { id: 'B', label: 'World' }
    ],
    edges: [
      { from: 'A', to: 'B', label: 'connects to' }
    ]
  }

  return (
    <Srndpty 
      spec={spec}
      options={{
        height: 400,
        enablePanZoom: true,
        onNodeClick: (nodeId, node) => {
          console.log('Clicked:', nodeId, node)
        }
      }}
    />
  )
}`}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
          3. With Ref for Control
        </h3>
        <div className="code-block">
{`import { useRef } from 'react'
import { Srndpty, type SrndptyMethods } from '@readable/mermaid'

export default function MyComponent() {
  const diagramRef = useRef<SrndptyMethods>(null)

  return (
    <>
      <Srndpty ref={diagramRef} spec={spec} />
      <button onClick={() => diagramRef.current?.fit()}>
        Fit Diagram
      </button>
      <button onClick={() => diagramRef.current?.exportPNG()}>
        Export PNG
      </button>
    </>
  )
}`}
        </div>

        <div className="info-panel">
          <h4>Key Features:</h4>
          <ul className="feature-list">
            <li>JSON-first schema (no Mermaid syntax to learn)</li>
            <li>Full TypeScript support with IntelliSense</li>
            <li>Interactive features (pan, zoom, click handlers)</li>
            <li>Export to SVG/PNG</li>
            <li>Accessible design (16px+ fonts, high contrast)</li>
            <li>Rich tooltips with metadata</li>
            <li>Works in React, vanilla JS, and Node.js</li>
          </ul>
        </div>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b' }}>
          Built with ❤️ using <a href="https://github.com/username/srndpty" style={{ color: '#3b82f6' }}>Srndpty</a> - 
          Universal interactive diagram framework
        </p>
      </footer>
    </div>
  )
}
