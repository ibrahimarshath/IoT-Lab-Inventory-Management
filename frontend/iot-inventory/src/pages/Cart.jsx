import React, { useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";

export default function Cart(){
  const [cart, setCart] = useState([
    { id: 1, item: "Raspberry Pi 4", qty: 1 }
  ]);

  return (
    <div className="col">
      <div className="page-header">
        <div>
          <h1 style={{margin:0}}>Cart</h1>
          <div className="small-muted">Items you are borrowing</div>
        </div>
      </div>

      <Card>
        <Table columns={["ID","Item","Qty"]} data={cart.map(c=>[c.id,c.item,c.qty])} />
        <div style={{display:"flex", justifyContent:"flex-end", marginTop:12}}>
          <button className="card" onClick={()=>alert("Submit borrow request")}>Submit Request</button>
        </div>
      </Card>
    </div>
  );
}
