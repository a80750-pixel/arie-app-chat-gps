export function formatDistance(meters: number, unitLabel: string): string {
  if (meters < 1000) {
    return `${Math.round(meters)} ${unitLabel}`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
