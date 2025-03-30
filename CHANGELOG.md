# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-03-XX

### Added
- **Core Store**
  - Type-safe state management with TypeScript generics
  - Flexible state updates with direct and function-based setState
  - Subscription system for state changes
  - Action dispatch system for predictable state updates

- **DevTools**
  - State history tracking for debugging
  - Action history recording
  - State inspection capabilities
  - Environment-aware enabling/disabling
  - Maximum history size control
  - Listener notification system

- **Middleware System**
  - Composable middleware chain
  - Type-safe middleware handlers
  - Action interception and transformation
  - Support for async operations

### Tests
- Comprehensive test suite for store functionality
  - State management tests
  - Subscription system tests
  - Action dispatch tests
  - DevTools integration tests

- DevTools specific tests
  - History tracking tests
  - Action recording tests
  - State inspection tests
  - Environment handling tests

### Configuration
- Project setup with TypeScript
- Build configuration with Rollup
- Test setup with Jest
- Code quality tools:
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript strict mode

### Developer Experience
- Detailed type definitions for better IDE support
- Comprehensive JSDoc comments
- Clear error messages
- Development mode features

[0.1.0]: https://github.com/yourusername/stately/releases/tag/v0.1.0 