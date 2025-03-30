/**
 * Core type definitions for the Stately store
 * These types define the shape and behavior of the state management system
 */

/**
 * Base type for all state objects
 * State must be a record with string keys and primitive or object values
 * This ensures state is always an object with properties
 */
export type StateValue = string | number | boolean | null | undefined | object | StateValue[];
export type State = Record<string, StateValue>;

/**
 * Type for state change listeners
 * @template T - The type of state being listened to
 * @param state - The current state
 * @param action - Optional action that caused the state change
 */
export type Listener<T extends State = State> = (state: T, action?: Action) => void;

/**
 * Function type for unsubscribing from state changes
 * Called to remove a listener when it's no longer needed
 */
export type Unsubscribe = () => void;

/**
 * Represents a state change action
 * @property type - Unique identifier for the action
 * @property payload - Optional data associated with the action
 * @property timestamp - Optional timestamp of when the action occurred
 */
export interface Action {
  type: string;
  payload?: StateValue;
  timestamp?: number;
}

/**
 * Core store interface that manages state and state changes
 * @template T - The type of state being managed
 * 
 * @property getState - Returns the current state
 * @property setState - Updates state with either a partial state object or an updater function
 * @property subscribe - Adds a listener for state changes and returns an unsubscribe function
 * @property dispatch - Dispatches an action to trigger state changes
 */
export interface Store<T extends State = State> {
  getState(): T;
  setState(updater: Partial<T> | ((state: T) => Partial<T>)): void;
  subscribe(listener: Listener<T>): Unsubscribe;
  dispatch(action: Action): void;
}

/**
 * Configuration options for creating a new store
 * @template T - The type of state being managed
 * 
 * @property initialState - Optional initial state of the store
 * @property devTools - Optional flag to enable Redux DevTools integration
 * @property middleware - Optional array of middleware functions
 */
export interface StoreOptions<T extends State = State> {
  initialState?: T;
  devTools?: boolean;
  middleware?: Middleware<T>[];
}

/**
 * Function type for dispatching actions
 * @param action - The action to dispatch
 */
export type Dispatch = (action: Action) => void;

/**
 * Function type for handling the next action in the middleware chain
 * @param action - The action to process
 */
export type NextHandler = (action: Action) => void;

/**
 * Function type for middleware handlers
 * @template T - The type of state being managed
 * 
 * @param store - The store instance
 * @param next - Function to call the next middleware in the chain
 * @returns A function that processes actions
 */
export type MiddlewareHandler<T extends State = State> = (
  store: Store<T>,
  next: NextHandler
) => NextHandler;

/**
 * Function type for middleware
 * @template T - The type of state being managed
 * 
 * Middleware functions can intercept and modify actions before they reach reducers
 * They receive the store instance and a next function to continue the chain
 */
export type Middleware<T extends State = State> = (
  store: Store<T>,
  next: NextHandler
) => NextHandler; 