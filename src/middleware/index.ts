/**
 * Middleware system for the Stately store
 */

import { Action, Middleware, Store, State, Dispatch, NextHandler } from '../store/types';
import { logger } from '../utils/logger';

export function applyMiddleware<T extends State = State>(...middlewares: Middleware<T>[]) {
  return (store: Store<T>) => {
    let dispatch: Dispatch = store.dispatch;

    // Compose the middleware chain
    dispatch = middlewares.reduceRight((next, middleware) => {
      return (action: Action) => {
        const nextHandler = middleware(store, next);
        nextHandler(action);
      };
    }, dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

export function createLogger<T extends State = State>(): Middleware<T> {
  return (store: Store<T>, next: NextHandler) => (action: Action) => {
    const prevState = store.getState();
    const startTime = performance.now();

    next(action);

    const nextState = store.getState();
    const duration = performance.now() - startTime;

    logger.logAction(action, prevState, nextState);
    logger.logPerformance('Action Processing', duration);
  };
} 