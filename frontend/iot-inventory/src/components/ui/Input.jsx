import React from "react";

export default function Input({value, onChange, placeholder, type="text", ...rest}){
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...rest} style={{padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.04)", background:"transparent", color:"var(--text)"}} />
  );
}
