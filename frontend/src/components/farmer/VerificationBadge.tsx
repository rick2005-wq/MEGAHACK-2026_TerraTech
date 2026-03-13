export default function VerificationBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-300 rounded-full px-3 py-1 text-xs font-semibold">
      ✅ Government Verified
    </span>
  );
}