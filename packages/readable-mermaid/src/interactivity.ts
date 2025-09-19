import type { InteractivityOptions, PanZoomState } from './types.js';

/**
 * Creates initial pan/zoom state
 */
export function createPanZoomState(): PanZoomState {
  return {
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };
}

/**
 * Applies pan/zoom transform to an SVG element
 */
export function applyTransform(element: SVGElement, state: PanZoomState): void {
  console.log('🔧 Applying transform:', state);
  
  // For SVG elements, we should use CSS transform on the SVG element
  const transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
  
  // Apply CSS transform with proper origin
  element.style.transform = transform;
  element.style.transformOrigin = 'center center';
  
  // Ensure the SVG is properly styled for transforms
  element.style.transition = 'none'; // Disable transitions during transform
  element.style.willChange = 'transform'; // Optimize for transforms
  
  console.log('🔧 Applied transform:', transform, 'to element:', element);
}

/**
 * Handles mouse wheel zoom
 */
export function handleWheel(
  event: WheelEvent,
  state: PanZoomState,
  options: InteractivityOptions,
  containerRect: DOMRect
): PanZoomState {
  const { minZoom = 0.1, maxZoom = 5 } = options;
  
  // Use multiplicative zoom for more natural feeling
  const zoomFactor = event.deltaY > 0 ? 0.85 : 1.15;
  const newScale = Math.max(minZoom, Math.min(maxZoom, state.scale * zoomFactor));
  
  console.log('🔍 Wheel zoom:', {
    deltaY: event.deltaY,
    currentScale: state.scale,
    zoomFactor,
    newScale
  });
  
  // Calculate mouse position relative to container
  const mouseX = event.clientX - containerRect.left;
  const mouseY = event.clientY - containerRect.top;
  
  // Calculate the point in the diagram that's under the mouse
  const pointX = (mouseX - state.translateX) / state.scale;
  const pointY = (mouseY - state.translateY) / state.scale;
  
  // Calculate new translation to keep the point under the mouse
  const newTranslateX = mouseX - pointX * newScale;
  const newTranslateY = mouseY - pointY * newScale;
  
  console.log('🔍 Zoom calculation:', {
    mouse: { x: mouseX, y: mouseY },
    point: { x: pointX, y: pointY },
    newTranslate: { x: newTranslateX, y: newTranslateY }
  });
  
  return {
    ...state,
    scale: newScale,
    translateX: newTranslateX,
    translateY: newTranslateY
  };
}

/**
 * Handles mouse down for pan start
 */
export function handleMouseDown(event: MouseEvent, state: PanZoomState): PanZoomState {
  return {
    ...state,
    isDragging: true,
    lastMouseX: event.clientX,
    lastMouseY: event.clientY
  };
}

/**
 * Handles mouse move for panning
 */
export function handleMouseMove(event: MouseEvent, state: PanZoomState): PanZoomState {
  if (!state.isDragging) return state;
  
  const deltaX = event.clientX - state.lastMouseX;
  const deltaY = event.clientY - state.lastMouseY;
  
  console.log('🖱️ Pan move:', {
    deltaX,
    deltaY,
    currentTranslate: { x: state.translateX, y: state.translateY },
    newTranslate: { x: state.translateX + deltaX, y: state.translateY + deltaY }
  });
  
  return {
    ...state,
    translateX: state.translateX + deltaX,
    translateY: state.translateY + deltaY,
    lastMouseX: event.clientX,
    lastMouseY: event.clientY
  };
}

/**
 * Handles mouse up for pan end
 */
export function handleMouseUp(state: PanZoomState): PanZoomState {
  return {
    ...state,
    isDragging: false
  };
}

/**
 * Fits diagram to container
 */
export function fitToContainer(
  svgElement: SVGElement,
  containerElement: HTMLElement,
  padding: number = 20
): PanZoomState {
  const svgRect = (svgElement as SVGGraphicsElement).getBBox();
  const containerRect = containerElement.getBoundingClientRect();
  
  const scaleX = (containerRect.width - padding * 2) / svgRect.width;
  const scaleY = (containerRect.height - padding * 2) / svgRect.height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
  
  const scaledWidth = svgRect.width * scale;
  const scaledHeight = svgRect.height * scale;
  
  const translateX = (containerRect.width - scaledWidth) / 2 - svgRect.x * scale;
  const translateY = (containerRect.height - scaledHeight) / 2 - svgRect.y * scale;
  
  return {
    scale,
    translateX,
    translateY,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };
}

/**
 * Resets pan/zoom to initial state
 */
export function resetTransform(): PanZoomState {
  return createPanZoomState();
}

/**
 * Constrains pan/zoom state within reasonable bounds
 */
export function constrainTransform(
  state: PanZoomState,
  _containerRect: DOMRect,
  options: InteractivityOptions
): PanZoomState {
  const { minZoom = 0.1, maxZoom = 5 } = options;
  
  // Constrain scale
  const constrainedScale = Math.max(minZoom, Math.min(maxZoom, state.scale));
  
  // For now, allow free panning - could add bounds later
  return {
    ...state,
    scale: constrainedScale
  };
}
