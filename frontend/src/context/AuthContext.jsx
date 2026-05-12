import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login, register, logout, getMe } from "../api/auth";
import { Token } from "../api/client";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    if (!Token.exists()) { setLoading(false); return; }
    getMe().then(setUser).catch(() => Token.clear()).finally(() => setLoading(false));
  }, []);

  // Force-logout when token expires (401 from any endpoint)
  useEffect(() => {
    const fn = () => setUser(null);
    window.addEventListener("sx:logout", fn);
    return () => window.removeEventListener("sx:logout", fn);
  }, []);

      const authLogin = useCallback(async (email, password) => {

        const data = await login({ email, password });

        
        if (data.error) {
          throw new Error(data.error);
        }

        // save token
        Token.set(data.access_token);

        // fetch user info
        const me = await getMe();
        setUser(me);

        return me;

      }, []);

    const authRegister = useCallback(async (name, email, password) => {
      await register({ name, email, password });
      return authLogin(email, password);
    }, [authLogin]);

  const authLogout = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  // Call after credits change (booking, transfer, etc.)
  const refreshUser = useCallback(async () => {
    if (!Token.exists()) return;
    const u = await getMe();
    setUser(u);
    return u;
  }, []);

  const updateUser = (newData) => {
  setUser(prev => ({ ...prev, ...newData }));
};

  return (
    <Ctx.Provider value={{
  user,
  loading,
  isAuth: !!user,
  isAdmin: user?.role === "admin",
  authLogin,
  authRegister,
  authLogout,
  refreshUser,
  updateUser
}}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};
