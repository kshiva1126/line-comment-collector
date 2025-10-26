# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Line Comment Collector is a Visual Studio Code extension that allows users to add comments to specific lines of code and manage them in a sidebar TreeView. Comments persist across sessions using VS Code's workspace state API.

## Development Commands

### Build and Compilation
- `pnpm run compile` - Compile TypeScript using webpack (development mode)
- `pnpm run watch` - Watch mode for development
- `pnpm run package` - Build production bundle with webpack
- `pnpm run compile-tests` - Compile test files to `out/` directory

### Testing
- `pnpm run pretest` - Runs lint, compile, and compile-tests
- `pnpm run test` - Run tests using vscode-test
- `pnpm run watch-tests` - Watch mode for test compilation

### Code Quality
- `pnpm run lint` - Run ESLint on src directory
- `pnpm run format` - Format code with Prettier
- `pnpm run format-check` - Check formatting without modifying files

### Publishing
- `pnpm run vscode-package` - Create .vsix package file
- `pnpm run vscode-publish` - Publish to VS Code Marketplace
- `pnpm run ovsx-publish` - Publish to Open VSX Registry (requires OVSX_PAT env var)

## Architecture

### Extension Entry Point
The extension activates in `src/extension.ts` which:
1. Initializes the Logger and DecoratorService (singletons)
2. Creates a CommentService instance with the extension context
3. Sets up CommentTreeProvider and TreeView for the sidebar
4. Registers all commands via `registerCommands()`
5. Sets up event listeners for editor changes to update decorations

### Core Services

**CommentService** (`src/core/CommentService.ts`)
- Central state management for comment entries
- Persists data using VS Code's `workspaceState` API with key `lineCommentCollector:v1`
- Each comment entry has: id (UUID), fileUri, relativePath, line number, optional selection range, excerpt, comment text, timestamps, and version
- Methods: add, edit, remove, clearAll, getAll, getByFile

**DecoratorService** (`src/core/Decorator.ts`)
- Singleton that manages line decorations in the editor
- Adds visual indicators to lines with comments

**Jump** (`src/core/Jump.ts`)
- Handles navigation to commented lines from the TreeView

**Persist** (`src/core/Persist.ts`)
- Type definitions for CommentEntry and StateV1
- CommentEntry contains both fileUri (absolute) and relativePath (for display)

### UI Components

**CommentTreeProvider** (`src/tree/CommentTreeProvider.ts`)
- Implements vscode.TreeDataProvider
- Groups comments by file (FileNode) and displays individual line comments (LineNode)
- Two-level hierarchy: Files → Line Comments

**TreeNodes** (`src/tree/TreeNodes.ts`)
- FileNode: Represents a file with comments
- LineNode: Represents an individual line comment with metadata

### Commands

All commands are registered in `src/commands/registerCommands.ts`:
- `addComment` - Add comment to current line/selection (Ctrl+Alt+C)
- `copyAll` - Copy all comments to clipboard
- `clearAll` - Remove all comments
- `edit` - Edit existing comment
- `delete` - Delete comment
- `reveal` - Jump to commented line

### Build System

Uses webpack to bundle the extension:
- Entry: `src/extension.ts`
- Output: `dist/extension.js` (referenced in package.json main field)
- Target: Node.js (VS Code extension host)
- TypeScript compiled with ts-loader
- Source maps enabled for debugging

### Data Model

Comments are stored per-workspace using VS Code's workspaceState API. Each entry:
- Has a unique UUID (generated using the `uuid` package)
- References both absolute fileUri and display-friendly relativePath
- Stores line number (0-based) and optional character selection range
- Includes code excerpt and user comment text
- Tracks creation and update timestamps
- Uses version field (currently v1) for future migration support

### Key Extension Points

The extension contributes:
- TreeView in Explorer sidebar: `lineCommentCollector.tree`
- Context menu items in editor and TreeView
- Keybinding: Ctrl+Alt+C (Cmd+Alt+C on macOS)
- Activation events: onCommand and onView

## VS Code API Version

Requires VS Code 1.99.3 or higher (specified in engines field of package.json)
