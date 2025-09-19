import React, { useState } from "react";
import { register, me, extractErrorMessage } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");

    // Client-side validation to avoid common backend 400s
    if (!form.password || form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(form.email, form.password, form.name);

      const token = res?.access_token || res?.token || res?.jwt || null;
      if (token) {
        // Token already persisted by register(); fetch profile and continue onboarding
        const u = await me();
        setUser(u);
        window.location.href = "/onboarding";
        return;
      }

      // Handle "email verification required" or similar backend responses
      if (res?.requires_verification || res?.status === "pending_verification") {
        setInfo("Registration successful. Please check your email to verify your account, then sign in.");
        // Optionally redirect after short delay
        setTimeout(() => (window.location.href = "/login"), 1500);
        return;
      }

      // No token returned - fallback to login
      setInfo("Account created. Please sign in to continue.");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (e2) {
      setErr(extractErrorMessage(e2, "Registration failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      {info && <div className="mb-3 text-sm text-green-700">{info}</div>}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
        <div>
          <label className="block text-sm font-medium">Confirm password</label>
          <input
            type="password"
            className="input mt-1"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
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
