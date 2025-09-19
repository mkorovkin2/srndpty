# Srndpty Demo - Next.js

This is a Next.js demo application showcasing the Srndpty universal interactive diagram framework.

## Features

- ✨ **Interactive Diagrams**: Click nodes and edges to explore diagram interactivity
- 🎯 **Live JSON Editing**: Edit diagram specifications in real-time with JSON schema
- 🔍 **Pan & Zoom**: Full pan and zoom support with mouse and keyboard controls
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- 🎨 **Modern UI**: Built with Next.js and modern CSS with glassmorphism effects
- 📊 **Multiple Examples**: Pre-built examples including basic flows, data pipelines, and microservices
- 🖼️ **Export Options**: Export diagrams as SVG or PNG
- ⌨️ **Keyboard Shortcuts**: Full keyboard support for common operations

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Testing

```bash
# Run end-to-end tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode
pnpm test:e2e:headed
```

## Architecture

This demo is built using:

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **@readable/mermaid** - The core Srndpty library
- **Playwright** - End-to-end testing
- **Modern CSS** - Responsive design with glassmorphism effects

## Demo Features

### Interactive Examples

1. **Basic Flow** - Simple process flow with decision points
2. **Data Pipeline** - Complex data processing pipeline with groups
3. **Microservices** - Service architecture with multiple data stores

### User Interface

- **JSON Editor** - Real-time editing with syntax validation
- **Live Preview** - Instant diagram updates as you type
- **Control Panel** - Zoom, pan, fit, and export controls
- **Interaction Log** - Track user interactions with nodes and edges
- **Selection Info** - Details about selected diagram elements

### Interaction Guide

- 🖱️ **Hover**: Rich tooltips with metadata and connection info
- 🎯 **Click Nodes**: Select and highlight connected paths
- 🔗 **Click Edges**: Highlight specific connections
- 🖱️ **Right-Click**: Context menu with actions and data export
- 🔍 **Mouse Wheel**: Zoom in/out on the diagram
- ✋ **Drag**: Pan around large diagrams
- ⌨️ **Keyboard**: ESC to clear, Ctrl+F to fit, Ctrl+R to reset

## Development Notes

This demo showcases the universal nature of Srndpty:
- Works in Next.js with SSR/SSG
- No Vite dependencies
- Full TypeScript integration
- Responsive design patterns
- Modern React patterns with hooks

The demo is designed to be both a functional showcase and a reference implementation for integrating Srndpty into Next.js applications.
