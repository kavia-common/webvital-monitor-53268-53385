import React from "react";

export default function Billing() {
  return (
    <div className="card p-4 space-y-4">
      <h1 className="text-xl font-semibold">Billing & Subscription</h1>
      <p className="text-gray-600">
        Manage your subscription. Upgrade or downgrade between Starter, Professional, and Agency plans.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Starter", price: "$9/mo", features: ["1 site", "Email alerts"] },
          { name: "Professional", price: "$29/mo", features: ["5 sites", "Slack + Email", "Reports"] },
          { name: "Agency", price: "$99/mo", features: ["Unlimited", "SMS + Slack + Email", "White-label"] },
        ].map((p) => (
          <div key={p.name} className="border rounded-lg p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-2xl">{p.price}</div>
            <ul className="list-disc ml-5 text-sm text-gray-600 mt-2">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <button className="btn mt-3">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
