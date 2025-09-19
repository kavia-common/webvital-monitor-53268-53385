import React, { useEffect, useState } from "react";
import { getPreferences, updatePreferences } from "../api/preferences";

export default function Preferences() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const p = await getPreferences();
        setPrefs(
          p || {
            channels: { email: true, slack: false, sms: false },
            thresholds: { lcp: 2.5, cls: 0.1, uptime: 99.5 },
          }
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      await updatePreferences(prefs);
      setMsg("Preferences saved");
    } catch {
      setMsg("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!prefs) return <div>Unable to load preferences</div>;

  return (
    <div className="card p-4 space-y-6">
      <h1 className="text-xl font-semibold">Alert preferences</h1>

      <div>
        <h2 className="font-medium mb-2">Notification channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["email", "slack", "sms"].map((c) => (
            <label key={c} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!prefs.channels[c]}
                onChange={(e) =>
                  setPrefs((p) => ({
                    ...p,
                    channels: { ...p.channels, [c]: e.target.checked },
                  }))
                }
              />
              <span className="capitalize">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">LCP (s)</label>
            <input
              type="number"
              step="0.1"
              className="input mt-1"
              value={prefs.thresholds.lcp}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  thresholds: { ...p.thresholds, lcp: parseFloat(e.target.value) },
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm">CLS</label>
            <input
              type="number"
              step="0.01"
              className="input mt-1"
              value={prefs.thresholds.cls}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  thresholds: { ...p.thresholds, cls: parseFloat(e.target.value) },
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm">Uptime target (%)</label>
            <input
              type="number"
              step="0.1"
              className="input mt-1"
              value={prefs.thresholds.uptime}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  thresholds: { ...p.thresholds, uptime: parseFloat(e.target.value) },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        {msg && <div className="text-sm text-gray-600">{msg}</div>}
      </div>
    </div>
  );
}
