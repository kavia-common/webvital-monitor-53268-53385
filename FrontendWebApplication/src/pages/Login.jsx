import React, { useState } from "react";
import { login, me, extractErrorMessage } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const u = await me();
      setUser(u);
      window.location.href = "/";
    } catch (e2) {
      setErr(extractErrorMessage(e2, "Login failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="input mt-1"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="input mt-1"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
        </div>
        <button className="btn w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
