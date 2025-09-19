import type { ExportOptions } from './types.js';

/**
 * Exports an SVG element as an SVG file
 */
export function exportSVG(
  svgElement: SVGElement,
  options: ExportOptions = { format: 'svg' }
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Set background if specified
      if (options.backgroundColor) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', options.backgroundColor);
        clonedSvg.insertBefore(rect, clonedSvg.firstChild);
      }
      
      // Get SVG string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      
      // Create data URL
      const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
      
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Exports an SVG element as a PNG file
 */
export function exportPNG(
  svgElement: SVGElement,
  options: ExportOptions = { format: 'png' }
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const { backgroundColor = 'white', scale = 2 } = options;
      
      // Get SVG dimensions
      const bbox = (svgElement as SVGGraphicsElement).getBBox();
      const width = bbox.width * scale;
      const height = bbox.height * scale;
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Clone and prepare SVG
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());
      
      // Convert SVG to data URL
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
      
      // Create image and draw to canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        resolve(pngDataUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load SVG image'));
      };
      img.src = svgDataUrl;
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Downloads a data URL as a file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports and downloads SVG
 */
export async function exportAndDownloadSVG(
  svgElement: SVGElement,
  filename: string = 'diagram.svg',
  options: Omit<ExportOptions, 'format'> = {}
): Promise<void> {
  const dataUrl = await exportSVG(svgElement, { ...options, format: 'svg' });
  downloadDataUrl(dataUrl, filename);
}

/**
 * Exports and downloads PNG
 */
export async function exportAndDownloadPNG(
  svgElement: SVGElement,
  filename: string = 'diagram.png',
  options: Omit<ExportOptions, 'format'> = {}
): Promise<void> {
  const dataUrl = await exportPNG(svgElement, { ...options, format: 'png' });
  downloadDataUrl(dataUrl, filename);
}
