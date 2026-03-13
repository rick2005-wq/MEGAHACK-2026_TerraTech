// Basic fraud detection heuristics
export async function checkForFraud(userId: string): Promise<{ flagged: boolean; reason?: string }> {
  // TODO: Check: duplicate documents, suspicious patterns, rapid account switches
  return { flagged: false };
}
