import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user } = useAuth();
  return (
    <div className="card p-4 space-y-2">
      <h1 className="text-xl font-semibold">Account</h1>
      <div><span className="font-medium">Name:</span> {user?.name || "-"}</div>
      <div><span className="font-medium">Email:</span> {user?.email || "-"}</div>
      <div className="text-sm text-gray-600">Manage your personal information here.</div>
    </div>
  );
}
