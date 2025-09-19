import { describe, it, expect, beforeEach } from 'vitest';
import {
  createPanZoomState,
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  resetTransform,
  constrainTransform,
  type PanZoomState
} from '../src/interactivity.js';
import type { InteractivityOptions } from '../src/types.js';

describe('createPanZoomState', () => {
  it('should create initial state with default values', () => {
    const state = createPanZoomState();
    
    expect(state).toEqual({
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    });
  });
});

describe('handleWheel', () => {
  let state: PanZoomState;
  let options: InteractivityOptions;
  let containerRect: DOMRect;

  beforeEach(() => {
    state = createPanZoomState();
    options = {
      enablePan: true,
      enableZoom: true,
      minZoom: 0.1,
      maxZoom: 5,
      zoomStep: 0.1
    };
    containerRect = new DOMRect(0, 0, 800, 600);
  });

  it('should zoom in on positive wheel delta', () => {
    const event = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 400,
      clientY: 300
    });

    const newState = handleWheel(event, state, options, containerRect);
    expect(newState.scale).toBe(1.1);
  });

  it('should zoom out on negative wheel delta', () => {
    const event = new WheelEvent('wheel', {
      deltaY: 100,
      clientX: 400,
      clientY: 300
    });

    const newState = handleWheel(event, state, options, containerRect);
    expect(newState.scale).toBe(0.9);
  });

  it('should respect minimum zoom limit', () => {
    state.scale = 0.1;
    const event = new WheelEvent('wheel', {
      deltaY: 100,
      clientX: 400,
      clientY: 300
    });

    const newState = handleWheel(event, state, options, containerRect);
    expect(newState.scale).toBe(0.1);
  });

  it('should respect maximum zoom limit', () => {
    state.scale = 5;
    const event = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 400,
      clientY: 300
    });

    const newState = handleWheel(event, state, options, containerRect);
    expect(newState.scale).toBe(5);
  });

  it('should adjust translation to zoom towards mouse position', () => {
    const event = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 200, // Off-center
      clientY: 150
    });

    const newState = handleWheel(event, state, options, containerRect);
    
    // Translation should be adjusted to keep zoom centered on mouse
    expect(newState.translateX).not.toBe(0);
    expect(newState.translateY).not.toBe(0);
  });
});

describe('handleMouseDown', () => {
  it('should set dragging state and store mouse position', () => {
    const state = createPanZoomState();
    const event = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 200
    });

    const newState = handleMouseDown(event, state);
    
    expect(newState.isDragging).toBe(true);
    expect(newState.lastMouseX).toBe(100);
    expect(newState.lastMouseY).toBe(200);
  });
});

describe('handleMouseMove', () => {
  it('should not change state when not dragging', () => {
    const state = createPanZoomState();
    const event = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 250
    });

    const newState = handleMouseMove(event, state);
    expect(newState).toEqual(state);
  });

  it('should update translation when dragging', () => {
    const state: PanZoomState = {
      ...createPanZoomState(),
      isDragging: true,
      lastMouseX: 100,
      lastMouseY: 200
    };
    
    const event = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 250
    });

    const newState = handleMouseMove(event, state);
    
    expect(newState.translateX).toBe(50); // 150 - 100
    expect(newState.translateY).toBe(50); // 250 - 200
    expect(newState.lastMouseX).toBe(150);
    expect(newState.lastMouseY).toBe(250);
  });

  it('should accumulate translation over multiple moves', () => {
    let state: PanZoomState = {
      ...createPanZoomState(),
      isDragging: true,
      lastMouseX: 100,
      lastMouseY: 200,
      translateX: 10,
      translateY: 20
    };
    
    const event = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 250
    });

    state = handleMouseMove(event, state);
    
    expect(state.translateX).toBe(60); // 10 + 50
    expect(state.translateY).toBe(70); // 20 + 50
  });
});

describe('handleMouseUp', () => {
  it('should stop dragging', () => {
    const state: PanZoomState = {
      ...createPanZoomState(),
      isDragging: true
    };

    const newState = handleMouseUp(state);
    expect(newState.isDragging).toBe(false);
  });

  it('should preserve other state properties', () => {
    const state: PanZoomState = {
      scale: 1.5,
      translateX: 100,
      translateY: 200,
      isDragging: true,
      lastMouseX: 50,
      lastMouseY: 75
    };

    const newState = handleMouseUp(state);
    
    expect(newState.scale).toBe(1.5);
    expect(newState.translateX).toBe(100);
    expect(newState.translateY).toBe(200);
    expect(newState.lastMouseX).toBe(50);
    expect(newState.lastMouseY).toBe(75);
    expect(newState.isDragging).toBe(false);
  });
});

describe('resetTransform', () => {
  it('should return initial state', () => {
    const state = resetTransform();
    const initialState = createPanZoomState();
    
    expect(state).toEqual(initialState);
  });
});

describe('constrainTransform', () => {
  let options: InteractivityOptions;
  let containerRect: DOMRect;

  beforeEach(() => {
    options = {
      minZoom: 0.5,
      maxZoom: 3,
    };
    containerRect = new DOMRect(0, 0, 800, 600);
  });

  it('should constrain scale to minimum', () => {
    const state: PanZoomState = {
      ...createPanZoomState(),
      scale: 0.1
    };

    const newState = constrainTransform(state, containerRect, options);
    expect(newState.scale).toBe(0.5);
  });

  it('should constrain scale to maximum', () => {
    const state: PanZoomState = {
      ...createPanZoomState(),
      scale: 5
    };

    const newState = constrainTransform(state, containerRect, options);
    expect(newState.scale).toBe(3);
  });

  it('should leave valid scale unchanged', () => {
    const state: PanZoomState = {
      ...createPanZoomState(),
      scale: 1.5
    };

    const newState = constrainTransform(state, containerRect, options);
    expect(newState.scale).toBe(1.5);
  });

  it('should preserve other properties', () => {
    const state: PanZoomState = {
      scale: 5,
      translateX: 100,
      translateY: 200,
      isDragging: true,
      lastMouseX: 50,
      lastMouseY: 75
    };

    const newState = constrainTransform(state, containerRect, options);
    
    expect(newState.translateX).toBe(100);
    expect(newState.translateY).toBe(200);
    expect(newState.isDragging).toBe(true);
    expect(newState.lastMouseX).toBe(50);
    expect(newState.lastMouseY).toBe(75);
  });
});
