import React, {
  useState
} from "react";

import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown
} from "lucide-react";

import {
  useAuth
} from "../context/AuthContext";

import "../css/components/Navbar.css";

export default function Navbar() {

  const {
    user,
    role
  } = useAuth();

  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);

  const name =
    user?.user_name ||
    user?.name ||
    user?.username ||
    (
      role === "MANAGER"
        ? "Manager"
        : "User"
    );

  const email =
    user?.email ||
    "user@company.com";

  return (

    <header className="navbar">

      <div className="mobile-page-title">
        Procura
      </div>

      <div className="global-search">

        <Search size={17} />

        <input
          placeholder=
            "Search requests, products, suppliers..."
        />

        <span className="search-shortcut">
          /
        </span>

      </div>

      <div className="navbar-actions">

        <button className="navbar-icon">
          <HelpCircle size={19} />
        </button>

        <div className="notification-wrapper">

          <button
            className="navbar-icon"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >

            <Bell size={19} />

            <span className="notification-dot">
              3
            </span>

          </button>

          {showNotifications && (

            <div className="notification-popover">

              <div className="notification-header">

                <strong>
                  Notifications
                </strong>

                <span>
                  3 new
                </span>

              </div>

              <div className="notification-item">

                <div className="notification-circle blue">
                  PR
                </div>

                <div>

                  <strong>
                    New approval request
                  </strong>

                  <p>
                    PR-1042 needs your review.
                  </p>

                  <small>
                    8 minutes ago
                  </small>

                </div>

              </div>

              <div className="notification-item">

                <div className="notification-circle green">
                  ✓
                </div>

                <div>

                  <strong>
                    Payment verified
                  </strong>

                  <p>
                    Payment TXN-8812 was verified.
                  </p>

                  <small>
                    1 hour ago
                  </small>

                </div>

              </div>

            </div>

          )}

        </div>

        <div className="user-menu">

          <div className="user-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="user-menu-info">

            <strong>
              {name}
            </strong>

            <span>
              {email}
            </span>

          </div>

          <ChevronDown
            size={16}
            className="user-chevron"
          />

        </div>

      </div>

    </header>

  );

}