// Base HTTP client — all API calls go through here.
// Attaches JWT token, parses responses, throws on errors.

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const Token = {
  get:    ()  => localStorage.getItem("sx_token"),
  set:    (t) => localStorage.setItem("sx_token", t),
  clear:  ()  => localStorage.removeItem("sx_token"),
  exists: ()  => !!localStorage.getItem("sx_token"),
};

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("sx_token")
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`http://localhost:8080${path}`, {
      method, headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError(0, "Cannot reach server — is Spring Boot running on port 8080?");
  }

  if (res.status === 401) {
    Token.clear();
    window.dispatchEvent(new Event("sx:logout"));
    throw new ApiError(401, "Session expired — please sign in again.");
  }

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
const msg =
  typeof data === "string"
    ? data
    : data?.message ||
      data?.error ||
      data?.detail ||
      data?.errors?.[0]?.defaultMessage ||
      "Something went wrong"; throw new ApiError(res.status, msg);
  }
  return data;
}

export const http = {
  get:    (path)       => request("GET",    path),
  post:   (path, body) => request("POST",   path, body),
  put:    (path, body) => request("PUT",    path, body),
  delete: (path)       => request("DELETE", path),
};
