import React, { useEffect, useState } from "react";
import { addNote, listNotes } from "../api/notes";
import { useParams } from "react-router-dom";

export default function Notes() {
  const { websiteId } = useParams();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const ns = await listNotes(websiteId);
    setNotes(ns || []);
  }

  useEffect(() => {
    load();
  }, [websiteId]);

  async function submit(e) {
    e.preventDefault();
    await addNote(websiteId, { text });
    setText("");
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h1 className="text-xl font-semibold">Notes</h1>
        <p className="text-sm text-gray-600">Website ID: {websiteId}</p>
      </div>

      <div className="card p-4">
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="input"
            placeholder="Add a note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button className="btn">Add</button>
        </form>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-3">Recent notes</h2>
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="p-3 border rounded-md">
              <div className="text-sm text-gray-600">{new Date(n.createdAt || Date.now()).toLocaleString()}</div>
              <div>{n.text}</div>
            </div>
          ))}
          {!notes.length && <div className="text-sm text-gray-500">No notes yet.</div>}
        </div>
      </div>
    </div>
  );
}
