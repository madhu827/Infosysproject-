
import React, {
  useEffect,
  useState
} from "react";

import {
  LayoutDashboard,
  PackagePlus,
  Package,
  Bell,
  UserCircle,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Truck,
  FileSpreadsheet,
  CreditCard,
  Star
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../api/client";

import "../css/supplier/SupplierDashboard.css";


const SupplierDashboard = () => {

  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [supplierId, setSupplierId] =
    useState(null);

  const [supplierName, setSupplierName] =
    useState("Supplier");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [downloadingCsv, setDownloadingCsv] =
    useState(false);


  // =========================================================
  // NAVIGATION
  // =========================================================

  const goToDashboard = () => {

    setMobileMenuOpen(false);

    navigate("/supplier/dashboard");

  };


  const goToAddProduct = () => {

    setMobileMenuOpen(false);

    navigate("/supplier/add-product");

  };


  const goToMyProducts = () => {

    setMobileMenuOpen(false);

    navigate("/supplier/MyProducts");

  };


  const goToTracking = () => {

    setMobileMenuOpen(false);

    navigate("/supplier/tracking");

  };


  // =========================================================
  // REVIEW NAVIGATION
  // =========================================================

  const goToReview = () => {

    setMobileMenuOpen(false);

    navigate("/manager/Review");

  };


  // =========================================================
  // EXTRACT SUPPLIER NAME
  // =========================================================

  const extractSupplierName = (responseData) => {

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData.supplierName
    ) {

      return String(
        responseData.supplierName
      ).trim();

    }


    if (
      responseData?.data?.supplierName
    ) {

      return String(
        responseData.data.supplierName
      ).trim();

    }


    if (
      responseData?.supplier?.supplierName
    ) {

      return String(
        responseData.supplier.supplierName
      ).trim();

    }


    if (
      responseData?.supplier_name
    ) {

      return String(
        responseData.supplier_name
      ).trim();

    }


    if (
      responseData?.name
    ) {

      return String(
        responseData.name
      ).trim();

    }


    return "";

  };


  // =========================================================
  // FETCH SUPPLIER DETAILS
  // =========================================================

  const fetchSupplierDetails = async (id) => {

    try {

      console.log(
        "Fetching supplier details for:",
        id
      );


      const response =
        await api.get(
          `/supplier/${id}`,
          {
            withCredentials: true
          }
        );


      console.log(
        "Supplier details:",
        response.data
      );


      const name =
        extractSupplierName(
          response.data
        );


      if (name) {

        setSupplierName(name);

        localStorage.setItem(
          "supplierName",
          name
        );

      }

      else {

        const storedName =
          localStorage.getItem(
            "supplierName"
          );


        if (
          storedName &&
          storedName !== "null" &&
          storedName !== "undefined"
        ) {

          setSupplierName(
            storedName
          );

        }

      }

    }

    catch (err) {

      console.error(
        "Error loading supplier details:",
        err
      );


      const storedName =
        localStorage.getItem(
          "supplierName"
        );


      if (
        storedName &&
        storedName !== "null" &&
        storedName !== "undefined"
      ) {

        setSupplierName(
          storedName
        );

      }

    }

  };


  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async (
    id,
    isRefresh = false
  ) => {

    try {

      if (isRefresh) {

        setRefreshing(true);

      }

      else {

        setLoading(true);

      }


      setError("");


      console.log(
        "Fetching products for supplier:",
        id
      );


      const response =
        await api.get(
          `/product/supplier/${id}`,
          {
            withCredentials: true
          }
        );


      console.log(
        "Products response:",
        response.data
      );


      if (
        Array.isArray(
          response.data
        )
      ) {

        setProducts(
          response.data
        );

      }

      else if (
        Array.isArray(
          response.data?.data
        )
      ) {

        setProducts(
          response.data.data
        );

      }

      else {

        setProducts([]);

      }

    }

    catch (err) {

      console.error(
        "Error loading products:",
        err
      );


      const message =
        err.response?.data?.message ||
        (
          typeof err.response?.data === "string"
            ? err.response.data
            : ""
        ) ||
        "Unable to load supplier products.";


      setError(message);

      setProducts([]);

    }

    finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  // =========================================================
  // NORMALIZE PAYMENT RESPONSE
  // =========================================================

  const normalizePayments = (responseData) => {

    console.log(
      "Raw payment response:",
      responseData
    );


    if (
      Array.isArray(responseData)
    ) {

      return responseData;

    }


    if (
      Array.isArray(
        responseData?.data
      )
    ) {

      return responseData.data;

    }


    if (
      Array.isArray(
        responseData?.payments
      )
    ) {

      return responseData.payments;

    }


    if (
      Array.isArray(
        responseData?.content
      )
    ) {

      return responseData.content;

    }


    if (
      Array.isArray(
        responseData?.data?.payments
      )
    ) {

      return responseData.data.payments;

    }


    return [];

  };


  // =========================================================
  // GET PAYMENT STATUS
  // =========================================================

  const getPaymentStatus = (payment) => {

    return String(
      payment?.paymentStatus ??
      payment?.payment_status ??
      payment?.status ??
      ""
    )
      .trim()
      .toUpperCase();

  };


  // =========================================================
  // GET PAYMENT AMOUNT
  // =========================================================

  const getPaymentAmount = (payment) => {

    const amount =
      Number(
        payment?.amount ??
        payment?.totalAmount ??
        payment?.paymentAmount ??
        payment?.payment_amount ??
        payment?.purchaseRequest?.totalPrice ??
        payment?.purchaseRequest?.totalprice ??
        0
      );


    return Number.isFinite(amount)
      ? amount
      : 0;

  };


  // =========================================================
  // GET SUPPLIER ID FROM PAYMENT
  // =========================================================

  const getPaymentSupplierId = (payment) => {

    const possibleIds = [

      payment?.purchaseRequest
        ?.product
        ?.supplier
        ?.supplierId,

      payment?.purchaseRequest
        ?.product
        ?.supplier
        ?.supplier_id,

      payment?.purchaseRequest
        ?.product
        ?.supplierId,

      payment?.purchaseRequest
        ?.product
        ?.supplier_id,

      payment?.product
        ?.supplier
        ?.supplierId,

      payment?.product
        ?.supplier
        ?.supplier_id,

      payment?.supplier
        ?.supplierId,

      payment?.supplier
        ?.supplier_id,

      payment?.supplierId,

      payment?.supplier_id

    ];


    for (
      const value of possibleIds
    ) {

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {

        const numericValue =
          Number(value);


        if (
          Number.isFinite(
            numericValue
          )
        ) {

          return numericValue;

        }

      }

    }


    return null;

  };


  // =========================================================
  // CHECK PAYMENT BELONGS TO CURRENT SUPPLIER
  // =========================================================

  const isPaymentForSupplier = (
    payment,
    currentSupplierId
  ) => {

    const paymentSupplierId =
      getPaymentSupplierId(
        payment
      );


    const normalizedSupplierId =
      Number(
        currentSupplierId
      );


    console.log(
      "Payment supplier check:",
      {
        paymentId:
          payment?.paymentId ??
          payment?.payment_id,

        paymentSupplierId,

        currentSupplierId:
          normalizedSupplierId,

        status:
          getPaymentStatus(payment)
      }
    );


    if (
      paymentSupplierId !== null
    ) {

      return (
        paymentSupplierId ===
        normalizedSupplierId
      );

    }


    return false;

  };


  // =========================================================
  // FETCH PAYED PAYMENTS
  // =========================================================

  const fetchPayments = async (id) => {

    try {

      console.log(
        "===================================="
      );

      console.log(
        "FETCHING PAYED PAYMENTS"
      );

      console.log(
        "Current Supplier ID:",
        id
      );

      console.log(
        "API:",
        "/payment/payed"
      );

      console.log(
        "===================================="
      );


      if (
        !id ||
        id === "null" ||
        id === "undefined"
      ) {

        console.error(
          "Supplier ID is missing."
        );

        setPayments([]);

        return;

      }


      const response =
        await api.get(
          "/payment/payed",
          {
            withCredentials: true
          }
        );


      console.log(
        "PAYMENT API RESPONSE:",
        response.data
      );


      const allPayments =
        normalizePayments(
          response.data
        );


      console.log(
        "ALL PAYED PAYMENTS:",
        allPayments
      );


      console.log(
        "TOTAL PAYED PAYMENTS FROM BACKEND:",
        allPayments.length
      );


      const supplierPayments =
        allPayments.filter(
          (payment) =>
            isPaymentForSupplier(
              payment,
              id
            )
        );


      console.log(
        "===================================="
      );

      console.log(
        "CURRENT SUPPLIER PAYMENTS:",
        supplierPayments
      );

      console.log(
        "CURRENT SUPPLIER PAYMENT COUNT:",
        supplierPayments.length
      );

      console.log(
        "===================================="
      );


      supplierPayments.forEach(
        (payment, index) => {

          console.log(
            `Supplier Payment ${index + 1}:`,
            {

              paymentId:
                payment?.paymentId ??
                payment?.payment_id,

              requestId:
                payment
                  ?.purchaseRequest
                  ?.requestId ??
                payment
                  ?.purchaseRequest
                  ?.request_id,

              supplierId:
                getPaymentSupplierId(
                  payment
                ),

              amount:
                getPaymentAmount(
                  payment
                ),

              status:
                getPaymentStatus(
                  payment
                ),

              product:
                payment
                  ?.purchaseRequest
                  ?.product
                  ?.productName ??
                payment
                  ?.purchaseRequest
                  ?.product
                  ?.product_name

            }
          );

        }
      );


      setPayments(
        supplierPayments
      );

    }

    catch (err) {

      console.error(
        "===================================="
      );

      console.error(
        "ERROR FETCHING PAYED PAYMENTS"
      );

      console.error(
        err
      );

      console.error(
        "Response:",
        err.response?.data
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "===================================="
      );


      setPayments([]);

    }

  };


  // =========================================================
  // DOWNLOAD PAYMENT HISTORY CSV
  // =========================================================

  const downloadPaymentHistoryCsv = async () => {

    try {

      const storedSupplierId =
        supplierId ||
        localStorage.getItem(
          "supplierId"
        );


      if (
        !storedSupplierId ||
        storedSupplierId === "null" ||
        storedSupplierId === "undefined"
      ) {

        alert(
          "Supplier ID not found. Please login again."
        );

        return;

      }


      setDownloadingCsv(true);


      console.log(
        "Downloading payment history CSV for supplier:",
        storedSupplierId
      );


      const response =
        await api.get(
          `/csv/payment-history/${storedSupplierId}`,
          {
            responseType: "blob",
            withCredentials: true
          }
        );


      const blob =
        new Blob(
          [response.data],
          {
            type: "text/csv;charset=utf-8;"
          }
        );


      const url =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement("a");


      link.href = url;


      link.download =
        "supplier_payment_history.csv";


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      window.URL.revokeObjectURL(
        url
      );

    }

    catch (err) {

      console.error(
        "Error downloading payment history CSV:",
        err
      );


      let message =
        "Unable to download payment history CSV.";


      if (
        err.response?.data instanceof Blob
      ) {

        try {

          const errorText =
            await err.response.data.text();


          if (errorText) {

            try {

              const errorJson =
                JSON.parse(
                  errorText
                );


              message =
                errorJson.message ||
                errorJson.error ||
                message;

            }

            catch {

              message =
                errorText;

            }

          }

        }

        catch {

          // Keep default message

        }

      }


      alert(message);

    }

    finally {

      setDownloadingCsv(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    const storedSupplierId =
      localStorage.getItem(
        "supplierId"
      );


    const storedSupplierName =
      localStorage.getItem(
        "supplierName"
      );


    console.log(
      "===================================="
    );

    console.log(
      "SUPPLIER DASHBOARD INITIAL LOAD"
    );

    console.log(
      "Stored supplier ID:",
      storedSupplierId
    );

    console.log(
      "Stored supplier name:",
      storedSupplierName
    );

    console.log(
      "===================================="
    );


    if (
      storedSupplierName &&
      storedSupplierName !== "null" &&
      storedSupplierName !== "undefined"
    ) {

      setSupplierName(
        storedSupplierName
      );

    }


    if (
      !storedSupplierId ||
      storedSupplierId === "null" ||
      storedSupplierId === "undefined"
    ) {

      setError(
        "Supplier ID not found. Please login again."
      );

      setLoading(false);

      return;

    }


    setSupplierId(
      storedSupplierId
    );


    fetchSupplierDetails(
      storedSupplierId
    );


    fetchProducts(
      storedSupplierId
    );


    fetchPayments(
      storedSupplierId
    );

  }, []);


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {

    if (!supplierId) {

      return;

    }


    setRefreshing(true);


    try {

      await Promise.all([

        fetchSupplierDetails(
          supplierId
        ),

        fetchProducts(
          supplierId,
          true
        ),

        fetchPayments(
          supplierId
        )

      ]);

    }

    finally {

      setRefreshing(false);

    }

  };


  // =========================================================
  // TOTAL PRODUCTS
  // =========================================================

  const totalProducts =
    products.length;


  // =========================================================
  // ACTIVE PRODUCTS
  // =========================================================

  const activeProducts =
    products.filter(
      (product) =>
        Number(
          product?.productQuantity ??
          product?.product_quantity ??
          0
        ) > 0
    ).length;


  // =========================================================
  // TOTAL PAYMENTS
  // =========================================================

  const totalPayments =
    payments.length;


  // =========================================================
  // TOTAL PAYMENT AMOUNT
  // =========================================================

  const totalPaymentAmount =
    payments.reduce(
      (total, payment) =>
        total +
        getPaymentAmount(
          payment
        ),
      0
    );


  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (

      <div className="supplier-dashboard">


        {/* ===================================================
            NAVBAR
        =================================================== */}

        <nav className="supplier-navbar">


          {/* LOGO */}

          <div
            className="supplier-logo"
            onClick={goToDashboard}
          >

            <div className="supplier-logo-icon">

              <Package size={24} />

            </div>


            <div className="supplier-logo-text">

              <span className="supplier-logo-main">
                PROCURA
              </span>

              <span className="supplier-logo-sub">
                Supplier Portal
              </span>

            </div>

          </div>


          {/* DESKTOP NAVIGATION */}

          <div className="supplier-nav-links">

            <button
              type="button"
              className="supplier-nav-link active"
              onClick={goToDashboard}
            >

              <LayoutDashboard size={18} />

              <span>
                Dashboard
              </span>

            </button>


            <button
              type="button"
              className="supplier-nav-link"
              onClick={goToAddProduct}
            >

              <PackagePlus size={18} />

              <span>
                Add Product
              </span>

            </button>


            <button
              type="button"
              className="supplier-nav-link"
              onClick={goToMyProducts}
            >

              <Package size={18} />

              <span>
                My Products
              </span>

            </button>


            <button
              type="button"
              className="supplier-nav-link"
              onClick={goToTracking}
            >

              <Truck size={18} />

              <span>
                Tracking
              </span>

            </button>


            {/* REVIEW */}

            <button
              type="button"
              className="supplier-nav-link"
              onClick={goToReview}
            >

              <Star size={18} />

              <span>
                Review
              </span>

            </button>


            <button
              type="button"
              className="supplier-nav-link"
              onClick={downloadPaymentHistoryCsv}
              disabled={downloadingCsv}
            >

              <FileSpreadsheet size={18} />

              <span>
                {downloadingCsv
                  ? "Downloading..."
                  : "Payment History CSV"}
              </span>

            </button>

          </div>


          {/* RIGHT SIDE */}

          <div className="supplier-navbar-right">

            <button
              type="button"
              className="supplier-notification"
            >

              <Bell size={20} />

              <span className="notification-dot"></span>

            </button>


            <div className="supplier-profile">

              <div className="supplier-avatar">

                <UserCircle size={34} />

              </div>


              <div className="supplier-profile-info">

                <span className="supplier-profile-name">
                  {supplierName}
                </span>

                <span className="supplier-profile-role">
                  Supplier Account
                </span>

              </div>

            </div>

          </div>


          {/* MOBILE MENU */}

          <button
            type="button"
            className="supplier-mobile-menu"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >

            {mobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}

          </button>

        </nav>


        {/* LOADING */}

        <main className="supplier-main">

          <div className="supplier-loading">

            <div className="supplier-loading-spinner"></div>

            <h2>
              Loading Dashboard
            </h2>

            <p>
              Fetching your supplier information...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (

    <div className="supplier-dashboard">


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="supplier-navbar">


        {/* LOGO */}

        <div
          className="supplier-logo"
          onClick={goToDashboard}
        >

          <div className="supplier-logo-icon">

            <Package size={24} />

          </div>


          <div className="supplier-logo-text">

            <span className="supplier-logo-main">
              PROCURA
            </span>

            <span className="supplier-logo-sub">
              Supplier Portal
            </span>

          </div>

        </div>


        {/* DESKTOP NAVIGATION */}

        <div className="supplier-nav-links">


          {/* DASHBOARD */}

          <button
            type="button"
            className="supplier-nav-link active"
            onClick={goToDashboard}
          >

            <LayoutDashboard size={18} />

            <span>
              Dashboard
            </span>

          </button>


          {/* ADD PRODUCT */}

          <button
            type="button"
            className="supplier-nav-link"
            onClick={goToAddProduct}
          >

            <PackagePlus size={18} />

            <span>
              Add Product
            </span>

          </button>


          {/* MY PRODUCTS */}

          <button
            type="button"
            className="supplier-nav-link"
            onClick={goToMyProducts}
          >

            <Package size={18} />

            <span>
              My Products
            </span>

          </button>


          {/* TRACKING */}

          <button
            type="button"
            className="supplier-nav-link"
            onClick={goToTracking}
          >

            <Truck size={18} />

            <span>
              Tracking
            </span>

          </button>


          {/* REVIEW */}

          <button
            type="button"
            className="supplier-nav-link"
            onClick={goToReview}
          >

            <Star size={18} />

            <span>
              Review
            </span>

          </button>


          {/* PAYMENT HISTORY CSV */}

          <button
            type="button"
            className="supplier-nav-link"
            onClick={downloadPaymentHistoryCsv}
            disabled={downloadingCsv}
          >

            <FileSpreadsheet size={18} />

            <span>
              {downloadingCsv
                ? "Downloading..."
                : "Payment History CSV"}
            </span>

          </button>

        </div>


        {/* RIGHT SIDE */}

        <div className="supplier-navbar-right">


          {/* NOTIFICATION */}

          <button
            type="button"
            className="supplier-notification"
          >

            <Bell size={20} />

            <span className="notification-dot"></span>

          </button>


          {/* PROFILE */}

          <div className="supplier-profile">

            <div className="supplier-avatar">

              <UserCircle size={34} />

            </div>


            <div className="supplier-profile-info">

              <span className="supplier-profile-name">
                {supplierName}
              </span>

              <span className="supplier-profile-role">
                Supplier Account
              </span>

            </div>

          </div>

        </div>


        {/* MOBILE MENU */}

        <button
          type="button"
          className="supplier-mobile-menu"
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
        >

          {mobileMenuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}

        </button>

      </nav>


      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileMenuOpen && (

        <div className="supplier-mobile-nav">


          {/* DASHBOARD */}

          <button
            type="button"
            className="mobile-nav-item active"
            onClick={goToDashboard}
          >

            <LayoutDashboard size={19} />

            Dashboard

          </button>


          {/* ADD PRODUCT */}

          <button
            type="button"
            className="mobile-nav-item"
            onClick={goToAddProduct}
          >

            <PackagePlus size={19} />

            Add Product

          </button>


          {/* MY PRODUCTS */}

          <button
            type="button"
            className="mobile-nav-item"
            onClick={goToMyProducts}
          >

            <Package size={19} />

            My Products

          </button>


          {/* TRACKING */}

          <button
            type="button"
            className="mobile-nav-item"
            onClick={goToTracking}
          >

            <Truck size={19} />

            Tracking

          </button>


          {/* REVIEW */}

          <button
            type="button"
            className="mobile-nav-item"
            onClick={goToReview}
          >

            <Star size={19} />

            Review

          </button>


          {/* PAYMENT HISTORY CSV */}

          <button
            type="button"
            className="mobile-nav-item"
            onClick={downloadPaymentHistoryCsv}
            disabled={downloadingCsv}
          >

            <FileSpreadsheet size={19} />

            {downloadingCsv
              ? "Downloading..."
              : "Payment History CSV"}

          </button>


        </div>

      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="supplier-main">


        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="supplier-page-header">


          <div className="supplier-header-content">

            <p className="supplier-welcome">

              Welcome back,

              <strong>
                {supplierName}
              </strong>

            </p>


            <h1>
              Supplier Dashboard
            </h1>


            <p className="supplier-header-description">

              Manage your products and monitor your
              product catalog from one place.

            </p>

          </div>


          <div className="supplier-header-actions">


            {/* ADD PRODUCT */}

            <button
              type="button"
              className="dashboard-add-product-btn"
              onClick={goToAddProduct}
            >

              <PackagePlus size={19} />

              Add Product

            </button>


            {/* PAYMENT CSV */}

            <button
              type="button"
              className="dashboard-add-product-btn"
              onClick={downloadPaymentHistoryCsv}
              disabled={downloadingCsv}
            >

              <FileSpreadsheet size={19} />

              {downloadingCsv
                ? "Downloading..."
                : "Payment History CSV"}

            </button>


          </div>

        </section>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="supplier-dashboard-error">

            <AlertCircle size={19} />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="supplier-stat-grid">


          {/* TOTAL PRODUCTS */}

          <div className="supplier-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-products">

                <Package size={23} />

              </div>


              <span className="stat-card-number">
                01
              </span>

            </div>


            <div className="stat-card-content">

              <span className="stat-label">
                Total Products
              </span>


              <h2>
                {totalProducts}
              </h2>


              <p>
                Products listed in your catalog
              </p>

            </div>

          </div>


          {/* ACTIVE PRODUCTS */}

          <div className="supplier-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-active">

                <CheckCircle size={23} />

              </div>


              <span className="stat-card-number">
                02
              </span>

            </div>


            <div className="stat-card-content">

              <span className="stat-label">
                Active Products
              </span>


              <h2>
                {activeProducts}
              </h2>


              <p>
                Products currently available
              </p>

            </div>

          </div>


          {/* TOTAL PAYMENTS */}

          <div className="supplier-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-payments">

                <CreditCard size={23} />

              </div>


              <span className="stat-card-number">
                03
              </span>

            </div>


            <div className="stat-card-content">

              <span className="stat-label">
                Total Payments
              </span>


              <h2>
                {totalPayments}
              </h2>


              <p>
                Payments received from customers
              </p>

            </div>

          </div>


        </section>


        {/* ===================================================
            PRODUCT OVERVIEW
        =================================================== */}

        <section className="supplier-dashboard-overview">


          <div className="dashboard-overview-header">


            <div>

              <span className="overview-eyebrow">
                CATALOG STATUS
              </span>


              <h3>
                Product Overview
              </h3>


              <p>
                Summary of your current product catalog
              </p>

            </div>


            <button
              type="button"
              onClick={goToMyProducts}
              className="view-products-btn"
            >

              View My Products

              <ArrowRight size={17} />

            </button>


          </div>


          <div className="dashboard-overview-content">


            {/* TOTAL */}

            <div className="overview-item">

              <div className="overview-item-icon">

                <Package size={21} />

              </div>


              <div className="overview-item-info">

                <span>
                  Total Products
                </span>


                <strong>
                  {totalProducts}
                </strong>

              </div>

            </div>


            <div className="overview-divider"></div>


            {/* ACTIVE */}

            <div className="overview-item">

              <div className="overview-item-icon active">

                <CheckCircle size={21} />

              </div>


              <div className="overview-item-info">

                <span>
                  Active Products
                </span>


                <strong>
                  {activeProducts}
                </strong>

              </div>

            </div>


            <div className="overview-divider"></div>


            {/* PAYMENTS */}

            <div className="overview-item">

              <div className="overview-item-icon active">

                <CreditCard size={21} />

              </div>


              <div className="overview-item-info">

                <span>
                  Total Payments
                </span>


                <strong>
                  {totalPayments}
                </strong>

              </div>

            </div>


          </div>

        </section>


        {/* ===================================================
            PAYMENT SUMMARY
        =================================================== */}

        {totalPayments > 0 && (

          <section className="supplier-dashboard-overview">

            <div className="dashboard-overview-header">

              <div>

                <span className="overview-eyebrow">
                  PAYMENT STATUS
                </span>

                <h3>
                  Payment Overview
                </h3>

                <p>
                  Summary of payments received from customers
                </p>

              </div>

            </div>


            <div className="dashboard-overview-content">


              {/* PAYED PAYMENTS */}

              <div className="overview-item">

                <div className="overview-item-icon active">

                  <CreditCard size={21} />

                </div>


                <div className="overview-item-info">

                  <span>
                    PAYED Payments
                  </span>


                  <strong>
                    {totalPayments}
                  </strong>

                </div>

              </div>


              <div className="overview-divider"></div>


              {/* TOTAL AMOUNT */}

              <div className="overview-item">

                <div className="overview-item-icon active">

                  <CheckCircle size={21} />

                </div>


                <div className="overview-item-info">

                  <span>
                    Total Amount
                  </span>


                  <strong>

                    ₹
                    {totalPaymentAmount.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }
                    )}

                  </strong>

                </div>

              </div>


            </div>

          </section>

        )}


        {/* ===================================================
            EMPTY PRODUCT MESSAGE
        =================================================== */}

        {totalProducts === 0 && !error && (

          <section className="supplier-empty-state">


            <div className="empty-state-icon">

              <Package size={34} />

            </div>


            <h3>
              No Products Yet
            </h3>


            <p>

              You haven't added any products to your
              supplier catalog yet.

            </p>


            <button
              type="button"
              onClick={goToAddProduct}
              className="empty-add-product-btn"
            >

              <PackagePlus size={17} />

              Add Your First Product

            </button>


          </section>

        )}


      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="supplier-footer">

        <span>
          © 2026 PROCURA Supplier Portal
        </span>

        <span>
          Supplier Management System
        </span>

      </footer>


    </div>

  );

};


export default SupplierDashboard;
