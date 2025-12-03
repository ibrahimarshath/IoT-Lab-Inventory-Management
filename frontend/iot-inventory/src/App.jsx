import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import BorrowRequests from "./pages/BorrowRequests";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import "./App.css";

/*
  Simple auth stub:
  Replace with your real auth logic / context
*/
const isLoggedIn = () => {
  // persist a flag in localStorage when user logs in
  return !!localStorage.getItem("auth");
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          isLoggedIn() ? <Layout /> : <Navigate to="/login" replace={true} />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="borrow-requests" element={<BorrowRequests />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to={isLoggedIn() ? "/" : "/login"} />} />
    </Routes>
  );
}
