import React from "react";
import Card from "../components/ui/Card";

export default function Profile(){
  const name = localStorage.getItem("userName") || "Admin";

  return (
    <div className="col">
      <div className="page-header">
        <div>
          <h1 style={{margin:0}}>Profile</h1>
          <div className="small-muted">Your account</div>
        </div>
      </div>

      <Card>
        <div style={{display:"flex", gap:12, alignItems:"center"}}>
          <div style={{width:72, height:72, borderRadius:12, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center"}}>{name[0].toUpperCase()}</div>
          <div>
            <div style={{fontWeight:700}}>{name}</div>
            <div className="small-muted">Lab Admin</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
