# Line Comment Collector

A Visual Studio Code extension that allows you to add comments to specific lines of code and manage them in a sidebar TreeView.

## Features

- Add comments to selected lines or cursor position in the editor
- View all comments in a TreeView sidebar organized by file
- Jump to commented lines directly from the sidebar
- Edit or delete existing comments through context menu
- Copy all comments in a formatted text for easy sharing
- Clear all comments with a single command
- Comments persist across VS Code sessions

## Requirements

- VS Code version 1.85.0 or higher

## How to Use

1. Open a file in the editor
2. Place your cursor on a line or select text
3. Press `Ctrl+Alt+C` (or `Cmd+Alt+C` on macOS) to add a comment
4. Enter your comment in the input box that appears
5. View your comments in the "Line Comment Collector" sidebar
6. Click on a comment to jump to that line in the editor
7. Right-click on a comment to edit or delete it
8. Use the "Copy All Comments" button in the sidebar to copy all comments to clipboard
9. Use the "Clear All Comments" button to remove all comments

## Extension Commands

This extension contributes the following commands:

- `lineCommentCollector.addComment`: Add a comment to the current line
- `lineCommentCollector.copyAll`: Copy all comments to clipboard
- `lineCommentCollector.clearAll`: Clear all comments
- `lineCommentCollector.edit`: Edit a comment
- `lineCommentCollector.delete`: Delete a comment
- `lineCommentCollector.reveal`: Reveal a line in the editor

## Known Issues

Currently, there are no known issues. If you encounter any problems, please report them on the GitHub repository.

## Release Notes

### 0.1.0

Initial release of Line Comment Collector

---

## Contributing

This extension is open source and contributions are welcome. Please see the GitHub repository for more information.
