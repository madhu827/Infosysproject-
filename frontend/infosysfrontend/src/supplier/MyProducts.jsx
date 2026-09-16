
import React, { useEffect, useState } from "react";

import {
  Package,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  IndianRupee,
  Boxes,
  AlertCircle,
  Plus,
  X
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../api/client";

import "../css/supplier/MyProducts.css";


export default function MyProducts() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [supplierId, setSupplierId] = useState(null);

  const [deleteProduct, setDeleteProduct] = useState(null);

  const [deleting, setDeleting] = useState(false);


  // =========================================================
  // GET SUPPLIER ID AND LOAD PRODUCTS
  // =========================================================

  useEffect(() => {

    const storedSupplierId =
      localStorage.getItem("supplierId");

    console.log(
      "Supplier ID from localStorage:",
      storedSupplierId
    );


    // ---------------------------------------------------------
    // CHECK SUPPLIER ID
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // CONVERT TO NUMBER
    // ---------------------------------------------------------

    const id = Number(storedSupplierId);


    if (isNaN(id) || id <= 0) {

      setError(
        "Invalid Supplier ID. Please login again."
      );

      setLoading(false);

      return;
    }


    // ---------------------------------------------------------
    // SAVE SUPPLIER ID
    // ---------------------------------------------------------

    setSupplierId(id);


    // ---------------------------------------------------------
    // LOAD PRODUCTS
    //
    // IMPORTANT:
    // Pass `id` directly.
    // Do NOT use supplierId state here because
    // setSupplierId() is asynchronous.
    // ---------------------------------------------------------

    fetchProducts(id);

  }, []);


  // =========================================================
  // FETCH PRODUCTS BY SUPPLIER ID
  // =========================================================

  const fetchProducts = async (id) => {

    try {

      setLoading(true);

      setError("");


      // -------------------------------------------------------
      // VALIDATE ID
      // -------------------------------------------------------

      if (!id || id === "null") {

        setError(
          "Supplier ID is missing."
        );

        setProducts([]);

        return;
      }


      console.log(
        "Fetching products for Supplier ID:",
        id
      );


      // -------------------------------------------------------
      // GET PRODUCTS
      //
      // THIS IS THE IMPORTANT FIX
      //
      // Previously:
      // `/product/supplier/${supplierId}`
      //
      // supplierId was still null.
      //
      // Now:
      // `/product/supplier/${id}`
      // -------------------------------------------------------

      const response = await api.get(
        `/product/supplier/${id}`,
        {
          withCredentials: true
        }
      );


      console.log(
        "Supplier products:",
        response.data
      );


      // -------------------------------------------------------
      // STORE PRODUCTS
      // -------------------------------------------------------

      if (Array.isArray(response.data)) {

        setProducts(response.data);

      } else {

        setProducts([]);

      }

    } catch (err) {

      console.error(
        "Error loading supplier products:",
        err
      );


      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to load products."
      );


      setProducts([]);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {

    if (supplierId) {

      fetchProducts(supplierId);

    }

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredProducts =
    products.filter((product) => {

      const search =
        searchTerm.toLowerCase().trim();


      if (!search) {

        return true;

      }


      const productName =
        product.productName
          ?.toLowerCase() || "";


      const description =
        product.description
          ?.toLowerCase() || "";


      return (
        productName.includes(search) ||
        description.includes(search)
      );

    });


  // =========================================================
  // TOTAL STOCK
  // =========================================================

  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.productQuantity || 0
        ),
      0
    );


  // =========================================================
  // TOTAL VALUE
  // =========================================================

  const totalValue =
    products.reduce(
      (total, product) =>
        total +
        (
          Number(
            product.product_price || 0
          ) *
          Number(
            product.productQuantity || 0
          )
        ),
      0
    );


  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const confirmDelete = (product) => {

    setDeleteProduct(product);

  };


  const handleDelete = async () => {

    if (!deleteProduct) {

      return;

    }


    try {

      setDeleting(true);


      await api.delete(
        `/supplier/product/${deleteProduct.productId}`,
        {
          withCredentials: true
        }
      );


      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product.productId !==
              deleteProduct.productId
          )
      );


      setDeleteProduct(null);


    } catch (err) {

      console.error(
        "Delete product error:",
        err
      );


      alert(
        err.response?.data?.message ||
        "Unable to delete product."
      );


    } finally {

      setDeleting(false);

    }

  };


  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const handleEdit = (product) => {

    localStorage.setItem(
      "editProduct",
      JSON.stringify(product)
    );


    navigate("/supplier/add-product");

  };


  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const handleAddProduct = () => {

    localStorage.removeItem(
      "editProduct"
    );


    navigate("/supplier/add-product");

  };


  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (

      <div className="my-products-page">

        <div className="my-products-loading">

          <div className="my-products-spinner"></div>

          <h3>
            Loading My Products
          </h3>

          <p>
            Please wait while we fetch your products...
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="my-products-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="my-products-header">

        <div className="my-products-heading">

          <div className="my-products-heading-icon">

            <Package size={26} />

          </div>

          <div>

            <h1>
              My Products
            </h1>

            <p>
              Manage products added by your organization
            </p>

          </div>

        </div>


        <div className="header-actions">

          <button
            className="refresh-products-btn"
            onClick={handleRefresh}
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <button
            className="add-product-btn"
            onClick={handleAddProduct}
          >

            <Plus size={18} />

            Add Product

          </button>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="products-error">

          <AlertCircle size={19} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="products-summary">


        {/* TOTAL PRODUCTS */}

        <div className="summary-card">

          <div className="summary-card-icon">

            <Package size={22} />

          </div>

          <div className="summary-card-content">

            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

          </div>

        </div>


        {/* TOTAL STOCK */}

        <div className="summary-card">

          <div className="summary-card-icon">

            <Boxes size={22} />

          </div>

          <div className="summary-card-content">

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>


        {/* TOTAL VALUE */}

        <div className="summary-card">

          <div className="summary-card-icon">

            <IndianRupee size={22} />

          </div>

          <div className="summary-card-content">

            <span>
              Inventory Value
            </span>

            <strong>
              ₹{totalValue.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>


      </div>


      {/* =====================================================
          PRODUCTS TOOLBAR
      ===================================================== */}

      <div className="products-toolbar">

        <div className="products-toolbar-left">

          <h2>
            Product Catalog
          </h2>

          <span>
            {filteredProducts.length} product
            {filteredProducts.length !== 1
              ? "s"
              : ""}
          </span>

        </div>


        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />


          {searchTerm && (

            <button
              className="clear-search"
              onClick={() =>
                setSearchTerm("")
              }
            >

              <X size={15} />

            </button>

          )}

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredProducts.length === 0 ? (

        <div className="empty-products">

          <div className="empty-products-icon">

            <Package size={42} />

          </div>

          <h2>

            {searchTerm
              ? "No Products Found"
              : "No Products Added"}

          </h2>

          <p>

            {searchTerm
              ? "Try searching with another product name."
              : "Products added by you will appear here."}

          </p>


          {!searchTerm && (

            <button
              className="empty-add-btn"
              onClick={handleAddProduct}
            >

              <Plus size={17} />

              Add Your First Product

            </button>

          )}

        </div>

      ) : (


        /* ===================================================
           PRODUCT GRID
        =================================================== */

        <div className="supplier-products-grid">

          {filteredProducts.map(
            (product) => (

              <div
                className="supplier-product-card"
                key={product.productId}
              >


                {/* ==========================================
                    PRODUCT IMAGE
                ========================================== */}

                <div className="supplier-product-image">

                  {product.imageUrl ? (

                    <img
                      src={product.imageUrl}
                      alt={
                        product.productName ||
                        "Product"
                      }
                      onError={(e) => {

                        e.currentTarget.style.display =
                          "none";


                        const fallback =
                          e.currentTarget
                            .parentElement
                            .querySelector(
                              ".product-image-fallback"
                            );


                        if (fallback) {

                          fallback.style.display =
                            "flex";

                        }

                      }}
                    />

                  ) : null}


                  <div
                    className="product-image-fallback"
                    style={{
                      display:
                        product.imageUrl
                          ? "none"
                          : "flex"
                    }}
                  >

                    <Package size={45} />

                  </div>


                  {/* PRODUCT ID */}

                  <div className="product-number">

                    ID #{product.productId}

                  </div>

                </div>


                {/* ==========================================
                    PRODUCT CONTENT
                ========================================== */}

                <div className="supplier-product-content">


                  <div className="product-title-row">

                    <h3>

                      {product.productName ||
                        "Unnamed Product"}

                    </h3>

                  </div>


                  <p className="supplier-product-description">

                    {product.description ||
                      "No description available for this product."}

                  </p>


                  {/* ========================================
                      PRICE + STOCK
                  ======================================== */}

                  <div className="product-details">


                    <div className="product-detail-item">

                      <span>
                        Unit Price
                      </span>

                      <strong className="product-price">

                        <IndianRupee size={15} />

                        {Number(
                          product.product_price || 0
                        ).toLocaleString("en-IN")}

                      </strong>

                    </div>


                    <div className="product-detail-item">

                      <span>
                        Available Stock
                      </span>

                      <strong>

                        {Number(
                          product.productQuantity || 0
                        ).toLocaleString("en-IN")}

                      </strong>

                    </div>


                  </div>


                  {/* ========================================
                      STOCK STATUS
                  ======================================== */}

                  <div className="stock-status">

                    {Number(
                      product.productQuantity || 0
                    ) === 0 ? (

                      <span className="stock-badge out-of-stock">

                        <span className="stock-dot"></span>

                        Out of Stock

                      </span>

                    ) : Number(
                      product.productQuantity || 0
                    ) <= 10 ? (

                      <span className="stock-badge low-stock">

                        <span className="stock-dot"></span>

                        Low Stock

                      </span>

                    ) : (

                      <span className="stock-badge in-stock">

                        <span className="stock-dot"></span>

                        In Stock

                      </span>

                    )}

                  </div>


                  {/* ========================================
                      CATEGORY / DEPARTMENT
                  ======================================== */}

                  <div className="product-meta">

                    {product.category?.categoryName && (

                      <span>
                        {product.category.categoryName}
                      </span>

                    )}


                    {product.department?.departmentName && (

                      <span>
                        {product.department.departmentName}
                      </span>

                    )}

                  </div>


                  {/* ========================================
                      ACTION BUTTONS
                  ======================================== */}

                  <div className="product-card-actions">

                    <button
                      className="product-edit-btn"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >

                      <Edit size={16} />

                      Edit

                    </button>


                    <button
                      className="product-delete-btn"
                      onClick={() =>
                        confirmDelete(product)
                      }
                    >

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </div>


                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteProduct && (

        <div className="delete-modal-overlay">

          <div className="delete-modal">

            <button
              className="delete-modal-close"
              onClick={() =>
                setDeleteProduct(null)
              }
            >

              <X size={19} />

            </button>


            <div className="delete-warning-icon">

              <Trash2 size={25} />

            </div>


            <h2>
              Delete Product?
            </h2>


            <p>

              Are you sure you want to delete

              <strong>
                {" "}
                {deleteProduct.productName}
              </strong>
              ?

              <br />

              This action cannot be undone.

            </p>


            <div className="delete-modal-actions">

              <button
                className="cancel-delete-btn"
                onClick={() =>
                  setDeleteProduct(null)
                }
                disabled={deleting}
              >

                Cancel

              </button>


              <button
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >

                <Trash2 size={16} />

                {deleting
                  ? "Deleting..."
                  : "Delete Product"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
