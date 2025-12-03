import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();
  const name = localStorage.getItem("userName") || "Admin";

  return (
    <div className="topbar">
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <button onClick={() => nav("/dashboard")} className="card">Dashboard</button>
        <div className="small-muted">Welcome back — {name}</div>
      </div>

      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <div className="card" style={{padding:"8px 12px"}}>Search</div>
        <div className="card" style={{padding:"8px 12px", cursor:"pointer"}} onClick={() => alert("Notifications")}>🔔</div>
        <div className="card" style={{padding:"8px 12px", cursor:"pointer"}} onClick={() => { localStorage.removeItem("auth"); window.location="/login"; }}>Logout</div>
      </div>
    </div>
  );
}
