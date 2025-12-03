import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo auth
    if (!email) return alert("enter email");
    localStorage.setItem("auth", "1");
    localStorage.setItem("userName", email.split("@")[0] || "Admin");
    nav("/");
  };

  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh"}}>
      <div className="card" style={{width:420, padding:28}}>
        <h2>Sign in</h2>
        <p className="small-muted">Use any email for demo</p>

        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:12, marginTop:18}}>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
          <input value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="Password" type="password" />
          <button style={{padding:10, borderRadius:8, background:"var(--accent)", border:"none", color:"#042022", fontWeight:700}}>Sign in</button>
        </form>
      </div>
    </div>
  );
}
