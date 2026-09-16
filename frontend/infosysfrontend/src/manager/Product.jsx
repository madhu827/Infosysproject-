import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Building2,
  AlertCircle,
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  Package,
  BarChart3,
  Bell,
  LogOut,
  Settings,
  Menu
} from "lucide-react";

import api from "../api/client";

import "../css/manager/Requests.css";


/* ============================================================
   COMPONENT
============================================================ */

export default function Request() {

  const navigate = useNavigate();


  /* ==========================================================
     STATE
  ========================================================== */

  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [managerDepartment, setManagerDepartment] =
    useState("");

  const [managerName, setManagerName] =
    useState("Manager");

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);


  /* ==========================================================
     GET MANAGER INFORMATION
  ========================================================== */

  useEffect(() => {

    try {

      const storedManager =
        localStorage.getItem("manager");


      if (storedManager) {

        const manager =
          JSON.parse(storedManager);


        const name =
          manager?.managerName ||
          manager?.manager_name ||
          manager?.name ||
          "Manager";


        setManagerName(name);


        const department =
          manager?.departmentName ||
          manager?.department_name ||
          manager?.department?.departmentName ||
          manager?.department?.department_name ||
          manager?.department?.name ||
          "";


        if (department) {

          setManagerDepartment(
            String(department).trim()
          );

        }

      }


      const storedDepartment =
        localStorage.getItem(
          "managerDepartment"
        );


      if (
        storedDepartment &&
        storedDepartment.trim() !== ""
      ) {

        setManagerDepartment(
          storedDepartment.trim()
        );

      }


      const storedDept =
        localStorage.getItem(
          "department"
        );


      if (
        storedDept &&
        storedDept.trim() !== ""
      ) {

        setManagerDepartment(
          storedDept.trim()
        );

      }

    } catch (err) {

      console.error(
        "Unable to read manager data:",
        err
      );

    }

  }, []);


  /* ==========================================================
     MANAGER INITIAL
  ========================================================== */

  const managerInitial =
    managerName
      ? managerName.charAt(0).toUpperCase()
      : "M";


  /* ==========================================================
     NORMALIZE TEXT
  ========================================================== */

  const normalizeText = (value) => {

    return String(value || "")
      .trim()
      .toLowerCase();

  };


  /* ==========================================================
     GET REQUEST ID
  ========================================================== */

  const getRequestId = (request) => {

    return (
      request?.requestId ??
      request?.purchaseRequestId ??
      request?.request_id ??
      request?.id ??
      null
    );

  };


  /* ==========================================================
     GET PRODUCT NAME
  ========================================================== */

  const getProductName = (request) => {

    return (
      request?.productName ||
      request?.product?.productName ||
      request?.product?.name ||
      request?.product_name ||
      "Product"
    );

  };


  /* ==========================================================
     GET PRODUCT ID
  ========================================================== */

  const getProductId = (request) => {

    return (
      request?.productId ??
      request?.product?.productId ??
      request?.product?.product_id ??
      request?.product_id ??
      null
    );

  };


  /* ==========================================================
     GET USER NAME
  ========================================================== */

  const getUserName = (request) => {

    return (
      request?.userName ||
      request?.user_name ||
      request?.user?.userName ||
      request?.user?.user_name ||
      request?.requesterName ||
      request?.requester ||
      "User"
    );

  };


  /* ==========================================================
     GET DEPARTMENT NAME
  ========================================================== */

  const getDepartmentName = (request) => {

    return (

      request?.departmentName ||
      request?.department_name ||
      request?.department?.departmentName ||
      request?.department?.department_name ||
      request?.department?.name ||

      request?.user?.departmentName ||
      request?.user?.department_name ||
      request?.user?.department?.departmentName ||
      request?.user?.department?.department_name ||
      request?.user?.department?.name ||

      ""

    );

  };


  /* ==========================================================
     GET QUANTITY
  ========================================================== */

  const getQuantity = (request) => {

    const quantity =
      request?.quantity ??
      request?.requestedQuantity ??
      request?.productQuantity ??
      0;


    const number =
      Number(quantity);


    return Number.isFinite(number)
      ? number
      : 0;

  };


  /* ==========================================================
     GET TOTAL PRICE
  ========================================================== */

  const getTotalPrice = (request) => {

    const directTotal =
      request?.totalPrice ??
      request?.totalprice ??
      request?.Totalprice ??
      request?.total_price ??
      request?.totalAmount ??
      request?.amount;


    if (
      directTotal !== undefined &&
      directTotal !== null &&
      directTotal !== ""
    ) {

      const number =
        Number(directTotal);


      if (Number.isFinite(number)) {

        return number;

      }

    }


    const productPrice =
      Number(
        request?.productPrice ??
        request?.product_price ??
        request?.product?.product_price ??
        request?.product?.productPrice ??
        0
      );


    const quantity =
      getQuantity(request);


    if (
      productPrice > 0 &&
      quantity > 0
    ) {

      return (
        productPrice *
        quantity
      );

    }


    return productPrice || 0;

  };


  /* ==========================================================
     GET STATUS
  ========================================================== */

  const getStatus = (request) => {

    return String(
      request?.status ||
      request?.requestStatus ||
      request?.request_status ||
      "PENDING"
    )
      .trim()
      .toUpperCase();

  };


  /* ==========================================================
     FORMAT CURRENCY
  ========================================================== */

  const formatCurrency = (amount) => {

    return Number(amount || 0)
      .toLocaleString(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0
        }
      );

  };


  /* ==========================================================
     LOAD REQUESTS
  ========================================================== */

  const loadRequests = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {

        setLoading(true);

      } else {

        setRefreshing(true);

      }


      setError("");


      const response =
        await api.get(
          "/raiserequest",
          {
            withCredentials: true
          }
        );


      console.log(
        "Purchase requests received:",
        response.data
      );


      let data = [];


      if (
        Array.isArray(response.data)
      ) {

        data =
          response.data;

      }

      else if (
        response.data &&
        Array.isArray(
          response.data.data
        )
      ) {

        data =
          response.data.data;

      }

      else if (
        response.data &&
        Array.isArray(
          response.data.requests
        )
      ) {

        data =
          response.data.requests;

      }

      else if (
        response.data &&
        Array.isArray(
          response.data.content
        )
      ) {

        data =
          response.data.content;

      }


      setRequests(data);

    } catch (err) {

      console.error(
        "Error loading purchase requests:",
        err
      );


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to view purchase requests."
        );

      }

      else {

        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error;


        if (backendMessage) {

          setError(
            backendMessage
          );

        }

        else if (err.request) {

          setError(
            "Unable to connect to the backend server."
          );

        }

        else {

          setError(
            "Unable to load purchase requests."
          );

        }

      }


      setRequests([]);

    }

    finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {

    loadRequests(true);

  }, []);


  /* ==========================================================
     FILTER BY MANAGER DEPARTMENT
  ========================================================== */

  const departmentRequests =
    useMemo(() => {

      if (!managerDepartment) {

        return requests;

      }


      const managerDept =
        normalizeText(
          managerDepartment
        );


      return requests.filter(
        request => {

          const requestDept =
            normalizeText(
              getDepartmentName(
                request
              )
            );


          return (
            requestDept ===
            managerDept
          );

        }
      );

    }, [
      requests,
      managerDepartment
    ]);


  /* ==========================================================
     SEARCH + STATUS FILTER
  ========================================================== */

  const filtered =
    useMemo(() => {

      return departmentRequests.filter(
        request => {

          const product =
            getProductName(request);

          const user =
            getUserName(request);

          const department =
            getDepartmentName(request);

          const status =
            getStatus(request);


          const text =
            `
              ${product}
              ${user}
              ${department}
              PR-${getRequestId(request)}
            `
              .toLowerCase();


          const matchesSearch =
            text.includes(
              search.toLowerCase()
            );


          const matchesFilter =
            filter === "ALL" ||
            status === filter;


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      departmentRequests,
      search,
      filter
    ]);


  /* ==========================================================
     SUMMARY COUNTS
  ========================================================== */

  const totalRequests =
    departmentRequests.length;


  const pendingRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) ===
        "PENDING"
    );


  const approvedRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) ===
        "APPROVED"
    );


  const rejectedRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) ===
        "REJECTED"
    );


  const paidRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) ===
        "PAID"
    );


  /* ==========================================================
     APPROVE / REJECT
  ========================================================== */

  const updateStatus = async (
    requestId,
    status
  ) => {

    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setError(
        "Request ID is missing. Cannot update request."
      );

      return;

    }


    const normalizedStatus =
      String(status)
        .trim()
        .toUpperCase();


    if (
      normalizedStatus !== "APPROVED" &&
      normalizedStatus !== "REJECTED"
    ) {

      setError(
        "Invalid request status."
      );

      return;

    }


    const action =
      normalizedStatus === "APPROVED"
        ? "approve"
        : "reject";


    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} request PR-${requestId}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setError("");


      await api.put(

        `/raiserequest/${requestId}/status`,

        null,

        {
          params: {
            status:
              normalizedStatus
          },

          withCredentials: true
        }

      );


      await loadRequests(false);

    }

    catch (err) {

      console.error(
        "Unable to update request:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      if (
        err.response?.status === 400
      ) {

        setError(
          backendMessage ||
          "Bad request."
        );

      }

      else if (
        err.response?.status === 401
      ) {

        setError(
          "Your session has expired. Please login again."
        );

      }

      else if (
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to approve or reject this request."
        );

      }

      else if (
        err.response?.status === 404
      ) {

        setError(
          `Request with ID ${requestId} was not found.`
        );

      }

      else {

        setError(
          backendMessage ||
          `Unable to ${action} request.`
        );

      }

    }

  };


  /* ==========================================================
     VIEW PRODUCT

     IMPORTANT:
     SEND REQUEST ID TO Product.jsx

     Example:
     requestId = 5

     Navigate:
     /manager/Product/5
  ========================================================== */

  const viewProduct = (
    requestId
  ) => {

    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setError(
        "Request ID is missing. Cannot view product."
      );

      return;

    }


    console.log(
      "Opening product for request:",
      requestId
    );


    navigate(
      `/manager/Product/${requestId}`
    );

  };


  /* ==========================================================
     LOGOUT
  ========================================================== */

  const logout = () => {

    localStorage.removeItem(
      "manager"
    );

    localStorage.removeItem(
      "managerId"
    );

    localStorage.removeItem(
      "managerName"
    );

    localStorage.removeItem(
      "managerDepartment"
    );


    navigate(
      "/manager/login"
    );

  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (

      <div className="manager-requests-page">

        <header className="manager-top-navbar">

          <Link
            to="/manager/dashboard"
            className="manager-brand"
          >

            <div className="brand-mark">
              P
            </div>

            <div className="brand-content">

              <strong>
                PROCUREX
              </strong>

              <span>
                PROCUREMENT
              </span>

            </div>

          </Link>

        </header>


        <div className="requests-message">

          <RefreshCw
            size={30}
            className="refresh-spinning"
          />

          <h3>
            Loading purchase requests...
          </h3>

          <p>
            Please wait while we retrieve
            the requests.
          </p>

        </div>

      </div>

    );

  }


  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (

    <div
      className="manager-requests-page"

      onClick={() =>
        showProfileMenu &&
        setShowProfileMenu(false)
      }
    >


      {/* ====================================================
          TOP NAVBAR
      ==================================================== */}

      <header
        className="manager-top-navbar"

        onClick={event =>
          event.stopPropagation()
        }
      >

        <div className="navbar-left">

          <button
            className="mobile-menu-button"
            type="button"
          >

            <Menu size={20} />

          </button>


          <Link
            to="/manager/dashboard"
            className="manager-brand"
          >

            <div className="brand-mark">
              P
            </div>

            <div className="brand-content">

              <strong>
                PROCUREX
              </strong>

              <span>
                PROCUREMENT
              </span>

            </div>

          </Link>


          <nav className="manager-top-nav">

            <Link
              to="/manager/dashboard"
              className="manager-top-nav-link"
            >

              <LayoutDashboard size={17} />

              Dashboard

            </Link>


            <Link
              to="/manager/requests"
              className="manager-top-nav-link active"
            >

              <ClipboardCheck size={17} />

              Approvals

              {pendingRequests.length > 0 && (

                <span className="nav-count">

                  {pendingRequests.length}

                </span>

              )}

            </Link>


            <Link
              to="/manager/payments"
              className="manager-top-nav-link"
            >

              <CreditCard size={17} />

              Payments

            </Link>


            <Link
              to="/manager/products"
              className="manager-top-nav-link"
            >

              <Package size={17} />

              Products

            </Link>


            <Link
              to="/manager/reports"
              className="manager-top-nav-link"
            >

              <BarChart3 size={17} />

              Reports

            </Link>

          </nav>

        </div>


        <div className="navbar-right">

          <button
            className="nav-icon-button"
            type="button"

            onClick={() =>
              navigate(
                "/manager/requests"
              )
            }
          >

            <Bell size={19} />

            {pendingRequests.length > 0 && (

              <span className="notification-dot" />

            )}

          </button>


          <div
            className="manager-profile"

            onClick={() =>
              setShowProfileMenu(
                previous =>
                  !previous
              )
            }
          >

            <div className="manager-avatar">

              {managerInitial}

            </div>


            <div className="manager-profile-info">

              <strong>
                {managerName}
              </strong>

              <span>
                Manager
              </span>

            </div>


            <ChevronDown size={16} />


            {showProfileMenu && (

              <div
                className="profile-dropdown"

                onClick={event =>
                  event.stopPropagation()
                }
              >

                <Link to="/manager/profile">

                  <Building2 size={16} />

                  Profile

                </Link>


                <Link to="/manager/settings">

                  <Settings size={16} />

                  Settings

                </Link>


                <button
                  type="button"
                  onClick={logout}
                >

                  <LogOut size={16} />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <main className="manager-requests-main">


        <section className="hero-heading">

          <div>

            <div className="manager-requests-label">

              <span className="eyebrow">
                MANAGER
              </span>

              <span className="queue-badge">
                Approval queue
              </span>

            </div>


            <h1>
              Purchase requests
            </h1>


            <p>
              Review and approve purchase requests
              submitted by users in your department.
            </p>

          </div>


          <button
            type="button"
            className="requests-refresh-button"

            onClick={() =>
              loadRequests(false)
            }

            disabled={refreshing}
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </section>


        <div className="manager-department-banner">

          <Building2 size={18} />

          <div>

            <span>
              Viewing requests for department
            </span>

            <strong>
              {managerDepartment ||
                "All Departments"}
            </strong>

          </div>

        </div>


        {error && (

          <div className="dashboard-error">

            <AlertCircle size={18} />

            <span>
              {error}
            </span>

            <button
              type="button"

              onClick={() =>
                loadRequests(false)
              }
            >
              Retry
            </button>

          </div>

        )}


        <section className="manager-request-summary">

          <div>

            <span>
              All requests
            </span>

            <strong>
              {totalRequests}
            </strong>

          </div>


          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingRequests.length}
            </strong>

          </div>


          <div>

            <span>
              Approved
            </span>

            <strong>
              {approvedRequests.length}
            </strong>

          </div>


          <div>

            <span>
              Rejected
            </span>

            <strong>
              {rejectedRequests.length}
            </strong>

          </div>


          <div>

            <span>
              Paid
            </span>

            <strong>
              {paidRequests.length}
            </strong>

          </div>

        </section>


        <section className="panel">


          <div className="manager-request-toolbar">

            <div className="manager-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search requester or product..."
                value={search}

                onChange={event =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="manager-filter">

              <Filter size={14} />

              <select
                value={filter}

                onChange={event =>
                  setFilter(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All requests
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

              </select>

              <ChevronDown size={13} />

            </div>

          </div>


          {filtered.length === 0 ? (

            <div className="requests-message">

              <FileTextIcon />

              <h3>
                No requests found
              </h3>

              <p>

                {managerDepartment
                  ? `There are no purchase requests for ${managerDepartment}.`
                  : "There are no purchase requests matching your search."}

              </p>


              {(search ||
                filter !== "ALL") && (

                <button
                  type="button"

                  onClick={() => {

                    setSearch("");

                    setFilter("ALL");

                  }}
                >

                  Clear filters

                </button>

              )}

            </div>

          ) : (

            <div className="modern-table">

              <table>

                <thead>

                  <tr>

                    <th>
                      Request
                    </th>

                    <th>
                      Requester
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Qty
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filtered.map(
                    (
                      request,
                      index
                    ) => {

                      const requestId =
                        getRequestId(
                          request
                        );


                      const rowKey =
                        requestId ??
                        `request-${index}`;


                      const status =
                        getStatus(
                          request
                        );


                      const userName =
                        getUserName(
                          request
                        );


                      const productName =
                        getProductName(
                          request
                        );


                      const department =
                        getDepartmentName(
                          request
                        );


                      const quantity =
                        getQuantity(
                          request
                        );


                      const totalPrice =
                        getTotalPrice(
                          request
                        );


                      return (

                        <tr
                          key={rowKey}
                        >


                          <td>

                            <strong className="request-id">

                              PR-
                              {requestId ?? "N/A"}

                            </strong>

                          </td>


                          <td>

                            <div className="requester-cell">

                              <div className="requester-avatar">

                                {userName
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <span>

                                {userName}

                              </span>

                            </div>

                          </td>


                          <td>

                            <span>

                              {department || "—"}

                            </span>

                          </td>


                          <td>

                            <strong>

                              {productName}

                            </strong>

                          </td>


                          <td>

                            {quantity}

                          </td>


                          <td>

                            <strong>

                              {formatCurrency(
                                totalPrice
                              )}

                            </strong>

                          </td>


                          <td>

                            <span
                              className={
                                `request-status ${status.toLowerCase()}`
                              }
                            >

                              {status}

                            </span>

                          </td>


                          <td>

                            <div className="request-actions">


                              {status === "PENDING" && (

                                <button
                                  type="button"
                                  className="approve-action"

                                  onClick={() =>
                                    updateStatus(
                                      requestId,
                                      "APPROVED"
                                    )
                                  }
                                >

                                  Approve

                                </button>

                              )}


                              {status === "PENDING" && (

                                <button
                                  type="button"
                                  className="reject-action"

                                  onClick={() =>
                                    updateStatus(
                                      requestId,
                                      "REJECTED"
                                    )
                                  }
                                >

                                  Reject

                                </button>

                              )}


                              {/* ==================================
                                  IMPORTANT
                                  REQUEST ID IS PASSED HERE
                              ================================== */}

                              <button
                                type="button"
                                className="view-product-action"

                                title="View product"

                                onClick={() =>
                                  viewProduct(
                                    requestId
                                  )
                                }
                              >

                                <Package size={14} />

                                <span>
                                  View Product
                                </span>

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        <footer className="manager-footer">

          <span>
            © 2026 PROCUREX
          </span>

          <span>
            Procurement Management Platform
          </span>

          <div>

            <Link to="/manager/help">
              Help
            </Link>

            <Link to="/manager/settings">
              Settings
            </Link>

          </div>

        </footer>

      </main>

    </div>

  );

}


/* ============================================================
   FILE TEXT ICON
============================================================ */

function FileTextIcon() {

  return (

    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      />

      <polyline
        points="14 2 14 8 20 8"
      />

      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
      />

      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
      />

      <polyline
        points="10 9 9 9 8 9"
      />

    </svg>

  );

}