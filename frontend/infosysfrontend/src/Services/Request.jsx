import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ShoppingCart,
  Search,
  CheckCircle,
  XCircle,
  Truck,
  MapPin
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Requests() {

  const BASE_URL = "http://localhost:8081";


  // ==========================================
  // REQUEST LIST
  // ==========================================

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");


  // ==========================================
  // ORDER FORM
  // ==========================================

  const [userId, setUserId] = useState("");

  const [productName, setProductName] = useState("");

  const [quantity, setQuantity] = useState("");

  const [departmentId, setDepartmentId] = useState("");


  // ==========================================
  // TRACKING FORM
  // ==========================================

  const [trackingRequestId, setTrackingRequestId] =
    useState("");

  const [orderStatus, setOrderStatus] =
    useState("");

  const [location, setLocation] =
    useState("");


  // ==========================================
  // GET ALL REQUESTS
  //
  // GET
  // http://localhost:8081/request
  // ==========================================

  const getAllRequests = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await axios.get(
        `${BASE_URL}/request`
      );

      setRequests(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Failed to load requests"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CREATE PRODUCT REQUEST
  //
  // POST
  // http://localhost:8081/request/order
  // ==========================================

  const createRequest = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      setMessage("");


      const requestData = {

        userId: Number(userId),

        productName: productName,

        quantity: Number(quantity),

        departmentId: Number(departmentId)

      };


      const response = await axios.post(

        `${BASE_URL}/request/order`,

        requestData

      );


      console.log(
        "Request created:",
        response.data
      );


      setMessage(
        `Request created successfully. Request ID: ${response.data.requestId}`
      );


      // Clear form

      setUserId("");

      setProductName("");

      setQuantity("");

      setDepartmentId("");


      // Reload requests

      getAllRequests();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to create request"

      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UPDATE REQUEST STATUS
  //
  // PUT
  // /request/{requestId}/status
  // ==========================================

  const updateRequestStatus = async (
    requestId,
    status
  ) => {

    try {

      setError("");

      setMessage("");


      await axios.put(

        `${BASE_URL}/request/${requestId}/status`,

        null,

        {
          params: {
            status: status
          }
        }

      );


      setMessage(

        `Request ${requestId} updated to ${status}`

      );


      getAllRequests();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to update request status"

      );

    }

  };


  // ==========================================
  // UPDATE TRACKING
  //
  // PUT
  // /request/{requestId}/tracking
  // ==========================================

  const updateTracking = async (e) => {

    e.preventDefault();

    try {

      setError("");

      setMessage("");


      const trackingData = {

        status: orderStatus,

        location: location

      };


      await axios.put(

        `${BASE_URL}/request/${trackingRequestId}/tracking`,

        trackingData

      );


      setMessage(
        "Order tracking updated successfully"
      );


      setTrackingRequestId("");

      setOrderStatus("");

      setLocation("");


      getAllRequests();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to update tracking"

      );

    }

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRequests =
    requests.filter((request) => {

      const product =
        request.productName
          ?.toLowerCase()
          || "";

      const id =
        String(
          request.requestId
        );


      return (

        product.includes(
          search.toLowerCase()
        )

        ||

        id.includes(search)

      );

    });


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    getAllRequests();

  }, []);


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      <div className="p-6">


        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold">

            Purchase Request Management

          </h1>

          <p className="text-gray-500">

            Manage product requests, approvals and order tracking

          </p>

        </div>


        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (

          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">

            {message}

          </div>

        )}


        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

            {error}

          </div>

        )}


        {/* ======================================
            CREATE REQUEST
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="bg-blue-100 p-3 rounded-lg">

              <ShoppingCart
                size={24}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold">

                Create Product Request

              </h2>

              <p className="text-gray-500">

                Request products from available inventory

              </p>

            </div>

          </div>


          <form onSubmit={createRequest}>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


              {/* USER ID */}

              <div>

                <label className="block mb-2 font-medium">

                  User ID

                </label>

                <input

                  type="number"

                  value={userId}

                  onChange={(e) =>
                    setUserId(e.target.value)
                  }

                  placeholder="User ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PRODUCT */}

              <div>

                <label className="block mb-2 font-medium">

                  Product Name

                </label>

                <input

                  type="text"

                  value={productName}

                  onChange={(e) =>
                    setProductName(
                      e.target.value
                    )
                  }

                  placeholder="Product name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* QUANTITY */}

              <div>

                <label className="block mb-2 font-medium">

                  Quantity

                </label>

                <input

                  type="number"

                  min="1"

                  value={quantity}

                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }

                  placeholder="Quantity"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* DEPARTMENT */}

              <div>

                <label className="block mb-2 font-medium">

                  Department ID

                </label>

                <input

                  type="number"

                  value={departmentId}

                  onChange={(e) =>
                    setDepartmentId(
                      e.target.value
                    )
                  }

                  placeholder="Department ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>

            </div>


            <button

              type="submit"

              disabled={loading}

              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"

            >

              <ShoppingCart size={18} />

              {loading
                ? "Submitting..."
                : "Submit Request"
              }

            </button>

          </form>

        </div>


        {/* ======================================
            TRACKING
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="bg-purple-100 p-3 rounded-lg">

              <Truck
                size={24}
                className="text-purple-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold">

                Update Order Tracking

              </h2>

              <p className="text-gray-500">

                Update the delivery status and location

              </p>

            </div>

          </div>


          <form onSubmit={updateTracking}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              {/* REQUEST ID */}

              <div>

                <label className="block mb-2 font-medium">

                  Request ID

                </label>

                <input

                  type="number"

                  value={trackingRequestId}

                  onChange={(e) =>
                    setTrackingRequestId(
                      e.target.value
                    )
                  }

                  placeholder="Request ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* STATUS */}

              <div>

                <label className="block mb-2 font-medium">

                  Order Status

                </label>

                <select

                  value={orderStatus}

                  onChange={(e) =>
                    setOrderStatus(
                      e.target.value
                    )
                  }

                  className="w-full border rounded-lg px-4 py-3"

                  required

                >

                  <option value="">

                    Select status

                  </option>

                  <option value="PROCESSING">

                    PROCESSING

                  </option>

                  <option value="DISPATCHED">

                    DISPATCHED

                  </option>

                  <option value="IN_TRANSIT">

                    IN TRANSIT

                  </option>

                  <option value="DELIVERED">

                    DELIVERED

                  </option>

                </select>

              </div>


              {/* LOCATION */}

              <div>

                <label className="block mb-2 font-medium">

                  Current Location

                </label>

                <input

                  type="text"

                  value={location}

                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }

                  placeholder="Current location"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>

            </div>


            <button

              type="submit"

              className="mt-5 bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"

            >

              <MapPin size={18} />

              Update Tracking

            </button>

          </form>

        </div>


        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="relative">

            <Search

              size={20}

              className="absolute left-3 top-3 text-gray-400"

            />

            <input

              type="text"

              placeholder="Search by request ID or product name..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full border rounded-lg pl-10 pr-4 py-3"

            />

          </div>

        </div>


        {/* ======================================
            REQUEST TABLE
        ====================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">

              Loading requests...

            </div>

          ) : filteredRequests.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No requests found.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Request ID
                    </th>

                    <th className="p-4 text-left">
                      User ID
                    </th>

                    <th className="p-4 text-left">
                      Product
                    </th>

                    <th className="p-4 text-left">
                      Department
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Quantity
                    </th>

                    <th className="p-4 text-left">
                      Total
                    </th>

                    <th className="p-4 text-center">
                      Approval
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRequests.map(
                    (request) => (

                      <tr

                        key={
                          request.requestId
                        }

                        className="border-t hover:bg-gray-50"

                      >

                        <td className="p-4 font-medium">

                          {
                            request.requestId
                          }

                        </td>


                        <td className="p-4">

                          {
                            request.userId
                          }

                        </td>


                        <td className="p-4 font-medium">

                          {
                            request.productName
                          }

                        </td>


                        <td className="p-4">

                          {
                            request.departmentId
                          }

                        </td>


                        <td className="p-4">

                          ₹{
                            request.productPrice
                          }

                        </td>


                        <td className="p-4">

                          {
                            request.quantity
                          }

                        </td>


                        <td className="p-4 font-semibold">

                          ₹{
                            request.totalPrice
                          }

                        </td>


                        {/* APPROVAL */}

                        <td className="p-4">

                          <div className="flex justify-center gap-2">


                            {/* APPROVE */}

                            <button

                              onClick={() =>
                                updateRequestStatus(
                                  request.requestId,
                                  "APPROVED"
                                )
                              }

                              className="bg-green-100 text-green-700 p-2 rounded-lg"

                              title="Approve"

                            >

                              <CheckCircle
                                size={18}
                              />

                            </button>


                            {/* REJECT */}

                            <button

                              onClick={() =>
                                updateRequestStatus(
                                  request.requestId,
                                  "REJECTED"
                                )
                              }

                              className="bg-red-100 text-red-700 p-2 rounded-lg"

                              title="Reject"

                            >

                              <XCircle
                                size={18}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );
}