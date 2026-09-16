
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  Send,
  IndianRupee,
  Calculator
} from "lucide-react";

import api from "../../api/client";

import "../../css/pages/user/createRequest.css";


export default function CreateRequest() {

  const location = useLocation();
  const navigate = useNavigate();


  /* ============================================================
     PRODUCT FROM USER DASHBOARD
  ============================================================ */

  const product = location.state?.product;


  /* ============================================================
     ONLY USER INPUT
  ============================================================ */

  const [quantity, setQuantity] = useState("");


  /* ============================================================
     UI STATES
  ============================================================ */

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");


  /* ============================================================
     PRODUCT PRICE
  ============================================================ */

  const productPrice =
    Number(product?.product_price) || 0;


  /* ============================================================
     TOTAL PRICE
     
     Total Price = Product Price × Quantity
  ============================================================ */

  const totalPrice =
    quantity !== "" && Number(quantity) > 0
      ? productPrice * Number(quantity)
      : 0;


  /* ============================================================
     FORMAT PRICE
  ============================================================ */

  const formatPrice = (price) => {

    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);

  };


  /* ============================================================
     SUBMIT REQUEST
  ============================================================ */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");


    /* ----------------------------------------------------------
       CHECK PRODUCT
    ---------------------------------------------------------- */

    if (!product) {

      setMessage(
        "Product information is missing. Please select a product from the dashboard."
      );

      return;

    }


    /* ----------------------------------------------------------
       CHECK QUANTITY
    ---------------------------------------------------------- */

    if (
      quantity === "" ||
      Number(quantity) <= 0
    ) {

      setMessage(
        "Please enter a valid quantity."
      );

      return;

    }


    /* ----------------------------------------------------------
       CHECK INTEGER
    ---------------------------------------------------------- */

    if (
      !Number.isInteger(
        Number(quantity)
      )
    ) {

      setMessage(
        "Quantity must be a whole number."
      );

      return;

    }


    /* ----------------------------------------------------------
       USER ID
    ---------------------------------------------------------- */

    const storedUserId =
      localStorage.getItem("userId");


    if (!storedUserId) {

      setMessage(
        "User session not found. Please login again."
      );

      return;

    }


    /* ----------------------------------------------------------
       REQUEST DATA
       
       Only these values are sent:
       
       productId
       quantity
       userId
       
       Backend should calculate the final amount again.
    ---------------------------------------------------------- */

    const requestData = {

      productId:
        Number(product.productId),

      quantity:
        Number(quantity),

      userId:
        Number(storedUserId)

    };


    console.log(
      "Sending purchase request:",
      requestData
    );

    console.log(
      "Calculated total price:",
      totalPrice
    );


    try {

      setLoading(true);


      /* ========================================================
         CREATE PURCHASE REQUEST
      ======================================================== */

      const response =
        await api.post(
          "/raiserequest",
          requestData,
          {
            withCredentials: true
          }
        );


      console.log(
        "Raise request response:",
        response.data
      );


      /* --------------------------------------------------------
         SUCCESS
      -------------------------------------------------------- */

      setMessage(
        "Purchase request raised successfully!"
      );

      setQuantity("");


      /* --------------------------------------------------------
         GO TO MY REQUESTS
      -------------------------------------------------------- */

      setTimeout(() => {

        navigate(
          "/user/requests"
        );

      }, 1500);


    } catch (error) {

      console.error(
        "Raise request error:",
        error
      );


      /* --------------------------------------------------------
         401 / 403
      -------------------------------------------------------- */

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        setMessage(
          "You are not authenticated. Please login again."
        );

        return;

      }


      /* --------------------------------------------------------
         BACKEND ERROR
      -------------------------------------------------------- */

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;


      setMessage(
        backendMessage ||
        "Failed to raise request. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ============================================================
     NO PRODUCT SELECTED
  ============================================================ */

  if (!product) {

    return (

      <div className="raise-request-page">

        <div className="raise-error-card">

          <Package size={45} />

          <h2>
            No Product Selected
          </h2>

          <p>
            Please go to the User Dashboard
            and select a product first.
          </p>

          <button
            type="button"
            className="back-dashboard-button"
            onClick={() =>
              navigate(
                "/user/dashboard"
              )
            }
          >

            <ArrowLeft size={18} />

            Back to Dashboard

          </button>

        </div>

      </div>

    );

  }


  /* ============================================================
     RAISE REQUEST PAGE
  ============================================================ */

  return (

    <div className="raise-request-page">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="raise-request-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              "/user/dashboard"
            )
          }
        >

          <ArrowLeft size={18} />

          Back

        </button>


        <div>

          <span className="raise-eyebrow">
            PROCUREMENT REQUEST
          </span>

          <h1>
            Raise Purchase Request
          </h1>

          <p>
            Enter the quantity required for
            the selected product.
          </p>

        </div>

      </div>


      {/* ========================================================
          REQUEST CARD
      ======================================================== */}

      <div className="raise-request-card">


        {/* ======================================================
            SELECTED PRODUCT
        ====================================================== */}

        <div className="selected-product">


          {/* PRODUCT IMAGE */}

          <div className="product-image">

            {product.imageUrl ? (

              <img
                src={product.imageUrl}
                alt={
                  product.productName ||
                  "Selected product"
                }
              />

            ) : (

              <Package size={45} />

            )}

          </div>


          {/* PRODUCT INFORMATION */}

          <div className="product-information">

            <span>
              SELECTED PRODUCT
            </span>


            <h2>
              {product.productName}
            </h2>


            {product.description && (

              <p>
                {product.description}
              </p>

            )}


            {/* PRICE */}

            <div className="product-price">

              <IndianRupee size={17} />

              <strong>
                {formatPrice(productPrice)}
              </strong>

              <small>
                per unit
              </small>

            </div>

          </div>

        </div>


        {/* ======================================================
            REQUEST FORM
        ====================================================== */}

        <form
          className="raise-request-form"
          onSubmit={handleSubmit}
        >


          {/* ====================================================
              QUANTITY
          ==================================================== */}

          <div className="form-group">

            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value
                )
              }
              placeholder="Enter quantity"
              required
            />

            <small>
              Enter the number of units you need.
            </small>

          </div>


          {/* ====================================================
              PRICE CALCULATION
          ==================================================== */}

          <div className="price-calculation">

            <div className="calculation-header">

              <div className="calculation-icon">
                <Calculator size={18} />
              </div>

              <div>

                <span>
                  REQUEST SUMMARY
                </span>

                <strong>
                  Estimated Purchase Cost
                </strong>

              </div>

            </div>


            <div className="calculation-row">

              <span>
                Unit Price
              </span>

              <strong>
                ₹ {formatPrice(productPrice)}
              </strong>

            </div>


            <div className="calculation-row">

              <span>
                Quantity
              </span>

              <strong>
                {quantity || 0}
              </strong>

            </div>


            <div className="calculation-divider"></div>


            <div className="calculation-total">

              <span>
                Total Price
              </span>

              <strong>
                <IndianRupee size={19} />
                {formatPrice(totalPrice)}
              </strong>

            </div>

          </div>


          {/* ====================================================
              MESSAGE
          ==================================================== */}

          {message && (

            <div
              className={
                message.includes(
                  "successfully"
                )
                  ? "success-message"
                  : "error-message"
              }
            >

              {message}

            </div>

          )}


          {/* ====================================================
              SUBMIT BUTTON
          ==================================================== */}

          <button
            type="submit"
            className="submit-request-button"
            disabled={loading}
          >

            <Send size={18} />

            {loading
              ? "Submitting..."
              : "Raise Request"
            }

          </button>


        </form>

      </div>

    </div>

  );

}
