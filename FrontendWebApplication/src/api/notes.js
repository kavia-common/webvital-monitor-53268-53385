/**
 * Notes API helpers.
 */
import api from "./client";

// PUBLIC_INTERFACE
export async function listNotes(websiteId) {
  /** List notes for a website */
  const { data } = await api.get(`/api/v1/websites/${websiteId}/notes`);
  return data;
}

// PUBLIC_INTERFACE
export async function addNote(websiteId, payload) {
  /** Add note: { text } */
  const { data } = await api.post(`/api/v1/websites/${websiteId}/notes`, payload);
  return data;
}
