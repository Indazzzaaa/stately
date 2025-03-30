/**
 * Core store implementation with state management, updates, subscriptions, middleware, and DevTools support
 */

import { Action, State, Store, StoreOptions } from './types';
import { DevTools } from './devtools';
import { applyMiddleware } from '../middleware';

/**
 * Creates a new store instance with the specified options
 * @template T - The type of state being managed
 * @param options - Configuration options for the store
 * @returns A new store instance
 * 
 * @example
 * ```typescript
 // Basic usage
 * const store = createStore({
 *   initialState: { count: 0 }
 * });
 * 
 // With middleware and DevTools
 * const store = createStore({
 *   initialState: { users: [] },
 *   middleware: [logger],
 *   devTools: true
 * });
 * ```
 */
export function createStore<T extends State = State>(options: StoreOptions<T> = {}): Store<T> {
  let state = options.initialState || {} as T;
  const listeners: Set<(state: T, action?: Action) => void> = new Set();
  const devTools = new DevTools({ enabled: options.devTools });

  const store: Store<T> = {
    /**
     * Returns the current state
     * @returns The current state of type T
     */
    getState: () => state,

    /**
     * Updates the state with either a partial state object or an updater function
     * @param updater - Either a partial state object or a function that receives current state and returns partial updates
     * 
     * @example
     * ```typescript
     * // Direct update
     * store.setState({ count: 42 });
     * 
     * // Function update
     * store.setState(state => ({
     *   count: state.count + 1
     * }));
     * ```
     */
    setState: (updater) => {
      const nextState = typeof updater === 'function' ? updater(state) : updater;
      state = { ...state, ...nextState } as T;
      
      const action: Action = {
        type: 'SET_STATE',
        payload: nextState,
        timestamp: Date.now(),
      };

      devTools.record(action, state);
      listeners.forEach(listener => listener(state, action));
    },

    /**
     * Subscribes to state changes
     * @param listener - Function to be called on state changes
     * @returns Function to unsubscribe the listener
     * 
     * @example
     * ```typescript
     * const unsubscribe = store.subscribe((state, action) => {
     *   console.log('State changed:', state);
     *   console.log('Action:', action);
     * });
     * 
     // Later, to unsubscribe:
     * unsubscribe();
     * ```
     */
    subscribe: (listener) => {
      listeners.add(listener as (state: T, action?: Action) => void);
      return () => listeners.delete(listener as (state: T, action?: Action) => void);
    },

    /**
     * Dispatches an action to trigger state changes
     * @param action - The action to dispatch
     * 
     * @example
     * ```typescript
     * store.dispatch({
     *   type: 'INCREMENT',
     *   payload: 1
     * });
     * ```
     */
    dispatch: (action: Action) => {
      action.timestamp = Date.now();
      devTools.record(action, state);
      listeners.forEach(listener => listener(state, action));
    },
  };

  // Apply middleware if provided
  if (options.middleware?.length) {
    return applyMiddleware<T>(...options.middleware)(store);
  }

  return store;
} 