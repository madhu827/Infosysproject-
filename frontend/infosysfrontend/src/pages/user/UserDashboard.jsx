
import React, {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import axios from "axios";

import {
  LayoutDashboard,
  ShoppingBag,
  FilePlus2,
  FileText,
  Menu,
  X,
  ChevronDown,
  Download,
  RefreshCw,
  Package,
  IndianRupee,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import "../../css/pages/user/UserDashboard.css";


export default function UserDashboard() {

  const { user } = useAuth();


  // ============================================================
  // MOBILE MENU
  // ============================================================

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  // ============================================================
  // PRODUCT STATES
  // ============================================================

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");


  // ============================================================
  // REQUEST STATES
  // ============================================================

  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loadingRequests,
    setLoadingRequests,
  ] = useState(true);

  const [
    requestError,
    setRequestError,
  ] = useState("");


  // ============================================================
  // USER NAME
  // ============================================================

  const userName =
    user?.user_name ||
    user?.name ||
    user?.userName ||
    "User";


  // ============================================================
  // USER ID
  // ============================================================

  const userId =
    user?.user_id ||
    user?.userId ||
    user?.id;


  // ============================================================
  // API BASE URL
  // ============================================================

  const API_BASE_URL =
    "http://localhost:8081";


  // ============================================================
  // REQUEST API URL
  // ============================================================

  const REQUESTS_API_URL =
    `${API_BASE_URL}/raiserequest`;


  // ============================================================
  // USER INITIALS
  // ============================================================

  const getInitials = () => {

    const words =
      userName
        .trim()
        .split(/\s+/);


    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  };


  // ============================================================
  // NAVIGATION ITEMS
  // ============================================================

  const navItems = [

    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Raise Request",
      path: "/user/createRequest",
      icon: FilePlus2,
      highlight: true,
    },

    {
      name: "MyRequest",
      path: "/user/requests",
      icon: FileText,
    },

  ];


  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = async () => {

    try {

      setLoadingProducts(true);

      setProductError("");


      const response =
        await axios.get(
          `${API_BASE_URL}/product`,
          {
            withCredentials: true,
          }
        );


      console.log(
        "Products received from backend:",
        response.data
      );


      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!Array.isArray(response.data)) {

        console.error(
          "Expected product array but received:",
          response.data
        );


        setProducts([]);

        setProductError(
          "Invalid product data received from server."
        );

        return;

      }


      // ========================================================
      // FORMAT PRODUCTS
      // ========================================================

      const formattedProducts =
        response.data.map(
          (product) => {

            return {

              productId:
                product.productId,

              productName:
                product.productName || "",

              product_price:
                product.product_price ?? 0,

              description:
                product.description || "",

              imageUrl:
                product.imageUrl || null,

            };

          }
        );


      console.log(
        "Formatted products:",
        formattedProducts
      );


      setProducts(
        formattedProducts
      );

    }


    catch (error) {

      console.error(
        "Error fetching products:",
        error
      );


      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );


        setProductError(
          error.response.data?.message ||
          "Unable to retrieve products from server."
        );

      }


      else if (error.request) {

        setProductError(
          "Unable to connect to the backend server."
        );

      }


      else {

        setProductError(
          "Something went wrong while loading products."
        );

      }


      setProducts([]);

    }


    finally {

      setLoadingProducts(false);

    }

  };


  // ============================================================
  // GET REQUEST STATUS
  // ============================================================

  const getRequestStatus = (request) => {

    return (

      request?.status ||

      request?.requestStatus ||

      request?.request_status ||

      request?.approvalStatus ||

      request?.approval_status ||

      ""

    )
      .toString()
      .trim()
      .toUpperCase();

  };


  // ============================================================
  // FETCH REQUESTS
  // ============================================================

  const fetchRequests = async () => {

    try {

      setLoadingRequests(true);

      setRequestError("");


      console.log(
        "Fetching request data from:",
        REQUESTS_API_URL
      );


      const response =
        await axios.get(
          REQUESTS_API_URL,
          {
            withCredentials: true,
          }
        );


      console.log(
        "Raise Request API response:",
        response.data
      );


      let requestList = [];


      // ========================================================
      // RESPONSE IS DIRECT ARRAY
      // ========================================================

      if (
        Array.isArray(
          response.data
        )
      ) {

        requestList =
          response.data;

      }


      // ========================================================
      // RESPONSE: { requests: [...] }
      // ========================================================

      else if (
        response.data &&
        Array.isArray(
          response.data.requests
        )
      ) {

        requestList =
          response.data.requests;

      }


      // ========================================================
      // RESPONSE: { data: [...] }
      // ========================================================

      else if (
        response.data &&
        Array.isArray(
          response.data.data
        )
      ) {

        requestList =
          response.data.data;

      }


      // ========================================================
      // RESPONSE: { content: [...] }
      // ========================================================

      else if (
        response.data &&
        Array.isArray(
          response.data.content
        )
      ) {

        requestList =
          response.data.content;

      }


      // ========================================================
      // INVALID RESPONSE
      // ========================================================

      else {

        console.error(
          "Unexpected /raiserequest response:",
          response.data
        );


        setRequests([]);

        setRequestError(
          "Invalid request data received from server."
        );

        return;

      }


      // ========================================================
      // NORMALIZE REQUEST DATA
      // ========================================================

      const formattedRequests =
        requestList.map(
          (request) => {

            const status =
              getRequestStatus(
                request
              );


            return {

              ...request,

              status:
                status,

            };

          }
        );


      // ========================================================
      // DEBUG
      // ========================================================

      console.log(
        "All requests received:",
        formattedRequests
      );


      console.log(
        "Request statuses:",
        formattedRequests.map(
          (request) => ({

            requestId:
              request.requestId ||
              request.id ||
              request.purchaseRequestId,

            status:
              request.status,

            userId:
              request.userId ||
              request.user_id,

          })
        )
      );


      // ========================================================
      // SET REQUESTS
      // ========================================================

      setRequests(
        formattedRequests
      );

    }


    catch (error) {

      console.error(
        "Error fetching requests:",
        error
      );


      if (error.response) {

        console.error(
          "Request backend response:",
          error.response.data
        );


        console.error(
          "Request backend status:",
          error.response.status
        );


        setRequestError(
          error.response.data?.message ||
          "Unable to retrieve request information."
        );

      }


      else if (error.request) {

        setRequestError(
          "Unable to connect to the backend server."
        );

      }


      else {

        setRequestError(
          "Something went wrong while loading requests."
        );

      }


      setRequests([]);

    }


    finally {

      setLoadingRequests(false);

    }

  };


  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // ============================================================
  // LOAD REQUESTS
  // ============================================================

  useEffect(() => {

    fetchRequests();

  }, []);


  // ============================================================
  // REJECTED REQUESTS
  // ============================================================

  const rejectedRequests =
    requests.filter(
      (request) => {

        const status =
          getRequestStatus(
            request
          );


        return (

          status === "REJECTED" ||

          status === "REJECT"

        );

      }
    ).length;


  // ============================================================
  // APPROVED REQUESTS
  // ============================================================

  const approvedRequests =
    requests.filter(
      (request) => {

        const status =
          getRequestStatus(
            request
          );


        return (

          status === "APPROVED" ||

          status === "APPROVE"

        );

      }
    ).length;


  // ============================================================
  // DOWNLOAD USER CSV
  // ============================================================

  const downloadCSV = async () => {

    try {

      // ========================================================
      // CHECK USER ID
      // ========================================================

      if (
        userId === undefined ||
        userId === null ||
        userId === ""
      ) {

        console.error(
          "User ID is missing. Cannot download CSV."
        );


        alert(
          "Unable to download CSV. User ID is missing."
        );

        return;

      }


      // ========================================================
      // CREATE USER-SPECIFIC CSV URL
      // ========================================================

      const csvUrl =
        `${API_BASE_URL}/csv/user/${encodeURIComponent(userId)}`;


      console.log(
        "Downloading user CSV for userId:",
        userId
      );


      console.log(
        "CSV API URL:",
        csvUrl
      );


      // ========================================================
      // CALL BACKEND
      // ========================================================

      const response =
        await axios.get(
          csvUrl,
          {
            responseType: "blob",

            withCredentials: true,
          }
        );


      console.log(
        "User CSV response received:",
        response
      );


      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (
        !response.data
      ) {

        throw new Error(
          "Empty CSV response received from server."
        );

      }


      // ========================================================
      // CREATE BLOB
      // ========================================================

      const blob =
        new Blob(
          [response.data],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );


      // ========================================================
      // CREATE DOWNLOAD URL
      // ========================================================

      const url =
        URL.createObjectURL(
          blob
        );


      // ========================================================
      // CREATE DOWNLOAD LINK
      // ========================================================

      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      // ========================================================
      // USER-SPECIFIC FILE NAME
      // ========================================================

      link.download =
        `procurex-user-${userId}.csv`;


      // ========================================================
      // TRIGGER DOWNLOAD
      // ========================================================

      document.body.appendChild(
        link
      );


      link.click();


      // ========================================================
      // CLEANUP
      // ========================================================

      document.body.removeChild(
        link
      );


      URL.revokeObjectURL(
        url
      );


      console.log(
        "User CSV downloaded successfully for userId:",
        userId
      );

    }


    catch (error) {

      console.error(
        "User CSV download failed:",
        error
      );


      // ========================================================
      // BACKEND ERROR
      // ========================================================

      if (error.response) {

        console.error(
          "CSV backend status:",
          error.response.status
        );


        console.error(
          "CSV backend response:",
          error.response.data
        );

      }


      else if (error.request) {

        console.error(
          "CSV request was sent but no response was received:",
          error.request
        );

      }


      else {

        console.error(
          "CSV request configuration error:",
          error.message
        );

      }


      alert(
        "Unable to download user CSV."
      );

    }

  };


  // ============================================================
  // IMAGE ERROR HANDLER
  // ============================================================

  const handleImageError =
    (event, product) => {

      console.error(
        "Product image failed to load:",
        product.imageUrl
      );


      event.currentTarget.style.display =
        "none";


      const container =
        event.currentTarget.parentElement;


      const fallback =
        container.querySelector(
          ".product-no-image"
        );


      if (fallback) {

        fallback.style.display =
          "flex";

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="user-dashboard">


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="user-navbar">

        <div className="user-navbar-container">


          {/* LOGO */}

          <NavLink
            to="/user/dashboard"
            className="user-navbar-logo"
            onClick={() =>
              setMobileOpen(false)
            }
          >

            <div className="logo-mark">

              <ShoppingBag
                size={20}
              />

            </div>


            <div className="logo-content">

              <span className="logo-title">

                Procure
                <span>X</span>

              </span>


              <small>
                PROCUREMENT PORTAL
              </small>

            </div>

          </NavLink>


          {/* ====================================================
              DESKTOP NAVIGATION
          ==================================================== */}

          <nav className="user-nav-links">

            {navItems.map(
              (item) => {

                const Icon =
                  item.icon;


                return (

                  <NavLink
                    key={
                      item.path
                    }

                    to={
                      item.path
                    }

                    className={({
                      isActive,
                    }) => {

                      let classes =
                        "user-nav-link";


                      if (
                        isActive
                      ) {

                        classes +=
                          " active";

                      }


                      if (
                        item.highlight
                      ) {

                        classes +=
                          " raise-request-link";

                      }


                      return classes;

                    }}
                  >

                    <Icon
                      size={17}
                    />


                    <span>
                      {item.name}
                    </span>


                    {item.highlight && (

                      <span className="new-dot">
                        New
                      </span>

                    )}

                  </NavLink>

                );

              }
            )}


            {/* DOWNLOAD CSV */}

            <button
              type="button"
              className="user-nav-link download-csv-link"
              onClick={
                downloadCSV
              }
              title="Download User CSV"
            >

              <Download
                size={17}
              />


              <span>
                Download CSV
              </span>

            </button>

          </nav>


          {/* ====================================================
              RIGHT SIDE
          ==================================================== */}

          <div className="user-navbar-right">

            <div className="navbar-divider" />


            {/* PROFILE */}

            <button
              type="button"
              className="navbar-profile"
            >

              <div className="navbar-avatar">

                {getInitials()}

              </div>


              <div className="navbar-user-info">

                <strong>
                  {userName}
                </strong>


                <span>
                  USER
                </span>

              </div>


              <ChevronDown
                size={15}
              />

            </button>


            {/* MOBILE MENU */}

            <button
              type="button"
              className="mobile-menu-button"

              onClick={() =>
                setMobileOpen(
                  (previous) =>
                    !previous
                )
              }
            >

              {mobileOpen ? (

                <X
                  size={22}
                />

              ) : (

                <Menu
                  size={22}
                />

              )}

            </button>

          </div>

        </div>


        {/* ======================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {mobileOpen && (

          <div className="mobile-nav">

            {navItems.map(
              (item) => {

                const Icon =
                  item.icon;


                return (

                  <NavLink
                    key={
                      item.path
                    }

                    to={
                      item.path
                    }

                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }

                    className={({ isActive }) =>
                      isActive
                        ? "mobile-nav-link active"
                        : "mobile-nav-link"
                    }
                  >

                    <Icon
                      size={18}
                    />


                    <span>
                      {item.name}
                    </span>


                    {item.highlight && (

                      <span className="mobile-new-dot">
                        New
                      </span>

                    )}

                  </NavLink>

                );

              }
            )}


            {/* MOBILE DOWNLOAD CSV */}

            <button
              type="button"
              className="mobile-nav-link mobile-download-csv"

              onClick={() => {

                downloadCSV();

                setMobileOpen(
                  false
                );

              }}
            >

              <Download
                size={18}
              />


              <span>
                Download CSV
              </span>

            </button>

          </div>

        )}

      </header>


      {/* ======================================================
          MAIN DASHBOARD
      ====================================================== */}

      <main className="user-dashboard-content">


        {/* ====================================================
            WELCOME
        ==================================================== */}

        <section className="dashboard-welcome">

          <div className="dashboard-welcome-content">

            <span className="dashboard-eyebrow">
              USER DASHBOARD
            </span>


            <h1>

              Welcome back,

              <span>
                {" "}
                {userName}
              </span>

            </h1>


            <p>

              Manage your procurement activities,
              raise product requests and track your
              requests from one place.

            </p>

          </div>


          <div className="dashboard-quick-action">

            <NavLink
              to="/user/createRequest"
              className="dashboard-primary-button"
            >

              <FilePlus2
                size={18}
              />

              Raise New Request

            </NavLink>

          </div>

        </section>


        {/* ====================================================
            DASHBOARD CARDS
        ==================================================== */}

        <section className="dashboard-cards">


          {/* AVAILABLE PRODUCTS */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">

              <Package
                size={22}
              />

            </div>


            <div className="dashboard-card-content">

              <span>
                Available Products
              </span>


              <strong>

                {loadingProducts
                  ? "..."
                  : products.length}

              </strong>


              <small>
                Products available for requests
              </small>

            </div>

          </div>


          {/* REJECTED REQUESTS */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">

              <FileText
                size={22}
              />

            </div>


            <div className="dashboard-card-content">

              <span>
                Rejected Requests
              </span>


              <strong>

                {loadingRequests
                  ? "..."
                  : rejectedRequests}

              </strong>


              <small>
                Requests rejected by manager
              </small>

            </div>

          </div>


          {/* APPROVED REQUESTS */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">

              <LayoutDashboard
                size={22}
              />

            </div>


            <div className="dashboard-card-content">

              <span>
                Approved
              </span>


              <strong>

                {loadingRequests
                  ? "..."
                  : approvedRequests}

              </strong>


              <small>
                Approved requests
              </small>

            </div>

          </div>

        </section>


        {/* ====================================================
            REQUEST ERROR
        ==================================================== */}

        {!loadingRequests &&
          requestError && (

            <div
              style={{
                marginBottom:
                  "25px",

                padding:
                  "15px 18px",

                borderRadius:
                  "10px",

                border:
                  "1px solid #ead3d3",

                background:
                  "#fff8f8",

                color:
                  "#8f3030",

                fontSize:
                  "13px",
              }}
            >

              {requestError}

            </div>

          )}


        {/* ====================================================
            PRODUCT CATALOG
        ==================================================== */}

        <section className="dashboard-products">

          <div className="dashboard-section-header">

            <div>

              <span className="section-eyebrow">
                PRODUCT CATALOG
              </span>


              <h2>
                Available Products
              </h2>


              <p>
                Products supplied through the
                ProcureX procurement system.
              </p>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={
                fetchProducts
              }
              className="refresh-products-button"
              disabled={
                loadingProducts
              }
            >

              <RefreshCw
                size={17}

                className={
                  loadingProducts
                    ? "refresh-loading"
                    : ""
                }
              />


              Refresh

            </button>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loadingProducts && (

            <div className="products-message">

              <RefreshCw
                size={24}
                className="refresh-loading"
              />


              <p>
                Loading products...
              </p>

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loadingProducts &&
            productError && (

              <div className="products-message error">

                <p>
                  {productError}
                </p>


                <button
                  type="button"
                  onClick={
                    fetchProducts
                  }
                >

                  Try Again

                </button>

              </div>

            )}


          {/* ==================================================
              NO PRODUCTS
          ================================================== */}

          {!loadingProducts &&
            !productError &&
            products.length === 0 && (

              <div className="products-message">

                <Package
                  size={35}
                />


                <h3>
                  No Products Available
                </h3>


                <p>
                  Suppliers have not added any
                  products yet.
                </p>

              </div>

            )}


          {/* ==================================================
              PRODUCTS
          ================================================== */}

          {!loadingProducts &&
            !productError &&
            products.length > 0 && (

              <div className="products-grid">

                {products.map(
                  (product) => (

                    <div
                      className="product-card"
                      key={
                        product.productId
                      }
                    >


                      {/* PRODUCT IMAGE */}

                      <div className="product-image-container">

                        {product.imageUrl ? (

                          <img
                            src={
                              product.imageUrl
                            }

                            alt={
                              product.productName ||
                              "Product"
                            }

                            className="product-image"

                            loading="lazy"

                            onError={(
                              event
                            ) =>
                              handleImageError(
                                event,
                                product
                              )
                            }
                          />

                        ) : null}


                        {/* IMAGE FALLBACK */}

                        <div
                          className="product-no-image"

                          style={{
                            display:
                              product.imageUrl
                                ? "none"
                                : "flex",
                          }}
                        >

                          <Package
                            size={42}
                          />


                          <span>
                            No Image Available
                          </span>

                        </div>

                      </div>


                      {/* PRODUCT DETAILS */}

                      <div className="product-card-content">


                        {/* PRODUCT NAME */}

                        <h3>

                          {
                            product.productName
                          }

                        </h3>


                        {/* DESCRIPTION */}

                        <p className="product-description">

                          {
                            product.description ||
                            "No description available."
                          }

                        </p>


                        {/* PRICE */}

                        <div className="product-price">

                          <IndianRupee
                            size={17}
                          />


                          <strong>

                            {
                              product.product_price ??
                              0
                            }

                          </strong>

                        </div>


                        {/* REQUEST PRODUCT */}

                        <NavLink
                          to="/user/createRequest"

                          state={{
                            product:
                              product,
                          }}

                          className="product-request-button"
                        >

                          <FilePlus2
                            size={17}
                          />

                          Request Product

                        </NavLink>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>


        {/* ====================================================
            QUICK LINKS
        ==================================================== */}

        <section className="dashboard-quick-links">

          <div className="dashboard-section-header">

            <div>

              <span className="section-eyebrow">
                QUICK ACTIONS
              </span>


              <h2>
                Procurement Workspace
              </h2>


              <p>
                Access the most frequently used
                procurement features.
              </p>

            </div>

          </div>


          <div className="quick-links-grid">


            {/* RAISE REQUEST */}

            <NavLink
              to="/user/createRequest"
              className="quick-link-card"
            >

              <div className="quick-link-icon">

                <FilePlus2
                  size={22}
                />

              </div>


              <div>

                <h3>
                  Raise Request
                </h3>


                <p>
                  Create a new purchase request
                  for your department.
                </p>

              </div>

            </NavLink>


            {/* MY REQUESTS */}

            <NavLink
              to="/user/requests"
              className="quick-link-card"
            >

              <div className="quick-link-icon">

                <FileText
                  size={22}
                />

              </div>


              <div>

                <h3>
                  My Requests
                </h3>


                <p>
                  View and track all your
                  submitted requests.
                </p>

              </div>

            </NavLink>

          </div>

        </section>


        {/* ====================================================
            INFORMATION
        ==================================================== */}

        <section className="dashboard-information">

          <div className="information-content">

            <span className="section-eyebrow">
              PROCUREMENT PORTAL
            </span>


            <h2>
              Simplify your procurement workflow.
            </h2>


            <p>
              Raise requests, monitor approvals and
              manage your procurement activities
              through the ProcureX workspace.
            </p>

          </div>


          <div className="information-action">

            <NavLink
              to="/user/createRequest"
              className="dashboard-outline-button"
            >

              Start a Request

            </NavLink>

          </div>

        </section>


      </main>

    </div>

  );

}
