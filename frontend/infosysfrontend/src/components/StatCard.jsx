import React from "react";

import "../css/components/StatCard.css";

export default function StatCard({

  title,

  value,

  description,

  icon: Icon,

  trend,

  trendType = "positive"

}) {

  return (

    <div className="stat-card">

      <div className="stat-card-header">

        <div>

          <p className="stat-title">
            {title}
          </p>

          <h2 className="stat-value">
            {value}
          </h2>

        </div>

        <div className="stat-icon">

          {Icon && (
            <Icon size={20} />
          )}

        </div>

      </div>

      <div className="stat-footer">

        {trend && (

          <span
            className={`trend ${trendType}`}
          >
            {trend}
          </span>

        )}

        <span className="stat-description">
          {description}
        </span>

      </div>

    </div>

  );

}