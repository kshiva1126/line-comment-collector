export function trimExcerpt(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

export function formatCommentEntry(entry: any): string {
  return `${entry.relativePath}:${entry.line + 1}  ${entry.excerpt}\n  - comment: ${entry.comment}\n`;
}
