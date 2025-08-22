export interface AuthResponse {
  username: string;
  roles: string[];
}

export interface AuthRequest {
  username: string;
  password: string;
  roles: string[];
}
