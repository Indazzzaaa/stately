/// <reference types="jest" />
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { DevTools } from '../devtools';
import { Action } from '../types';

describe('DevTools', () => {
  let devTools: DevTools;
  const mockAction: Action = {
    type: 'TEST_ACTION',
    payload: { test: 'data' }
  };

  beforeEach(() => {
    devTools = new DevTools({ enabled: true });
  });

  it('should record state changes', () => {
    const initialState = { count: 0 };
    const newState = { count: 1 };

    devTools.record(mockAction, initialState);
    devTools.record(mockAction, newState);

    expect(devTools.getStateHistory()).toHaveLength(2);
    expect(devTools.getStateHistory()[0]).toEqual(initialState);
    expect(devTools.getStateHistory()[1]).toEqual(newState);
  });

  it('should record action history', () => {
    const state = { count: 0 };
    devTools.record(mockAction, state);
    devTools.record({ ...mockAction, type: 'ANOTHER_ACTION' }, state);

    expect(devTools.getActionHistory()).toHaveLength(2);
    expect(devTools.getActionHistory()[0]).toEqual(mockAction);
  });

  it('should notify listeners of state changes', () => {
    const listener = jest.fn();
    devTools.subscribe(listener);
    
    const state = { count: 0 };
    devTools.record(mockAction, state);
    
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      type: 'STATE_CHANGED',
      state,
      action: mockAction
    });
  });

  it('should respect maximum history size', () => {
    devTools.setMaxHistorySize(5);
    const state = { count: 0 };

    for (let i = 0; i < 10; i++) {
      devTools.record({ ...mockAction, type: `ACTION_${i}` }, state);
    }

    expect(devTools.getStateHistory()).toHaveLength(5);
    expect(devTools.getActionHistory()).toHaveLength(5);
  });

  it('should be disabled in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    devTools = new DevTools();
    const state = { count: 0 };
    devTools.record(mockAction, state);
    expect(devTools.getStateHistory()).toHaveLength(0);

    process.env.NODE_ENV = originalEnv;
  });
}); 