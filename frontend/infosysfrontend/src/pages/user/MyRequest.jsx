
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  FileText,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  LayoutDashboard,
} from "lucide-react";

import api from "../../api/client";

import "../../css/pages/user/MyRequests.css";

export default function MyRequests() {

  const navigate = useNavigate();

  // ============================================================
  // STATES
  // ============================================================

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ============================================================
  // FETCH USER REQUESTS
  // ============================================================

  const fetchRequests = async () => {

    try {

      setLoading(true);

      setError("");

      console.log("Fetching user requests...");

      /*
       * IMPORTANT:
       *
       * Your backend endpoint is:
       *
       * GET /raiserequest
       *
       * withCredentials:true sends the JSESSIONID
       * cookie to Spring Security.
       */

      const response = await api.get(
        "/raiserequest",
        {
          withCredentials: true,
        }
      );

      console.log(
        "User requests received:",
        response.data
      );

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (Array.isArray(response.data)) {

        setRequests(response.data);

      } else if (
        response.data &&
        Array.isArray(response.data.data)
      ) {

        setRequests(response.data.data);

      } else {

        console.warn(
          "Unexpected request response:",
          response.data
        );

        setRequests([]);

      }

    } catch (error) {

      console.error(
        "Error fetching requests:",
        error
      );

      // ========================================================
      // 401 / 403
      // ========================================================

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        setError(
          "Your login session has expired. Please login again."
        );

        return;
      }

      // ========================================================
      // BACKEND ERROR
      // ========================================================

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (backendMessage) {

        setError(backendMessage);

      } else if (error.request) {

        setError(
          "Unable to connect to the backend server."
        );

      } else {

        setError(
          "Unable to load your requests. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  // ============================================================
  // LOAD REQUESTS
  // ============================================================

  useEffect(() => {

    fetchRequests();

  }, []);

  // ============================================================
  // STATUS ICON
  // ============================================================

  const getStatusIcon = (status) => {

    const value =
      String(status || "")
        .toUpperCase();

    if (
      value === "APPROVED" ||
      value === "ACCEPTED"
    ) {

      return (
        <CheckCircle2
          size={17}
        />
      );

    }

    if (
      value === "REJECTED" ||
      value === "DECLINED"
    ) {

      return (
        <XCircle
          size={17}
        />
      );

    }

    return (
      <Clock
        size={17}
      />
    );

  };

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {

    const value =
      String(status || "")
        .toUpperCase();

    if (
      value === "APPROVED" ||
      value === "ACCEPTED"
    ) {

      return "status-approved";

    }

    if (
      value === "REJECTED" ||
      value === "DECLINED"
    ) {

      return "status-rejected";

    }

    return "status-pending";

  };

  // ============================================================
  // GET REQUEST ID
  // ============================================================

  const getRequestId = (request) => {

    return (
      request.requestId ??
      request.purchaseRequestId ??
      request.id ??
      "-"
    );

  };

  // ============================================================
  // GET PRODUCT NAME
  // ============================================================

  const getProductName = (request) => {

    return (
      request.productName ??
      request.product?.productName ??
      request.product?.name ??
      "Product"
    );

  };

  // ============================================================
  // GET QUANTITY
  // ============================================================

  const getQuantity = (request) => {

    return (
      request.quantity ??
      request.requestedQuantity ??
      0
    );

  };

  // ============================================================
  // GET PRICE
  // ============================================================

  const getPrice = (request) => {

    return (
      request.totalPrice ??
      request.totalprice ??
      request.total_price ??
      request.productPrice ??
      request.product_price ??
      0
    );

  };

  // ============================================================
  // GET STATUS
  // ============================================================

  const getStatus = (request) => {

    return (
      request.requestStatus ??
      request.status ??
      "PENDING"
    );

  };

  // ============================================================
  // GET DATE
  // ============================================================

  const getDate = (request) => {

    const date =
      request.createdAt ??
      request.createdDate ??
      request.requestDate ??
      request.date;

    if (!date) {

      return "-";

    }

    try {

      return new Date(date)
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

    } catch {

      return date;

    }

  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (

    <div className="my-requests-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="my-requests-header">

        <div className="my-requests-header-inner">

          {/* LOGO */}

          <NavLink
            to="/user/dashboard"
            className="my-requests-logo"
          >

            <div className="my-requests-logo-icon">

              <Package size={20} />

            </div>

            <div>

              <strong>
                Procure<span>X</span>
              </strong>

              <small>
                PROCUREMENT PORTAL
              </small>

            </div>

          </NavLink>

          {/* NAVIGATION */}

          <nav className="my-requests-navigation">

            <NavLink
              to="/user/dashboard"
              className="my-requests-nav-link"
            >

              <LayoutDashboard
                size={17}
              />

              Dashboard

            </NavLink>

            <NavLink
              to="/user/createRequest"
              className="my-requests-nav-link"
            >

              <FileText
                size={17}
              />

              Raise Request

            </NavLink>

            <NavLink
              to="/user/requests"
              className={({ isActive }) =>
                isActive
                  ? "my-requests-nav-link active"
                  : "my-requests-nav-link"
              }
            >

              <FileText
                size={17}
              />

              My Requests

            </NavLink>

          </nav>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="my-requests-content">

        {/* ====================================================
            PAGE TITLE
        ==================================================== */}

        <section className="requests-page-heading">

          <div>

            <button
              type="button"
              className="requests-back-button"
              onClick={() =>
                navigate("/user/dashboard")
              }
            >

              <ArrowLeft size={17} />

              Back to Dashboard

            </button>

            <span className="requests-eyebrow">
              PROCUREMENT WORKSPACE
            </span>

            <h1>
              My Requests
            </h1>

            <p>
              View and track all purchase requests
              submitted by you.
            </p>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            className="requests-refresh-button"
            onClick={fetchRequests}
            disabled={loading}
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }
            />

            Refresh

          </button>

        </section>


        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        {!loading && !error && (

          <section className="request-summary-grid">

            <div className="request-summary-card">

              <div className="summary-icon">
                <FileText size={20} />
              </div>

              <div>

                <span>
                  Total Requests
                </span>

                <strong>
                  {requests.length}
                </strong>

              </div>

            </div>


            <div className="request-summary-card">

              <div className="summary-icon">
                <Clock size={20} />
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>

                  {
                    requests.filter(
                      (request) =>
                        String(
                          getStatus(request)
                        ).toUpperCase() ===
                        "PENDING"
                    ).length
                  }

                </strong>

              </div>

            </div>


            <div className="request-summary-card">

              <div className="summary-icon">
                <CheckCircle2 size={20} />
              </div>

              <div>

                <span>
                  Approved
                </span>

                <strong>

                  {
                    requests.filter(
                      (request) =>
                        [
                          "APPROVED",
                          "ACCEPTED",
                        ].includes(
                          String(
                            getStatus(request)
                          ).toUpperCase()
                        )
                    ).length
                  }

                </strong>

              </div>

            </div>


            <div className="request-summary-card">

              <div className="summary-icon">
                <XCircle size={20} />
              </div>

              <div>

                <span>
                  Rejected
                </span>

                <strong>

                  {
                    requests.filter(
                      (request) =>
                        [
                          "REJECTED",
                          "DECLINED",
                        ].includes(
                          String(
                            getStatus(request)
                          ).toUpperCase()
                        )
                    ).length
                  }

                </strong>

              </div>

            </div>

          </section>

        )}


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div className="requests-message">

            <RefreshCw
              size={30}
              className="refresh-spinning"
            />

            <h3>
              Loading your requests...
            </h3>

            <p>
              Please wait while we retrieve
              your procurement requests.
            </p>

          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (

          <div className="requests-message requests-error">

            <XCircle size={40} />

            <h3>
              Unable to Load Requests
            </h3>

            <p>
              {error}
            </p>

            <div className="request-error-actions">

              <button
                type="button"
                onClick={fetchRequests}
              >

                <RefreshCw size={17} />

                Try Again

              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/user/dashboard")
                }
              >

                <ArrowLeft size={17} />

                Dashboard

              </button>

            </div>

          </div>

        )}


        {/* ====================================================
            NO REQUESTS
        ==================================================== */}

        {!loading &&
          !error &&
          requests.length === 0 && (

            <div className="requests-message">

              <FileText size={42} />

              <h3>
                No Requests Found
              </h3>

              <p>
                You have not submitted any
                procurement requests yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/user/dashboard"
                  )
                }
              >

                <Package size={17} />

                Browse Products

              </button>

            </div>

          )}


        {/* ====================================================
            REQUEST LIST
        ==================================================== */}

        {!loading &&
          !error &&
          requests.length > 0 && (

            <section className="requests-section">

              <div className="requests-section-header">

                <div>

                  <span>
                    REQUEST HISTORY
                  </span>

                  <h2>
                    Submitted Requests
                  </h2>

                </div>

                <span className="request-count">
                  {requests.length} Request
                  {requests.length !== 1 ? "s" : ""}
                </span>

              </div>


              <div className="requests-list">

                {requests.map(
                  (request, index) => {

                    const status =
                      getStatus(request);

                    const statusClass =
                      getStatusClass(status);

                    return (

                      <article
                        className="request-card"
                        key={
                          getRequestId(request) !== "-"
                            ? getRequestId(request)
                            : index
                        }
                      >

                        {/* PRODUCT ICON */}

                        <div className="request-product-icon">

                          <Package size={25} />

                        </div>


                        {/* MAIN DETAILS */}

                        <div className="request-main">

                          <div className="request-title-row">

                            <h3>
                              {getProductName(
                                request
                              )}
                            </h3>

                            <span
                              className={
                                `request-status ${statusClass}`
                              }
                            >

                              {getStatusIcon(
                                status
                              )}

                              {status}

                            </span>

                          </div>


                          <div className="request-details">

                            <div>

                              <span>
                                Request ID
                              </span>

                              <strong>
                                #{getRequestId(
                                  request
                                )}
                              </strong>

                            </div>


                            <div>

                              <span>
                                Quantity
                              </span>

                              <strong>
                                {getQuantity(
                                  request
                                )}
                              </strong>

                            </div>


                            <div>

                              <span>
                                Amount
                              </span>

                              <strong className="request-price">

                                <IndianRupee
                                  size={14}
                                />

                                {getPrice(
                                  request
                                )}

                              </strong>

                            </div>


                            <div>

                              <span>
                                Submitted
                              </span>

                              <strong>
                                {getDate(
                                  request
                                )}
                              </strong>

                            </div>

                          </div>

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            </section>

          )}

      </main>

    </div>

  );

}
