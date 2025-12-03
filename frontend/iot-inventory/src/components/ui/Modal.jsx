import React from "react";

export default function Modal({open, onClose, children}) {
  if(!open) return null;
  return (
    <div style={{
      position:"fixed", left:0, top:0, right:0, bottom:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.6)", zIndex:999
    }}>
      <div style={{width:600, background:"var(--card)", borderRadius:12, padding:16}}>
        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <button onClick={onClose} className="card">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
