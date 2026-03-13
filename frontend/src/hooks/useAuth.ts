import { useState, useEffect } from "react";
export function useAuth() {
  const [user, setUser] = useState<null | { id: string; role: string; name: string }>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // TODO: Validate JWT / Firebase token
    setLoading(false);
  }, []);
  return { user, loading };
}