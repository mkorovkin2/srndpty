import type { ReadableSpec, ReadableNode, ReadableEdge, ReadableGroup, LegendItem } from './types.js';

/**
 * Wraps text at the specified character limit, handling long words gracefully
 */
export function wrapLabel(text: string, maxChars: number = 20): string {
  if (text.length <= maxChars) return text;
  
  // First split by existing line breaks to preserve them
  const paragraphs = text.split('\n');
  const wrappedParagraphs: string[] = [];
  
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if (word.length > maxChars) {
        // Handle very long words by breaking them
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        
        let remainingWord = word;
        while (remainingWord.length > maxChars) {
          lines.push(remainingWord.substring(0, maxChars));
          remainingWord = remainingWord.substring(maxChars);
        }
        currentLine = remainingWord + ' ';
      } else if (currentLine.length + word.length + 1 <= maxChars) {
        currentLine += word + ' ';
      } else {
        if (currentLine) {
          lines.push(currentLine.trim());
        }
        currentLine = word + ' ';
      }
    }
    
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    
    wrappedParagraphs.push(lines.join('<br/>'));
  }
  
  return wrappedParagraphs.join('\n');
}

/**
 * Converts a node shape to Mermaid syntax
 */
function getNodeShape(node: ReadableNode): string {
  const wrappedLabel = wrapLabel(node.label);
  
  switch (node.shape) {
    case 'round':
      return `${node.id}("${wrappedLabel}")`;
    case 'stadium':
      return `${node.id}(["${wrappedLabel}"])`;
    case 'cylinder':
      return `${node.id}[("${wrappedLabel}")]`;
    case 'circle':
      return `${node.id}(("${wrappedLabel}"))`;
    case 'diamond':
      return `${node.id}{"${wrappedLabel}"}`;
    case 'hexagon':
      return `${node.id}{{"${wrappedLabel}"}}`;
    case 'rect':
    default:
      return `${node.id}["${wrappedLabel}"]`;
  }
}

/**
 * Converts an edge style to Mermaid syntax
 */
function getEdgeStyle(edge: ReadableEdge): string {
  const { from, to, label, style } = edge;
  
  let arrow = '--->';
  if (style === 'thick') arrow = '===>';
  else if (style === 'dotted') arrow = '-.->'; // Fixed dotted arrow syntax
  else if (style === 'dashed') arrow = '-->';
  
  if (label) {
    return `${from} ${arrow}|"${label}"| ${to}`;
  }
  return `${from} ${arrow} ${to}`;
}

/**
 * Generates CSS classes for theming
 */
function generateThemeClasses(spec: ReadableSpec): string {
  const classes: string[] = [];
  
  // Base readable styles
  classes.push(`
    %%{init: {
      "theme": "${spec.theme || 'default'}",
      "themeVariables": {
        "fontSize": "16px",
        "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        "primaryColor": "#f0f9ff",
        "primaryTextColor": "#0f172a",
        "primaryBorderColor": "#0ea5e9",
        "lineColor": "#64748b",
        "secondaryColor": "#fef3c7",
        "tertiaryColor": "#ecfdf5",
        "background": "#ffffff",
        "mainBkg": "#f8fafc",
        "secondBkg": "#e2e8f0",
        "tertiaryBkg": "#cbd5e1"
      }
    }}%%
  `);
  
  return classes.join('\n');
}

/**
 * Builds legend as a subgraph
 */
function buildLegend(legend: LegendItem[]): string {
  if (!legend || legend.length === 0) return '';
  
  const legendNodes = legend.map((item, index) => {
    const nodeId = `legend_${index}`;
    return `${nodeId}["${item.label}"]`;
  }).join('\n    ');
  
  const legendClasses = legend.map((item, index) => {
    // Map swatch names to actual colors since Mermaid doesn't support CSS variables
    const colorMap: Record<string, string> = {
      'primary': '#3b82f6',
      'accent': '#10b981',
      'secondary': '#6b7280',
      'success': '#22c55e',
      'warning': '#f59e0b',
      'error': '#ef4444',
      'info': '#06b6d4'
    };
    const fillColor = colorMap[item.swatch] || '#e2e8f0';
    const strokeColor = colorMap[item.swatch] ? '#1f2937' : '#64748b';
    return `classDef legend_${index} fill:${fillColor},stroke:${strokeColor}`;
  }).join('\n  ');
  
  return `
  subgraph Legend["Legend"]
    ${legendNodes}
  end
  
  ${legendClasses}
  ${legend.map((_, index) => `class legend_${index} legend_${index}`).join('\n  ')}
  `;
}

/**
 * Builds groups as subgraphs
 */
function buildGroups(groups: ReadableGroup[]): string {
  if (!groups || groups.length === 0) return '';
  
  return groups.map(group => {
    const nodesList = group.nodes.join('\n    ');
    return `
  subgraph ${group.id}["${group.label}"]
    ${nodesList}
  end`;
  }).join('\n');
}

/**
 * Main function to convert ReadableSpec to Mermaid diagram code
 */
export function specToMermaid(spec: ReadableSpec): string {
  if (!spec || !spec.nodes || spec.nodes.length === 0) {
    return 'graph TD\n  A["No data provided"]';
  }
  
  const direction = spec.direction || 'TD';
  const lines: string[] = [];
  
  // Add theme configuration
  lines.push(generateThemeClasses(spec));
  
  // Start with graph declaration
  lines.push(`graph ${direction}`);
  
  // Add nodes
  spec.nodes.forEach(node => {
    lines.push(`  ${getNodeShape(node)}`);
  });
  
  // Add edges
  spec.edges.forEach(edge => {
    lines.push(`  ${getEdgeStyle(edge)}`);
  });
  
  // Add groups
  if (spec.groups) {
    lines.push(buildGroups(spec.groups));
  }
  
  // Add legend
  if (spec.legend) {
    lines.push(buildLegend(spec.legend));
  }
  
  // Add node classes for styling
  spec.nodes.forEach(node => {
    if (node.className) {
      lines.push(`  class ${node.id} ${node.className}`);
    }
  });
  
  // Add click handlers placeholders (will be handled by React component)
  spec.nodes.forEach(node => {
    lines.push(`  click ${node.id} nodeClickHandler`);
  });
  
  return lines.join('\n');
}

/**
 * Validates a ReadableSpec for common issues
 */
export function validateSpec(spec: ReadableSpec): string[] {
  const errors: string[] = [];
  
  if (!spec) {
    errors.push('Spec is required');
    return errors;
  }
  
  if (!spec.nodes || spec.nodes.length === 0) {
    errors.push('At least one node is required');
  }
  
  // Check for duplicate node IDs
  const nodeIds = new Set();
  spec.nodes.forEach(node => {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  });
  
  // Check that edges reference valid nodes
  spec.edges?.forEach(edge => {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge references unknown node: ${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge references unknown node: ${edge.to}`);
    }
  });
  
  // Check that groups reference valid nodes
  spec.groups?.forEach(group => {
    group.nodes.forEach(nodeId => {
      if (!nodeIds.has(nodeId)) {
        errors.push(`Group "${group.label}" references unknown node: ${nodeId}`);
      }
    });
  });
  
  return errors;
}
