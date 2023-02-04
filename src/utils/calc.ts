export const calcProgress = (progress: number): number =>
  Math.round(progress * 100 * 100) / 100;

export const bytesToMegabytes = (bytesCount: number): string =>
  (bytesCount / Math.pow(2, 20)).toFixed(1) + ' mb';
