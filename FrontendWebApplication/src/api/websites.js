/**
 * Websites API helpers.
 */
import api from "./client";

// PUBLIC_INTERFACE
export async function listWebsites() {
  /** List websites for current user */
  const { data } = await api.get("/api/v1/websites");
  return data;
}

// PUBLIC_INTERFACE
export async function createWebsite(payload) {
  /** Create website: { url, name?, tags? } */
  const { data } = await api.post("/api/v1/websites", payload);
  return data;
}

// PUBLIC_INTERFACE
export async function updateWebsite(id, payload) {
  /** Update website settings */
  const { data } = await api.put(`/api/v1/websites/${id}`, payload);
  return data;
}

// PUBLIC_INTERFACE
export async function deleteWebsite(id) {
  /** Delete website */
  const { data } = await api.delete(`/api/v1/websites/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function getWebsiteResults(id, params = {}) {
  /** Get monitoring results for website; params may include range, metric, etc. */
  const { data } = await api.get(`/api/v1/websites/${id}/results`, { params });
  return data;
}

// PUBLIC_INTERFACE
export async function downloadReportPdf(id) {
  /** Download PDF report for website */
  const res = await api.get(`/api/v1/websites/${id}/report.pdf`, {
    responseType: "blob",
  });
  return res.data;
}
