
import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  FileSpreadsheet,
  Settings,
  LogOut,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  FileCheck2,
  TrendingUp,
  Building2,
  Eye,
  Menu,
  RefreshCw,
  Check,
  X,
  Package,
  Star
} from "lucide-react";

import api from "../api/client";

import "../css/manager/ManagerDashboard.css";


/* ============================================================
   PROCUREX - MANAGER DASHBOARD

   FEATURES:
   - Dashboard
   - Approvals
   - Payments
   - Manager CSV Download
   - Payments CSV Download using managerId
   - Reviews
   - Department filtering
   - Approval / Rejection
   - Spend overview
   - Recent activity

   SEARCH:
   - Removed from navbar
   ============================================================ */


export default function ManagerDashboard() {

  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardPage =
    location.pathname === "/manager/dashboard";


  /* ============================================================
     STATE
     ============================================================ */

  const [requests, setRequests] =
    useState([]);

  const [managerName, setManagerName] =
    useState("Manager");

  const [managerDepartment, setManagerDepartment] =
    useState("");

  const [managerId, setManagerId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [downloadingManagerCsv, setDownloadingManagerCsv] =
    useState(false);

  const [downloadingPaymentCsv, setDownloadingPaymentCsv] =
    useState(false);


  /* ============================================================
     MANAGER INFORMATION
     ============================================================ */

  useEffect(() => {

    try {

      const storedManager =
        localStorage.getItem("manager");


      if (storedManager) {

        const manager =
          JSON.parse(storedManager);


        /* --------------------------------------------------------
           MANAGER ID
           -------------------------------------------------------- */

        const id =
          manager?.managerId ??
          manager?.manager_id ??
          manager?.id ??
          null;


        if (
          id !== null &&
          id !== undefined &&
          id !== ""
        ) {

          setManagerId(id);

          localStorage.setItem(
            "managerId",
            String(id)
          );
        }


        /* --------------------------------------------------------
           MANAGER NAME
           -------------------------------------------------------- */

        const name =
          manager?.managerName ||
          manager?.manager_name ||
          manager?.name ||
          "Manager";

        setManagerName(name);


        /* --------------------------------------------------------
           DEPARTMENT
           -------------------------------------------------------- */

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


      /* ========================================================
         FALLBACK: MANAGER ID FROM LOCAL STORAGE
         ======================================================== */

      const storedManagerId =
        localStorage.getItem("managerId");


      if (
        storedManagerId &&
        storedManagerId.trim() !== ""
      ) {

        setManagerId(
          storedManagerId.trim()
        );
      }


      /* ========================================================
         MANAGER NAME FROM LOCAL STORAGE
         ======================================================== */

      const storedManagerName =
        localStorage.getItem("managerName");


      if (
        storedManagerName &&
        storedManagerName.trim() !== ""
      ) {

        setManagerName(
          storedManagerName.trim()
        );
      }


      /* ========================================================
         DEPARTMENT FROM LOCAL STORAGE
         ======================================================== */

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


  /* ============================================================
     MANAGER INITIAL
     ============================================================ */

  const managerInitial =
    managerName
      ? managerName
          .charAt(0)
          .toUpperCase()
      : "M";


  /* ============================================================
     NORMALIZE TEXT
     ============================================================ */

  const normalizeText = (value) => {

    return String(value || "")
      .trim()
      .toLowerCase();

  };


  /* ============================================================
     REQUEST ID
     ============================================================ */

  const getRequestId = (request) => {

    return (
      request?.requestId ??
      request?.purchaseRequestId ??
      request?.request_id ??
      request?.id ??
      null
    );

  };


  /* ============================================================
     PRODUCT NAME
     ============================================================ */

  const getProductName = (request) => {

    return (
      request?.productName ||
      request?.product?.productName ||
      request?.product?.name ||
      request?.product_name ||
      "Product"
    );

  };


  /* ============================================================
     USER NAME
     ============================================================ */

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


  /* ============================================================
     DEPARTMENT NAME
     ============================================================ */

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


  /* ============================================================
     QUANTITY
     ============================================================ */

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


  /* ============================================================
     TOTAL PRICE
     ============================================================ */

  const getTotalPrice = (request) => {

    const directTotal =
      request?.totalPrice ??
      request?.totalprice ??
      request?.Totalprice ??
      request?.total_price ??
      request?.totalAmount ??
      request?.amount ??
      request?.purchaseTotal;


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


  /* ============================================================
     REQUEST STATUS
     ============================================================ */

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


  /* ============================================================
     CURRENCY
     ============================================================ */

  const formatCurrency = (amount) => {

    const number =
      Number(amount || 0);

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(number);

  };


  /* ============================================================
     SHORT CURRENCY
     ============================================================ */

  const formatShortCurrency = (amount) => {

    const number =
      Number(amount || 0);


    if (number >= 10000000) {

      return (
        "₹" +
        (number / 10000000)
          .toFixed(2) +
        "Cr"
      );

    }


    if (number >= 100000) {

      return (
        "₹" +
        (number / 100000)
          .toFixed(2) +
        "L"
      );

    }


    if (number >= 1000) {

      return (
        "₹" +
        (number / 1000)
          .toFixed(1) +
        "K"
      );

    }


    return formatCurrency(number);

  };


  /* ============================================================
     DOWNLOAD FILE HELPER
     ============================================================ */

  const downloadBlobFile = (
    blob,
    filename
  ) => {

    const url =
      window.URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.setAttribute(
      "download",
      filename
    );


    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  };


  /* ============================================================
     GET CURRENT MANAGER ID
     ============================================================ */

  const getCurrentManagerId = () => {

    let currentManagerId =
      managerId;


    /* ----------------------------------------------------------
       First fallback: localStorage managerId
       ---------------------------------------------------------- */

    if (
      currentManagerId === null ||
      currentManagerId === undefined ||
      currentManagerId === ""
    ) {

      currentManagerId =
        localStorage.getItem(
          "managerId"
        );

    }


    /* ----------------------------------------------------------
       Second fallback: manager object
       ---------------------------------------------------------- */

    if (
      currentManagerId === null ||
      currentManagerId === undefined ||
      currentManagerId === ""
    ) {

      const storedManager =
        localStorage.getItem(
          "manager"
        );


      if (storedManager) {

        try {

          const manager =
            JSON.parse(
              storedManager
            );


          currentManagerId =
            manager?.managerId ??
            manager?.manager_id ??
            manager?.id ??
            null;

        } catch (parseError) {

          console.error(
            "Unable to parse manager data:",
            parseError
          );

        }

      }

    }


    return currentManagerId;

  };


  /* ============================================================
     DOWNLOAD MANAGER CSV

     API:
     GET /csv/managers/download/{managerId}
     ============================================================ */

  const downloadManagerCsv = async () => {

    if (downloadingManagerCsv) {
      return;
    }


    try {

      setDownloadingManagerCsv(true);

      setError("");


      const currentManagerId =
        getCurrentManagerId();


      if (
        currentManagerId === null ||
        currentManagerId === undefined ||
        currentManagerId === ""
      ) {

        setError(
          "Manager ID is missing. Please login again."
        );

        return;
      }


      console.log(
        "Downloading Manager CSV for Manager ID:",
        currentManagerId
      );


      const response =
        await api.get(
          `/csv/managers/download/${currentManagerId}`,
          {
            responseType: "blob",
            withCredentials: true
          }
        );


      downloadBlobFile(
        response.data,
        "managers.csv"
      );


    } catch (err) {

      console.error(
        "Manager CSV download failed:",
        err
      );


      let message =
        "Unable to download manager CSV.";


      if (
        err.response?.data instanceof Blob
      ) {

        try {

          const text =
            await err.response.data.text();


          try {

            const parsed =
              JSON.parse(text);


            message =
              parsed?.message ||
              parsed?.error ||
              message;

          } catch {

            if (text) {
              message = text;
            }

          }

        } catch {
          // Keep default message
        }

      } else {

        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;

      }


      if (
        err.response?.status === 400
      ) {

        message =
          "Invalid manager ID.";

      }


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        message =
          "You are not authorized to download the manager CSV.";

      }


      if (
        err.response?.status === 404
      ) {

        message =
          "Manager not found. Please check the manager ID.";

      }


      setError(message);

    } finally {

      setDownloadingManagerCsv(false);

    }

  };


  /* ============================================================
     DOWNLOAD PAYMENTS CSV

     API:
     GET /csv/manager/{managerId}/csv
     ============================================================ */

  const downloadPaymentCsv = async () => {

    if (downloadingPaymentCsv) {
      return;
    }


    try {

      setDownloadingPaymentCsv(true);

      setError("");


      const currentManagerId =
        getCurrentManagerId();


      if (
        currentManagerId === null ||
        currentManagerId === undefined ||
        currentManagerId === ""
      ) {

        setError(
          "Manager ID is missing. Please login again."
        );

        return;
      }


      console.log(
        "Downloading Payments CSV for Manager ID:",
        currentManagerId
      );


      const response =
        await api.get(
          `/csv/manager/${currentManagerId}/csv`,
          {
            responseType: "blob",
            withCredentials: true
          }
        );


      console.log(
        "Payments CSV response:",
        response
      );


      downloadBlobFile(
        response.data,
        `manager_${currentManagerId}_payments.csv`
      );


    } catch (err) {

      console.error(
        "Payments CSV download failed:",
        err
      );


      let message =
        "Unable to download payments CSV.";


      if (
        err.response?.data instanceof Blob
      ) {

        try {

          const text =
            await err.response.data.text();


          try {

            const parsed =
              JSON.parse(text);


            message =
              parsed?.message ||
              parsed?.error ||
              message;

          } catch {

            if (text) {
              message = text;
            }

          }

        } catch {
          // Keep default message
        }

      } else {

        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;

      }


      if (
        err.response?.status === 400
      ) {

        message =
          "Invalid manager ID.";

      }


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        message =
          "You are not authorized to download the payments CSV.";

      }


      if (
        err.response?.status === 404
      ) {

        message =
          "No payments CSV endpoint was found for this manager.";

      }


      if (
        err.response?.status === 500
      ) {

        message =
          "Server error while generating the payments CSV.";

      }


      setError(message);

    } finally {

      setDownloadingPaymentCsv(false);

    }

  };


  /* ============================================================
     LOAD REQUESTS
     ============================================================ */

  const loadRequests = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true);
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
        "Dashboard purchase requests:",
        response.data
      );


      let data = [];


      if (
        Array.isArray(
          response.data
        )
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
        "Error loading dashboard requests:",
        err
      );


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to view purchase requests."
        );

      } else {

        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error;


        if (backendMessage) {

          setError(
            backendMessage
          );

        } else if (err.request) {

          setError(
            "Unable to connect to the backend server."
          );

        } else {

          setError(
            "Unable to load purchase requests."
          );

        }

      }


      setRequests([]);

    } finally {

      setLoading(false);

    }

  };


  /* ============================================================
     INITIAL LOAD
     ============================================================ */

  useEffect(() => {

    loadRequests(true);

  }, []);


  /* ============================================================
     FILTER REQUESTS BY MANAGER DEPARTMENT
     ============================================================ */

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


  /* ============================================================
     TOTAL REQUESTS
     ============================================================ */

  const totalRequests =
    departmentRequests.length;


  /* ============================================================
     PENDING REQUESTS
     ============================================================ */

  const pendingRequests =
    useMemo(() => {

      return departmentRequests.filter(
        request =>
          getStatus(request) ===
          "PENDING"
      );

    }, [
      departmentRequests
    ]);


  /* ============================================================
     APPROVED REQUESTS
     ============================================================ */

  const approvedRequests =
    useMemo(() => {

      return departmentRequests.filter(
        request =>
          getStatus(request) ===
          "APPROVED"
      );

    }, [
      departmentRequests
    ]);


  /* ============================================================
     REJECTED REQUESTS
     ============================================================ */

  const rejectedRequests =
    useMemo(() => {

      return departmentRequests.filter(
        request =>
          getStatus(request) ===
          "REJECTED"
      );

    }, [
      departmentRequests
    ]);


  /* ============================================================
     PAID REQUESTS
     ============================================================ */

  const paidRequests =
    useMemo(() => {

      return departmentRequests.filter(
        request =>
          getStatus(request) ===
          "PAID"
      );

    }, [
      departmentRequests
    ]);


  /* ============================================================
     APPROVED SPEND
     ============================================================ */

  const approvedTotal =
    useMemo(() => {

      return approvedRequests.reduce(
        (
          total,
          request
        ) =>
          total +
          getTotalPrice(
            request
          ),
        0
      );

    }, [
      approvedRequests
    ]);


  /* ============================================================
     PENDING SPEND
     ============================================================ */

  const pendingTotal =
    useMemo(() => {

      return pendingRequests.reduce(
        (
          total,
          request
        ) =>
          total +
          getTotalPrice(
            request
          ),
        0
      );

    }, [
      pendingRequests
    ]);


  /* ============================================================
     DISPLAY FIRST 5 PENDING REQUESTS
     ============================================================ */

  const displayRequests =
    pendingRequests.slice(
      0,
      5
    );


  /* ============================================================
     APPROVE / REJECT
     ============================================================ */

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
      normalizedStatus !==
        "APPROVED" &&
      normalizedStatus !==
        "REJECTED"
    ) {

      setError(
        "Invalid request status."
      );

      return;
    }


    const action =
      normalizedStatus ===
      "APPROVED"
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


    } catch (err) {

      console.error(
        "Unable to update request:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      if (
        err.response?.status ===
        400
      ) {

        setError(
          backendMessage ||
          "Bad request. Please check the request ID and status."
        );

      }

      else if (
        err.response?.status ===
        401
      ) {

        setError(
          "Your session has expired. Please login again."
        );

      }

      else if (
        err.response?.status ===
        403
      ) {

        setError(
          "You are not authorized to approve or reject this request."
        );

      }

      else if (
        err.response?.status ===
        404
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


  /* ============================================================
     DEPARTMENT SPEND
     ============================================================ */

  const departmentSpend =
    useMemo(() => {

      const map = {};


      approvedRequests.forEach(
        request => {

          const department =
            getDepartmentName(
              request
            ) ||
            "Unknown Department";


          const amount =
            getTotalPrice(
              request
            );


          if (
            !map[department]
          ) {

            map[department] = 0;

          }


          map[department] +=
            amount;

        }
      );


      return Object.entries(
        map
      )
        .map(
          (
            [
              name,
              amount
            ]
          ) => ({
            name,
            amount
          })
        )
        .sort(
          (
            a,
            b
          ) =>
            b.amount -
            a.amount
        );

    }, [
      approvedRequests
    ]);


  /* ============================================================
     HIGHEST DEPARTMENT SPEND
     ============================================================ */

  const highestDepartmentSpend =
    departmentSpend.length > 0
      ? departmentSpend[0].amount
      : 0;


  /* ============================================================
     RECENT ACTIVITY
     ============================================================ */

  const activities =
    useMemo(() => {

      const result = [];


      approvedRequests
        .slice()
        .reverse()
        .slice(0, 4)
        .forEach(
          request => {

            result.push({

              icon:
                CheckCircle2,

              title:
                "Purchase request approved",

              description:
                `PR-${getRequestId(
                  request
                )} · ${getProductName(
                  request
                )} · ${formatCurrency(
                  getTotalPrice(
                    request
                  )
                )}`,

              type:
                "success"

            });

          }
        );


      rejectedRequests
        .slice()
        .reverse()
        .slice(0, 3)
        .forEach(
          request => {

            result.push({

              icon:
                AlertCircle,

              title:
                "Purchase request rejected",

              description:
                `PR-${getRequestId(
                  request
                )} · ${getProductName(
                  request
                )}`,

              type:
                "warning"

            });

          }
        );


      return result.slice(
        0,
        6
      );

    }, [
      approvedRequests,
      rejectedRequests
    ]);


  /* ============================================================
     LOGOUT
     ============================================================ */

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

    localStorage.removeItem(
      "department"
    );


    navigate(
      "/manager/login"
    );

  };


  /* ============================================================
     LOADING SCREEN
     ============================================================ */

  if (loading) {

    return (

      <div className="manager-dashboard-loading">

        <div className="loading-logo">
          P
        </div>

        <RefreshCw
          size={25}
          className="loading-spinner"
        />

        <h3>
          Loading Manager Dashboard
        </h3>

        <p>
          Retrieving procurement data...
        </p>

      </div>

    );

  }


  /* ============================================================
     MAIN UI
     ============================================================ */

  return (

    <div
      className="manager-dashboard"
      onClick={() => {

        if (showProfileMenu) {

          setShowProfileMenu(false);

        }

      }}
    >


      {/* ========================================================
          TOP NAVBAR
          ======================================================== */}

      {isDashboardPage && (

        <header
          className="manager-navbar"
          onClick={event =>
            event.stopPropagation()
          }
        >

          <div className="navbar-left">


            {/* MOBILE MENU */}

            <button
              className="mobile-menu-button"
              type="button"
              aria-label="Open menu"
            >

              <Menu size={21} />

            </button>


            {/* BRAND */}

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


            {/* ==================================================
                NAVIGATION
                ================================================== */}

            <nav className="manager-nav">


              {/* DASHBOARD */}

              <Link
                to="/manager/dashboard"
                className="manager-nav-link active"
              >

                <LayoutDashboard
                  size={17}
                />

                Dashboard

              </Link>


              {/* APPROVALS */}

              <Link
                to="/manager/requests"
                className="manager-nav-link"
              >

                <ClipboardCheck
                  size={17}
                />

                Approvals

                {pendingRequests.length >
                  0 && (

                  <span className="nav-count">
                    {pendingRequests.length}
                  </span>

                )}

              </Link>


              {/* PAYMENTS */}

              <Link
                to="/manager/Payment"
                className="manager-nav-link"
              >

                <CreditCard size={17} />

                Payments

              </Link>


              {/* =================================================
                  REVIEWS
                  ================================================= */}

              <Link
                to="/manager/Review"
                className="manager-nav-link"
              >

                <Star size={17} />

                Reviews

              </Link>


              {/* =================================================
                  MANAGER CSV
                  ================================================= */}

              <button
                type="button"
                className="manager-nav-link manager-csv-button"
                onClick={downloadManagerCsv}
                disabled={downloadingManagerCsv}
                title="Download Manager CSV"
              >

                {downloadingManagerCsv ? (

                  <RefreshCw
                    size={17}
                    className="loading-spinner"
                  />

                ) : (

                  <FileSpreadsheet
                    size={17}
                  />

                )}

                {downloadingManagerCsv
                  ? "Downloading..."
                  : "Manager CSV"}

              </button>


              {/* =================================================
                  PAYMENTS CSV
                  ================================================= */}

              <button
                type="button"
                className="manager-nav-link manager-csv-button"
                onClick={downloadPaymentCsv}
                disabled={downloadingPaymentCsv}
                title="Download Payments CSV"
              >

                {downloadingPaymentCsv ? (

                  <RefreshCw
                    size={17}
                    className="loading-spinner"
                  />

                ) : (

                  <FileSpreadsheet
                    size={17}
                  />

                )}

                {downloadingPaymentCsv
                  ? "Downloading..."
                  : "Payments CSV"}

              </button>


            </nav>

          </div>


          {/* ====================================================
              RIGHT NAVBAR
              SEARCH REMOVED
              ==================================================== */}

          <div className="navbar-right">


            {/* NOTIFICATION */}

            <button
              className="nav-icon-button"
              type="button"
              aria-label="Notifications"
              onClick={() =>
                navigate(
                  "/manager/requests"
                )
              }
            >

              <Bell size={19} />

              {pendingRequests.length >
                0 && (

                <span className="notification-dot" />

              )}

            </button>


            {/* PROFILE */}

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


              <ChevronDown
                size={16}
              />


              {showProfileMenu && (

                <div
                  className="profile-dropdown"
                  onClick={event =>
                    event.stopPropagation()
                  }
                >

                  <Link
                    to="/manager/profile"
                  >

                    <Building2
                      size={16}
                    />

                    Profile

                  </Link>


                  <Link
                    to="/manager/settings"
                  >

                    <Settings
                      size={16}
                    />

                    Settings

                  </Link>


                  <button
                    type="button"
                    onClick={logout}
                  >

                    <LogOut
                      size={16}
                    />

                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

      )}


      {/* ========================================================
          MAIN
          ======================================================== */}

      <main className="manager-main">


        {/* HEADER */}

        <section className="dashboard-header">

          <div>

            <div className="dashboard-eyebrow">

              <span />

              MANAGER DASHBOARD

            </div>


            <h1>
              Welcome back, {managerName}
            </h1>


            <p>
              Monitor procurement requests,
              approvals and spending activity.
            </p>

          </div>


          <div className="header-actions">

            <Link
              to="/manager/requests"
              className="primary-button"
            >

              <ClipboardCheck
                size={17}
              />

              Review requests

              <ArrowUpRight
                size={15}
              />

            </Link>

          </div>

        </section>


        {/* DEPARTMENT */}

        <div className="department-banner">

          <div className="department-banner-icon">

            <Building2 size={19} />

          </div>


          <div>

            <span>
              CURRENT PROCUREMENT SCOPE
            </span>

            <strong>
              {managerDepartment ||
                "All Departments"}
            </strong>

          </div>


          <div className="live-indicator">

            <span />

            LIVE DATA

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="dashboard-error">

            <AlertCircle
              size={18}
            />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                loadRequests(true)
              }
            >
              Retry
            </button>

          </div>

        )}


        {/* ======================================================
            SUMMARY CARDS
            ====================================================== */}

        <section className="summary-grid">


          {/* TOTAL */}

          <div className="summary-card">

            <div className="summary-card-top">

              <div className="summary-icon burgundy">

                <ClipboardCheck
                  size={21}
                />

              </div>

              <span className="summary-label">
                ALL REQUESTS
              </span>

            </div>


            <strong className="summary-value">
              {totalRequests}
            </strong>


            <span className="summary-description">
              Total purchase requests
            </span>

          </div>


          {/* PENDING */}

          <div className="summary-card pending-card">

            <div className="summary-card-top">

              <div className="summary-icon gold">

                <Clock3
                  size={21}
                />

              </div>

              <span className="summary-label">
                PENDING
              </span>

            </div>


            <strong className="summary-value">
              {pendingRequests.length}
            </strong>


            <span className="summary-description">
              Awaiting approval
            </span>

          </div>


          {/* APPROVED */}

          <div className="summary-card">

            <div className="summary-card-top">

              <div className="summary-icon green">

                <CheckCircle2
                  size={21}
                />

              </div>

              <span className="summary-label">
                APPROVED
              </span>

            </div>


            <strong className="summary-value">
              {approvedRequests.length}
            </strong>


            <span className="summary-description">
              Approved requests
            </span>

          </div>


          {/* APPROVED SPEND */}

          <div className="summary-card spend-summary-card">

            <div className="summary-card-top">

              <div className="summary-icon gold">

                <IndianRupee
                  size={21}
                />

              </div>

              <span className="summary-label">
                APPROVED SPEND
              </span>

            </div>


            <strong className="summary-value currency-value">

              {formatShortCurrency(
                approvedTotal
              )}

            </strong>


            <span className="summary-description">
              From approved requests
            </span>

          </div>

        </section>


        {/* ======================================================
            MAIN CONTENT GRID
            ====================================================== */}

        <section className="dashboard-content-grid">


          {/* ====================================================
              APPROVAL QUEUE
              ==================================================== */}

          <div className="dashboard-panel approval-panel">

            <div className="panel-heading">

              <div>

                <div className="panel-title-row">

                  <h2>
                    Approval queue
                  </h2>

                  <span className="panel-count">
                    {pendingRequests.length}
                  </span>

                </div>


                <p>
                  Pending purchase requests requiring
                  your approval.
                </p>

              </div>


              <Link
                to="/manager/requests"
                className="view-all-link"
              >

                View all

                <ArrowUpRight
                  size={15}
                />

              </Link>

            </div>


            {displayRequests.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">

                  <CheckCircle2
                    size={30}
                  />

                </div>


                <strong>

                  No pending requests

                </strong>


                <span>

                  All requests are currently processed.

                </span>

              </div>

            ) : (

              <div className="request-table-wrapper">

                <table className="request-table">

                  <thead>

                    <tr>

                      <th>
                        REQUEST
                      </th>

                      <th>
                        REQUESTER
                      </th>

                      <th>
                        DEPARTMENT
                      </th>

                      <th>
                        QTY
                      </th>

                      <th>
                        AMOUNT
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        ACTION
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {displayRequests.map(
                      (
                        request,
                        index
                      ) => {

                        const requestId =
                          getRequestId(
                            request
                          );


                        const requester =
                          getUserName(
                            request
                          );


                        const product =
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


                        const amount =
                          getTotalPrice(
                            request
                          );


                        return (

                          <tr
                            key={
                              requestId ??
                              `request-${index}`
                            }
                          >


                            {/* REQUEST */}

                            <td>

                              <div className="request-product">

                                <div className="product-mini-icon">

                                  <Package
                                    size={16}
                                  />

                                </div>


                                <div>

                                  <strong>
                                    {product}
                                  </strong>

                                  <small>
                                    PR-{requestId}
                                  </small>

                                </div>

                              </div>

                            </td>


                            {/* REQUESTER */}

                            <td>

                              <div className="requester-cell">

                                <div className="requester-avatar">

                                  {requester
                                    .split(" ")
                                    .filter(Boolean)
                                    .map(
                                      word =>
                                        word[0]
                                    )
                                    .join("")
                                    .toUpperCase()}

                                </div>


                                <span>
                                  {requester}
                                </span>

                              </div>

                            </td>


                            {/* DEPARTMENT */}

                            <td>

                              <span className="department-cell">

                                {department ||
                                  "—"}

                              </span>

                            </td>


                            {/* QUANTITY */}

                            <td>

                              <strong>
                                {quantity}
                              </strong>

                            </td>


                            {/* AMOUNT */}

                            <td>

                              <strong className="amount-cell">

                                {formatCurrency(
                                  amount
                                )}

                              </strong>

                            </td>


                            {/* STATUS */}

                            <td>

                              <span className="status-badge pending">

                                <Clock3
                                  size={12}
                                />

                                PENDING

                              </span>

                            </td>


                            {/* ACTION */}

                            <td>

                              <div className="table-actions">


                                {/* VIEW */}

                                <button
                                  type="button"
                                  className="icon-action view"
                                  title="View request"
                                  onClick={() =>
                                    navigate(
                                      `/manager/requests/${requestId}`
                                    )
                                  }
                                >

                                  <Eye
                                    size={15}
                                  />

                                </button>


                                {/* APPROVE */}

                                <button
                                  type="button"
                                  className="icon-action approve"
                                  title="Approve request"
                                  onClick={() =>
                                    updateStatus(
                                      requestId,
                                      "APPROVED"
                                    )
                                  }
                                >

                                  <Check
                                    size={15}
                                  />

                                </button>


                                {/* REJECT */}

                                <button
                                  type="button"
                                  className="icon-action reject"
                                  title="Reject request"
                                  onClick={() =>
                                    updateStatus(
                                      requestId,
                                      "REJECTED"
                                    )
                                  }
                                >

                                  <X
                                    size={15}
                                  />

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

          </div>


          {/* ====================================================
              SPEND OVERVIEW
              ==================================================== */}

          <div className="dashboard-panel spend-panel">

            <div className="panel-heading">

              <div>

                <h2>
                  Spend overview
                </h2>

                <p>
                  Approved procurement spending
                </p>

              </div>


              <div className="panel-heading-icon">

                <TrendingUp
                  size={18}
                />

              </div>

            </div>


            <div className="spend-summary">

              <div>

                <span>
                  Approved spend
                </span>

                <strong>
                  {formatCurrency(
                    approvedTotal
                  )}
                </strong>

              </div>


              <div className="spend-live">

                <span />

                Live

              </div>

            </div>


            <div className="chart-container">

              <div className="chart-y-axis">

                <span>
                  100%
                </span>

                <span>
                  75%
                </span>

                <span>
                  50%
                </span>

                <span>
                  25%
                </span>

                <span>
                  0%
                </span>

              </div>


              <div className="chart-area">

                <div className="chart-grid-lines">

                  <span />
                  <span />
                  <span />
                  <span />
                  <span />

                </div>


                <div className="bars">

                  {departmentSpend.length >
                  0 ? (

                    departmentSpend
                      .slice(0, 6)
                      .map(
                        (
                          department,
                          index
                        ) => {

                          const percentage =
                            highestDepartmentSpend >
                            0
                              ? Math.round(
                                  (
                                    department.amount /
                                    highestDepartmentSpend
                                  ) *
                                  100
                                )
                              : 0;


                          return (

                            <div
                              className="bar-column"
                              key={
                                department.name +
                                index
                              }
                            >

                              <div className="bar-value">

                                {formatShortCurrency(
                                  department.amount
                                )}

                              </div>


                              <div
                                className="spend-bar"
                                style={{
                                  height:
                                    `${Math.max(
                                      percentage,
                                      5
                                    )}%`
                                }}
                                title={
                                  `${department.name}: ` +
                                  `${formatCurrency(
                                    department.amount
                                  )}`
                                }
                              />


                              <span>

                                {department.name
                                  .substring(
                                    0,
                                    7
                                  )}

                              </span>

                            </div>

                          );

                        }
                      )

                  ) : (

                    <div className="chart-no-data">

                      No approved spend

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            LOWER GRID
            ====================================================== */}

        <section className="lower-grid">


          {/* ====================================================
              DEPARTMENT SPEND
              ==================================================== */}

          <div className="dashboard-panel department-panel">

            <div className="panel-heading">

              <div>

                <h2>
                  Department spend
                </h2>

                <p>
                  Based on approved requests
                </p>

              </div>


              <Building2
                size={19}
              />

            </div>


            {departmentSpend.length === 0 ? (

              <div className="empty-state small">

                <div className="empty-icon">

                  <Building2
                    size={26}
                  />

                </div>


                <strong>
                  No department spending
                </strong>


                <span>
                  Approved requests will appear here.
                </span>

              </div>

            ) : (

              <div className="department-list">

                {departmentSpend.map(
                  department => {

                    const percentage =
                      highestDepartmentSpend >
                      0
                        ? Math.round(
                            (
                              department.amount /
                              highestDepartmentSpend
                            ) *
                            100
                          )
                        : 0;


                    return (

                      <div
                        className="department-item"
                        key={
                          department.name
                        }
                      >

                        <div className="department-top">

                          <div className="department-name">

                            <span className="department-dot" />

                            <strong>
                              {department.name}
                            </strong>

                          </div>


                          <strong>

                            {formatCurrency(
                              department.amount
                            )}

                          </strong>

                        </div>


                        <div className="department-progress">

                          <span
                            style={{
                              width:
                                `${percentage}%`
                            }}
                          />

                        </div>


                        <div className="department-bottom">

                          <span>

                            {percentage}%
                            {" "}
                            relative spend

                          </span>


                          <span>

                            {percentage >= 80
                              ? "High usage"
                              : "On track"}

                          </span>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* ====================================================
              ACTIVITY LIST
              ==================================================== */}

          <div className="dashboard-panel activity-panel">

            <div className="panel-heading">

              <div>

                <h2>
                  Recent activity
                </h2>

                <p>
                  Latest procurement activity
                </p>

              </div>


              <FileCheck2
                size={19}
              />

            </div>


            {activities.length === 0 ? (

              <div className="empty-state small">

                <div className="empty-icon">

                  <FileCheck2
                    size={26}
                  />

                </div>


                <strong>
                  No activity yet
                </strong>


                <span>
                  Approval activity will appear here.
                </span>

              </div>

            ) : (

              <div className="activity-list">

                {activities.map(
                  (
                    activity,
                    index
                  ) => {

                    const Icon =
                      activity.icon;


                    return (

                      <div
                        className="activity-item"
                        key={index}
                      >

                        <div
                          className={
                            `activity-icon ${activity.type}`
                          }
                        >

                          <Icon
                            size={16}
                          />

                        </div>


                        <div className="activity-content">

                          <strong>
                            {activity.title}
                          </strong>

                          <span>
                            {activity.description}
                          </span>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>

        </section>


        {/* ======================================================
            FOOTER
            ====================================================== */}

        <footer className="manager-footer">

          <span>
            © 2026 PROCUREX
          </span>


          <span>
            Procurement Management Platform
          </span>


          <div>

            <Link
              to="/manager/help"
            >
              Help
            </Link>


            <Link
              to="/manager/settings"
            >
              Settings
            </Link>

          </div>

        </footer>


      </main>

    </div>

  );

}
