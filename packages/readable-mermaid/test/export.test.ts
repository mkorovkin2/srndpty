import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportSVG, exportPNG, downloadDataUrl } from '../src/export.js';

// Mock DOM APIs
const mockImage = {
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
  width: 0,
  height: 0
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn()
  })),
  toDataURL: vi.fn(() => 'data:image/png;base64,mockpngdata')
};

// Mock global objects
Object.defineProperty(global, 'Image', {
  value: vi.fn(() => mockImage)
});

Object.defineProperty(global, 'XMLSerializer', {
  value: vi.fn(() => ({
    serializeToString: vi.fn((element) => '<svg>mock svg content</svg>')
  }))
});

global.btoa = vi.fn((str) => `base64-${str}`);

Object.defineProperty(global.document, 'createElement', {
  value: vi.fn((tagName) => {
    if (tagName === 'canvas') return mockCanvas;
    if (tagName === 'a') return {
      href: '',
      download: '',
      click: vi.fn(),
      style: {}
    };
    return {};
  })
});

Object.defineProperty(global.document, 'createElementNS', {
  value: vi.fn(() => ({
    setAttribute: vi.fn()
  }))
});

Object.defineProperty(global.document.body, 'appendChild', {
  value: vi.fn()
});

Object.defineProperty(global.document.body, 'removeChild', {
  value: vi.fn()
});

describe('exportSVG', () => {
  let mockSvgElement: any;

  beforeEach(() => {
    mockSvgElement = {
      cloneNode: vi.fn(() => mockSvgElement),
      insertBefore: vi.fn()
    };
    
    // Reset XMLSerializer to default for each test
    Object.defineProperty(global, 'XMLSerializer', {
      value: vi.fn(() => ({
        serializeToString: vi.fn((element) => '<svg>mock svg content</svg>')
      })),
      configurable: true
    });
    
    vi.clearAllMocks();
  });

  it('should export SVG as data URL', async () => {
    const result = await exportSVG(mockSvgElement);
    
    expect(result).toBe('data:image/svg+xml;base64,base64-<svg>mock svg content</svg>');
    expect(mockSvgElement.cloneNode).toHaveBeenCalledWith(true);
  });

  it('should add background color when specified', async () => {
    const options = { format: 'svg' as const, backgroundColor: '#ffffff' };
    
    await exportSVG(mockSvgElement, options);
    
    expect(document.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'rect');
    expect(mockSvgElement.insertBefore).toHaveBeenCalled();
  });

  it('should handle serialization errors', async () => {
    // Mock XMLSerializer to throw an error
    const mockSerializerInstance = {
      serializeToString: vi.fn(() => {
        throw new Error('Serialization failed');
      })
    };
    
    Object.defineProperty(global, 'XMLSerializer', {
      value: vi.fn(() => mockSerializerInstance),
      configurable: true
    });

    await expect(exportSVG(mockSvgElement)).rejects.toThrow('Serialization failed');
  });
});

describe('exportPNG', () => {
  let mockSvgElement: any;

  beforeEach(() => {
    mockSvgElement = {
      cloneNode: vi.fn(() => mockSvgElement),
      getBBox: vi.fn(() => ({ width: 100, height: 80 })),
      setAttribute: vi.fn()
    };
    
    // Reset XMLSerializer to default for PNG tests
    Object.defineProperty(global, 'XMLSerializer', {
      value: vi.fn(() => ({
        serializeToString: vi.fn((element) => '<svg>mock svg content</svg>')
      })),
      configurable: true
    });
    
    // Reset canvas mock
    mockCanvas.getContext.mockReturnValue({
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn()
    });
    
    vi.clearAllMocks();
  });

  it('should export PNG as data URL', async () => {
    // Simulate successful image load
    setTimeout(() => {
      if (mockImage.onload) mockImage.onload();
    }, 0);

    const result = await exportPNG(mockSvgElement);
    
    expect(result).toBe('data:image/png;base64,mockpngdata');
    expect(mockSvgElement.cloneNode).toHaveBeenCalledWith(true);
  });

  it('should apply scale factor', async () => {
    const options = { format: 'png' as const, scale: 3 };
    
    setTimeout(() => {
      if (mockImage.onload) mockImage.onload();
    }, 0);

    await exportPNG(mockSvgElement, options);
    
    expect(mockCanvas.width).toBe(300); // 100 * 3
    expect(mockCanvas.height).toBe(240); // 80 * 3
  });

  it('should set background color', async () => {
    const options = { format: 'png' as const, backgroundColor: '#ff0000' };
    const mockCtx = mockCanvas.getContext();
    
    setTimeout(() => {
      if (mockImage.onload) mockImage.onload();
    }, 0);

    await exportPNG(mockSvgElement, options);
    
    expect(mockCtx.fillStyle).toBe('#ff0000');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 200, 160); // default scale 2
  });

  it('should handle canvas context creation failure', async () => {
    mockCanvas.getContext.mockReturnValue(null);
    
    await expect(exportPNG(mockSvgElement)).rejects.toThrow('Could not get canvas context');
  });

  it('should handle image load errors', async () => {
    setTimeout(() => {
      if (mockImage.onerror) mockImage.onerror();
    }, 0);

    await expect(exportPNG(mockSvgElement)).rejects.toThrow('Failed to load SVG image');
  });
});

describe('downloadDataUrl', () => {
  let mockLink: any;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: {}
    };
    
    (document.createElement as any).mockImplementation((tagName: string) => {
      if (tagName === 'a') return mockLink;
      return {};
    });
    
    vi.clearAllMocks();
  });

  it('should create download link and trigger download', () => {
    const dataUrl = 'data:image/svg+xml;base64,test';
    const filename = 'test.svg';
    
    downloadDataUrl(dataUrl, filename);
    
    expect(mockLink.href).toBe(dataUrl);
    expect(mockLink.download).toBe(filename);
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });

  it('should handle different file types', () => {
    downloadDataUrl('data:image/png;base64,test', 'diagram.png');
    
    expect(mockLink.href).toBe('data:image/png;base64,test');
    expect(mockLink.download).toBe('diagram.png');
  });
});
