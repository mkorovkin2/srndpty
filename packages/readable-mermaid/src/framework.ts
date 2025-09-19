import type { ReadableSpec, FrameworkOptions, VanillaRenderOptions } from './types.js';
import { createDiagram as createVanillaDiagram, renderDiagram as renderVanillaDiagram } from './vanilla.js';

// Check if React is available in the environment
function isReactAvailable(): boolean {
  try {
    // Check if React is available globally
    if (typeof window !== 'undefined' && (window as any).React) {
      return true;
    }
    
    // Check if we can import React (this will work in bundled environments)
    try {
      require('react');
      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

/**
 * Main framework class that provides a unified API for both React and vanilla environments
 */
export class SrndptyFramework {
  private static defaultOptions: FrameworkOptions = {
    autoDetect: true,
    fallbackToVanilla: true,
    defaultContainer: '#mermaid-container'
  };
  
  /**
   * Create a diagram with automatic environment detection
   */
  static create(spec: ReadableSpec, options?: Partial<VanillaRenderOptions & FrameworkOptions>) {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    if (mergedOptions.autoDetect) {
      const hasReact = isReactAvailable();
      
      if (hasReact && !mergedOptions.fallbackToVanilla) {
        // Return React component reference for React environments
        try {
          const { Srndpty } = require('./ReadableMermaid.js');
          return {
            type: 'react' as const,
            component: Srndpty,
            spec,
            options
          };
        } catch (error) {
          if (!mergedOptions.fallbackToVanilla) {
            throw new Error('React environment detected but Srndpty component could not be loaded');
          }
        }
      }
    }
    
    // Fallback to vanilla implementation
    const container = options?.container || mergedOptions.defaultContainer!;
    const vanillaOptions: VanillaRenderOptions = {
      container,
      ...options
    };
    
    return createVanillaDiagram(spec, vanillaOptions);
  }
  
  /**
   * Render a diagram immediately with automatic environment detection
   */
  static async render(spec: ReadableSpec, options?: Partial<VanillaRenderOptions & FrameworkOptions>) {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    if (mergedOptions.autoDetect) {
      const hasReact = isReactAvailable();
      
      if (hasReact && !mergedOptions.fallbackToVanilla) {
        throw new Error('Cannot use auto-render in React environment. Use the Srndpty component instead.');
      }
    }
    
    // Use vanilla implementation
    const container = options?.container || mergedOptions.defaultContainer!;
    const vanillaOptions: VanillaRenderOptions = {
      container,
      ...options
    };
    
    return await renderVanillaDiagram(spec, vanillaOptions);
  }
  
  /**
   * Force vanilla rendering (bypass React detection)
   */
  static createVanilla(spec: ReadableSpec, options: VanillaRenderOptions) {
    return createVanillaDiagram(spec, options);
  }
  
  /**
   * Force vanilla rendering and render immediately
   */
  static async renderVanilla(spec: ReadableSpec, options: VanillaRenderOptions) {
    return await renderVanillaDiagram(spec, options);
  }
  
  /**
   * Get the React component (if available)
   */
  static getReactComponent() {
    try {
      const { Srndpty } = require('./ReadableMermaid.js');
      return Srndpty;
    } catch (error) {
      throw new Error('React component not available. Make sure React is installed and available.');
    }
  }
  
  /**
   * Utility to check environment capabilities
   */
  static getEnvironmentInfo() {
    return {
      hasReact: isReactAvailable(),
      hasMermaid: typeof window !== 'undefined' || typeof global !== 'undefined',
      isNode: typeof process !== 'undefined' && process.versions?.node,
      isBrowser: typeof window !== 'undefined'
    };
  }
}

// Export convenience functions for common use cases
export const createDiagram = SrndptyFramework.createVanilla;
export const renderDiagram = SrndptyFramework.renderVanilla;

// Legacy exports for backwards compatibility
export const ReadableMermaidFramework = SrndptyFramework;

// Default export
export default SrndptyFramework;
