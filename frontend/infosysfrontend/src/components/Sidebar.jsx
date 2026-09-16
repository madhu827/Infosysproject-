import React from "react";

import {
  NavLink
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  FileText,
  CreditCard,
  Tags,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
  ShoppingBag
} from "lucide-react";

import {
  useAuth
} from "../context/AuthContext";

import "../css/components/Sidebar.css";

export default function Sidebar() {

  const {
    role,
    logout
  } = useAuth();

  const userLinks = [

    {
      name: "Overview",
      path: "/user/dashboard",
      icon: LayoutDashboard
    },

    {
      name: "Product Catalog",
      path: "/user/products",
      icon: ShoppingBag
    },

    {
      name: "My Requests",
      path: "/user/requests",
      icon: FileText
    }

  ];

  const managerLinks = [

    {
      name: "Overview",
      path: "/manager/dashboard",
      icon: LayoutDashboard
    },

    {
      name: "Approval Queue",
      path: "/manager/requests",
      icon: FileText
    },

    {
      name: "Products",
      path: "/manager/products",
      icon: Package
    },

    {
      name: "Categories",
      path: "/manager/categories",
      icon: Tags
    },

    {
      name: "Payments",
      path: "/manager/payments",
      icon: CreditCard
    },

    {
      name: "Analytics",
      path: "/manager/dashboard",
      icon: BarChart3
    }

  ];

  const links =
    role === "MANAGER"
      ? managerLinks
      : userLinks;

  return (

    <aside className="sidebar">

      <div>

        <div className="brand">

          <div className="brand-icon">
            P
          </div>

          <div className="brand-content">

            <h2>
              Procura
            </h2>

            <span>
              Procurement Cloud
            </span>

          </div>

        </div>

        <div className="workspace-switcher">

          <div className="workspace-avatar">
            AC
          </div>

          <div>

            <strong>
              Acme Corporation
            </strong>

            <span>
              Main Workspace
            </span>

          </div>

        </div>

        <div className="menu-title">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {links.map(
            ({
              name,
              path,
              icon: Icon
            }) => (

              <NavLink
                key={`${name}-${path}`}
                to={path}
                className={({ isActive }) =>
                  `nav-item ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >

                <Icon size={18} />

                <span>
                  {name}
                </span>

              </NavLink>

            )
          )}

        </nav>

      </div>

      <div className="sidebar-bottom">

        <button className="logout-button">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </button>

        <button className="logout-button">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className="logout-button"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>

      </div>

    </aside>

  );

}