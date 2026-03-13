export async function analyzeUser(userId: string): Promise<{ safe: boolean; score: number }> {
  // TODO: Fraud heuristics
  return { safe: true, score: 0 };
}
