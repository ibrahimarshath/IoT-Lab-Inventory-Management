import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../..//App.css";

export default function Layout() {
  return (
    <div className="app-grid">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main>
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
