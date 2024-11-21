export function limitScore(x: number): number {
  return (Math.round((x + Number.EPSILON) * 100) / 100);
}
