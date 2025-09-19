/**
 * Preferences API helpers.
 */
import api from "./client";

// PUBLIC_INTERFACE
export async function getPreferences() {
  /** Get alert preferences for current user */
  const { data } = await api.get("/api/v1/preferences");
  return data;
}

// PUBLIC_INTERFACE
export async function updatePreferences(prefs) {
  /** Update alert preferences */
  const { data } = await api.put("/api/v1/preferences", prefs);
  return data;
}
