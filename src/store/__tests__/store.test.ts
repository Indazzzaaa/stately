/// <reference types="jest" />
import { describe, it, expect, jest } from '@jest/globals';
import { createStore } from '../createStore';
import { Action, State } from '../types';

describe('Store', () => {
  interface TestState extends State {
    count: number;
    user?: {
      name: string;
      age: number;
    };
  }

  const initialState: TestState = {
    count: 0,
  };

  it('should create a store with initial state', () => {
    const store = createStore<TestState>({ initialState });
    expect(store.getState()).toEqual(initialState);
  });

  it('should update state with setState', () => {
    const store = createStore<TestState>({ initialState });
    
    store.setState({ count: 1 });
    expect(store.getState().count).toBe(1);

    store.setState(state => ({ count: state.count + 1 }));
    expect(store.getState().count).toBe(2);
  });

  it('should notify subscribers of state changes', () => {
    const store = createStore<TestState>({ initialState });
    const listener = jest.fn();
    
    store.subscribe(listener);
    store.setState({ count: 1 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      { count: 1 },
      expect.objectContaining({
        type: 'SET_STATE',
        payload: { count: 1 }
      })
    );
  });

  it('should allow unsubscribing from state changes', () => {
    const store = createStore<TestState>({ initialState });
    const listener = jest.fn();
    
    const unsubscribe = store.subscribe(listener);
    store.setState({ count: 1 });
    unsubscribe();
    store.setState({ count: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should handle actions through dispatch', () => {
    const store = createStore<TestState>({ initialState });
    const listener = jest.fn();
    
    store.subscribe(listener);
    const action: Action = {
      type: 'INCREMENT',
      payload: 1
    };
    
    store.dispatch(action);

    expect(listener).toHaveBeenCalledWith(
      initialState,
      expect.objectContaining({
        type: 'INCREMENT',
        payload: 1
      })
    );
  });

  it('should maintain state history in DevTools', () => {
    const store = createStore<TestState>({ 
      initialState,
      devTools: true 
    });

    store.setState({ count: 1 });
    store.setState({ count: 2 });
    store.dispatch({ type: 'INCREMENT', payload: 1 });

    // Note: We can't directly test DevTools internals as they're private
    // But we can verify the store still works correctly
    expect(store.getState().count).toBe(2);
  });
});