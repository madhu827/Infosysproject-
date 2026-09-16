
import React, { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
  Copy,
  Check,
  Eye,
  EyeOff
} from "lucide-react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import api from "../api/client";

import "../css/manager/Payments.css";


/* ============================================================
   PROCUREX
   MANAGER PAYMENT PAGE

   PAYMENT DATA SENT TO BACKEND

   PhonePe:
   POST /payment/{requestId}

   {
      requestId,
      managerId,
      amount,
      paymentMethod: "PHONEPE",
      paymentType: "PHONEPE"
   }


   QR:
   POST /payment/{requestId}

   {
      requestId,
      managerId,
      amount,
      paymentMethod: "QR",
      paymentType: "QR"
   }
   ============================================================ */


export default function Payment() {

  const navigate = useNavigate();
  const location = useLocation();


  /* ============================================================
     PAYMENT REQUEST
     ============================================================ */

  const paymentRequest =
    location.state?.paymentRequest || null;


  /* ============================================================
     PRODUCT
     ============================================================ */

  const [product, setProduct] = useState(null);

  const [loadingProduct, setLoadingProduct] =
    useState(false);


  /* ============================================================
     PAYMENT METHOD
     ============================================================ */

  const [paymentMethod, setPaymentMethod] =
    useState("PHONEPE");


  /* ============================================================
     PIN
     ============================================================ */

  const [showPinPopup, setShowPinPopup] =
    useState(false);

  const [pin, setPin] =
    useState("");

  const [showPin, setShowPin] =
    useState(false);

  const [pinError, setPinError] =
    useState("");

  const [pinVerified, setPinVerified] =
    useState(false);

  const [verifyingPin, setVerifyingPin] =
    useState(false);


  /* ============================================================
     PAYMENT
     ============================================================ */

  const [processing, setProcessing] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);


  /* ============================================================
     OTHER
     ============================================================ */

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);


  /* ============================================================
     FORMAT CURRENCY
     ============================================================ */

  const formatCurrency = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    );

  };


  /* ============================================================
     GET MANAGER ID
     ============================================================ */

  const getManagerId = () => {

    const storedManagerId =
      localStorage.getItem("managerId");

    if (!storedManagerId) {
      return null;
    }

    const managerId =
      Number(storedManagerId);

    if (!managerId || managerId <= 0) {
      return null;
    }

    return managerId;

  };


  /* ============================================================
     GET REQUEST ID
     ============================================================ */

  const getRequestId = () => {

    const requestId =
      Number(paymentRequest?.requestId);

    if (!requestId || requestId <= 0) {
      return null;
    }

    return requestId;

  };


  /* ============================================================
     TOTAL PRICE / AMOUNT
     ============================================================ */

  const getTotalPrice = (
    request = paymentRequest,
    productData = product
  ) => {

    if (!request) {
      return 0;
    }


    /* ==========================================================
       FIRST: USE EXISTING TOTAL AMOUNT FROM REQUEST
       ========================================================== */

    const existingTotal =
      request.totalPrice ??
      request.totalprice ??
      request.Totalprice ??
      request.total_price ??
      request.totalAmount ??
      request.amount;


    if (
      existingTotal !== undefined &&
      existingTotal !== null &&
      existingTotal !== "" &&
      Number(existingTotal) > 0
    ) {

      return Number(existingTotal);

    }


    /* ==========================================================
       OTHERWISE CALCULATE:

       product price × quantity
       ========================================================== */

    const productPrice =
      productData?.product_price ??
      productData?.productPrice ??
      productData?.price ??
      request.productPrice ??
      request.price ??
      0;


    const quantity =
      request.quantity ??
      request.productQuantity ??
      0;


    return (
      Number(productPrice) *
      Number(quantity)
    );

  };


  /* ============================================================
     GET PAYMENT AMOUNT
     ============================================================ */

  const getPaymentAmount = () => {

    const amount =
      Number(
        getTotalPrice(
          paymentRequest,
          product
        )
      );

    if (!amount || amount <= 0) {
      return null;
    }

    return amount;

  };


  /* ============================================================
     PRODUCT PRICE
     ============================================================ */

  const getProductPrice = () => {

    return Number(
      product?.product_price ??
      product?.productPrice ??
      product?.price ??
      paymentRequest?.productPrice ??
      paymentRequest?.price ??
      0
    );

  };


  /* ============================================================
     PRODUCT NAME
     ============================================================ */

  const getProductName = () => {

    return (
      product?.productName ||
      product?.name ||
      paymentRequest?.productName ||
      "Product"
    );

  };


  /* ============================================================
     PRODUCT IMAGE
     ============================================================ */

  const getProductImage = () => {

    return (
      product?.imageUrl ||
      product?.imageURL ||
      product?.image ||
      product?.productImage ||
      paymentRequest?.imageUrl ||
      paymentRequest?.imageURL ||
      null
    );

  };


  /* ============================================================
     LOAD PRODUCT
     ============================================================ */

  useEffect(() => {

    const loadProduct = async () => {

      const requestId =
        getRequestId();


      if (!requestId) {

        setError(
          "Request ID is missing."
        );

        return;

      }


      try {

        setLoadingProduct(true);

        setError("");


        const response =
          await api.get(
            `/raiserequest/${requestId}/product`,
            {
              withCredentials: true
            }
          );


        console.log(
          "Product response:",
          response.data
        );


        const responseData =
          response.data?.data ||
          response.data?.product ||
          response.data;


        if (!responseData) {

          setError(
            "Product information could not be retrieved."
          );

          return;

        }


        setProduct(responseData);

      } catch (err) {

        console.error(
          "Failed to retrieve product:",
          err
        );


        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error;


        setError(
          backendMessage ||
          "Unable to retrieve product information."
        );

      } finally {

        setLoadingProduct(false);

      }

    };


    loadProduct();

  }, [paymentRequest?.requestId]);


  /* ============================================================
     CHECK REQUEST
     ============================================================ */

  useEffect(() => {

    if (!paymentRequest) {

      setError(
        "No approved purchase request was selected for payment."
      );

    }

  }, [paymentRequest]);


  /* ============================================================
     BACK
     ============================================================ */

  const goBack = () => {

    navigate("/manager/requests");

  };


  /* ============================================================
     COPY REFERENCE
     ============================================================ */

  const copyReference = async () => {

    const requestId =
      getRequestId();


    if (!requestId) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        `PR-${requestId}`
      );


      setCopied(true);


      setTimeout(() => {

        setCopied(false);

      }, 2000);

    } catch (err) {

      console.error(
        "Copy failed:",
        err
      );

    }

  };


  /* ============================================================
     VALIDATE PAYMENT REQUEST
     ============================================================ */

  const validatePaymentRequest = () => {

    const requestId =
      getRequestId();


    if (!requestId) {

      setError(
        "Invalid request ID."
      );

      return false;

    }


    const managerId =
      getManagerId();


    if (!managerId) {

      setError(
        "Manager ID not found. Please login again."
      );

      return false;

    }


    if (
      paymentRequest.status &&
      paymentRequest.status !== "APPROVED"
    ) {

      setError(
        "Only approved requests can be paid."
      );

      return false;

    }


    const amount =
      getPaymentAmount();


    if (
      !amount ||
      amount <= 0
    ) {

      setError(
        "Invalid payment amount."
      );

      return false;

    }


    return true;

  };


  /* ============================================================
     OPEN PIN POPUP
     ============================================================ */

  const openPinPopup = () => {

    if (!validatePaymentRequest()) {
      return;
    }


    setError("");

    setPin("");

    setPinError("");

    setShowPin(false);

    setShowPinPopup(true);

  };


  /* ============================================================
     CLOSE PIN POPUP
     ============================================================ */

  const closePinPopup = () => {

    if (
      verifyingPin ||
      processing
    ) {

      return;

    }


    setShowPinPopup(false);

    setPin("");

    setPinError("");

    setShowPin(false);

  };


  /* ============================================================
     COMPLETE QR PAYMENT

     REQUEST BODY:

     {
        requestId: 10,
        managerId: 2,
        amount: 50000,
        paymentMethod: "QR",
        paymentType: "QR"
     }
     ============================================================ */

  const completeQrPayment = async () => {

    if (processing) {
      return;
    }


    const requestId =
      getRequestId();


    if (!requestId) {

      setError(
        "Invalid request ID."
      );

      return;

    }


    const managerId =
      getManagerId();


    if (!managerId) {

      setError(
        "Manager ID not found. Please login again."
      );

      return;

    }


    const amount =
      getPaymentAmount();


    if (
      !amount ||
      amount <= 0
    ) {

      setError(
        "Invalid payment amount."
      );

      return;

    }


    try {

      setProcessing(true);

      setError("");


      /* ========================================================
         QR PAYMENT DATA

         ALL REQUIRED VALUES ARE SENT HERE
         ======================================================== */

      const paymentData = {

        requestId: requestId,

        managerId: managerId,

        amount: amount,

        paymentMethod: "QR",

        paymentType: "QR"

      };


      console.log(
        "===================================="
      );

      console.log(
        "QR PAYMENT"
      );

      console.log(
        "REQUEST ID:",
        requestId
      );

      console.log(
        "MANAGER ID:",
        managerId
      );

      console.log(
        "AMOUNT:",
        amount
      );

      console.log(
        "PAYMENT METHOD:",
        "QR"
      );

      console.log(
        "PAYMENT TYPE:",
        "QR"
      );

      console.log(
        "COMPLETE PAYMENT DATA:",
        paymentData
      );

      console.log(
        "===================================="
      );


      /* ========================================================
         POST PAYMENT
         ======================================================== */

      const response =
        await api.post(
          `/payment/${requestId}`,
          paymentData,
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json"
            }

          }
        );


      console.log(
        "QR payment response:",
        response.data
      );


      /* ========================================================
         PAYMENT SUCCESS
         ======================================================== */

      if (
        response.status >= 200 &&
        response.status < 300
      ) {

        setPaymentSuccess(true);

        return;

      }


      setError(
        response.data?.message ||
        "QR payment could not be completed."
      );


    } catch (err) {

      console.error(
        "QR payment failed:",
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
          "Invalid QR payment details."
        );

      } else if (
        err.response?.status === 401
      ) {

        setError(
          backendMessage ||
          "You are not authorized to make this payment."
        );

      } else if (
        err.response?.status === 404
      ) {

        setError(
          backendMessage ||
          "Purchase request not found."
        );

      } else if (
        err.response?.status === 409
      ) {

        setError(
          backendMessage ||
          "Payment has already been completed."
        );

      } else {

        setError(
          backendMessage ||
          "QR payment could not be completed. Please try again."
        );

      }

    } finally {

      setProcessing(false);

    }

  };


  /* ============================================================
     COMPLETE PHONEPE PAYMENT

     REQUEST BODY:

     {
        requestId: 10,
        managerId: 2,
        amount: 50000,
        paymentMethod: "PHONEPE",
        paymentType: "PHONEPE"
     }
     ============================================================ */

  const completePhonePePayment = async () => {

    if (processing) {
      return;
    }


    const requestId =
      getRequestId();


    if (!requestId) {

      setError(
        "Invalid request ID."
      );

      return;

    }


    const managerId =
      getManagerId();


    if (!managerId) {

      setError(
        "Manager ID not found. Please login again."
      );

      return;

    }


    const amount =
      getPaymentAmount();


    if (
      !amount ||
      amount <= 0
    ) {

      setError(
        "Invalid payment amount."
      );

      return;

    }


    if (!pinVerified) {

      setError(
        "Please verify your PIN before completing payment."
      );

      return;

    }


    try {

      setProcessing(true);

      setError("");


      /* ========================================================
         PHONEPE PAYMENT DATA

         ALL REQUIRED VALUES ARE SENT HERE
         ======================================================== */

      const paymentData = {

        requestId: requestId,

        managerId: managerId,

        amount: amount,

        paymentMethod: "PHONEPE",

        paymentType: "PHONEPE"

      };


      console.log(
        "===================================="
      );

      console.log(
        "PHONEPE PAYMENT"
      );

      console.log(
        "REQUEST ID:",
        requestId
      );

      console.log(
        "MANAGER ID:",
        managerId
      );

      console.log(
        "AMOUNT:",
        amount
      );

      console.log(
        "PAYMENT METHOD:",
        "PHONEPE"
      );

      console.log(
        "PAYMENT TYPE:",
        "PHONEPE"
      );

      console.log(
        "COMPLETE PAYMENT DATA:",
        paymentData
      );

      console.log(
        "===================================="
      );


      /* ========================================================
         POST PAYMENT
         ======================================================== */

      const response =
        await api.post(
          `/payment/${requestId}`,
          paymentData,
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json"
            }

          }
        );


      console.log(
        "PhonePe payment response:",
        response.data
      );


      /* ========================================================
         PAYMENT SUCCESS
         ======================================================== */

      if (
        response.status >= 200 &&
        response.status < 300
      ) {

        setPaymentSuccess(true);

        return;

      }


      setError(
        response.data?.message ||
        "Payment could not be completed."
      );


    } catch (err) {

      console.error(
        "PhonePe payment failed:",
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
          "Invalid payment details."
        );

      } else if (
        err.response?.status === 401
      ) {

        setError(
          backendMessage ||
          "You are not authorized to make this payment."
        );

      } else if (
        err.response?.status === 404
      ) {

        setError(
          backendMessage ||
          "Purchase request not found."
        );

      } else if (
        err.response?.status === 409
      ) {

        setError(
          backendMessage ||
          "Payment has already been completed."
        );

      } else {

        setError(
          backendMessage ||
          "Payment could not be completed. Please try again."
        );

      }

    } finally {

      setProcessing(false);

    }

  };


  /* ============================================================
     VERIFY MANAGER PIN
     ============================================================ */

  const verifyPin = async () => {

    setPinError("");

    setError("");


    /* ============================================================
       PIN VALIDATION
       ============================================================ */

    if (!pin) {

      setPinError(
        "Please enter your 4-digit PIN."
      );

      return;

    }


    if (!/^\d{4}$/.test(pin)) {

      setPinError(
        "PIN must contain exactly 4 digits."
      );

      return;

    }


    /* ============================================================
       MANAGER ID
       ============================================================ */

    const managerId =
      getManagerId();


    if (!managerId) {

      setPinError(
        "Manager ID not found. Please login again."
      );

      return;

    }


    try {

      setVerifyingPin(true);


      /* ========================================================
         VERIFY PIN
         ======================================================== */

      const response =
        await api.post(
          "/manager/verify-pin",
          {
            managerId: managerId,
            pin: pin
          },
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json"
            }

          }
        );


      console.log(
        "PIN verification response:",
        response.data
      );


      /* ========================================================
         PIN VERIFIED
         ======================================================== */

      if (
        response.data?.success === true
      ) {


        /* ======================================================
           QR FLOW

           PIN verified
                ↓
           close popup
                ↓
           complete QR payment
                ↓
           send requestId
           send managerId
           send amount
           send paymentMethod
           send paymentType
                ↓
           success
           ====================================================== */

        if (
          paymentMethod === "QR"
        ) {

          setShowPinPopup(false);

          setPin("");

          setPinError("");

          setShowPin(false);


          await completeQrPayment();


          return;

        }


        /* ======================================================
           PHONEPE FLOW

           PIN verified
                ↓
           show confirmation card
                ↓
           Payment Done
                ↓
           completePhonePePayment()
           ====================================================== */

        setPinVerified(true);

        setShowPinPopup(false);

        setPin("");

        setPinError("");

        setShowPin(false);


        return;

      }


      setPinError(
        response.data?.message ||
        "Incorrect PIN. Please try again."
      );


    } catch (err) {

      console.error(
        "PIN verification failed:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      if (
        err.response?.status === 401
      ) {

        setPinError(
          backendMessage ||
          "Incorrect PIN. Please try again."
        );

      } else if (
        err.response?.status === 404
      ) {

        setPinError(
          backendMessage ||
          "Manager not found."
        );

      } else {

        setPinError(
          backendMessage ||
          "Unable to verify PIN. Please try again."
        );

      }

    } finally {

      setVerifyingPin(false);

    }

  };


  /* ============================================================
     PAYMENT DONE BUTTON
     ============================================================ */

  const completePayment = () => {

    if (
      paymentMethod === "PHONEPE"
    ) {

      completePhonePePayment();

    }

  };


  /* ============================================================
     SUCCESS SCREEN
     ============================================================ */

  if (paymentSuccess) {

    return (

      <div className="phonepe-payment-page">

        <header className="payment-topbar">

          <div className="payment-brand">

            <div className="payment-brand-mark">
              P
            </div>

            <div>

              <strong>
                PROCUREX
              </strong>

              <span>
                PROCUREMENT
              </span>

            </div>

          </div>


          <div className="payment-security">

            <Lock size={14} />

            <span>
              Secure Manager Payment
            </span>

          </div>

        </header>


        <main className="payment-main">

          <div className="payment-success-container">

            <div className="success-icon">

              <CheckCircle2 size={58} />

            </div>


            <span className="success-eyebrow">

              PAYMENT DONE SUCCESSFULLY

            </span>


            <h1>

              Payment successful

            </h1>


            <p>

              The payment has been successfully
              completed and recorded in the
              PROCUREX payment system.

            </p>


            <div className="success-payment-card">

              <div>

                <span>
                  Request
                </span>

                <strong>
                  PR-{getRequestId()}
                </strong>

              </div>


              <div>

                <span>
                  Manager ID
                </span>

                <strong>
                  {getManagerId() || "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Product
                </span>

                <strong>
                  {getProductName()}
                </strong>

              </div>


              <div>

                <span>
                  Amount
                </span>

                <strong className="success-amount">

                  {formatCurrency(
                    getPaymentAmount()
                  )}

                </strong>

              </div>


              <div>

                <span>
                  Payment Method
                </span>

                <strong>

                  {paymentMethod === "PHONEPE"
                    ? "PhonePe"
                    : "UPI QR"}

                </strong>

              </div>

            </div>


            <div className="supplier-notification">

              <ShieldCheck size={18} />

              <span>

                Payment has been saved successfully
                in the Payment entity.

              </span>

            </div>


            <button
              type="button"
              className="gold-button"
              onClick={() =>
                navigate("/manager/requests")
              }
            >

              <ArrowLeft size={17} />

              Back to requests

            </button>


          </div>

        </main>

      </div>

    );

  }


  /* ============================================================
     MAIN PAGE
     ============================================================ */

  return (

    <div className="phonepe-payment-page">


      {/* ========================================================
          TOP BAR
          ======================================================== */}

      <header className="payment-topbar">

        <div className="payment-brand">

          <div className="payment-brand-mark">
            P
          </div>

          <div>

            <strong>
              PROCUREX
            </strong>

            <span>
              PROCUREMENT
            </span>

          </div>

        </div>


        <div className="payment-security">

          <Lock size={14} />

          <span>
            Secure Manager Payment
          </span>

        </div>

      </header>


      {/* ========================================================
          MAIN
          ======================================================== */}

      <main className="payment-main">


        <button
          type="button"
          className="payment-back-button"
          onClick={goBack}
        >

          <ArrowLeft size={17} />

          Back to requests

        </button>


        <section className="payment-heading">

          <div>

            <span className="payment-heading-eyebrow">

              MANAGER PAYMENT

            </span>


            <h1>
              Complete payment
            </h1>


            <p>

              Make the payment securely using
              PhonePe or scan the QR code.

            </p>

          </div>


          <div className="secure-payment-pill">

            <ShieldCheck size={16} />

            Secure payment

          </div>

        </section>


        {/* ======================================================
            ERROR
            ====================================================== */}

        {error && (

          <div className="payment-error">

            <div className="payment-error-icon">

              <X size={18} />

            </div>


            <div>

              <strong>
                Payment error
              </strong>

              <span>
                {error}
              </span>

            </div>

          </div>

        )}


        {/* ======================================================
            PAYMENT METHOD CARD
            ====================================================== */}

        {!pinVerified && (

          <section className="payment-method-card">


            <div className="payment-card-header">

              <div>

                <span className="card-eyebrow">

                  PAYMENT METHOD

                </span>


                <h2>

                  Pay securely

                </h2>


                <p>

                  Select your preferred UPI
                  payment method.

                </p>

              </div>


              <div className="phonepe-badge">

                <Smartphone size={15} />

                UPI PAYMENT

              </div>

            </div>


            {/* ==================================================
                PAYMENT METHOD SELECTOR
                ================================================== */}

            <div className="payment-method-selector">


              {/* =================================================
                  PHONEPE
                  ================================================= */}

              <button
                type="button"
                className={
                  paymentMethod === "PHONEPE"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("PHONEPE")
                }
                disabled={processing}
              >

                <div className="method-icon">

                  <Smartphone size={22} />

                </div>


                <div className="method-content">

                  <strong>
                    PhonePe
                  </strong>

                  <span>
                    Pay securely using PhonePe
                  </span>

                </div>


                <div className="method-radio">

                  {paymentMethod === "PHONEPE" && (
                    <span />
                  )}

                </div>

              </button>


              {/* =================================================
                  QR
                  ================================================= */}

              <button
                type="button"
                className={
                  paymentMethod === "QR"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("QR")
                }
                disabled={processing}
              >

                <div className="method-icon">

                  <QrCode size={22} />

                </div>


                <div className="method-content">

                  <strong>
                    Scan QR Code
                  </strong>

                  <span>
                    Scan using PhonePe or another UPI app
                  </span>

                </div>


                <div className="method-radio">

                  {paymentMethod === "QR" && (
                    <span />
                  )}

                </div>

              </button>


            </div>


            {/* ==================================================
                PHONEPE SECTION
                ================================================== */}

            {paymentMethod === "PHONEPE" && (

              <div className="phonepe-payment-section">

                <div className="phonepe-logo-large">

                  <Smartphone size={38} />

                </div>


                <h3>
                  Pay with PhonePe
                </h3>


                <p>

                  Continue to PhonePe and
                  authorize the payment securely.

                </p>


                <div className="phonepe-instruction">


                  <div className="instruction-item">

                    <span>
                      1
                    </span>

                    <div>

                      <strong>
                        Open PhonePe
                      </strong>

                      <p>
                        Launch the PhonePe app.
                      </p>

                    </div>

                  </div>


                  <div className="instruction-item">

                    <span>
                      2
                    </span>

                    <div>

                      <strong>
                        Confirm payment
                      </strong>

                      <p>
                        Verify the amount in PhonePe.
                      </p>

                    </div>

                  </div>


                  <div className="instruction-item">

                    <span>
                      3
                    </span>

                    <div>

                      <strong>
                        Authorize payment
                      </strong>

                      <p>
                        Complete authorization in PhonePe.
                      </p>

                    </div>

                  </div>


                </div>


                <button
                  type="button"
                  className="phonepe-continue-button"
                  onClick={openPinPopup}
                  disabled={
                    loadingProduct ||
                    processing
                  }
                >

                  <Smartphone size={18} />

                  Continue with PhonePe

                </button>

              </div>

            )}


            {/* ==================================================
                QR SECTION
                ================================================== */}

            {paymentMethod === "QR" && (

              <div className="qr-payment-section">


                <div className="qr-header">

                  <div>

                    <h3>
                      Scan to pay
                    </h3>

                    <p>

                      Scan the QR code using
                      PhonePe or another UPI app.

                    </p>

                  </div>

                </div>


                {/* =================================================
                    QR CODE
                    ================================================= */}

                <div className="qr-wrapper">

                  <div className="qr-code">

                    <div className="qr-pattern">


                      <div className="qr-corner top-left">

                        <span />

                      </div>


                      <div className="qr-corner top-right">

                        <span />

                      </div>


                      <div className="qr-corner bottom-left">

                        <span />

                      </div>


                      <div className="qr-random">

                        {Array
                          .from({ length: 81 })
                          .map((_, index) => (

                            <i
                              key={index}
                              className={
                                index % 3 === 0 ||
                                index % 5 === 0 ||
                                index % 7 === 0
                                  ? "filled"
                                  : ""
                              }
                            />

                          ))}

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    QR AMOUNT
                    ================================================= */}

                <div className="qr-amount">

                  <span>
                    Amount to pay
                  </span>

                  <strong>

                    {formatCurrency(
                      getPaymentAmount()
                    )}

                  </strong>

                </div>


                {/* =================================================
                    REFERENCE
                    ================================================= */}

                <div className="upi-reference">

                  <div>

                    <span>
                      Payment reference
                    </span>

                    <strong>

                      PR-{getRequestId()}

                    </strong>

                  </div>


                  <button
                    type="button"
                    onClick={copyReference}
                    disabled={processing}
                  >

                    {copied ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}

                    {copied
                      ? "Copied"
                      : "Copy"}

                  </button>

                </div>


                {/* =================================================
                    QR PAYMENT BUTTON
                    ================================================= */}

                <button
                  type="button"
                  className="qr-continue-button"
                  onClick={openPinPopup}
                  disabled={
                    loadingProduct ||
                    processing
                  }
                >

                  {processing ? (

                    <>

                      <span className="button-spinner" />

                      Processing payment...

                    </>

                  ) : (

                    <>

                      <QrCode size={18} />

                      Payment

                    </>

                  )}

                </button>


              </div>

            )}


            <div className="payment-security-note">

              <ShieldCheck size={17} />

              <span>

                Payment authorization is required
                before completing the payment.

              </span>

            </div>


          </section>

        )}


        {/* ======================================================
            PHONEPE PURCHASE REQUEST CARD
            ====================================================== */}

        {pinVerified &&
          paymentMethod === "PHONEPE" && (

          <section className="purchase-request-card">


            <div className="purchase-card-header">

              <div>

                <span>
                  APPROVED PURCHASE REQUEST
                </span>

                <h2>
                  Payment confirmation
                </h2>

              </div>


              <div className="approved-badge">

                <CheckCircle2 size={15} />

                APPROVED

              </div>

            </div>


            <div className="purchase-product">


              <div className="purchase-product-image">


                {loadingProduct ? (

                  <div className="product-image-placeholder">

                    <span className="button-spinner" />

                  </div>

                ) : getProductImage() ? (

                  <img
                    src={getProductImage()}
                    alt={getProductName()}
                    onError={(e) => {

                      e.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="product-image-placeholder">

                    <CreditCard size={38} />

                  </div>

                )}


              </div>


              <div className="purchase-product-details">

                <span className="product-label">
                  PRODUCT
                </span>


                <h3>
                  {getProductName()}
                </h3>


                <div className="product-price">

                  {formatCurrency(
                    getProductPrice()
                  )}

                  <span>
                    / unit
                  </span>

                </div>

              </div>


            </div>


            <div className="purchase-divider" />


            <div className="purchase-details-grid">


              <div className="purchase-detail">

                <span>
                  Request ID
                </span>

                <strong>
                  PR-{getRequestId()}
                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Manager ID
                </span>

                <strong>
                  {getManagerId() || "N/A"}
                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Requester
                </span>

                <strong>
                  {paymentRequest?.userName || "User"}
                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Department
                </span>

                <strong>
                  {paymentRequest?.department || "Department"}
                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Quantity
                </span>

                <strong>
                  {paymentRequest?.quantity || 0}
                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Unit price
                </span>

                <strong>

                  {formatCurrency(
                    getProductPrice()
                  )}

                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Payment amount
                </span>

                <strong>

                  {formatCurrency(
                    getPaymentAmount()
                  )}

                </strong>

              </div>


              <div className="purchase-detail">

                <span>
                  Payment method
                </span>

                <strong>
                  PhonePe
                </strong>

              </div>


            </div>


            <div className="purchase-divider" />


            <div className="purchase-total-row">

              <div>

                <span>
                  TOTAL PAYABLE
                </span>

                <small>
                  Approved purchase amount
                </small>

              </div>


              <strong>

                {formatCurrency(
                  getPaymentAmount()
                )}

              </strong>

            </div>


            <div className="pin-verified-message">

              <CheckCircle2 size={18} />

              <div>

                <strong>
                  Payment authorization verified
                </strong>

                <span>

                  The purchase request is ready
                  for final payment confirmation.

                </span>

              </div>

            </div>


            <button
              type="button"
              className="card-payment-done-button"
              onClick={completePayment}
              disabled={
                processing ||
                loadingProduct
              }
            >

              {processing ? (

                <>

                  <span className="button-spinner" />

                  Processing payment...

                </>

              ) : (

                <>

                  <CheckCircle2 size={19} />

                  Payment done

                </>

              )}

            </button>


            <p className="card-payment-disclaimer">

              By clicking "Payment Done", you confirm
              that the approved payment has been completed.

            </p>


          </section>

        )}


        {/* ======================================================
            FOOTER
            ====================================================== */}

        <footer className="payment-footer">

          <span>
            © 2026 PROCUREX
          </span>

          <span>
            Secure Procurement Payment
          </span>


          <div>

            <span>

              <Lock size={12} />

              Secure

            </span>


            <span>

              <ShieldCheck size={12} />

              Verified

            </span>

          </div>

        </footer>


      </main>


      {/* ========================================================
          PIN MODAL
          ======================================================== */}

      {showPinPopup && (

        <div
          className="pin-modal-overlay"
          onClick={closePinPopup}
        >

          <div
            className="pin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <div className="pin-modal-header">

              <div className="pin-modal-icon">

                <Lock size={24} />

              </div>


              <button
                type="button"
                className="pin-close-button"
                onClick={closePinPopup}
                disabled={
                  verifyingPin ||
                  processing
                }
              >

                <X size={18} />

              </button>

            </div>


            <span className="pin-modal-eyebrow">

              PAYMENT AUTHORIZATION

            </span>


            <h2>
              Enter payment PIN
            </h2>


            <p>

              Verify your payment authorization
              to continue.

            </p>


            <div className="pin-input-wrapper">

              <Lock size={17} />


              <input
                type={
                  showPin
                    ? "text"
                    : "password"
                }
                value={pin}
                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4);

                  setPin(value);

                  setPinError("");

                }}
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter" &&
                    !verifyingPin
                  ) {

                    verifyPin();

                  }

                }}
                placeholder="••••"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                disabled={
                  verifyingPin ||
                  processing
                }
              />


              <button
                type="button"
                className="pin-eye-button"
                onClick={() =>
                  setShowPin(!showPin)
                }
                disabled={
                  verifyingPin ||
                  processing
                }
              >

                {showPin ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}

              </button>


            </div>


            {pinError && (

              <div className="pin-error">

                <X size={15} />

                {pinError}

              </div>

            )}


            <button
              type="button"
              className="verify-pin-button"
              onClick={verifyPin}
              disabled={
                verifyingPin ||
                processing
              }
            >

              {verifyingPin ? (

                <>

                  <span className="button-spinner" />

                  {paymentMethod === "QR"
                    ? "Verifying & completing payment..."
                    : "Verifying PIN..."}

                </>

              ) : (

                <>

                  <Lock size={17} />

                  Verify PIN

                </>

              )}

            </button>


            <button
              type="button"
              className="cancel-pin-button"
              onClick={closePinPopup}
              disabled={
                verifyingPin ||
                processing
              }
            >

              Cancel

            </button>


            <small className="pin-security-text">

              Your PIN is verified securely
              by the PROCUREX backend.

            </small>


          </div>

        </div>

      )}


    </div>

  );

}
