import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  PlusCircle,
  Save,
  X,
  IndianRupee,
  Boxes,
  Image,
  FileText,
  Package,
  Building2,
  Layers,
  RefreshCw
} from "lucide-react";

import "../css/supplier/addproduct.css";

const API_BASE_URL = "http://localhost:8081";

function AddProduct() {

  const navigate = useNavigate();

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    productName: "",
    product_price: "",
    productQuantity: "",
    description: "",
    imageUrl: "",
    category: "",
    department: ""
  });

  // =========================================================
  // STATES
  // =========================================================

  const [savingProduct, setSavingProduct] = useState(false);
  const [imageError, setImageError] = useState(false);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (name === "imageUrl") {
      setImageError(false);
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateProduct = () => {

    const productName = formData.productName.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const department = formData.department.trim();

    const priceText = formData.product_price.trim();
    const quantityText = formData.productQuantity.trim();

    // PRODUCT NAME
    if (!productName) {
      alert("Product name is required.");
      return false;
    }

    if (
      productName.length < 4 ||
      productName.length > 20
    ) {
      alert(
        "Product name must be between 4 and 20 characters."
      );

      return false;
    }

    // PRICE
    if (!priceText) {
      alert("Product price is required.");
      return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(priceText)) {
      alert(
        "Product price must contain only numbers."
      );

      return false;
    }

    const price = Number(priceText);

    if (!Number.isFinite(price) || price <= 0) {
      alert(
        "Product price must be greater than 0."
      );

      return false;
    }

    // QUANTITY
    if (!quantityText) {
      alert("Product quantity is required.");
      return false;
    }

    if (!/^\d+$/.test(quantityText)) {
      alert(
        "Product quantity must contain only numbers."
      );

      return false;
    }

    const quantity = Number(quantityText);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Product quantity must be at least 1."
      );

      return false;
    }

    // DESCRIPTION
    if (!description) {
      alert("Description is required.");
      return false;
    }

    if (
      description.length < 4 ||
      description.length > 100
    ) {
      alert(
        "Description must be between 4 and 100 characters."
      );

      return false;
    }

    // CATEGORY
    if (!category) {
      alert("Category is required.");
      return false;
    }

    // DEPARTMENT
    if (!department) {
      alert("Department is required.");
      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateProduct()) {
      return;
    }

    const productData = {

      productName:
        formData.productName.trim(),

      product_price:
        Number(formData.product_price.trim()),

      productQuantity:
        Number(formData.productQuantity.trim()),

      description:
        formData.description.trim(),

      imageUrl:
        formData.imageUrl.trim(),

      category:
        formData.category.trim(),

      department:
        formData.department.trim()
    };

    console.log(
      "POST URL:",
      `${API_BASE_URL}/product`
    );

    console.log(
      "POST BODY:",
      productData
    );

    setSavingProduct(true);

    try {

      const response = await axios.post(
    `${API_BASE_URL}/product`,
    productData,
    {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    }
);

      console.log(
        "Product added successfully:",
        response.data
      );

      alert("Product added successfully!");

      // Reset form
      setFormData({
        productName: "",
        product_price: "",
        productQuantity: "",
        description: "",
        imageUrl: "",
        category: "",
        department: ""
      });

      setImageError(false);

      // After successful save
      navigate("/supplier/dashboard");

    } catch (error) {

      console.error(
        "Product creation error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data;

      if (error.response?.status === 400) {

        alert(
          typeof backendMessage === "string"
            ? backendMessage
            : "Invalid product data. Please check all fields."
        );

      } else if (
        error.response?.status === 401
      ) {

        alert(
          "You are not authorized. Please login again."
        );

      } else if (
        error.response?.status === 403
      ) {

        alert(
          "Access denied. Only suppliers can add products."
        );

      } else if (
        error.response?.status === 404
      ) {

        alert(
          "Add Product API endpoint was not found."
        );

      } else {

        alert(
          "Unable to add product. Please try again."
        );
      }

    } finally {

      setSavingProduct(false);

    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {

    if (savingProduct) {
      return;
    }

    navigate("/supplier/dashboard");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <section className="add-product-page">

      <div className="add-product-form-card">

        {/* HEADER */}

        <div className="add-product-form-header">

          <div className="add-product-header-left">

            <div className="add-product-title-icon">
              <PlusCircle size={22} />
            </div>

            <div>

              <h2>
                Add New Product
              </h2>

              <p>
                Enter the product details below.
              </p>

            </div>

          </div>

          <button
            type="button"
            className="add-product-close-button"
            onClick={handleCancel}
            disabled={savingProduct}
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="add-product-form"
        >

          <div className="add-product-form-grid">

            {/* PRODUCT NAME */}

            <div className="add-product-form-group add-product-full-width">

              <label>
                Product Name
                <span>*</span>
              </label>

              <div className="add-product-input-with-icon">

                <Package size={17} />

                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Example: Lenovo LOQ"
                  minLength={4}
                  maxLength={20}
                  required
                />

              </div>

              <small className="add-product-form-help">
                4–20 characters
              </small>

            </div>

            {/* PRICE */}

            <div className="add-product-form-group">

              <label>
                Product Price
                <span>*</span>
              </label>

              <div className="add-product-input-with-icon">

                <IndianRupee size={17} />

                <input
                  type="text"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  inputMode="decimal"
                  autoComplete="off"
                  required
                />

              </div>

            </div>

            {/* QUANTITY */}

            <div className="add-product-form-group">

              <label>
                Quantity
                <span>*</span>
              </label>

              <div className="add-product-input-with-icon">

                <Boxes size={17} />

                <input
                  type="text"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div className="add-product-form-group">

              <label>
                Category
                <span>*</span>
              </label>

              <div className="add-product-input-with-icon">

                <Layers size={17} />

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Example: Electronics"
                  required
                />

              </div>

            </div>

            {/* DEPARTMENT */}

            <div className="add-product-form-group">

              <label>
                Department
                <span>*</span>
              </label>

              <div className="add-product-input-with-icon">

                <Building2 size={17} />

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Example: IT"
                  required
                />

              </div>

            </div>

            {/* IMAGE URL */}

            <div className="add-product-form-group add-product-full-width">

              <label>
                Product Image URL
              </label>

              <div className="add-product-input-with-icon">

                <Image size={17} />

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  autoComplete="off"
                />

              </div>

              {/* IMAGE PREVIEW */}

              {formData.imageUrl &&
                !imageError && (

                  <div className="add-product-image-preview">

                    <img
                      src={formData.imageUrl}
                      alt={
                        formData.productName ||
                        "Product preview"
                      }
                      onError={() =>
                        setImageError(true)
                      }
                    />

                  </div>

                )}

              {formData.imageUrl &&
                imageError && (

                  <small className="add-product-image-error">
                    Unable to load image from this URL.
                  </small>

                )}

            </div>

            {/* DESCRIPTION */}

            <div className="add-product-form-group add-product-full-width">

              <label>
                Description
                <span>*</span>
              </label>

              <div className="add-product-textarea-with-icon">

                <FileText size={17} />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  minLength={4}
                  maxLength={100}
                  rows={5}
                  required
                />

              </div>

              <small className="add-product-form-help">
                {formData.description.length}/100 characters
              </small>

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="add-product-form-actions">

            <button
              type="button"
              className="add-product-secondary-button"
              onClick={handleCancel}
              disabled={savingProduct}
            >
              <X size={18} />
              Cancel
            </button>

            <button
              type="submit"
              className="add-product-primary-button"
              disabled={savingProduct}
            >

              {savingProduct ? (

                <>
                  <RefreshCw
                    size={18}
                    className="add-product-loading-icon"
                  />

                  Saving...
                </>

              ) : (

                <>
                  <Save size={18} />
                  Save Product
                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </section>
  );
}

export default AddProduct;