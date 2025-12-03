import React from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";

export default function Dashboard() {
  // demo data - replace with API calls
  const stats = [
    { title: "Total Items", value: 324 },
    { title: "Borrowed", value: 42 },
    { title: "Pending Requests", value: 8 },
    { title: "Users", value: 62 }
  ];
  const recent = [
    { id: 1, item: "Raspberry Pi 4", user: "sai", status: "Borrowed" },
    { id: 2, item: "ESP32 DevKit", user: "meera", status: "Returned" }
  ];

  return (
    <div className="col">
      <div className="page-header">
        <div>
          <h1 style={{margin:0}}>Dashboard</h1>
          <div className="small-muted">Overview of lab inventory</div>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12}}>
        {stats.map(s => (
          <Card key={s.title}>
            <div style={{fontSize:12}} className="small-muted">{s.title}</div>
            <div style={{fontSize:20, fontWeight:700}}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{marginTop:18}}>
        <div className="card">
          <h3 style={{marginTop:0}}>Recent activity</h3>
          <Table columns={["ID","Item","User","Status"]} data={recent.map(r=>[r.id,r.item,r.user,r.status])} />
        </div>
      </div>
    </div>
  );
}
