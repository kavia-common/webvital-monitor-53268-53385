import React, { useEffect, useState } from "react";
import { downloadReportPdf, getWebsiteResults, listWebsites } from "../api/websites";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [sites, setSites] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function init() {
      const ws = await listWebsites();
      setSites(ws || []);
      if (ws?.length) setSelectedId(ws[0].id);
    }
    init();
  }, []);

  async function downloadFromBackend() {
    if (!selectedId) return;
    const blob = await downloadReportPdf(selectedId);
    const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function clientExport() {
    if (!selectedId) return;
    setExporting(true);
    try {
      const results = await getWebsiteResults(selectedId, { range: "30d" });
      const doc = new jsPDF();
      doc.text("WebVital Monitor - 30d Report", 14, 16);
      const rows = results.map((r) => [
        new Date(r.timestamp || r.time || Date.now()).toLocaleString(),
        r.metrics?.lcp ?? "",
        r.metrics?.cls ?? "",
        r.uptime ?? "",
      ]);
      autoTable(doc, {
        head: [["Time", "LCP (s)", "CLS", "Uptime (%)"]],
        body: rows,
        startY: 22,
      });
      doc.save("report-client.pdf");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="card p-4 space-y-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <div className="flex items-center gap-2">
        <label className="text-sm">Website</label>
        <select
          className="input"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name || s.url}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <button className="btn" onClick={downloadFromBackend}>
          Download PDF (server)
        </button>
        <button className="btn" onClick={clientExport} disabled={exporting}>
          {exporting ? "Exporting..." : "Export PDF (client)"}
        </button>
      </div>
    </div>
  );
}
