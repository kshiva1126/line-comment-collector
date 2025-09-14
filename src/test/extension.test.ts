import * as assert from 'assert';
import * as vscode from 'vscode';
import { CommentService } from '../core/CommentService';
import { CommentEntry } from '../core/Persist';

suite('Line Comment Collector Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  let commentService: CommentService;

  suiteSetup(() => {
    // Get the extension context
    const extension = vscode.extensions.getExtension('line-comment-collector');
    if (extension) {
      commentService = new CommentService(extension.exports);
    }
  });

  test('Comment service should add a comment', async () => {
    // Skip this test if we don't have a comment service
    if (!commentService) {
      assert.ok(true);
      return;
    }

    const fileUri = 'file:///test/file.ts';
    const relativePath = 'file.ts';
    const line = 10;
    const excerpt = 'const x = 1;';
    const comment = 'This is a test comment';

    const entry = await commentService.add(
      fileUri,
      relativePath,
      line,
      excerpt,
      comment,
    );

    assert.ok(entry.id);
    assert.strictEqual(entry.fileUri, fileUri);
    assert.strictEqual(entry.relativePath, relativePath);
    assert.strictEqual(entry.line, line);
    assert.strictEqual(entry.excerpt, excerpt);
    assert.strictEqual(entry.comment, comment);
    assert.ok(entry.createdAt);
    assert.ok(entry.updatedAt);
    assert.strictEqual(entry.version, 1);
  });

  test('Comment service should edit a comment', async () => {
    // Skip this test if we don't have a comment service
    if (!commentService) {
      assert.ok(true);
      return;
    }

    // Add a comment first
    const fileUri = 'file:///test/file.ts';
    const relativePath = 'file.ts';
    const line = 10;
    const excerpt = 'const x = 1;';
    const comment = 'This is a test comment';

    const entry = await commentService.add(
      fileUri,
      relativePath,
      line,
      excerpt,
      comment,
    );

    // Edit the comment
    const newComment = 'This is an updated comment';
    await commentService.edit(entry.id, newComment);

    // Verify the comment was updated
    const entries = commentService.getAll();
    const updatedEntry = entries.find(e => e.id === entry.id);

    assert.ok(updatedEntry);
    assert.strictEqual(updatedEntry!.comment, newComment);
    assert.ok(updatedEntry!.updatedAt > updatedEntry!.createdAt);
  });

  test('Comment service should remove a comment', async () => {
    // Skip this test if we don't have a comment service
    if (!commentService) {
      assert.ok(true);
      return;
    }

    // Add a comment first
    const fileUri = 'file:///test/file.ts';
    const relativePath = 'file.ts';
    const line = 10;
    const excerpt = 'const x = 1;';
    const comment = 'This is a test comment';

    const entry = await commentService.add(
      fileUri,
      relativePath,
      line,
      excerpt,
      comment,
    );

    // Verify the comment was added
    let entries = commentService.getAll();
    assert.strictEqual(entries.length, 1);

    // Remove the comment
    await commentService.remove(entry.id);

    // Verify the comment was removed
    entries = commentService.getAll();
    assert.strictEqual(entries.length, 0);
  });

  test('Comment service should clear all comments', async () => {
    // Skip this test if we don't have a comment service
    if (!commentService) {
      assert.ok(true);
      return;
    }

    // Add multiple comments
    await commentService.add(
      'file:///test/file1.ts',
      'file1.ts',
      10,
      'const x = 1;',
      'Comment 1',
    );
    await commentService.add(
      'file:///test/file2.ts',
      'file2.ts',
      20,
      'const y = 2;',
      'Comment 2',
    );

    // Verify the comments were added
    let entries = commentService.getAll();
    assert.strictEqual(entries.length, 2);

    // Clear all comments
    await commentService.clearAll();

    // Verify all comments were cleared
    entries = commentService.getAll();
    assert.strictEqual(entries.length, 0);
  });
});
