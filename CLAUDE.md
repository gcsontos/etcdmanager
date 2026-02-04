# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ETCD Manager is a cross-platform desktop application (Electron + Vue.js 2) for managing ETCD v3 clusters. It provides a GUI for key management, authentication, user/role administration, leases, watchers, and cluster health monitoring.

**Important**: This project uses Vue 2.7 (final Vue 2 version) with TypeScript, class-based components (`vue-class-component`, `vue-property-decorator`), and Vuex for state management. It targets ETCD v3 API only (v2 is not supported).

**Node.js Requirement**: Node.js 22+ is required. The project has been upgraded to work with modern Node.js and Electron 35.

## Development Commands

### Setup and Installation
```bash
npm install --legacy-peer-deps

# Note: GRPC is now handled by @grpc/grpc-js (pure JavaScript implementation)
# No native module rebuilding is required!
```

### Development
```bash
npm run electron:serve              # Start dev server with hot reload
```

### Building
```bash
npm run build                        # Build web version
npm run electron:build               # Build for current platform
npm run electron:build:linux         # Build for Linux (AppImage, tar.gz)
npm run electron:build:mac           # Build for macOS (dmg)
npm run electron:build:win           # Build for Windows (nsis installer)
```

### Testing and Quality
```bash
npm run test                         # Run Playwright tests
npm run test:headed                  # Run Playwright tests with UI
npm run test:debug                   # Debug Playwright tests
npm run lint                         # Run ESLint (AirBnB style guide)
npm run lint:fix                     # Auto-fix ESLint issues
```

### Publishing
```bash
npm run electron:publish:linux       # Build and publish to GitHub for Linux
npm run electron:publish:mac         # Build and publish to GitHub for macOS
npm run electron:publish:win         # Build and publish to GitHub for Windows
```

## Architecture

### Application Entry Points

- **Electron Main Process**: `src/background.ts` - Handles window creation, menu management, IPC communication, splash screen, and auto-updates
- **Vue App Entry**: `src/main.ts` - Initializes Vue app with i18n, Vuetify, Vuelidate, and global components
- **Router**: `src/router.ts` - Vue Router configuration with route guards
- **State Management**: `src/store.ts` - Vuex store with ETCD connection state, config profiles, watchers, and messages

### Key Directories

- **`src/components/`** - Vue components (manager screens, editors, dialogs)
  - Manager components: `key-manager.vue`, `user-manager.vue`, `role-manager.vue`, `lease-manager.vue`, `watcher_manager.vue`
  - Editor components: `key-editor.vue`, `user-editor.vue`, `role-editor.vue`, etc.
  - Dialogs: `delete.dialog.vue`, `purge.dialog.vue`, `message.dialog.vue`, etc.

- **`src/services/`** - Business logic and API wrappers
  - `etcd.service.ts` - Core ETCD client wrapper (uses `etcd3` npm package)
  - `key.service.ts`, `user.service.ts`, `role.service.ts`, `lease.service.ts`, `watcher.service.ts` - Domain-specific services
  - `auth.service.ts`, `config.service.ts` - Authentication and configuration management
  - `local-storage.service.ts` - LocalStorage wrapper
  - `platform.service.ts`, `clipboard.service.ts` - Platform utilities

- **`src/lib/`** - Base classes and utilities
  - `crud.class.ts` - Base class for CRUD components with keyboard shortcuts, clipboard, and data loading
  - `editor.class.ts` - Base class for editor components
  - `dialog.class.ts` - Base class for dialog components
  - `validators.ts` - Custom Vuelidate validators
  - `messages.ts` - Message/notification helpers

- **`src/i18n/`** - Internationalization (currently `en.ts`, `hu.ts`)

- **`src/guards/`** - Vue Router navigation guards

- **`tests/e2e/`** - End-to-end tests using Playwright (Spectron has been replaced)
  - Test files organized by feature (migrated from old `test/spec/modules/`)

### Component Architecture

Most components extend from base classes in `src/lib/`:

- **CrudBase** (`crud.class.ts`): Provides common CRUD functionality, keyboard shortcuts (via Mousetrap), data table management, selection handling, and auto-reload on data changes
- **EditorBase** (`editor.class.ts`): Extends CrudBase for editor forms with validation
- **DialogBase** (`dialog.class.ts`): Base for modal dialogs

Components use Vue class decorators (`@Component`) and TypeScript class syntax.

### State Management

