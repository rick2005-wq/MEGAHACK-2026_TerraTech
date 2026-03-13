export type UserRole = "FARMER" | "INDUSTRY" | "ADMIN";
export interface User {
  id: string; role: UserRole; name: string; phone: string;
  email: string; verified_status: boolean; created_at: string;
}