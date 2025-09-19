import React, { useState } from "react";
import { createWebsite } from "../api/websites";
import { updatePreferences } from "../api/preferences";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [website, setWebsite] = useState({ url: "", name: "" });
  const [prefs, setPrefs] = useState({
    channels: { email: true, slack: false, sms: false },
    thresholds: { lcp: 2.5, cls: 0.1, uptime: 99.5 },
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleWebsite() {
    setErr("");
    if (!website.url) {
      setErr("Please enter a website URL");
      return;
    }
    setLoading(true);
    try {
      await createWebsite(website);
      setStep(2);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create website");
    } finally {
      setLoading(false);
    }
  }

  async function handlePrefs() {
    setErr("");
    setLoading(true);
    try {
      await updatePreferences(prefs);
      setStep(3);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-2">Welcome to WebVital Monitor</h1>
      <p className="text-gray-600 mb-6">Let's get you set up in a few quick steps.</p>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Step 1: Add your first website</h2>
          <div>
            <label className="block text-sm font-medium">Website URL</label>
            <input
              placeholder="https://example.com"
              className="input mt-1"
              value={website.url}
              onChange={(e) => setWebsite((p) => ({ ...p, url: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Friendly name (optional)</label>
            <input
              placeholder="Example Site"
              className="input mt-1"
              value={website.name}
              onChange={(e) => setWebsite((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <button className="btn" onClick={handleWebsite} disabled={loading}>
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Step 2: Alert preferences</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">LCP threshold (s)</label>
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
              <label className="block text-sm">CLS threshold</label>
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
          <button className="btn" onClick={handlePrefs} disabled={loading}>
            {loading ? "Saving..." : "Finish"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">All set!</h2>
          <p>You can now view your dashboard and we will start monitoring your site.</p>
          <button className="btn" onClick={() => (window.location.href = "/")}>
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
