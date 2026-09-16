import React, { useState } from "react";
import axios from "axios";

import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  IndianRupee
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Payments() {

  // ==========================================
  // BACKEND URL
  // ==========================================

  const BASE_URL = "http://localhost:8081";


  // ==========================================
  // CREATE PAYMENT STATES
  // ==========================================

  const [requestId, setRequestId] = useState("");

  const [cardHolderName, setCardHolderName] = useState("");

  const [cardNumber, setCardNumber] = useState("");

  const [expiryDate, setExpiryDate] = useState("");

  const [cvv, setCvv] = useState("");


  // ==========================================
  // VERIFY PAYMENT STATES
  // ==========================================

  const [transactionId, setTransactionId] = useState("");


  // ==========================================
  // APPROVE PAYMENT STATES
  // ==========================================

  const [paymentId, setPaymentId] = useState("");


  // ==========================================
  // COMMON STATES
  // ==========================================

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [payment, setPayment] = useState(null);


  // ==========================================
  // CLEAR MESSAGES
  // ==========================================

  const clearMessages = () => {

    setMessage("");

    setError("");

  };


  // ==========================================
  // CREATE PAYMENT
  //
  // POST
  // /payment/{requestId}
  // ==========================================

  const createPayment = async (e) => {

    e.preventDefault();

    clearMessages();

    try {

      setLoading(true);


      const paymentData = {

        cardHolderName: cardHolderName,

        cardNumber: cardNumber,

        expiryDate: expiryDate,

        cvv: cvv

      };


      const response = await axios.post(

        `${BASE_URL}/payment/${requestId}`,

        paymentData

      );


      setPayment(response.data);


      setMessage(
        "Payment created successfully"
      );


      // Clear form

      setRequestId("");

      setCardHolderName("");

      setCardNumber("");

      setExpiryDate("");

      setCvv("");


      console.log(
        "Payment:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to create payment"

      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VERIFY PAYMENT
  //
  // PUT / GET depending on your controller
  //
  // Assumed:
  // PUT /payment/verify/{transactionId}
  // ==========================================

  const verifyPayment = async (e) => {

    e.preventDefault();

    clearMessages();

    try {

      setLoading(true);


      const response = await axios.put(

        `${BASE_URL}/payment/verify/${transactionId}`

      );


      setPayment(response.data);


      setMessage(
        "Payment verified successfully"
      );


      setTransactionId("");


      console.log(
        "Verified Payment:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to verify payment"

      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // APPROVE PAYMENT
  //
  // PUT
  // /payment/approve/{id}
  // ==========================================

  const approvePayment = async (e) => {

    e.preventDefault();

    clearMessages();

    try {

      setLoading(true);


      const response = await axios.put(

        `${BASE_URL}/payment/approve/${paymentId}`

      );


      setPayment(response.data);


      setMessage(
        "Payment approved successfully"
      );


      setPaymentId("");


      console.log(
        "Approved Payment:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to approve payment"

      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <DashboardLayout>

      <div className="p-6">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            Payment Management

          </h1>

          <p className="text-gray-500 mt-1">

            Securely create, verify and approve payments

          </p>

        </div>


        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (

          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">

            <CheckCircle2 size={20} />

            {message}

          </div>

        )}


        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">

            {error}

          </div>

        )}


        {/* ======================================
            CREATE PAYMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-blue-100 p-3 rounded-xl">

              <CreditCard
                className="text-blue-600"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold">

                Create Payment

              </h2>

              <p className="text-gray-500">

                Enter payment details for an approved request

              </p>

            </div>

          </div>


          <form onSubmit={createPayment}>


            {/* REQUEST ID */}

            <div className="mb-5">

              <label className="block font-medium mb-2">

                Purchase Request ID

              </label>

              <input

                type="number"

                value={requestId}

                onChange={(e) =>
                  setRequestId(e.target.value)
                }

                placeholder="Enter approved request ID"

                className="w-full border rounded-lg px-4 py-3"

                required

              />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


              {/* CARD HOLDER */}

              <div>

                <label className="block font-medium mb-2">

                  Card Holder Name

                </label>

                <input

                  type="text"

                  value={cardHolderName}

                  onChange={(e) =>
                    setCardHolderName(
                      e.target.value
                    )
                  }

                  placeholder="Enter card holder name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* CARD NUMBER */}

              <div>

                <label className="block font-medium mb-2">

                  Card Number

                </label>

                <input

                  type="text"

                  value={cardNumber}

                  onChange={(e) =>
                    setCardNumber(
                      e.target.value
                    )
                  }

                  placeholder="1234 5678 9012 3456"

                  maxLength="19"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* EXPIRY */}

              <div>

                <label className="block font-medium mb-2">

                  Expiry Date

                </label>

                <input

                  type="text"

                  value={expiryDate}

                  onChange={(e) =>
                    setExpiryDate(
                      e.target.value
                    )
                  }

                  placeholder="MM/YY"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* CVV */}

              <div>

                <label className="block font-medium mb-2">

                  CVV

                </label>

                <input

                  type="password"

                  value={cvv}

                  onChange={(e) =>
                    setCvv(e.target.value)
                  }

                  placeholder="***"

                  maxLength="4"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>

            </div>


            {/* SECURITY MESSAGE */}

            <div className="bg-gray-50 rounded-lg p-4 mt-5 flex items-center gap-3">

              <Lock
                size={20}
                className="text-green-600"
              />

              <span className="text-sm text-gray-600">

                Your payment information is securely processed by the backend.

              </span>

            </div>


            {/* BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"

            >

              <CreditCard size={20} />

              {loading
                ? "Processing..."
                : "Create Payment"
              }

            </button>

          </form>

        </div>


        {/* ======================================
            VERIFY PAYMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-green-100 p-3 rounded-xl">

              <ShieldCheck
                className="text-green-600"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold">

                Verify Payment

              </h2>

              <p className="text-gray-500">

                Verify a payment using its transaction ID

              </p>

            </div>

          </div>


          <form onSubmit={verifyPayment}>

            <div className="flex flex-col md:flex-row gap-4">

              <input

                type="text"

                value={transactionId}

                onChange={(e) =>
                  setTransactionId(
                    e.target.value
                  )
                }

                placeholder="Example: PAY-123456"

                className="flex-1 border rounded-lg px-4 py-3"

                required

              />


              <button

                type="submit"

                disabled={loading}

                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"

              >

                <ShieldCheck size={20} />

                Verify Payment

              </button>

            </div>

          </form>

        </div>


        {/* ======================================
            APPROVE PAYMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-purple-100 p-3 rounded-xl">

              <CheckCircle2
                className="text-purple-600"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold">

                Approve Payment

              </h2>

              <p className="text-gray-500">

                Approve a payment using the payment ID

              </p>

            </div>

          </div>


          <form onSubmit={approvePayment}>

            <div className="flex flex-col md:flex-row gap-4">

              <input

                type="number"

                value={paymentId}

                onChange={(e) =>
                  setPaymentId(e.target.value)
                }

                placeholder="Enter payment ID"

                className="flex-1 border rounded-lg px-4 py-3"

                required

              />


              <button

                type="submit"

                disabled={loading}

                className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"

              >

                <CheckCircle2 size={20} />

                Approve Payment

              </button>

            </div>

          </form>

        </div>


        {/* ======================================
            PAYMENT RESPONSE
        ====================================== */}

        {payment && (

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

              Payment Details

            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <div className="bg-gray-50 p-4 rounded-lg">

                <p className="text-sm text-gray-500">

                  Payment ID

                </p>

                <p className="font-semibold">

                  {payment.paymentId}

                </p>

              </div>


              <div className="bg-gray-50 p-4 rounded-lg">

                <p className="text-sm text-gray-500">

                  Transaction ID

                </p>

                <p className="font-semibold">

                  {payment.transactionId}

                </p>

              </div>


              <div className="bg-gray-50 p-4 rounded-lg">

                <p className="text-sm text-gray-500">

                  Amount

                </p>

                <p className="font-semibold flex items-center">

                  <IndianRupee size={16} />

                  {payment.amount}

                </p>

              </div>


              <div className="bg-gray-50 p-4 rounded-lg">

                <p className="text-sm text-gray-500">

                  Payment Status

                </p>

                <p className="font-semibold">

                  {payment.paymentStatus}

                </p>

              </div>


              <div className="bg-gray-50 p-4 rounded-lg">

                <p className="text-sm text-gray-500">

                  Verified

                </p>

                <p className="font-semibold">

                  {payment.verified
                    ? "YES"
                    : "NO"
                  }

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );
}