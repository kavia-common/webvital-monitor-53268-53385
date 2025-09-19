/**
 * Agencies API helpers.
 */
import api from "./client";

// PUBLIC_INTERFACE
export async function listAgencies() {
  /** List agencies for current user */
  const { data } = await api.get("/api/v1/agencies");
  return data;
}

// PUBLIC_INTERFACE
export async function createAgency(payload) {
  /** Create an agency */
  const { data } = await api.post("/api/v1/agencies", payload);
  return data;
}

// PUBLIC_INTERFACE
export async function listMembers(agencyId) {
  /** List agency members */
  const { data } = await api.get(`/api/v1/agencies/${agencyId}/members`);
  return data;
}

// PUBLIC_INTERFACE
export async function addMember(agencyId, payload) {
  /** Add/invite member to agency */
  const { data } = await api.post(`/api/v1/agencies/${agencyId}/members`, payload);
  return data;
}
