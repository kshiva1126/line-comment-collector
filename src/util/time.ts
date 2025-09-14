export function getCurrentTimestamp(): number {
  return Date.now();
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toISOString();
}
