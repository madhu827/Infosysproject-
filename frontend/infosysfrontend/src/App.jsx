
import React from "react";

import LandingPage from "./LandingPage";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


/* ============================================================
   AUTH
============================================================ */

import Login from "./pages/Login";
import Register from "./pages/Register";


/* ============================================================
   USER
============================================================ */

import UserDashboard from "./pages/user/UserDashboard";
import CreateRequest from "./pages/user/CreateRequest";
import MyRequests from "./pages/user/MyRequest";


/* ============================================================
   MANAGER
============================================================ */

import ManagerDashboard from "./manager/ManagerDashboard";
import Request from "./manager/Request";
import Product from "./manager/Product";
import Category from "./manager/Category";
import Payment from "./manager/Payment";
import Review from "./manager/Review";


/* ============================================================
   SUPPLIER
============================================================ */

import SupplierDashboard from "./supplier/supplierDashboard";
import AddProduct from "./supplier/AddProduct";
import MyProducts from "./supplier/MyProducts";
import Tracking from "./supplier/Tracking";


/* ============================================================
   APP
============================================================ */

export default function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>


          {/* ==================================================
              LANDING PAGE
          ================================================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />


          {/* ==================================================
              AUTH
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================================================
              USER
          ================================================== */}

          <Route
            path="/user"
            element={
              <Navigate
                to="/user/dashboard"
                replace
              />
            }
          />


          {/* ==================================================
              USER DASHBOARD
          ================================================== */}

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRole="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              USER REQUEST WITH PRODUCT ID
          ================================================== */}

          <Route
            path="/user/request/:id"
            element={
              <ProtectedRoute allowedRole="USER">
                <CreateRequest />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              USER CREATE REQUEST
          ================================================== */}

          <Route
            path="/user/createRequest"
            element={
              <ProtectedRoute allowedRole="USER">
                <CreateRequest />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              USER MY REQUESTS
          ================================================== */}

          <Route
            path="/user/requests"
            element={
              <ProtectedRoute allowedRole="USER">
                <MyRequests />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER
          ================================================== */}

          <Route
            path="/manager"
            element={
              <Navigate
                to="/manager/dashboard"
                replace
              />
            }
          />


          {/* ==================================================
              MANAGER DASHBOARD
          ================================================== */}

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRole="MANAGER">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER REQUESTS
          ================================================== */}

          <Route
            path="/manager/requests"
            element={
              <ProtectedRoute allowedRole="MANAGER">
                <Request />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER PRODUCTS
          ================================================== */}

          <Route
            path="/manager/product"
            element={
              <ProtectedRoute allowedRole="MANAGER">
                <Product />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER CATEGORY
          ================================================== */}

          <Route
            path="/manager/category"
            element={
              <ProtectedRoute allowedRole="MANAGER">
                <Category />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER PAYMENTS
          ================================================== */}

          <Route
            path="/manager/Payment"
            element={
              <ProtectedRoute allowedRole="MANAGER">
                <Payment />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              MANAGER / SUPPLIER REVIEW
              
              Review can now be opened by:
              1. Manager
              2. Supplier
              
              Supplier Dashboard -> Review
              will therefore NOT be redirected to "/".
          ================================================== */}

          <Route
            path="/manager/Review"
            element={
              <ProtectedRoute
                allowedRoles={["MANAGER", "SUPPLIER"]}
              >
                <Review />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SUPPLIER
          ================================================== */}

          <Route
            path="/supplier"
            element={
              <Navigate
                to="/supplier/dashboard"
                replace
              />
            }
          />


          {/* ==================================================
              SUPPLIER DASHBOARD
          ================================================== */}

          <Route
            path="/supplier/dashboard"
            element={
              <ProtectedRoute allowedRole="SUPPLIER">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SUPPLIER ADD PRODUCT
          ================================================== */}

          <Route
            path="/supplier/add-product"
            element={
              <ProtectedRoute allowedRole="SUPPLIER">
                <AddProduct />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SUPPLIER MY PRODUCTS
          ================================================== */}

          <Route
            path="/supplier/MyProducts"
            element={
              <ProtectedRoute allowedRole="SUPPLIER">
                <MyProducts />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              SUPPLIER TRACKING
          ================================================== */}

          <Route
            path="/supplier/tracking"
            element={
              <ProtectedRoute allowedRole="SUPPLIER">
                <Tracking />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              FALLBACK
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );
}
