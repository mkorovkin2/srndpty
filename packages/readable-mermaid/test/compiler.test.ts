import { describe, it, expect } from 'vitest';
import { 
  wrapLabel, 
  specToMermaid, 
  validateSpec 
} from '../src/compiler.js';
import type { ReadableSpec } from '../src/types.js';

describe('wrapLabel', () => {
  it('should return text unchanged if shorter than maxChars', () => {
    expect(wrapLabel('Short text', 20)).toBe('Short text');
  });

  it('should wrap text at word boundaries', () => {
    const result = wrapLabel('This is a very long text that should be wrapped', 20);
    expect(result).toBe('This is a very long<br/>text that should be<br/>wrapped');
  });

  it('should handle single long words by breaking them', () => {
    const result = wrapLabel('Supercalifragilisticexpialidocious', 10);
    expect(result).toBe('Supercalif<br/>ragilistic<br/>expialidoc<br/>ious');
  });

  it('should handle mixed long and short words', () => {
    const result = wrapLabel('Short Supercalifragilisticexpialidocious word', 15);
    expect(result).toBe('Short<br/>Supercalifragil<br/>isticexpialidoc<br/>ious word');
  });

  it('should handle empty string', () => {
    expect(wrapLabel('', 10)).toBe('');
  });

  it('should handle single character', () => {
    expect(wrapLabel('A', 10)).toBe('A');
  });

  it('should handle text with existing line breaks', () => {
    const result = wrapLabel('Line one\nLine two that is very long', 15);
    expect(result).toBe('Line one\nLine two that<br/>is very long');
  });
});

describe('specToMermaid', () => {
  it('should generate basic flowchart from simple spec', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      direction: 'TD',
      nodes: [
        { id: 'A', label: 'Start' },
        { id: 'B', label: 'Process' }
      ],
      edges: [
        { from: 'A', to: 'B' }
      ]
    };

    const result = specToMermaid(spec);
    
    expect(result).toContain('graph TD');
    expect(result).toContain('A["Start"]');
    expect(result).toContain('B["Process"]');
    expect(result).toContain('A ---> B');
    expect(result).toContain('click A nodeClickHandler');
    expect(result).toContain('click B nodeClickHandler');
  });

  it('should handle different node shapes', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'rect', label: 'Rectangle', shape: 'rect' },
        { id: 'round', label: 'Round', shape: 'round' },
        { id: 'stadium', label: 'Stadium', shape: 'stadium' },
        { id: 'cylinder', label: 'Cylinder', shape: 'cylinder' },
        { id: 'circle', label: 'Circle', shape: 'circle' },
        { id: 'diamond', label: 'Diamond', shape: 'diamond' },
        { id: 'hexagon', label: 'Hexagon', shape: 'hexagon' }
      ],
      edges: []
    };

    const result = specToMermaid(spec);
    
    expect(result).toContain('rect["Rectangle"]');
    expect(result).toContain('round("Round")');
    expect(result).toContain('stadium(["Stadium"])');
    expect(result).toContain('cylinder[("Cylinder")]');
    expect(result).toContain('circle(("Circle"))');
    expect(result).toContain('diamond{"Diamond"}');
    expect(result).toContain('hexagon{{"Hexagon"}}');
  });

  it('should handle different edge styles', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' }
      ],
      edges: [
        { from: 'A', to: 'B', style: 'solid' },
        { from: 'B', to: 'C', style: 'thick' },
        { from: 'C', to: 'D', style: 'dotted' }
      ]
    };

    const result = specToMermaid(spec);
    
    expect(result).toContain('A ---> B');
    expect(result).toContain('B ===> C');
    expect(result).toContain('C -.-> D');
  });

  it('should handle edges with labels', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' }
      ],
      edges: [
        { from: 'A', to: 'B', label: 'processes' }
      ]
    };

    const result = specToMermaid(spec);
    expect(result).toContain('A --->|"processes"| B');
  });

  it('should handle groups/subgraphs', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' }
      ],
      edges: [],
      groups: [
        {
          id: 'group1',
          label: 'Processing Group',
          nodes: ['A', 'B']
        }
      ]
    };

    const result = specToMermaid(spec);
    expect(result).toContain('subgraph group1["Processing Group"]');
    expect(result).toContain('A\n    B');
  });

  it('should handle legend', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' }
      ],
      edges: [],
      legend: [
        { swatch: 'primary', label: 'Core step' },
        { swatch: 'accent', label: 'External system' }
      ]
    };

    const result = specToMermaid(spec);
    expect(result).toContain('subgraph Legend["Legend"]');
    expect(result).toContain('legend_0["Core step"]');
    expect(result).toContain('legend_1["External system"]');
    expect(result).toContain('classDef legend_0 fill:var(--primary-color,#e2e8f0)');
    expect(result).toContain('classDef legend_1 fill:var(--accent-color,#e2e8f0)');
  });

  it('should handle node classes', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A', className: 'important' }
      ],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toContain('class A important');
  });

  it('should use default direction TD when not specified', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [{ id: 'A', label: 'A' }],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toContain('graph TD');
  });

  it('should use specified direction', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      direction: 'LR',
      nodes: [{ id: 'A', label: 'A' }],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toContain('graph LR');
  });

  it('should handle empty spec gracefully', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toBe('graph TD\n  A["No data provided"]');
  });

  it('should wrap long node labels', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'This is a very long label that should be wrapped' }
      ],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toContain('<br/>');
  });

  it('should include theme configuration', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      theme: 'dark',
      nodes: [{ id: 'A', label: 'A' }],
      edges: []
    };

    const result = specToMermaid(spec);
    expect(result).toContain('%%{init:');
    expect(result).toContain('"theme": "dark"');
    expect(result).toContain('fontSize');
  });
});

