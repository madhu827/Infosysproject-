import React from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import "../css/layouts/DashboardLayout.css";

export default function DashboardLayout({
  children
}) {

  return (

    <div className="app-shell">

      <Sidebar />

      <div className="main-container">

        <Navbar />

        <main className="page-content">

          {children}

        </main>

      </div>

    </div>

  );

}