# Project Context: Line Comment Collector VS Code Extension

## Project Overview

This is a Visual Studio Code extension called "Line Comment Collector" that allows users to add comments to specific lines in files and view/manage them in a sidebar TreeView. The extension is designed to help developers collect and organize comments about code sections they're reviewing or working on.

Key features intended for this extension:

- Add comments to selected lines or cursor position in editor
- Display comments in a TreeView sidebar with file hierarchy
- Jump to commented lines from the sidebar
- Copy all comments in a formatted text
- Persist comments using VS Code's workspaceState
- Edit or delete individual comments

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js (VS Code extension context)
- **Build System**: Webpack
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript ESLint plugin
- **Testing**: VS Code Test CLI with Mocha

## Project Structure

```
line-comment-collector/
├── src/
│   ├── extension.ts (main entry point)
│   ├── test/ (test files)
├── dist/ (compiled extension output)
├── package.json (extension manifest and scripts)
├── tsconfig.json (TypeScript configuration)
├── webpack.config.js (build configuration)
├── eslint.config.mjs (linting configuration)
├── .vscode-test.mjs (test configuration)
├── README.md
└── CHANGELOG.md
```

## Development Workflow

### Building

- `pnpm run compile` - Compile the extension using webpack
- `pnpm run watch` - Watch for changes and recompile automatically
- `pnpm run package` - Package the extension for distribution (production build)

### Testing

- `pnpm run compile-tests` - Compile test files
- `pnpm run watch-tests` - Watch and compile test files automatically
- `pnpm run test` - Run extension tests
- `pnpm run pretest` - Run all preparation steps for testing (compile, lint, etc.)

### Linting

- `pnpm run lint` - Run ESLint on source files

### Pre-publishing

- `pnpm run vscode:prepublish` - Run before publishing to marketplace (runs package script)

## Extension Architecture (Based on Design Document)

The extension is planned to have the following components:

- `extension.ts` - Main entry point
- `tree/CommentTreeProvider.ts` - TreeDataProvider implementation for sidebar
- `tree/TreeNodes.ts` - Node definitions (FileNode, LineNode)
- `core/CommentService.ts` - Add/edit/delete/save/load comments
- `core/Persist.ts` - workspaceState wrapper
- `core/Jump.ts` - File opening and line jumping functionality
- `core/Decorator.ts` - Line decoration functionality
- `commands/registerCommands.ts` - Command registration
- `util/` - Utility modules (logger, time, fmt)

## Coding Conventions

- Strict TypeScript mode enabled
- ESLint rules include naming conventions, curly braces requirement, eqeqeq, no-throw-literal, and semi
- Target: ES2022 with Node16 module resolution

## Key Extension Points

- Commands:
  - `line-comment-collector.helloWorld` (currently implemented, to be replaced)
  - Planned: `lineCommentCollector.addComment`, `lineCommentCollector.copyAll`, etc.
- Views:
  - Planned: `lineCommentCollector.tree` in explorer sidebar
- Activation Events:
  - Currently empty, but planned for specific commands and views
- Keybindings:
  - Planned: `ctrl+alt+c` for adding comments

## Data Model

Comments are stored in workspaceState with the following model:

```ts
type CommentEntry = {
  id: string; // uuid
  workspaceFolder: string; // ルート名 or URI
  fileUri: string; // vscode.Uri.toString()
  relativePath: string; // 表示用
  line: number; // 0-based
  selection?: { start: number; end: number }; // optional: column range
  excerpt: string; // 行の抜粋（最大N文字にトリム）
  comment: string; // ユーザー入力
  createdAt: number;
  updatedAt: number;
  version: 1;
};

type StateV1 = {
  entries: CommentEntry[];
};
```

## Development Environment

- VS Code extension development
- Minimum supported VS Code version: 1.85.0
- Uses VS Code Extension API for TreeView, commands, workspaceState, etc.