describe('validateSpec', () => {
  it('should return no errors for valid spec', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' }
      ],
      edges: [
        { from: 'A', to: 'B' }
      ]
    };

    const errors = validateSpec(spec);
    expect(errors).toEqual([]);
  });

  it('should return error for null/undefined spec', () => {
    const errors = validateSpec(null as any);
    expect(errors).toContain('Spec is required');
  });

  it('should return error for spec without nodes', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [],
      edges: []
    };

    const errors = validateSpec(spec);
    expect(errors).toContain('At least one node is required');
  });

  it('should detect duplicate node IDs', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A1' },
        { id: 'A', label: 'A2' }
      ],
      edges: []
    };

    const errors = validateSpec(spec);
    expect(errors).toContain('Duplicate node ID: A');
  });

  it('should detect edges referencing unknown nodes', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'C', to: 'A' }
      ]
    };

    const errors = validateSpec(spec);
    expect(errors).toContain('Edge references unknown node: B');
    expect(errors).toContain('Edge references unknown node: C');
  });

  it('should detect groups referencing unknown nodes', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' }
      ],
      edges: [],
      groups: [
        {
          id: 'group1',
          label: 'Group 1',
          nodes: ['A', 'B', 'C']
        }
      ]
    };

    const errors = validateSpec(spec);
    expect(errors).toContain('Group "Group 1" references unknown node: B');
    expect(errors).toContain('Group "Group 1" references unknown node: C');
  });

  it('should return multiple errors when multiple issues exist', () => {
    const spec: ReadableSpec = {
      type: 'flow',
      nodes: [
        { id: 'A', label: 'A' },
        { id: 'A', label: 'A duplicate' }
      ],
      edges: [
        { from: 'A', to: 'B' }
      ]
    };

    const errors = validateSpec(spec);
    expect(errors.length).toBeGreaterThan(1);
    expect(errors).toContain('Duplicate node ID: A');
    expect(errors).toContain('Edge references unknown node: B');
  });
});