Vuex store (`src/store.ts`) manages:
- **ETCD Connection**: Single `EtcdService` instance, connection options, SSL/TLS config
- **Configuration**: Active profile, multiple config profiles, language, UI preferences
- **Authentication**: Username/password for ETCD basic auth
- **Watchers**: Active watchers stored in a Map, auto-load settings
- **UI State**: Loading indicators, messages/toasts, console output

Key mutations: `etcdConnect`, `config`, `etcdConfig`, `ssl`, `etcdAuthConfig`, `watcher`

### ETCD Client Integration

The app uses the `etcd3` npm package (v1.1.2+) with `@grpc/grpc-js` (pure JavaScript GRPC implementation). Connection is initialized via:
1. User configures connection in `config.vue` (host, port, SSL, auth)
2. Config is saved to Vuex store
3. Store mutation `etcdConnect` calls `EtcdService.init()` with connection options
4. Service instantiates `Etcd3` client with GRPC connection

**Important**: The project now uses `@grpc/grpc-js` instead of the native `grpc` module. This is a pure JavaScript implementation that works with Node.js 22 without requiring native module compilation. Proto files are handled internally by the library.

### Keyboard Shortcuts

The app heavily uses keyboard shortcuts via Mousetrap (bound in `CrudBase`). Press **Ctrl/Cmd+H** in the app to show the help pane with all shortcuts.

### Route Guards

`isConfiguredGuard` (in `src/guards/guards.ts`) prevents navigation to feature screens until ETCD is configured.

## Code Style

- **Linter**: ESLint 8.x with AirBnB base style guide + Vue plugin + TypeScript support
- **Configuration**: `.eslintrc.js` in project root
- **Max line length**: 140 characters
- **Quotes**: Single quotes
- **Indentation**: 4 spaces
- **TypeScript**: Strict mode enabled with `strictPropertyInitialization: false` for Vue 2 class components compatibility

## Testing

- **Framework**: Playwright (replaces Mocha + Spectron)
- **Configuration**: `playwright.config.ts` in project root
- **Test location**: `tests/e2e/`
- **Running tests**: `npm run test` (headless), `npm run test:headed` (with UI), `npm run test:debug` (debug mode)
- **Selectors**: All testable UI elements have `data-test` attributes with format: `componentName.operation-elementType` (e.g., `data-test="config.settings-actions-submit.v-btn"`)

**Note**: Tests are currently being migrated from the old Spectron-based tests to Playwright.

## Important Technical Details

### Build System
The project uses **Vite** as the build system with `vite-plugin-electron` for Electron integration. This replaces the previous Vue CLI + webpack 4 setup and provides:
- **No OpenSSL workaround needed** - Vite uses esbuild/rollup, not webpack 4
- **Faster development builds** - Vite's native ESM dev server
- **Modern bundling** - Rollup for production builds

Configuration files:
- `vite.config.ts` - Vite configuration with Electron plugins
- `electron-builder.yml` - Electron Builder packaging configuration

### GRPC Implementation
The project uses `@grpc/grpc-js` (pure JavaScript) instead of the native `grpc` module. This provides:
- **No native compilation required** - works out of the box with Node.js 22
- **Cross-platform compatibility** - no platform-specific build issues
- **Easier development setup** - just `npm install` with no rebuild steps

### Proto Loader Alias
The Vite config aliases `@grpc/proto-loader` to `webpack-proto-loader` for browser compatibility in the renderer process.

### TypeScript Configuration
- Path alias: `@/*` maps to `src/*`
- Target: ES2022
- Strict mode enabled with `strictPropertyInitialization: false` (required for Vue 2 class component prop initialization)
- Experimental decorators enabled for Vue class components

### Sass/SCSS
The project uses Dart Sass (`sass` package) instead of the deprecated `node-sass`. All `.vue` files use `<style lang="scss">` blocks.

### Multi-Profile Support
Users can save multiple ETCD connection profiles. Config is stored in localStorage via `vue-localstorage` plugin.

### Auto-Updates
The app uses `electron-updater` to check for updates. Release info is fetched from GitHub releases.

### Translation Keys
When adding new UI text, add translation keys to `src/i18n/en.ts` (and optionally `hu.ts`). Use `$t('key.path')` in templates or `i18n.t()` in code.

## Common Patterns

### Creating a New Manager Component
1. Extend `CrudBase` from `src/lib/crud.class.ts`
2. Implement the `load()` method to fetch data from ETCD service
3. Define table headers in `headers` property
4. Add route in `src/router.ts` with `isConfiguredGuard`
5. Add menu item in `src/background.ts` (Electron menu)
6. Add `data-test` attributes for testing

