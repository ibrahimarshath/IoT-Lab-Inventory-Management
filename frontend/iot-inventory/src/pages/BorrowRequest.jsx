import React from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";

const requests = [
  { id: "R-001", user: "sai", item: "Raspberry Pi 4", status: "Pending" },
  { id: "R-002", user: "ram", item: "ESP32", status: "Approved" }
];

export default function BorrowRequests(){
  return (
    <div className="col">
      <div className="page-header">
        <div>
          <h1 style={{margin:0}}>Borrow Requests</h1>
          <div className="small-muted">Manage requests</div>
        </div>
      </div>

      <Card>
        <Table columns={["ID","User","Item","Status"]} data={requests.map(r=>[r.id,r.user,r.item,r.status])} />
      </Card>
    </div>
  );
}
