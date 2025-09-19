import React, { useState } from "react";
import { register, me } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await register(form.email, form.password, form.name);
      // If backend returned a token we can fetch profile and proceed
      if (res?.access_token) {
        const u = await me();
        setUser(u);
        window.location.href = "/onboarding";
      } else {
        // Otherwise fallback: ask the user to sign in
        window.location.href = "/login";
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="input mt-1"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="input mt-1"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            minLength={6}
          />
        </div>
        <button className="btn w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
