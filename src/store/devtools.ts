/**
 * Custom DevTools for Stately store
 * Provides debugging, state inspection, and action replay capabilities
 */

import { Action, State } from './types';

/**
 * Configuration options for DevTools
 * @property name - Display name in DevTools
 * @property enabled - Whether DevTools integration is enabled
 */
export interface DevToolsOptions {
  name?: string;
  enabled?: boolean;
}

/**
 * Custom DevTools class for debugging and state inspection
 */
export class DevTools {
  private enabled: boolean;
  private name: string;
  private stateHistory: State[] = [];
  private actionHistory: Action[] = [];
  private maxHistorySize: number = 100;
  private listeners: Set<(change: { type: string; state: State; action?: Action }) => void> = new Set();

  constructor(options: DevToolsOptions = {}) {
    this.name = options.name || 'Stately Store';
    this.enabled = options.enabled ?? process.env.NODE_ENV === 'development';
  }

  /**
   * Records a state change and action
   * @param action - The action that caused the state change
   * @param state - The new state
   */
  record(action: Action, state: State): void {
    if (!this.enabled) {
      return;
    }

    // Record state and action history
    this.stateHistory.push(state);
    this.actionHistory.push(action);

    // Maintain history size limit
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
      this.actionHistory.shift();
    }

    // Notify listeners
    this.notifyListeners('STATE_CHANGED', state, action);
  }

  /**
   * Subscribes to state changes
   * @param listener - Callback function for state changes
   * @returns Unsubscribe function
   */
  subscribe(listener: (change: { type: string; state: State; action?: Action }) => void): () => void {
    if (!this.enabled) {
      return () => {};
    }
    
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Gets the current state history
   * @returns Array of previous states
   */
  getStateHistory(): State[] {
    return [...this.stateHistory];
  }

  /**
   * Gets the current action history
   * @returns Array of previous actions
   */
  getActionHistory(): Action[] {
    return [...this.actionHistory];
  }

  /**
   * Gets the state at a specific point in history
   * @param index - Index in history (0 is most recent)
   * @returns State at that point or null if not found
   */
  getStateAt(index: number): State | null {
    if (index < 0 || index >= this.stateHistory.length) {
      return null;
    }
    return this.stateHistory[this.stateHistory.length - 1 - index];
  }

  /**
   * Gets the action at a specific point in history
   * @param index - Index in history (0 is most recent)
   * @returns Action at that point or null if not found
   */
  getActionAt(index: number): Action | null {
    if (index < 0 || index >= this.actionHistory.length) {
      return null;
    }
    return this.actionHistory[this.actionHistory.length - 1 - index];
  }

  /**
   * Clears the history
   */
  clearHistory(): void {
    this.stateHistory = [];
    this.actionHistory = [];
  }

  /**
   * Sets the maximum history size
   * @param size - Maximum number of states/actions to keep
   */
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    while (this.stateHistory.length > size) {
      this.stateHistory.shift();
      this.actionHistory.shift();
    }
  }

  /**
   * Enables or disables DevTools
   * @param enabled - Whether to enable DevTools
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private notifyListeners(type: string, state: State, action?: Action): void {
    this.listeners.forEach(listener => listener({ type, state, action }));
  }
} 