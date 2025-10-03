export type Credentials = { identifier: string; password: string };

export type AuthSuccess = {
  ok: true;
  user: { id: string; email: string; username?: string };
  token?: string;
};

export type AuthFailure = {
  ok: false;
  code: "VALIDATION" | "UNAUTHORIZED" | "RATE_LIMIT" | "SERVER" | "NETWORK" | "UNAVAILABLE";
  message: string;
};

export type AuthResult = AuthSuccess | AuthFailure;