### Creating a New Service
1. Create service file in `src/services/`
2. Inject `EtcdService` to access ETCD client
3. Use `store.state.connection.getClient()` to get the etcd3 client instance
4. Return Promises for async operations
5. Handle errors and use `store.commit('message', {...})` for user feedback

### Adding Keyboard Shortcuts
Register in component's `bindEvents()` or `bindDefaultEvents()` using Mousetrap:
```typescript
this.keyboardEvents = Mousetrap.bind('ctrl+n', () => this.create());
```

## Dependencies

### Core Stack
- **Node.js**: 22+ required
- **Vue 2.7.16** (final Vue 2 version with Composition API backport)
- **TypeScript 5.7.0** with strict mode
- **Vuetify 1.5.24** (Material Design UI components)
- **Electron 35.7.5** (desktop app framework with Node 22.14.0)

### Build Tools
- **Vite 5.4** (build system - replaced Vue CLI)
- **vite-plugin-electron 0.28** (Electron main process integration)
- **vite-plugin-electron-renderer 0.14** (Electron renderer process Node.js support)
- **@vitejs/plugin-vue2 2.3** (Vue 2 support for Vite)
- **Electron Builder 25.0** (packaging)
- **ESLint 8.57** with TypeScript and Vue plugins
- **Dart Sass 1.80** (SCSS compilation)
- **Playwright 1.48** (E2E testing)

### ETCD & Communication
- **etcd3 1.1.2** (ETCD v3 client library)
- **@grpc/grpc-js 1.12+** (pure JavaScript GRPC implementation - replaces native grpc)
- **@grpc/proto-loader 0.7.13** (protocol buffer loader)
- **protobufjs 7.4.0** (protocol buffer runtime)

### Vue Ecosystem
- **vue-class-component 7.2.6** (class-style components)
- **vue-property-decorator 9.1.2** (property decorators)
- **vue-router 3.6.5** (routing)
- **vuex 3.6.2** (state management)
- **vue-i18n 8.28.2** (internationalization)
- **vuelidate 0.7.7** (form validation)

### Utilities
- **@electron/remote 2.1.3** (Electron remote module for renderer process)
- **electron-updater 6.3.0** (auto-updates)
- **mousetrap 1.6.5** (keyboard shortcuts)
- **moment** (date/time manipulation)
- **marked 1.x** (markdown rendering)
- **uuid 11.0** (UUID generation)
- **lodash-es 4.17.21** (utility functions)

## Node 22 Upgrade Notes

This project was upgraded from Node 10+ to Node 22 in February 2026. Key changes:

### What Changed
1. **GRPC Migration**: Replaced native `grpc` (1.24.2) with `@grpc/grpc-js` (1.12+) - pure JavaScript implementation compatible with Node 22
2. **Electron**: Upgraded from v6 to v35.7.5 (includes Node 22.14.0)
3. **Build System**: Migrated from Vue CLI + webpack 4 to Vite + vite-plugin-electron
4. **Linting**: Migrated from TSLint to ESLint 8.x
5. **Styling**: Replaced node-sass with Dart Sass
6. **Testing**: Added Playwright (replacing Spectron which is deprecated)
7. **Vue 2.7**: Upgraded to final Vue 2 release with Composition API backport
8. **TypeScript**: Upgraded from 3.8 → 5.7

### Build Considerations
- **Legacy Peer Deps**: Use `--legacy-peer-deps` flag with npm install due to dependency resolution conflicts
- **Vue DevTools**: Disabled in development due to Electron 35 compatibility issues with the extension installer

### Known Issues & Workarounds
- Some dependencies still show engine warnings for older Node versions (safe to ignore)
- Property initialization in Vue class components requires `@ts-ignore` comments due to TypeScript 5 strictness
- Vue DevTools extension installation causes "renderer.bundle.js" errors in Electron 35 - use built-in DevTools instead (Ctrl+Shift+I)

### Future Improvements
- Consider migrating to Vue 3 when ready for breaking changes
- Complete Playwright test migration from old Spectron tests
- Re-enable Vue DevTools when electron-devtools-installer is updated for Electron 35

### Compatibility
- **Minimum Node.js**: 22.0.0
- **Tested on**: Node 22.19.0
- **Target Platforms**: Linux (AppImage, tar.gz), macOS (dmg), Windows (nsis)
