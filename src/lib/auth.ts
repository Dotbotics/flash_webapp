/**
 * AUTH.TS
 * 
 * What it does:
 * A utility library for managing admin authentication and session state.
 * 
 * Why it exists:
 * To provide a consistent way to check if a user is logged in and to handle 
 * the storage of authentication tokens.
 * 
 * How it works:
 * - Uses 'localStorage' to persist a "fake" admin token for session management.
 * - Provides functions for login, logout, and checking current auth status.
 * 
 * Connections:
 * - Used by 'src/app/App.tsx' to protect admin routes.
 * - Connects to the '/api/login' endpoint in 'server.ts'.
 * 
 * Module: Shared Logic / Lib
 */

export const login = async (username: string, password: string): Promise<string | null> => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      return data.token;
    }
  } catch (err) {
    console.error("Login failed", err);
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('admin_token');
};

export const checkAuth = (): boolean => {
  return localStorage.getItem('admin_token') === 'fake-admin-token';
};
