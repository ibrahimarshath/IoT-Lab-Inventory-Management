import React from "react";

export default function Table({columns = [], data = []}) {
  return (
    <table style={{width:"100%", borderCollapse:"collapse"}}>
      <thead>
        <tr>
          {columns.map((c, i) => <th key={i} style={{textAlign:"left", padding:"8px 12px", color:"var(--muted)"}}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
          <tr key={rIdx} style={{borderTop:"1px solid rgba(255,255,255,0.02)"}}>
            {row.map((cell, cIdx) => <td key={cIdx} style={{padding:"10px 12px"}}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
