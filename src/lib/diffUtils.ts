export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
}

/**
 * Computes a line-by-line diff using Longest Common Subsequence (LCS).
 * Fast, reliable, and completely local.
 */
export function computeTextDiff(originalText: string, modifiedText: string): DiffResult {
  const origLines = originalText.split(/\r?\n/);
  const modLines = modifiedText.split(/\r?\n/);

  const n = origLines.length;
  const m = modLines.length;

  // Build DP table for LCS
  // For safety on very large texts, cap rows/cols or handle gracefully
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origLines[i] === modLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to reconstruct diff
  const lines: DiffLine[] = [];
  let i = n;
  let j = m;

  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      stack.push({
        type: 'unchanged',
        text: origLines[i - 1],
        originalLineNumber: i,
        modifiedLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        type: 'added',
        text: modLines[j - 1],
        modifiedLineNumber: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      stack.push({
        type: 'removed',
        text: origLines[i - 1],
        originalLineNumber: i,
      });
      i--;
    }
  }

  while (stack.length > 0) {
    lines.push(stack.pop()!);
  }

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const line of lines) {
    if (line.type === 'added') additions++;
    else if (line.type === 'removed') deletions++;
    else unchanged++;
  }

  return {
    lines,
    additions,
    deletions,
    unchanged,
  };
}
