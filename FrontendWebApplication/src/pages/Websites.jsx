import React, { useEffect, useState } from "react";
import { createWebsite, deleteWebsite, listWebsites } from "../api/websites";
import { Link } from "react-router-dom";

export default function Websites() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ url: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const ws = await listWebsites();
      setSites(ws || []);
    } catch {
      setSites([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addSite(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await createWebsite(form);
      setForm({ url: "", name: "" });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add website");
    } finally {
      setLoading(false);
    }
  }

  async function removeSite(id) {
    if (!window.confirm("Delete this website?")) return;
    await deleteWebsite(id);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h1 className="text-xl font-semibold">Websites</h1>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-3">Add website</h2>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={addSite}>
          <input
            placeholder="https://example.com"
            className="input"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            required
          />
          <input
            placeholder="Friendly name (optional)"
            className="input"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <button className="btn" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-3">Your websites</h2>
        <div className="divide-y">
          {sites.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name || s.url}</div>
                <div className="text-sm text-gray-500">{s.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/notes/${s.id}`} className="text-sm text-indigo-600">Notes</Link>
                <button className="text-sm text-red-600" onClick={() => removeSite(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!sites.length && <div className="text-sm text-gray-500">No websites yet.</div>}
        </div>
      </div>
    </div>
  );
}
