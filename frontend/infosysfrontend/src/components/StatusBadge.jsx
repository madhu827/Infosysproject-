import React from "react";

import "../css/components/StatusBadge.css";

export default function StatusBadge({
  status = "PENDING"
}) {

  const value =
    String(status).toLowerCase();

  return (

    <span
      className={`status-badge ${value}`}
    >

      <span className="status-dot"></span>

      {status}

    </span>

  );

}