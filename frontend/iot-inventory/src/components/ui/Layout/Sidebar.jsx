import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/inventory", label: "Inventory" },
  { to: "/borrow-requests", label: "Borrow Requests" },
  { to: "/cart", label: "Cart" },
  { to: "/profile", label: "Profile" }
];

export default function Sidebar() {
  const nav = useNavigate();

  return (
    <div>
      <div className="brand">
        <img src="/src/assets/react.svg" alt="logo" />
        <div>
          <div style={{fontWeight:700}}>IoT Lab</div>
          <div className="small-muted">Inventory Dashboard</div>
        </div>
      </div>

      <nav style={{display:"flex", flexDirection:"column", gap:8}}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({isActive}) => "nav-item" + (isActive ? " active" : "")}
          >
            <span style={{width:8, height:8, borderRadius:4, background: 'rgba(110,231,183,0.25)'}}></span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div style={{marginTop:20}}>
        <div className="small-muted">Quick actions</div>
        <div style={{display:"flex", flexDirection:"column", gap:8, marginTop:8}}>
          <button className="card" onClick={() => nav("/inventory")}>New Inventory</button>
          <button className="card" onClick={() => nav("/borrow-requests")}>Manage Requests</button>
        </div>
      </div>
    </div>
  );
}
