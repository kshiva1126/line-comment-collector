# Change Log

All notable changes to the "line-comment-collector" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.8] - 2025-11-06

### Added
- Badge display on activity bar icon showing the total number of comments
- Tooltip on badge showing comment count (e.g., "5 comments")

### Changed
- Badge automatically updates when comments are added, edited, or deleted
- Badge is hidden when there are no comments

## [0.1.7] - 2025-10-29

### Added
- Webview-based multiline comment input with dedicated textarea
- Keyboard shortcuts: Ctrl+Enter (Cmd+Enter) to submit, Escape to cancel
- Auto-focus and cursor positioning for immediate typing
- Split view: Webview opens beside current editor for side-by-side commenting

### Changed
- Replaced single-line input box with webview panel for better UX
- Input form now matches VS Code theme colors
- No more file save dialogs appearing during comment input
- Comment input now displays in split view, allowing code review while typing

### Fixed
- Fixed issue where Ctrl+S triggered unwanted file save dialog
- Fixed Promise resolution bug where comments were not being saved on submit

## [0.1.6] - 2025-10-26

### Added
- Added dedicated activity bar icon for Line Comment Collector
- Extension now appears as independent sidebar view (like TODO Tree)
- Custom SVG icon showing code lines with comment bubble

### Changed
- Moved view from Explorer to dedicated activity bar container
- View name simplified to "Comments" in the sidebar

## [0.1.5] - 2025-10-26

### Fixed
- Fixed "Invalid comment entry" error when deleting or editing individual comments from TreeView

### Changed
- Changed copy format: file path and line number now appear first, followed by comment text
- Changed separator from `---` to `=====` in copied output

## [0.1.4] - 2025-09-15

- Added images to README.md
- Minor improvements and bug fixes

## [0.1.1] - 2025-09-15

- Project structure flattened
- Added Prettier for code formatting
- Minor improvements and bug fixes

## [0.1.0] - 2025-09-14

- Initial release
- Add comments to selected lines or cursor position
- View comments in TreeView sidebar
- Jump to commented lines from sidebar
- Edit or delete comments through context menu
- Copy all comments in formatted text
- Clear all comments with single command
- Comments persist across VS Code sessions
