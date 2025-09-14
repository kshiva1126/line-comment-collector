# Line Comment Collector

![Line Comment Collector](https://raw.githubusercontent.com/kshiva1126/line-comment-collector/6a9a006a0e71092b7d9c1b500e11218a18c3e59d/images/line-comment-collector.png)

A Visual Studio Code extension that allows you to add comments to specific lines of code and manage them in a sidebar TreeView.

## Features

- Add comments to selected lines or cursor position in the editor
- View all comments in a TreeView sidebar organized by file
- Jump to commented lines directly from the sidebar
- Edit or delete existing comments through context menu
- Copy all comments in a formatted text for easy sharing
- Clear all comments with a single command
- Comments persist across VS Code sessions
- Support for multi-line comments with selections
- Line decorations to visually identify commented lines in the editor

## Requirements

- VS Code version 1.99.3 or higher

## How to Use

![Copy All Comments](https://raw.githubusercontent.com/kshiva1126/line-comment-collector/6a9a006a0e71092b7d9c1b500e11218a18c3e59d/images/copy-all-comments.gif)

1. Open a file in the editor
2. Place your cursor on a line or select text (for multi-line comments)
3. Press `Ctrl+Alt+C` (or `Cmd+Alt+C` on macOS) to add a comment
4. Enter your comment in the input box that appears
5. View your comments in the "Line Comment Collector" sidebar
6. Click on a comment to jump to that line in the editor
7. Right-click on a comment to edit or delete it
8. Use the "Copy All Comments" button in the sidebar to copy all comments to clipboard
9. Use the "Clear All Comments" button to remove all comments

## Extension Commands

This extension contributes the following commands:

- `lineCommentCollector.addComment`: Add a comment to the current line or selection
- `lineCommentCollector.copyAll`: Copy all comments to clipboard in a formatted text
- `lineCommentCollector.clearAll`: Clear all comments after confirmation
- `lineCommentCollector.edit`: Edit a comment
- `lineCommentCollector.delete`: Delete a comment after confirmation
- `lineCommentCollector.reveal`: Reveal a commented line in the editor

## Known Issues

Currently, there are no known issues. If you encounter any problems, please report them on the GitHub repository.

---

## Contributing

This extension is open source and contributions are welcome. Please see the GitHub repository for more information.

## Publishing

This extension can be published to either the VS Code Marketplace or the Open VSX Registry:

- For VS Code Marketplace: `pnpm run vscode-publish`
- For Open VSX Registry: `pnpm run ovsx-publish` (requires OVSX_PAT environment variable)
