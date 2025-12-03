import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";

const demoInventory = [
  { id: "I-001", name: "Raspberry Pi 4", qty: 10, location: "Shelf A1" },
  { id: "I-002", name: "ESP32 DevKit", qty: 15, location: "Shelf B2" }
];

export default function Inventory(){
  const [items, setItems] = useState([]);

  useEffect(()=> {
    // replace with real fetch
    setItems(demoInventory);
  }, []);

  return (
    <div className="col">
      <div className="page-header">
        <div>
          <h1 style={{margin:0}}>Inventory</h1>
          <div className="small-muted">All components and devices</div>
        </div>
      </div>

      <Card>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div className="small-muted">Inventory List</div>
          <div style={{display:"flex", gap:8}}>
            <button className="card" onClick={()=>alert("Add item")}>+ Add Item</button>
            <button className="card" onClick={()=>alert("Bulk import")}>Import</button>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <Table
            columns={["ID","Name","Qty","Location"]}
            data={items.map(i => [i.id, i.name, i.qty, i.location])}
          />
        </div>
      </Card>
    </div>
  );
}
