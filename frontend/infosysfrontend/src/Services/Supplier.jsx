import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Building2
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Suppliers() {

  const BASE_URL = "http://localhost:8081";

  // ==========================================
  // STATES
  // ==========================================

  const [suppliers, setSuppliers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productType, setProductType] = useState("");
  const [email, setEmail] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // GET ALL SUPPLIERS
  //
  // GET /supplier
  // ==========================================

  const getAllSuppliers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}/supplier`
      );

      setSuppliers(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Failed to load suppliers"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // GET SUPPLIER BY ID
  //
  // GET /supplier/{id}
  // ==========================================

  const getSupplierById = async (id) => {

    try {

      const response = await axios.get(
        `${BASE_URL}/supplier/${id}`
      );

      console.log(
        "Supplier:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Supplier not found"
      );

    }
  };


  // ==========================================
  // ADD SUPPLIER
  //
  // POST /supplier
  // ==========================================

  const addSupplier = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const supplier = {

        name: name,

        phone: phone,

        address: address,

        productType: productType,

        email: email,

        gst_number: gstNumber,

        rating: rating
          ? Number(rating)
          : null,

        feedback: feedback,

        status: status,

        product: productId
          ? {
              product_id: Number(productId)
            }
          : null

      };


      await axios.post(

        `${BASE_URL}/supplier`,

        supplier

      );


      alert(
        "Supplier added successfully"
      );


      clearForm();

      getAllSuppliers();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to add supplier"

      );

    }

  };


  // ==========================================
  // UPDATE SUPPLIER
  //
  // PUT /supplier/{id}
  // ==========================================

  const updateSupplier = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const supplier = {

        name: name,

        phone: phone,

        address: address,

        productType: productType,

        email: email,

        gst_number: gstNumber,

        rating: rating
          ? Number(rating)
          : null,

        feedback: feedback,

        status: status,

        product: productId
          ? {
              product_id: Number(productId)
            }
          : null

      };


      await axios.put(

        `${BASE_URL}/supplier/${editingId}`,

        supplier

      );


      alert(
        "Supplier updated successfully"
      );


      clearForm();

      getAllSuppliers();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to update supplier"

      );

    }

  };


  // ==========================================
  // DELETE SUPPLIER
  //
  // DELETE /supplier/{id}
  // ==========================================

  const deleteSupplier = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this supplier?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      setError("");

      await axios.delete(

        `${BASE_URL}/supplier/${id}`

      );


      alert(
        "Supplier deleted successfully"
      );


      getAllSuppliers();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to delete supplier"

      );

    }

  };


  // ==========================================
  // FIND SUPPLIER BY PRODUCT TYPE
  //
  // GET
  // /supplier/product-type/{productType}
  // ==========================================

  const searchByProductType = async () => {

    if (!productType) {

      getAllSuppliers();

      return;

    }


    try {

      setLoading(true);

      setError("");


      const response = await axios.get(

        `${BASE_URL}/supplier/product-type/${productType}`

      );


      // Backend returns Optional<Supplier>

      if (response.data) {

        setSuppliers([response.data]);

      } else {

        setSuppliers([]);

      }

    } catch (error) {

      console.error(error);

      setError(
        "Supplier not found for this product type"
      );

      setSuppliers([]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // EDIT SUPPLIER
  // ==========================================

  const editSupplier = (supplier) => {

    setEditingId(
      supplier.supplier_id
    );


    setName(
      supplier.name || ""
    );

    setPhone(
      supplier.phone || ""
    );

    setAddress(
      supplier.address || ""
    );

    setProductType(
      supplier.productType || ""
    );

    setEmail(
      supplier.email || ""
    );

    setGstNumber(
      supplier.gst_number || ""
    );

    setRating(
      supplier.rating ?? ""
    );

    setFeedback(
      supplier.feedback || ""
    );

    setStatus(
      supplier.status || ""
    );

    setProductId(
      supplier.product?.product_id || ""
    );

  };


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {

    setEditingId(null);

    setName("");

    setPhone("");

    setAddress("");

    setProductType("");

    setEmail("");

    setGstNumber("");

    setRating("");

    setFeedback("");

    setStatus("");

    setProductId("");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredSuppliers =
    suppliers.filter((supplier) => {

      const supplierName =
        supplier.name
          ?.toLowerCase() || "";

      const supplierEmail =
        supplier.email
          ?.toLowerCase() || "";

      const type =
        supplier.productType
          ?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();


      return (

        supplierName.includes(searchText) ||

        supplierEmail.includes(searchText) ||

        type.includes(searchText)

      );

    });


  // ==========================================
  // LOAD SUPPLIERS
  // ==========================================

  useEffect(() => {

    getAllSuppliers();

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

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 p-3 rounded-xl">

              <Building2
                size={28}
                className="text-blue-600"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold">

                Supplier Management

              </h1>

              <p className="text-gray-500">

                Manage suppliers and their product information

              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-5">

            {error}

          </div>

        )}


        {/* ======================================
            ADD / UPDATE SUPPLIER
        ====================================== */}

        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-5">

            {editingId
              ? "Update Supplier"
              : "Add Supplier"
            }

          </h2>


          <form

            onSubmit={
              editingId
                ? updateSupplier
                : addSupplier
            }

          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* NAME */}

              <div>

                <label className="block mb-2 font-medium">

                  Supplier Name

                </label>

                <input

                  type="text"

                  value={name}

                  onChange={(e) =>
                    setName(e.target.value)
                  }

                  placeholder="Enter supplier name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PHONE */}

              <div>

                <label className="block mb-2 font-medium">

                  Phone

                </label>

                <input

                  type="text"

                  value={phone}

                  onChange={(e) =>
                    setPhone(e.target.value)
                  }

                  placeholder="Enter phone number"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="block mb-2 font-medium">

                  Email

                </label>

                <input

                  type="email"

                  value={email}

                  onChange={(e) =>
                    setEmail(e.target.value)
                  }

                  placeholder="supplier@example.com"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PRODUCT TYPE */}

              <div>

                <label className="block mb-2 font-medium">

                  Product Type

                </label>

                <input

                  type="text"

                  value={productType}

                  onChange={(e) =>
                    setProductType(
                      e.target.value
                    )
                  }

                  placeholder="Example: Electronics"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* GST */}

              <div>

                <label className="block mb-2 font-medium">

                  GST Number

                </label>

                <input

                  type="text"

                  value={gstNumber}

                  onChange={(e) =>
                    setGstNumber(
                      e.target.value
                    )
                  }

                  placeholder="GST number"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* RATING */}

              <div>

                <label className="block mb-2 font-medium">

                  Rating

                </label>

                <input

                  type="number"

                  min="0"

                  max="5"

                  step="0.1"

                  value={rating}

                  onChange={(e) =>
                    setRating(
                      e.target.value
                    )
                  }

                  placeholder="0 - 5"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* STATUS */}

              <div>

                <label className="block mb-2 font-medium">

                  Status

                </label>

                <select

                  value={status}

                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }

                  className="w-full border rounded-lg px-4 py-3"

                >

                  <option value="">

                    Select Status

                  </option>

                  <option value="ACTIVE">

                    ACTIVE

                  </option>

                  <option value="INACTIVE">

                    INACTIVE

                  </option>

                </select>

              </div>


              {/* PRODUCT ID */}

              <div>

                <label className="block mb-2 font-medium">

                  Product ID

                </label>

                <input

                  type="number"

                  value={productId}

                  onChange={(e) =>
                    setProductId(
                      e.target.value
                    )
                  }

                  placeholder="Enter product ID"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label className="block mb-2 font-medium">

                  Address

                </label>

                <textarea

                  value={address}

                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }

                  placeholder="Enter supplier address"

                  rows="3"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* FEEDBACK */}

              <div className="md:col-span-3">

                <label className="block mb-2 font-medium">

                  Feedback

                </label>

                <textarea

                  value={feedback}

                  onChange={(e) =>
                    setFeedback(
                      e.target.value
                    )
                  }

                  placeholder="Enter feedback"

                  rows="3"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>

            </div>


            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              <button

                type="submit"

                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"

              >

                {editingId ? (

                  <>

                    <Pencil size={18} />

                    Update Supplier

                  </>

                ) : (

                  <>

                    <Plus size={18} />

                    Add Supplier

                  </>

                )}

              </button>


              {editingId && (

                <button

                  type="button"

                  onClick={clearForm}

                  className="bg-gray-300 px-6 py-3 rounded-lg flex items-center gap-2"

                >

                  <X size={18} />

                  Cancel

                </button>

              )}

            </div>

          </form>

        </div>


        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">

              <Search

                size={20}

                className="absolute left-3 top-3 text-gray-400"

              />

              <input

                type="text"

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

                placeholder="Search supplier..."

                className="w-full border rounded-lg pl-10 pr-4 py-3"

              />

            </div>


            <button

              onClick={searchByProductType}

              className="bg-gray-800 text-white px-6 py-3 rounded-lg"

            >

              Search Product Type

            </button>


            <button

              onClick={getAllSuppliers}

              className="bg-gray-200 px-6 py-3 rounded-lg"

            >

              Reset

            </button>

          </div>

        </div>


        {/* ======================================
            TABLE
        ====================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">

              Loading suppliers...

            </div>

          ) : filteredSuppliers.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No suppliers found.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      ID
                    </th>

                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Phone
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-left">
                      Product Type
                    </th>

                    <th className="p-4 text-left">
                      GST
                    </th>

                    <th className="p-4 text-left">
                      Rating
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredSuppliers.map(

                    (supplier) => (

                      <tr

                        key={
                          supplier.supplier_id
                        }

                        className="border-t hover:bg-gray-50"

                      >

                        <td className="p-4">

                          {
                            supplier.supplier_id
                          }

                        </td>


                        <td className="p-4 font-medium">

                          {
                            supplier.name
                          }

                        </td>


                        <td className="p-4">

                          {
                            supplier.phone
                          }

                        </td>


                        <td className="p-4">

                          {
                            supplier.email
                          }

                        </td>


                        <td className="p-4">

                          {
                            supplier.productType
                          }

                        </td>


                        <td className="p-4">

                          {
                            supplier.gst_number
                            || "N/A"
                          }

                        </td>


                        <td className="p-4">

                          ⭐ {
                            supplier.rating
                            ?? "N/A"
                          }

                        </td>


                        <td className="p-4">

                          <span className="px-3 py-1 rounded-full bg-gray-100">

                            {
                              supplier.status
                              || "N/A"
                            }

                          </span>

                        </td>


                        <td className="p-4">

                          <div className="flex justify-center gap-3">


                            {/* EDIT */}

                            <button

                              onClick={() =>
                                editSupplier(
                                  supplier
                                )
                              }

                              className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"

                            >

                              <Pencil size={18} />

                            </button>


                            {/* DELETE */}

                            <button

                              onClick={() =>
                                deleteSupplier(
                                  supplier.supplier_id
                                )
                              }

                              className="text-red-600 p-2 hover:bg-red-50 rounded-lg"

                            >

                              <Trash2 size={18} />

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