import * as vscode from 'vscode';

/**
 * Shows a webview panel for multiline comment input
 * @param prompt Instructions to show the user
 * @param initialValue Initial text content (optional)
 * @returns The entered text, or undefined if cancelled
 */
export async function showCommentInputWebview(
  prompt: string,
  initialValue: string = '',
): Promise<string | undefined> {
  return new Promise<string | undefined>((resolve) => {
    let resolved = false;

    // Create webview panel (split beside current editor)
    const panel = vscode.window.createWebviewPanel(
      'commentInput',
      prompt,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      },
    );

    // Set HTML content
    panel.webview.html = getWebviewContent(prompt, initialValue);

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'submit':
            if (!resolved) {
              resolved = true;
              const text = message.text?.trim();
              resolve(text || undefined);
              panel.dispose();
            }
            return;
          case 'cancel':
            if (!resolved) {
              resolved = true;
              resolve(undefined);
              panel.dispose();
            }
            return;
        }
      },
      undefined,
    );

    // Handle panel disposal (user manually closed the panel)
    panel.onDidDispose(() => {
      if (!resolved) {
        resolved = true;
        resolve(undefined);
      }
    });
  });
}

function getWebviewContent(prompt: string, initialValue: string): string {
  // Escape HTML special characters in initial value
  const escapedValue = initialValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h2 {
            margin-top: 0;
            margin-bottom: 16px;
            color: var(--vscode-foreground);
        }
        textarea {
            width: 100%;
            min-height: 200px;
            padding: 10px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            color: var(--vscode-input-foreground);
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            resize: vertical;
            box-sizing: border-box;
        }
        textarea:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        .button-container {
            margin-top: 16px;
            display: flex;
            gap: 8px;
        }
        button {
            padding: 6px 14px;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-button-foreground);
            background-color: var(--vscode-button-background);
            border: none;
            border-radius: 2px;
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        button:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        button.secondary {
            color: var(--vscode-button-secondaryForeground);
            background-color: var(--vscode-button-secondaryBackground);
        }
        button.secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        .hint {
            margin-top: 8px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>${prompt}</h2>
        <textarea id="commentInput" placeholder="Enter your comment here..." autofocus>${escapedValue}</textarea>
        <div class="hint">Press Ctrl+Enter (Cmd+Enter on macOS) to submit quickly</div>
        <div class="button-container">
            <button id="submitBtn">Submit</button>
            <button id="cancelBtn" class="secondary">Cancel</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const textarea = document.getElementById('commentInput');
        const submitBtn = document.getElementById('submitBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        // Focus textarea on load
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

        // Submit handler
        function submit() {
            const text = textarea.value;
            if (text.trim()) {
                vscode.postMessage({
                    command: 'submit',
                    text: text
                });
            } else {
                vscode.postMessage({
                    command: 'cancel'
                });
            }
        }

        // Cancel handler
        function cancel() {
            vscode.postMessage({
                command: 'cancel'
            });
        }

        // Button click handlers
        submitBtn.addEventListener('click', submit);
        cancelBtn.addEventListener('click', cancel);

        // Keyboard shortcuts
        textarea.addEventListener('keydown', (e) => {
            // Ctrl+Enter or Cmd+Enter to submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                submit();
            }
            // Escape to cancel
            if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
            }
        });
    </script>
</body>
</html>`;
}
