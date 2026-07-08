export type UserRole = "admin" | "pembimbing" | "user";

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success?: boolean;
}
