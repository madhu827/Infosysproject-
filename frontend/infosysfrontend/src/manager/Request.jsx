
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
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
  Bell,
  LogOut,
  Settings,
  Menu,
  X,
  LoaderCircle,
  CheckCircle2,
  MessageSquare,
  Send,
  Download,
} from "lucide-react";

import api from "../api/client";

import "../css/manager/Requests.css";


/* ============================================================
   REQUEST COMPONENT
============================================================ */

export default function Request() {

  const navigate = useNavigate();
  const location = useLocation();


  /* ==========================================================
     REQUEST STATE
  ========================================================== */

  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  /* ==========================================================
     MANAGER STATE
  ========================================================== */

  const [managerId, setManagerId] = useState(null);

  const [managerName, setManagerName] = useState("Manager");

  const [managerDepartment, setManagerDepartment] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);


  /* ==========================================================
     PAYMENT STATE
  ========================================================== */

  const [paymentStatuses, setPaymentStatuses] = useState({});


  /* ==========================================================
     PRODUCT MODAL STATE
  ========================================================== */

  const [showProductModal, setShowProductModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productLoading, setProductLoading] = useState(false);

  const [productError, setProductError] = useState("");


  /* ==========================================================
     FEEDBACK STATE
  ========================================================== */

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [feedbackRequest, setFeedbackRequest] = useState(null);

  const [feedbackRating, setFeedbackRating] = useState(0);

  const [feedbackComment, setFeedbackComment] = useState("");

  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const [feedbackError, setFeedbackError] = useState("");

  const [feedbackSuccess, setFeedbackSuccess] = useState("");


  /* ==========================================================
     SUBMITTED FEEDBACK STATE
  ========================================================== */

  const [submittedFeedback, setSubmittedFeedback] = useState({});


  /* ==========================================================
     FEEDBACK PRODUCT IMAGE STATE
  ========================================================== */

  const [feedbackProduct, setFeedbackProduct] = useState(null);

  const [feedbackProductLoading, setFeedbackProductLoading] =
    useState(false);


  /* ==========================================================
     READ MANAGER INFORMATION
  ========================================================== */

  useEffect(() => {

    try {

      const storedManager =
        localStorage.getItem("manager");

      if (storedManager) {

        const manager =
          JSON.parse(storedManager);

        const id =
          manager?.managerId ??
          manager?.manager_id ??
          manager?.id;

        if (
          id !== undefined &&
          id !== null
        ) {
          setManagerId(id);
        }


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


      const storedManagerId =
        localStorage.getItem("managerId");

      if (
        storedManagerId !== null &&
        storedManagerId !== ""
      ) {

        setManagerId(storedManagerId);

      }


      const storedManagerName =
        localStorage.getItem("managerName");

      if (storedManagerName) {

        setManagerName(storedManagerName);

      }


      const storedDepartment =
        localStorage.getItem("managerDepartment");

      if (
        storedDepartment &&
        storedDepartment.trim() !== ""
      ) {

        setManagerDepartment(
          storedDepartment.trim()
        );

      }


      const storedDept =
        localStorage.getItem("department");

      if (
        storedDept &&
        storedDept.trim() !== ""
      ) {

        setManagerDepartment(
          storedDept.trim()
        );

      }

    }

    catch (err) {

      console.error(
        "Unable to read manager information:",
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
     GET PRODUCT ID
  ========================================================== */

  const getProductId = (request) => {

    return (
      request?.productId ??
      request?.product_id ??
      request?.product?.productId ??
      request?.product?.product_id ??
      null
    );

  };


  /* ==========================================================
     GET PRODUCT NAME
  ========================================================== */

  const getProductName = (request) => {

    return (
      request?.productName ||
      request?.product_name ||
      request?.product?.productName ||
      request?.product?.name ||
      "Product"
    );

  };


  /* ==========================================================
     GET PRODUCT IMAGE
  ========================================================== */

  const getProductImage = (request) => {

    return (
      request?.imageUrl ||
      request?.image_url ||
      request?.productImage ||
      request?.product_image ||
      request?.product?.imageUrl ||
      request?.product?.image_url ||
      request?.product?.productImage ||
      request?.product?.product_image ||
      ""
    );

  };


  /* ==========================================================
     GET USER ID
  ========================================================== */

  const getUserId = (request) => {

    return (
      request?.userId ??
      request?.user_id ??
      request?.user?.userId ??
      request?.user?.user_id ??
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
     GET DEPARTMENT
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

    const number = Number(quantity);

    return Number.isFinite(number)
      ? number
      : 0;

  };


  /* ==========================================================
     GET PRODUCT PRICE
  ========================================================== */

  const getProductPrice = (request) => {

    const price =
      request?.productPrice ??
      request?.product_price ??
      request?.product?.product_price ??
      request?.product?.productPrice ??
      request?.price ??
      0;

    const number = Number(price);

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

      const number = Number(directTotal);

      if (Number.isFinite(number)) {
        return number;
      }

    }


    const productPrice =
      getProductPrice(request);

    const quantity =
      getQuantity(request);

    if (
      productPrice > 0 &&
      quantity > 0
    ) {

      return productPrice * quantity;

    }

    return productPrice || 0;

  };


  /* ==========================================================
     GET ORIGINAL REQUEST STATUS
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
     CSV VALUE ESCAPE
  ========================================================== */

  const escapeCsvValue = (value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    const stringValue = String(value);

    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`;

  };


  /* ==========================================================
     DOWNLOAD CSV HELPER
  ========================================================== */

  const downloadCsv = (
    filename,
    headers,
    rows
  ) => {

    if (
      !Array.isArray(rows) ||
      rows.length === 0
    ) {

      setError(
        "There is no data available to download."
      );

      return;

    }


    const csvRows = [];

    csvRows.push(
      headers
        .map(escapeCsvValue)
        .join(",")
    );


    rows.forEach(row => {

      csvRows.push(
        row
          .map(escapeCsvValue)
          .join(",")
      );

    });


    const csvContent =
      "\uFEFF" +
      csvRows.join("\r\n");


    const blob =
      new Blob(
        [csvContent],
        {
          type: "text/csv;charset=utf-8;"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      filename
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  /* ==========================================================
     DOWNLOAD REQUESTS CSV
  ========================================================== */

  const downloadRequestsCsv = () => {

    if (
      !departmentRequests ||
      departmentRequests.length === 0
    ) {

      setError(
        "No purchase requests are available to download."
      );

      return;

    }


    const headers = [
      "Request ID",
      "Requester",
      "User ID",
      "Department",
      "Product ID",
      "Product",
      "Quantity",
      "Product Price",
      "Total Amount",
      "Request Status",
      "Payment Status",
      "Feedback Submitted"
    ];


    const rows =
      departmentRequests.map(request => {

        const requestId =
          getRequestId(request);

        const paymentStatus =
          requestId !== null &&
          requestId !== undefined
            ? paymentStatuses[
                String(requestId)
              ] || "NOT PAID"
            : "NOT PAID";


        const feedbackStatus =
          requestId !== null &&
          requestId !== undefined &&
          submittedFeedback[
            String(requestId)
          ] === true
            ? "YES"
            : "NO";


        return [
          requestId ?? "",
          getUserName(request),
          getUserId(request) ?? "",
          getDepartmentName(request),
          getProductId(request) ?? "",
          getProductName(request),
          getQuantity(request),
          getProductPrice(request),
          getTotalPrice(request),
          getStatus(request),
          paymentStatus,
          feedbackStatus
        ];

      });


    const date =
      new Date()
        .toISOString()
        .slice(0, 10);


    downloadCsv(
      `manager_purchase_requests_${date}.csv`,
      headers,
      rows
    );

  };


  /* ==========================================================
     DOWNLOAD PAYMENTS CSV
  ========================================================== */

  const downloadPaymentsCsv = () => {

    if (
      !departmentRequests ||
      departmentRequests.length === 0
    ) {

      setError(
        "No payment information is available to download."
      );

      return;

    }


    const paymentRequests =
      departmentRequests.filter(
        request => {

          const requestId =
            getRequestId(request);

          const paymentStatus =
            requestId !== null &&
            requestId !== undefined
              ? paymentStatuses[
                  String(requestId)
                ]
              : null;


          return (
            paymentStatus ||
            getStatus(request) === "APPROVED" ||
            getStatus(request) === "PAID"
          );

        }
      );


    if (paymentRequests.length === 0) {

      setError(
        "No payment records are available to download."
      );

      return;

    }


    const headers = [
      "Request ID",
      "Requester",
      "User ID",
      "Department",
      "Product ID",
      "Product",
      "Quantity",
      "Product Price",
      "Payment Amount",
      "Request Status",
      "Payment Status",
      "Payment Completed"
    ];


    const rows =
      paymentRequests.map(request => {

        const requestId =
          getRequestId(request);


        const paymentStatus =
          requestId !== null &&
          requestId !== undefined
            ? paymentStatuses[
                String(requestId)
              ] || "PENDING"
            : "PENDING";


        const paymentCompleted =
          paymentStatus === "PAID" ||
          paymentStatus === "VERIFIED" ||
          paymentStatus === "PAYMENT_COMPLETED" ||
          paymentStatus === "COMPLETED" ||
          paymentStatus === "SUCCESS" ||
          paymentStatus === "SUCCESSFUL"
            ? "YES"
            : "NO";


        return [
          requestId ?? "",
          getUserName(request),
          getUserId(request) ?? "",
          getDepartmentName(request),
          getProductId(request) ?? "",
          getProductName(request),
          getQuantity(request),
          getProductPrice(request),
          getTotalPrice(request),
          getStatus(request),
          paymentStatus,
          paymentCompleted
        ];

      });


    const date =
      new Date()
        .toISOString()
        .slice(0, 10);


    downloadCsv(
      `manager_payments_${date}.csv`,
      headers,
      rows
    );

  };


  /* ==========================================================
     CHECK FEEDBACK STATUS
     IMPORTANT:
     - The backend may return a boolean directly.
     - It may return {data: true}, {feedbackSubmitted: true},
       {exists: true}, etc.
     - It may return the actual feedback/rating object.
     - It may return an array of feedback records.
     ========================================================== */

  const checkFeedbackStatus = async (requestId) => {

    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {
      return null;
    }

    const parseFeedbackStatus = (responseData) => {

      /* Direct boolean */
      if (typeof responseData === "boolean") {
        return responseData;
      }

      /* Direct number: 1 = submitted, 0 = not submitted */
      if (typeof responseData === "number") {
        return responseData === 1;
      }

      /* Direct string */
      if (typeof responseData === "string") {

        const normalized =
          responseData.trim().toLowerCase();

        if (
          [
            "true",
            "yes",
            "completed",
            "submitted",
            "success",
            "exists",
            "found",
            "paid"
          ].includes(normalized)
        ) {
          return true;
        }

        if (
          [
            "false",
            "no",
            "pending",
            "not submitted",
            "not_submitted",
            "not found",
            "not_found"
          ].includes(normalized)
        ) {
          return false;
        }

        return null;
      }

      if (
        responseData === null ||
        responseData === undefined
      ) {
        return null;
      }

      /* Arrays */
      if (Array.isArray(responseData)) {
        return responseData.length > 0;
      }

      /* Object */
      if (typeof responseData === "object") {

        /* Some APIs wrap the result in data/result/response */
        const nestedCandidates = [
          responseData.data,
          responseData.result,
          responseData.response,
          responseData.feedback
        ];

        /*
         * Explicit status fields must be checked first.
         * This is the important part missing from many
         * backend response formats.
         */
        const statusFields = [
          "feedbackCompleted",
          "feedback_completed",
          "feedbackSubmitted",
          "feedback_submitted",
          "isFeedbackCompleted",
          "is_feedback_completed",
          "isFeedbackSubmitted",
          "is_feedback_submitted",
          "hasFeedback",
          "has_feedback",
          "feedbackExists",
          "feedback_exists",
          "isSubmitted",
          "is_submitted",
          "exists",
          "found",
          "completed",
          "submitted"
        ];

        for (const field of statusFields) {

          if (
            Object.prototype.hasOwnProperty.call(
              responseData,
              field
            )
          ) {

            const value =
              responseData[field];

            if (typeof value === "boolean") {
              return value;
            }

            if (typeof value === "number") {
              return value === 1;
            }

            if (typeof value === "string") {

              const normalized =
                value.trim().toLowerCase();

              if (
                [
                  "true",
                  "yes",
                  "completed",
                  "submitted",
                  "success",
                  "exists",
                  "found"
                ].includes(normalized)
              ) {
                return true;
              }

              if (
                [
                  "false",
                  "no",
                  "not submitted",
                  "not_submitted",
                  "not found",
                  "not_found"
                ].includes(normalized)
              ) {
                return false;
              }
            }
          }
        }

        /*
         * If the API returns the actual ProductRating/
         * Feedback entity, its existence means feedback
         * has already been submitted.
         */
        const feedbackObject =
          responseData.rating !== undefined ||
          responseData.comment !== undefined ||
          responseData.feedbackText !== undefined ||
          responseData.feedback_text !== undefined ||
          responseData.productRatingId !== undefined ||
          responseData.product_rating_id !== undefined ||
          responseData.ratingId !== undefined ||
          responseData.rating_id !== undefined;

        if (feedbackObject) {
          return true;
        }

        /*
         * Check common nested wrappers.
         */
        for (const nested of nestedCandidates) {

          if (
            nested !== undefined &&
            nested !== null
          ) {

            const nestedStatus =
              parseFeedbackStatus(nested);

            if (nestedStatus !== null) {
              return nestedStatus;
            }
          }
        }

        /*
         * If this is a normal object containing an
         * actual feedback record, treat it as submitted.
         */
        if (
          responseData.id !== undefined &&
          responseData.id !== null
        ) {

          const looksLikeFeedback =
            responseData.productId !== undefined ||
            responseData.product_id !== undefined ||
            responseData.requestId !== undefined ||
            responseData.request_id !== undefined;

          if (looksLikeFeedback) {
            return true;
          }
        }
      }

      return null;
    };


    try {

      const response =
        await api.get(
          `/product-rating/${requestId}`,
          {
            withCredentials: true
          }
        );

      console.log(
        `Feedback status response for request ${requestId}:`,
        response.data
      );

      const parsedStatus =
        parseFeedbackStatus(response.data);

      /*
       * null means the backend response could not be
       * interpreted. Do NOT convert it to false because
       * that would incorrectly show "Give Feedback".
       */
      return parsedStatus;

    }

    catch (err) {

      console.warn(
        `Unable to check feedback status for request ${requestId}:`,
        err.response?.status,
        err.response?.data || err.message
      );

      /*
       * null = status could not be retrieved.
       * This is different from false = definitely not submitted.
       */
      return null;
    }

  };


  /* ==========================================================
     LOAD ALL FEEDBACK STATUSES
  ========================================================== */

  const loadSubmittedFeedback = async (requestData) => {

    if (
      !Array.isArray(requestData) ||
      requestData.length === 0
    ) {

      setSubmittedFeedback({});
      return {};

    }


    try {

      const statusEntries =
        await Promise.all(
          requestData.map(
            async request => {

              const requestId =
                getRequestId(request);


              if (
                requestId === null ||
                requestId === undefined ||
                requestId === ""
              ) {
                return null;
              }


              const completed =
                await checkFeedbackStatus(
                  requestId
                );


              /*
               * Only store a result when the backend actually
               * gave us a definite true/false value.
               */
              if (completed === null) {
                return null;
              }


              return [
                String(requestId),
                completed === true
              ];

            }
          )
        );


      /*
       * Keep the existing map when a particular status API
       * request failed. This prevents a temporary 401/403/404/
       * network error from changing "Feedback Submitted" back
       * to "Give Feedback".
       */
      setSubmittedFeedback(previous => {

        const nextMap = {
          ...previous
        };

        statusEntries.forEach(
          entry => {

            if (entry) {

              const [
                requestId,
                completed
              ] = entry;

              nextMap[requestId] =
                completed === true;

            }

          }
        );

        console.log(
          "Feedback status from backend:",
          nextMap
        );

        return nextMap;

      });


      /*
       * Return the current status map so callers can use
       * the result immediately if required.
       */
      const currentMap = {};

      statusEntries.forEach(
        entry => {

          if (entry) {

            const [
              requestId,
              completed
            ] = entry;

            currentMap[requestId] =
              completed === true;

          }

        }
      );

      return currentMap;

    }

    catch (err) {

      console.error(
        "Unable to load feedback statuses:",
        err
      );

      /*
       * Do not clear the existing status map here.
       */
      return {};

    }

  };


  /* ==========================================================
     PAYMENT STATUS API
  ========================================================== */

  const checkPaymentStatus = async (requestId) => {

    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      return null;

    }


    try {

      const response =
        await api.get(
          `/payment/status/${requestId}`,
          {
            withCredentials: true
          }
        );


      const responseData =
        response.data;


      const data =
        responseData?.data &&
        typeof responseData.data === "object"
          ? responseData.data
          : responseData;


      if (
        data?.paymentCompleted === true ||
        data?.payment_completed === true ||
        data?.paid === true ||
        data?.isPaid === true
      ) {

        return "PAID";

      }


      let paymentStatus =
        data?.paymentStatus ??
        data?.payment_status ??
        data?.status ??
        "";


      if (
        paymentStatus !== null &&
        paymentStatus !== undefined &&
        paymentStatus !== ""
      ) {

        paymentStatus =
          String(paymentStatus)
            .trim()
            .toUpperCase();


        if (
          paymentStatus === "PAID" ||
          paymentStatus === "VERIFIED" ||
          paymentStatus === "PAYMENT_COMPLETED" ||
          paymentStatus === "COMPLETED" ||
          paymentStatus === "SUCCESS" ||
          paymentStatus === "SUCCESSFUL"
        ) {

          return "PAID";

        }


        return paymentStatus;

      }


      return null;

    }

    catch (err) {

      console.warn(
        `Unable to check payment status for request ${requestId}:`,
        err
      );

      return null;

    }

  };


  /* ==========================================================
     LOAD PAYMENT STATUSES
  ========================================================== */

  const loadPaymentStatuses = async (requestData) => {

    if (
      !Array.isArray(requestData) ||
      requestData.length === 0
    ) {

      setPaymentStatuses({});

      return;

    }


    try {

      const statusEntries =
        await Promise.all(
          requestData.map(
            async request => {

              const requestId =
                getRequestId(request);


              if (
                requestId === null ||
                requestId === undefined ||
                requestId === ""
              ) {

                return null;

              }


              const status =
                await checkPaymentStatus(
                  requestId
                );


              if (!status) {
                return null;
              }


              return [
                String(requestId),
                status
              ];

            }
          )
        );


      const statusMap = {};


      statusEntries.forEach(
        entry => {

          if (entry) {

            const [
              requestId,
              status
            ] = entry;

            statusMap[requestId] =
              status;

          }

        }
      );


      setPaymentStatuses(statusMap);

    }

    catch (err) {

      console.error(
        "Unable to load payment statuses:",
        err
      );

    }

  };


  /* ==========================================================
     EFFECTIVE STATUS
  ========================================================== */

  const getEffectiveStatus = (request) => {

    const requestId =
      getRequestId(request);


    const paymentStatus =
      requestId !== null &&
      requestId !== undefined
        ? paymentStatuses[
            String(requestId)
          ]
        : null;


    if (
      paymentStatus === "PAID" ||
      paymentStatus === "VERIFIED" ||
      paymentStatus === "PAYMENT_COMPLETED" ||
      paymentStatus === "COMPLETED" ||
      paymentStatus === "SUCCESS" ||
      paymentStatus === "SUCCESSFUL"
    ) {

      return "PAID";

    }


    return getStatus(request);

  };


  /* ==========================================================
     LOAD REQUESTS
  ========================================================== */

  const loadRequests = async (showLoader = true) => {

    try {

      if (showLoader) {
        setLoading(true);
      }
      else {
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


      let data = [];


      if (Array.isArray(response.data)) {

        data = response.data;

      }

      else if (
        response.data &&
        Array.isArray(response.data.data)
      ) {

        data = response.data.data;

      }

      else if (
        response.data &&
        Array.isArray(response.data.requests)
      ) {

        data = response.data.requests;

      }

      else if (
        response.data &&
        Array.isArray(response.data.content)
      ) {

        data = response.data.content;

      }


      setRequests(data);


      await Promise.all([
        loadPaymentStatuses(data),
        loadSubmittedFeedback(data)
      ]);

    }

    catch (err) {

      console.error(
        "Error loading purchase requests:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to view purchase requests."
        );

      }
      else {

        setError(
          backendMessage ||
          "Unable to load purchase requests."
        );

      }


      setRequests([]);

      setPaymentStatuses({});

      setSubmittedFeedback({});

    }

    finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  /* ==========================================================
     INITIAL REQUEST LOAD
  ========================================================== */

  useEffect(() => {

    loadRequests(true);

  }, []);


  /* ==========================================================
     RELOAD FEEDBACK WHEN MANAGER ID AVAILABLE
  ========================================================== */

  useEffect(() => {

    if (
      managerId !== null &&
      managerId !== undefined &&
      managerId !== "" &&
      requests.length > 0
    ) {

      Promise.all([
        loadSubmittedFeedback(requests),
        loadPaymentStatuses(requests)
      ]);

    }

  }, [managerId]);


  /* ==========================================================
     PAYMENT COMPLETED
  ========================================================== */

  useEffect(() => {

    const paymentCompleted =
      location.state?.paymentCompleted;

    const requestId =
      location.state?.requestId;


    if (
      paymentCompleted === true &&
      requestId !== undefined &&
      requestId !== null
    ) {

      const matchingRequest =
        requests.find(
          request =>
            String(
              getRequestId(request)
            ) ===
            String(requestId)
        );


      if (matchingRequest) {

        openFeedback(
          matchingRequest
        );

      }


      navigate(
        location.pathname,
        {
          replace: true,
          state: {}
        }
      );

    }

  }, [
    location.state,
    location.pathname,
    navigate,
    requests
  ]);


  /* ==========================================================
     FILTER BY DEPARTMENT
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
              getDepartmentName(request)
            );


          return requestDept === managerDept;

        }
      );

    }, [
      requests,
      managerDepartment
    ]);


  /* ==========================================================
     SEARCH + FILTER
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
            getEffectiveStatus(request);


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
      filter,
      paymentStatuses
    ]);


  /* ==========================================================
     SUMMARY COUNTS
  ========================================================== */

  const totalRequests =
    departmentRequests.length;


  const pendingRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) === "PENDING"
    );


  const approvedRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) === "APPROVED"
    );


  const rejectedRequests =
    departmentRequests.filter(
      request =>
        getStatus(request) === "REJECTED"
    );


  const paidRequests =
    departmentRequests.filter(
      request =>
        getEffectiveStatus(request) === "PAID"
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
        "Request ID is missing."
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
            status: normalizedStatus
          },
          withCredentials: true
        }
      );


      await loadRequests(false);

      /*
       * Re-read the persisted feedback status from the backend.
       * Do not rely only on local React state.
       */
      await loadSubmittedFeedback(
        requests.map(item =>
          String(getRequestId(item)) === String(requestId)
            ? {
                ...item,
                requestId: requestId
              }
            : item
        )
      );

    }

    catch (err) {

      console.error(
        "Unable to update request:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      setError(
        backendMessage ||
        `Unable to ${action} request.`
      );

    }

  };


  /* ==========================================================
     PAYMENT
  ========================================================== */

  const handlePayment = (request) => {

    const requestId =
      getRequestId(request);

    const amount =
      getTotalPrice(request);

    const quantity =
      getQuantity(request);

    const productName =
      getProductName(request);

    const productId =
      getProductId(request);

    const userId =
      getUserId(request);

    const userName =
      getUserName(request);

    const department =
      getDepartmentName(request);

    const status =
      getEffectiveStatus(request);


    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setError(
        "Request ID is missing."
      );

      return;

    }


    if (status === "PAID") {

      setError(
        `Payment for PR-${requestId} has already been completed.`
      );

      return;

    }


    if (status !== "APPROVED") {

      setError(
        "Only approved requests can be paid."
      );

      return;

    }


    if (
      !amount ||
      amount <= 0
    ) {

      setError(
        "Payment amount is not available."
      );

      return;

    }


    navigate(
      "/manager/Payment",
      {
        state: {

          paymentRequest: {

            requestId,

            productId,

            productName,

            quantity,

            amount,

            userId,

            userName,

            department,

            status

          }

        }

      }
    );

  };


  /* ==========================================================
     LOAD FEEDBACK PRODUCT
  ========================================================== */

  const loadFeedbackProduct = async (request) => {

    const existingImage =
      getProductImage(request);


    if (existingImage) {

      setFeedbackProduct({
        ...request,
        imageUrl: existingImage
      });

      return;

    }


    const requestId =
      getRequestId(request);


    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setFeedbackProduct(request);

      return;

    }


    try {

      setFeedbackProductLoading(true);


      const response =
        await api.get(
          `/raiserequest/${requestId}/product`,
          {
            withCredentials: true
          }
        );


      let productData =
        response.data;


      if (response.data?.data) {

        productData =
          response.data.data;

      }
      else if (response.data?.product) {

        productData =
          response.data.product;

      }


      setFeedbackProduct(
        productData || request
      );

    }

    catch (err) {

      console.warn(
        "Unable to load feedback product image:",
        err
      );


      setFeedbackProduct(request);

    }

    finally {

      setFeedbackProductLoading(false);

    }

  };


  /* ==========================================================
     OPEN FEEDBACK
  ========================================================== */

  function openFeedback(request) {

    const productId =
      getProductId(request);

    const requestId =
      getRequestId(request);


    if (
      requestId !== null &&
      requestId !== undefined &&
      requestId !== "" &&
      submittedFeedback[
        String(requestId)
      ]
    ) {

      setError(
        "Feedback for this product has already been submitted."
      );

      return;

    }


    if (
      productId === null ||
      productId === undefined ||
      productId === ""
    ) {

      setFeedbackError(
        "Product ID is missing. Cannot submit feedback."
      );

    }
    else {

      setFeedbackError("");

    }


    setFeedbackRequest(request);

    setFeedbackProduct(null);

    setFeedbackRating(0);

    setFeedbackComment("");

    setFeedbackSuccess("");

    setFeedbackProductLoading(false);

    setShowFeedbackModal(true);


    loadFeedbackProduct(request);

  }


  /* ==========================================================
     CLOSE FEEDBACK MODAL
  ========================================================== */

  const closeFeedbackModal = () => {

    if (feedbackSubmitting) {
      return;
    }


    setShowFeedbackModal(false);

    setFeedbackRequest(null);

    setFeedbackProduct(null);

    setFeedbackRating(0);

    setFeedbackComment("");

    setFeedbackError("");

    setFeedbackSuccess("");

  };


  /* ==========================================================
     SUBMIT FEEDBACK
  ========================================================== */

  const submitFeedback = async (event) => {

    event.preventDefault();


    const requestId =
      getRequestId(feedbackRequest);

    const productId =
      getProductId(feedbackRequest);


    let currentManagerId =
      managerId;


    if (
      currentManagerId === null ||
      currentManagerId === undefined ||
      currentManagerId === ""
    ) {

      currentManagerId =
        localStorage.getItem("managerId");

    }


    if (
      currentManagerId === null ||
      currentManagerId === undefined ||
      currentManagerId === ""
    ) {

      try {

        const storedManager =
          localStorage.getItem("manager");


        if (storedManager) {

          const manager =
            JSON.parse(storedManager);


          currentManagerId =
            manager?.managerId ??
            manager?.manager_id ??
            manager?.id ??
            null;

        }

      }

      catch (err) {

        console.error(
          "Unable to read manager ID:",
          err
        );

      }

    }


    if (
      currentManagerId === null ||
      currentManagerId === undefined ||
      currentManagerId === ""
    ) {

      setFeedbackError(
        "Manager ID is missing. Please login again."
      );

      return;

    }


    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setFeedbackError(
        "Request ID is missing. Cannot submit feedback."
      );

      return;

    }


    if (
      productId === null ||
      productId === undefined ||
      productId === ""
    ) {

      setFeedbackError(
        "Product ID is missing."
      );

      return;

    }


    if (
      submittedFeedback[
        String(requestId)
      ] === true
    ) {

      setFeedbackError(
        "You have already submitted feedback for this request."
      );

      return;

    }


    if (
      !feedbackRating ||
      feedbackRating < 1 ||
      feedbackRating > 5
    ) {

      setFeedbackError(
        "Please select a rating from 1 to 5 stars."
      );

      return;

    }


    if (!feedbackComment.trim()) {

      setFeedbackError(
        "Please enter your feedback."
      );

      return;

    }


    try {

      setFeedbackSubmitting(true);

      setFeedbackError("");

      setFeedbackSuccess("");


      const feedbackData = {

        requestId:
          Number(requestId),

        productId:
          Number(productId),

        comment:
          feedbackComment.trim(),

        rating:
          Number(feedbackRating)

      };


      const feedbackUrl =
        `/product-rating/add/${currentManagerId}`;


      console.log(
        "Submitting product feedback:",
        {
          managerId: currentManagerId,
          requestId,
          productId,
          feedbackData
        }
      );


      await api.post(
        feedbackUrl,
        feedbackData,
        {
          withCredentials: true
        }
      );


      setSubmittedFeedback(
        previous => ({
          ...previous,
          [String(requestId)]: true
        })
      );


      setFeedbackSuccess(
        "Thank you! Your feedback has been submitted successfully."
      );


      setFeedbackRating(0);

      setFeedbackComment("");


      await loadRequests(false);

    }

    catch (err) {

      console.error(
        "Unable to submit feedback:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      if (err.response?.status === 400) {

        setFeedbackError(
          backendMessage ||
          "Invalid feedback. Please check your rating and comment."
        );

      }

      else if (err.response?.status === 401) {

        setFeedbackError(
          "Your session has expired. Please login again."
        );

      }

      else if (err.response?.status === 403) {

        setFeedbackError(
          "You are not authorized to submit feedback."
        );

      }

      else if (err.response?.status === 404) {

        setFeedbackError(
          "Feedback API was not found. Check your backend endpoint."
        );

      }

      else {

        setFeedbackError(
          backendMessage ||
          "Unable to submit feedback. Please try again."
        );

      }

    }

    finally {

      setFeedbackSubmitting(false);

    }

  };


  /* ==========================================================
     VIEW PRODUCT
  ========================================================== */

  const viewProduct = async (requestId) => {

    if (
      requestId === null ||
      requestId === undefined ||
      requestId === ""
    ) {

      setError(
        "Request ID is missing."
      );

      return;

    }


    try {

      setShowProductModal(true);

      setProductLoading(true);

      setProductError("");

      setSelectedProduct(null);


      const response =
        await api.get(
          `/raiserequest/${requestId}/product`,
          {
            withCredentials: true
          }
        );


      let productData =
        response.data;


      if (response.data?.data) {

        productData =
          response.data.data;

      }
      else if (response.data?.product) {

        productData =
          response.data.product;

      }


      setSelectedProduct(productData);

    }

    catch (err) {

      console.error(
        "Unable to load product:",
        err
      );


      setProductError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load product details."
      );

    }

    finally {

      setProductLoading(false);

    }

  };


  /* ==========================================================
     CLOSE PRODUCT MODAL
  ========================================================== */

  const closeProductModal = () => {

    setShowProductModal(false);

    setSelectedProduct(null);

    setProductError("");

    setProductLoading(false);

  };


  /* ==========================================================
     LOGOUT
  ========================================================== */

  const logout = () => {

    localStorage.removeItem("manager");

    localStorage.removeItem("managerId");

    localStorage.removeItem("managerName");

    localStorage.removeItem("managerDepartment");

    localStorage.removeItem("department");


    navigate("/manager/login");

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

      onClick={() => {

        if (showProfileMenu) {

          setShowProfileMenu(false);

        }

      }}
    >


      {/* ====================================================
          NAVBAR
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

            onClick={() =>
              setShowMobileMenu(
                previous =>
                  !previous
              )
            }
          >

            {showMobileMenu
              ? <X size={21} />
              : <Menu size={21} />
            }

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


          <nav
            className={
              `manager-top-nav ${
                showMobileMenu
                  ? "mobile-nav-open"
                  : ""
              }`
            }
          >

            <Link
              to="/manager/dashboard"
              className="manager-top-nav-link"

              onClick={() =>
                setShowMobileMenu(false)
              }
            >

              <LayoutDashboard size={17} />

              <span>
                Dashboard
              </span>

            </Link>


            <Link
              to="/manager/requests"
              className="manager-top-nav-link active"

              onClick={() =>
                setShowMobileMenu(false)
              }
            >

              <ClipboardCheck size={17} />

              <span>
                Approvals
              </span>


              {pendingRequests.length > 0 && (

                <span className="nav-count">
                  {pendingRequests.length}
                </span>

              )}

            </Link>


            <Link
              to="/manager/Payment"
              className="manager-top-nav-link"

              onClick={() =>
                setShowMobileMenu(false)
              }
            >

              <CreditCard size={17} />

              <span>
                Payments
              </span>

            </Link>


            <button
              type="button"
              className="manager-top-nav-link manager-csv-nav-button"
              onClick={() => {
                downloadRequestsCsv();
                setShowMobileMenu(false);
              }}
              title="Download manager purchase requests CSV"
            >
              <Download size={17} />

              <span>
                Manager CSV
              </span>
            </button>


            <button
              type="button"
              className="manager-top-nav-link manager-csv-nav-button"
              onClick={() => {
                downloadPaymentsCsv();
                setShowMobileMenu(false);
              }}
              title="Download manager payments CSV"
            >
              <CreditCard size={17} />

              <span>
                Payments CSV
              </span>
            </button>

          </nav>

        </div>


        {/* ==================================================
            NAVBAR RIGHT
        ================================================== */}

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

                <Link
                  to="/manager/profile"
                >

                  <Building2 size={16} />

                  Profile

                </Link>


                <Link
                  to="/manager/settings"
                >

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
          MAIN
      ==================================================== */}

      <main className="manager-requests-main">


        {/* HERO */}

        <section className="hero-heading">

          <div>

            <div className="manager-requests-label">

              <span className="eyebrow">
                MANAGER
              </span>

              <span className="queue-badge">
                Approval Queue
              </span>

            </div>


            <h1>
              Purchase Requests
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


        {/* DEPARTMENT */}

        <div className="manager-department-banner">

          <div className="department-icon">

            <Building2 size={18} />

          </div>

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


        {/* ERROR */}

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


        {/* ==================================================
            SUMMARY
        ================================================== */}

        <section className="manager-request-summary">


          <div className="summary-card">

            <span>
              All Requests
            </span>

            <strong>
              {totalRequests}
            </strong>

          </div>


          <div className="summary-card pending-card">

            <span>
              Pending
            </span>

            <strong>
              {pendingRequests.length}
            </strong>

          </div>


          <div className="summary-card approved-card">

            <span>
              Approved
            </span>

            <strong>
              {approvedRequests.length}
            </strong>

          </div>


          <div className="summary-card rejected-card">

            <span>
              Rejected
            </span>

            <strong>
              {rejectedRequests.length}
            </strong>

          </div>


          <div className="summary-card paid-card">

            <span>
              Paid
            </span>

            <strong>
              {paidRequests.length}
            </strong>

          </div>

        </section>


        {/* REQUEST PANEL */}

        <section className="panel">


          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="manager-request-toolbar">

            <div className="manager-search">

              <Search size={17} />

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

              <Filter size={15} />

              <select
                value={filter}

                onChange={event =>
                  setFilter(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All Requests
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

              <ChevronDown size={14} />

            </div>




          </div>


          {/* EMPTY */}

          {filtered.length === 0 ? (

            <div className="requests-message">

              <FileTextIcon />

              <h3>
                No Requests Found
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

                  Clear Filters

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
                        getRequestId(request);


                      const rowKey =
                        requestId ??
                        `request-${index}`;


                      const status =
                        getEffectiveStatus(
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


                      const feedbackSubmitted =
                        requestId !== null &&
                        requestId !== undefined
                          ? submittedFeedback[
                              String(requestId)
                            ] === true
                          : false;


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

                            <strong className="amount-value">

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


                              {/* PENDING */}

                              {status === "PENDING" && (

                                <>

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

                                    <CheckCircle2
                                      size={14}
                                    />

                                    Approve

                                  </button>


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

                                </>

                              )}


                              {/* APPROVED */}

                              {status === "APPROVED" && (

                                <button
                                  type="button"
                                  className="pay-now-action"

                                  onClick={() =>
                                    handlePayment(
                                      request
                                    )
                                  }
                                >

                                  <CreditCard
                                    size={14}
                                  />

                                  Pay Now

                                </button>

                              )}


                              {/* PAID */}

                              {status === "PAID" && (

                                <>

                                  <span className="payment-completed">

                                    <CheckCircle2
                                      size={15}
                                    />

                                    Payment Completed

                                  </span>


                                  {feedbackSubmitted ? (

                                    <span className="feedback-submitted">

                                      <CheckCircle2
                                        size={14}
                                      />

                                      Feedback Submitted

                                    </span>

                                  ) : (

                                    <button
                                      type="button"
                                      className="feedback-action"

                                      onClick={() =>
                                        openFeedback(
                                          request
                                        )
                                      }
                                    >

                                      <MessageSquare
                                        size={14}
                                      />

                                      Give Feedback

                                    </button>

                                  )}

                                </>

                              )}


                              {/* VIEW PRODUCT */}

                              <button
                                type="button"
                                className="view-product-action"

                                onClick={() =>
                                  viewProduct(
                                    requestId
                                  )
                                }
                              >

                                <Package
                                  size={14}
                                />

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


        {/* FOOTER */}

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


      {/* ====================================================
          PRODUCT MODAL
      ==================================================== */}

      {showProductModal && (

        <div
          className="product-modal-overlay"

          onClick={
            closeProductModal
          }
        >

          <div
            className="product-modal"

            onClick={event =>
              event.stopPropagation()
            }
          >

            <div className="product-modal-header">

              <div>

                <span className="product-modal-eyebrow">
                  PRODUCT DETAILS
                </span>

                <h2>
                  Product Information
                </h2>

              </div>


              <button
                type="button"
                className="product-modal-close"

                onClick={
                  closeProductModal
                }
              >

                <X size={20} />

              </button>

            </div>


            <div className="product-modal-body">


              {productLoading && (

                <div className="product-modal-loading">

                  <LoaderCircle
                    size={40}
                    className="product-loading-spinner"
                  />

                  <h3>
                    Loading Product...
                  </h3>

                  <p>
                    Please wait while we retrieve
                    the product details.
                  </p>

                </div>

              )}


              {!productLoading &&
                productError && (

                  <div className="product-modal-error">

                    <AlertCircle size={42} />

                    <h3>
                      Unable to Load Product
                    </h3>

                    <p>
                      {productError}
                    </p>

                    <button
                      type="button"

                      onClick={
                        closeProductModal
                      }
                    >
                      Close
                    </button>

                  </div>

                )}


              {!productLoading &&
                !productError &&
                selectedProduct && (

                  <div className="product-details-content">


                    <div className="product-image-section">

                      {selectedProduct.imageUrl ? (

                        <img
                          src={
                            selectedProduct.imageUrl
                          }

                          alt={
                            selectedProduct.productName ||
                            selectedProduct.name ||
                            "Product"
                          }

                          className="product-modal-image"

                          onError={event => {

                            event.currentTarget.style.display =
                              "none";

                            event.currentTarget
                              .nextElementSibling
                              ?.classList.add(
                                "show-product-image-placeholder"
                              );

                          }}
                        />

                      ) : null}


                      <div className="product-image-placeholder">

                        <Package size={52} />

                        <span>
                          No Image Available
                        </span>

                      </div>

                    </div>


                    <div className="product-information">

                      <div className="product-modal-title-row">

                        <span className="product-label">
                          PRODUCT
                        </span>

                        <h3>

                          {
                            selectedProduct.productName ||
                            selectedProduct.name ||
                            "Product"
                          }

                        </h3>

                      </div>


                      <div className="product-price-section">

                        <span>
                          Price
                        </span>

                        <strong className="product-price">

                          {formatCurrency(
                            selectedProduct.product_price ??
                            selectedProduct.productPrice ??
                            selectedProduct.price ??
                            0
                          )}

                        </strong>

                      </div>


                      <div className="product-description">

                        <span>
                          Description
                        </span>

                        <p>

                          {
                            selectedProduct.description ||
                            "No description available."
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                )}


              {!productLoading &&
                !productError &&
                !selectedProduct && (

                  <div className="product-modal-error">

                    <AlertCircle size={42} />

                    <h3>
                      Product Not Found
                    </h3>

                    <p>
                      No product information was returned
                      by the server.
                    </p>

                    <button
                      type="button"
                      onClick={
                        closeProductModal
                      }
                    >
                      Close
                    </button>

                  </div>

                )}

            </div>


            <div className="product-modal-footer">

              <button
                type="button"
                className="product-modal-close-button"

                onClick={
                  closeProductModal
                }
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ====================================================
          FEEDBACK MODAL
      ==================================================== */}

      {showFeedbackModal && (

        <div
          className="feedback-modal-overlay"

          onClick={
            closeFeedbackModal
          }
        >

          <div
            className="feedback-modal"

            onClick={event =>
              event.stopPropagation()
            }
          >


            <div className="feedback-modal-header">

              <div className="feedback-header-icon">

                <MessageSquare size={22} />

              </div>


              <div>

                <span className="feedback-eyebrow">
                  PAYMENT COMPLETED
                </span>

                <h2>
                  Share Your Feedback
                </h2>

              </div>


              <button
                type="button"
                className="feedback-close-button"

                onClick={
                  closeFeedbackModal
                }

                disabled={
                  feedbackSubmitting
                }
              >

                <X size={20} />

              </button>

            </div>


            <form
              className="feedback-form"

              onSubmit={
                submitFeedback
              }
            >


              <div className="feedback-product-card">

                <div className="feedback-product-image-wrapper">

                  {feedbackProductLoading ? (

                    <div className="feedback-image-loading">

                      <LoaderCircle
                        size={28}
                        className="feedback-spinner"
                      />

                    </div>

                  ) : (

                    getProductImage(
                      feedbackProduct ||
                      feedbackRequest
                    ) ? (

                      <img
                        src={
                          getProductImage(
                            feedbackProduct ||
                            feedbackRequest
                          )
                        }

                        alt={
                          getProductName(
                            feedbackProduct ||
                            feedbackRequest
                          )
                        }

                        className="feedback-product-image"

                        onError={event => {

                          event.currentTarget.style.display =
                            "none";

                          event.currentTarget
                            .nextElementSibling
                            ?.classList.add(
                              "show-feedback-placeholder"
                            );

                        }}
                      />

                    ) : null

                  )}


                  <div className="feedback-product-image-placeholder">

                    <Package size={38} />

                    <span>
                      No Image
                    </span>

                  </div>

                </div>


                <div className="feedback-product-details">

                  <span className="feedback-product-label">
                    PRODUCT
                  </span>

                  <h3>

                    {
                      getProductName(
                        feedbackProduct ||
                        feedbackRequest
                      )
                    }

                  </h3>

                  <div className="feedback-product-meta">

                    <span>

                      Product ID:

                      <strong>

                        {
                          getProductId(
                            feedbackRequest
                          ) || "N/A"
                        }

                      </strong>

                    </span>

                  </div>

                </div>

              </div>


              <div className="feedback-request-info">

                <div>

                  <span>
                    Manager ID
                  </span>

                  <strong>
                    {managerId || "N/A"}
                  </strong>

                </div>


                <div>

                  <span>
                    Product ID
                  </span>

                  <strong>

                    {
                      getProductId(
                        feedbackRequest
                      ) || "N/A"
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Product
                  </span>

                  <strong>

                    {
                      getProductName(
                        feedbackRequest
                      )
                    }

                  </strong>

                </div>

              </div>


              <div className="feedback-rating-section">

                <label>
                  How would you rate this product?
                </label>


                <div className="feedback-stars">

                  {[1, 2, 3, 4, 5].map(
                    star => (

                      <button
                        key={star}

                        type="button"

                        className={
                          `feedback-star ${
                            star <= feedbackRating
                              ? "selected active"
                              : ""
                          }`
                        }

                        onClick={() =>
                          setFeedbackRating(
                            star
                          )
                        }

                        disabled={
                          feedbackSubmitting
                        }

                        aria-label={
                          `${star} star`
                        }

                        aria-pressed={
                          star <= feedbackRating
                        }
                      >

                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill={
                            star <= feedbackRating
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >

                          <polygon
                            points="
                              12 2
                              15.09 8.26
                              22 9.27
                              17 14.14
                              18.18 21.02
                              12 17.77
                              5.82 21.02
                              7 14.14
                              2 9.27
                              8.91 8.26
                            "
                          />

                        </svg>

                      </button>

                    )
                  )}

                </div>


                <div className="feedback-rating-text">

                  {feedbackRating === 0 &&
                    "Select a rating"}

                  {feedbackRating === 1 &&
                    "Very Poor"}

                  {feedbackRating === 2 &&
                    "Poor"}

                  {feedbackRating === 3 &&
                    "Average"}

                  {feedbackRating === 4 &&
                    "Good"}

                  {feedbackRating === 5 &&
                    "Excellent"}

                </div>

              </div>


              <div className="feedback-comment-section">

                <label htmlFor="feedback-comment">
                  Comment
                </label>


                <textarea
                  id="feedback-comment"

                  rows="5"

                  placeholder="Write your feedback about the product..."

                  value={
                    feedbackComment
                  }

                  onChange={event =>
                    setFeedbackComment(
                      event.target.value
                    )
                  }

                  disabled={
                    feedbackSubmitting
                  }

                  maxLength={500}
                />


                <div className="feedback-character-count">

                  {feedbackComment.length}/500

                </div>

              </div>


              {feedbackError && (

                <div className="feedback-error">

                  <AlertCircle size={17} />

                  <span>
                    {feedbackError}
                  </span>

                </div>

              )}


              {feedbackSuccess && (

                <div className="feedback-success">

                  <CheckCircle2 size={17} />

                  <span>
                    {feedbackSuccess}
                  </span>

                </div>

              )}


              <div className="feedback-actions">

                <button
                  type="button"

                  className="feedback-cancel-button"

                  onClick={
                    closeFeedbackModal
                  }

                  disabled={
                    feedbackSubmitting
                  }
                >

                  {feedbackSuccess
                    ? "Close"
                    : "Cancel"}

                </button>


                {!feedbackSuccess && (

                  <button
                    type="submit"

                    className="feedback-submit-button"

                    disabled={
                      feedbackSubmitting
                    }
                  >

                    {feedbackSubmitting ? (

                      <>

                        <LoaderCircle
                          size={16}
                          className="feedback-spinner"
                        />

                        Submitting...

                      </>

                    ) : (

                      <>

                        <Send size={16} />

                        Submit Feedback

                      </>

                    )}

                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      )}

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
