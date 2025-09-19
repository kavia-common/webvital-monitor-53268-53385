import React, { useEffect, useState } from "react";
import { addMember, createAgency, listAgencies, listMembers } from "../api/agencies";

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState([]);
  const [agencyForm, setAgencyForm] = useState({ name: "" });
  const [inviteForm, setInviteForm] = useState({ email: "", role: "editor" });

  async function load() {
    const data = await listAgencies();
    setAgencies(data || []);
    if (data?.length) setSelected(data[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    async function loadMembers() {
      if (!selected) return;
      const ms = await listMembers(selected);
      setMembers(ms || []);
    }
    loadMembers();
  }, [selected]);

  async function create(e) {
    e.preventDefault();
    await createAgency(agencyForm);
    setAgencyForm({ name: "" });
    await load();
  }

  async function invite(e) {
    e.preventDefault();
    await addMember(selected, inviteForm);
    setInviteForm({ email: "", role: "editor" });
    const ms = await listMembers(selected);
    setMembers(ms || []);
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h1 className="text-xl font-semibold">Agencies</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-3">Your agencies</h2>
          <form className="flex gap-2 mb-4" onSubmit={create}>
            <input
              className="input"
              placeholder="New agency name"
              value={agencyForm.name}
              onChange={(e) => setAgencyForm({ name: e.target.value })}
              required
            />
            <button className="btn">Create</button>
          </form>
          <div className="divide-y">
            {agencies.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`w-full text-left py-2 ${selected === a.id ? "text-indigo-700" : ""}`}
              >
                {a.name}
              </button>
            ))}
            {!agencies.length && <div className="text-sm text-gray-500">No agencies yet.</div>}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-medium mb-3">Members</h2>
          {selected ? (
            <>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4" onSubmit={invite}>
                <input
                  className="input"
                  placeholder="Email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <select
                  className="input"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button className="btn">Invite</button>
              </form>
              <div className="divide-y">
                {members.map((m) => (
                  <div key={m.id} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium">{m.email}</div>
                      <div className="text-sm text-gray-500 capitalize">{m.role}</div>
                    </div>
                  </div>
                ))}
                {!members.length && <div className="text-sm text-gray-500">No members found.</div>}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">Select an agency to manage members.</div>
          )}
        </div>
      </div>
    </div>
  );
}
