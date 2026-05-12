import { http, Token } from "./client";

export async function register({ name, email, password }) {
  const data = await http.post("/auth/register", { name, email, password });
  return data;
}

export async function login({ email, password }) {
  const data = await http.post("/auth/login", { email, password });

  // save token correctly
  Token.set(data.access_token);

  return data;
}

export const getMe = () => http.get("/auth/me");

export function logout() {
  Token.clear();
}