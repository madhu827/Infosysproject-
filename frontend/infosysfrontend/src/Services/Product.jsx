import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Products() {

  const BASE_URL = "http://localhost:8081";

  // ==========================================
  // STATES
  // ==========================================

  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");

  const [productPrice, setProductPrice] = useState("");

  const [productQuantity, setProductQuantity] = useState("");

  const [description, setDescription] = useState("");

  const [requestStatus, setRequestStatus] = useState("");

  const [userId, setUserId] = useState("");

  const [departmentId, setDepartmentId] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // GET ALL PRODUCTS
  //
  // GET
  // http://localhost:8081/product
  // ==========================================

  const getAllProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}/product`
      );

      setProducts(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // GET PRODUCT BY ID
  //
  // GET
  // http://localhost:8081/product/{id}
  // ==========================================

  const getProductById = async (id) => {

    try {

      const response = await axios.get(
        `${BASE_URL}/product/${id}`
      );

      console.log(
        "Product:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Product not found"
      );

    }
  };


  // ==========================================
  // CREATE PRODUCT
  //
  // POST
  // http://localhost:8081/product
  // ==========================================

  const createProduct = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const product = {

        productName: productName,

        product_price: Number(productPrice),

        productQuantity: Number(productQuantity),

        description: description,

        requestStatus: requestStatus,

        user: {

          user_id: Number(userId)

        },

        department: {

          departmentId: Number(departmentId)

        },

        category: {

          category_id: Number(categoryId)

        }

      };


      await axios.post(

        `${BASE_URL}/product`,

        product

      );


      alert(
        "Product created successfully"
      );


      clearForm();

      getAllProducts();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to create product"

      );

    }

  };


  // ==========================================
  // UPDATE PRODUCT
  //
  // PUT
  // http://localhost:8081/product/{id}
  // ==========================================

  const updateProduct = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const product = {

        productName: productName,

        product_price: Number(productPrice),

        productQuantity: Number(productQuantity),

        description: description,

        requestStatus: requestStatus,

        user: {

          user_id: Number(userId)

        },

        department: {

          departmentId: Number(departmentId)

        },

        category: {

          category_id: Number(categoryId)

        }

      };


      await axios.put(

        `${BASE_URL}/product/${editingId}`,

        product

      );


      alert(
        "Product updated successfully"
      );


      clearForm();

      getAllProducts();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to update product"

      );

    }

  };


  // ==========================================
  // DELETE PRODUCT
  //
  // DELETE
  // http://localhost:8081/product/{id}
  // ==========================================

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this product?"

    );


    if (!confirmDelete) {

      return;

    }


    try {

      setError("");

      await axios.delete(

        `${BASE_URL}/product/${id}`

      );


      alert(
        "Product deleted successfully"
      );


      getAllProducts();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to delete product"

      );

    }

  };


  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const editProduct = (product) => {

    setEditingId(
      product.product_id
    );


    setProductName(
      product.productName || ""
    );


    setProductPrice(
      product.product_price || ""
    );


    setProductQuantity(
      product.productQuantity || ""
    );


    setDescription(
      product.description || ""
    );


    setRequestStatus(
      product.requestStatus || ""
    );


    setUserId(
      product.user?.user_id || ""
    );


    setDepartmentId(
      product.department?.departmentId || ""
    );


    setCategoryId(
      product.category?.category_id || ""
    );

  };


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {

    setEditingId(null);

    setProductName("");

    setProductPrice("");

    setProductQuantity("");

    setDescription("");

    setRequestStatus("");

    setUserId("");

    setDepartmentId("");

    setCategoryId("");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts =
    products.filter((product) =>

      product.productName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {

    getAllProducts();

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

            Product Management

          </h1>

          <p className="text-gray-500">

            Manage products in your procurement system

          </p>

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
            ADD / UPDATE PRODUCT
        ====================================== */}

        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-5">

            {editingId
              ? "Update Product"
              : "Add Product"
            }

          </h2>


          <form

            onSubmit={
              editingId
                ? updateProduct
                : createProduct
            }

          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* PRODUCT NAME */}

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

                  placeholder="Enter product name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PRICE */}

              <div>

                <label className="block mb-2 font-medium">

                  Product Price

                </label>

                <input

                  type="number"

                  step="0.01"

                  value={productPrice}

                  onChange={(e) =>
                    setProductPrice(
                      e.target.value
                    )
                  }

                  placeholder="Enter price"

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

                  value={productQuantity}

                  onChange={(e) =>
                    setProductQuantity(
                      e.target.value
                    )
                  }

                  placeholder="Enter quantity"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* USER ID */}

              <div>

                <label className="block mb-2 font-medium">

                  User ID

                </label>

                <input

                  type="number"

                  value={userId}

                  onChange={(e) =>
                    setUserId(
                      e.target.value
                    )
                  }

                  placeholder="Enter user ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* DEPARTMENT ID */}

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

                  placeholder="Enter department ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* CATEGORY ID */}

              <div>

                <label className="block mb-2 font-medium">

                  Category ID

                </label>

                <input

                  type="number"

                  value={categoryId}

                  onChange={(e) =>
                    setCategoryId(
                      e.target.value
                    )
                  }

                  placeholder="Enter category ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* REQUEST STATUS */}

              <div>

                <label className="block mb-2 font-medium">

                  Request Status

                </label>

                <select

                  value={requestStatus}

                  onChange={(e) =>
                    setRequestStatus(
                      e.target.value
                    )
                  }

                  className="w-full border rounded-lg px-4 py-3"

                >

                  <option value="">

                    Select Status

                  </option>

                  <option value="PENDING">

                    PENDING

                  </option>

                  <option value="APPROVED">

                    APPROVED

                  </option>

                  <option value="REJECTED">

                    REJECTED

                  </option>

                </select>

              </div>


              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="block mb-2 font-medium">

                  Description

                </label>

                <textarea

                  value={description}

                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }

                  placeholder="Enter product description"

                  rows="3"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>

            </div>


            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">


              <button

                type="submit"

                className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"

              >

                {editingId ? (

                  <>

                    <Pencil size={18} />

                    Update Product

                  </>

                ) : (

                  <>

                    <Plus size={18} />

                    Add Product

                  </>

                )}

              </button>


              {editingId && (

                <button

                  type="button"

                  onClick={clearForm}

                  className="bg-gray-300 px-5 py-3 rounded-lg flex items-center gap-2"

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

          <div className="relative">

            <Search

              size={20}

              className="absolute left-3 top-3 text-gray-400"

            />

            <input

              type="text"

              placeholder="Search products..."

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
            PRODUCT TABLE
        ====================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">

              Loading products...

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No products found.

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
                      Product
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Quantity
                    </th>

                    <th className="p-4 text-left">
                      User
                    </th>

                    <th className="p-4 text-left">
                      Department
                    </th>

                    <th className="p-4 text-left">
                      Category
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

                  {filteredProducts.map(

                    (product) => (

                      <tr

                        key={
                          product.product_id
                        }

                        className="border-t hover:bg-gray-50"

                      >

                        <td className="p-4">

                          {
                            product.product_id
                          }

                        </td>


                        <td className="p-4 font-medium">

                          {
                            product.productName
                          }

                        </td>


                        <td className="p-4">

                          ₹
                          {
                            product.product_price
                          }

                        </td>


                        <td className="p-4">

                          {
                            product.productQuantity
                          }

                        </td>


                        <td className="p-4">

                          {
                            product.user?.user_id
                            || "N/A"
                          }

                        </td>


                        <td className="p-4">

                          {
                            product.department?.departmentId
                            || "N/A"
                          }

                        </td>


                        <td className="p-4">

                          {
                            product.category?.category_id
                            || "N/A"
                          }

                        </td>


                        <td className="p-4">

                          <span className="px-3 py-1 rounded-full text-sm bg-gray-100">

                            {
                              product.requestStatus
                              || "N/A"
                            }

                          </span>

                        </td>


                        <td className="p-4">

                          <div className="flex justify-center gap-3">


                            {/* EDIT */}

                            <button

                              onClick={() =>
                                editProduct(
                                  product
                                )
                              }

                              className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"

                            >

                              <Pencil size={18} />

                            </button>


                            {/* DELETE */}

                            <button

                              onClick={() =>
                                deleteProduct(
                                  product.product_id
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