import React, { useEffect, useMemo, useState } from "react";
import { listWebsites, getWebsiteResults } from "../api/websites";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const ws = await listWebsites();
        setSites(ws || []);
        if (ws?.length) {
          setSelectedId(ws[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;
    async function load() {
      try {
        const r = await getWebsiteResults(selectedId, { range: "7d" });
        if (mounted) setResults(r || []);
      } catch {
        if (mounted) setResults([]);
      }
    }
    load();
    const interval = setInterval(load, 30_000); // poll every 30s for near real-time
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedId]);

  const chartData = useMemo(() => {
    const labels = results.map((p) => format(new Date(p.timestamp || p.time || Date.now()), "MM-dd HH:mm"));
    const lcp = results.map((p) => p.metrics?.lcp ?? null);
    const cls = results.map((p) => p.metrics?.cls ?? null);
    const uptime = results.map((p) => (p.uptime ?? 100));

    return {
      labels,
      datasets: [
        { label: "LCP (s)", data: lcp, borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)" },
        { label: "CLS", data: cls, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.2)" },
        { label: "Uptime (%)", data: uptime, borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.2)" },
      ],
    };
  }, [results]);

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm">Website</label>
            <select
              className="input"
              value={selectedId || ""}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.url}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-2">Real-time & Historical Metrics (7d)</h2>
          {loading && !sites.length ? (
            <div>Loading...</div>
          ) : results.length ? (
            <Line data={chartData} />
          ) : (
            <div className="text-gray-500 text-sm">No data to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
