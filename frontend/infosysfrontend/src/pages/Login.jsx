
import React, { useState } from "react";
import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  ArrowRight,
  Mail,
  LockKeyhole,
  ShieldCheck,
  BarChart3,
  ShoppingBag,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../css/pages/Login.css";


export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  /* =====================================================
     ROLE
  ===================================================== */

  const [role, setRole] = useState("USER");


  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({
    email: "",
    password: ""
  });


  /* =====================================================
     PASSWORD VISIBILITY
  ===================================================== */

  const [showPassword, setShowPassword] = useState(false);


  /* =====================================================
     LOADING
  ===================================================== */

  const [loading, setLoading] = useState(false);


  /* =====================================================
     ERROR
  ===================================================== */

  const [error, setError] = useState("");


  /* =====================================================
     UPDATE FORM
  ===================================================== */

  function updateField(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  /* =====================================================
     LOGIN
  ===================================================== */

  async function submit(e) {

    e.preventDefault();

    setLoading(true);
    setError("");


    try {

      /* =================================================
         VALIDATION
      ================================================= */

      if (!form.email.trim()) {

        throw new Error("Please enter your email.");

      }

      if (!form.password.trim()) {

        throw new Error("Please enter your password.");

      }


      /* =================================================
         SELECT LOGIN ENDPOINT
      ================================================= */

      let endpoint = "";

      if (role === "USER") {

        endpoint = "/user/login";

      } else if (role === "MANAGER") {

        endpoint = "/manager/login";

      } else if (role === "SUPPLIER") {

        endpoint = "/supplier/login";

      } else {

        throw new Error("Invalid role selected.");

      }


      console.log("Login role:", role);
      console.log("Login endpoint:", endpoint);


      /* =================================================
         CREATE LOGIN REQUEST DATA

         IMPORTANT:
         Supplier normally expects:
         email + password

         User backend from your project uses:
         email + user_password

         Manager normally uses:
         email + password
      ================================================= */

      let loginData = {};


      if (role === "USER") {

        loginData = {
          email: form.email.trim(),
          user_password: form.password
        };

      } else {

        loginData = {
          email: form.email.trim(),
          password: form.password
        };

      }


      console.log("Login request:", {
        ...loginData,
        password: "***"
      });


      /* =================================================
         SEND LOGIN REQUEST
      ================================================= */

      const response = await axios.post(
        `http://localhost:8081${endpoint}`,
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      console.log("Login response:", response.data);


      /* =================================================
         GET RESPONSE DATA
      ================================================= */

      const data = response.data || {};


      /* =================================================
         FIND ACCOUNT

         Backend can return:

         {
           user: {...}
         }

         OR

         {
           manager: {...}
         }

         OR

         {
           supplier: {...}
         }

         OR directly:

         {
           supplierId: 1,
           suppliername: "..."
         }
      ================================================= */

      const account =
        data.user ||
        data.manager ||
        data.supplier ||
        data;


      console.log("Logged in account:", account);


      /* =================================================
         CHECK ACCOUNT
      ================================================= */

      if (
        !account ||
        typeof account !== "object" ||
        Object.keys(account).length === 0
      ) {

        throw new Error(
          "Login successful but account information was not returned."
        );

      }


      /* =================================================
         SAVE AUTH INFORMATION
      ================================================= */

      login(account, role);


      /* =================================================
         SUPPLIER
      ================================================= */

      if (role === "SUPPLIER") {

        /* -----------------------------------------------
           Save complete supplier information
        ------------------------------------------------ */

        localStorage.setItem(
          "supplier",
          JSON.stringify(account)
        );


        /* -----------------------------------------------
           Get supplier ID
        ------------------------------------------------ */

        const supplierId =
          account.supplierId ||
          account.supplier_id ||
          account.id;


        if (supplierId) {

          localStorage.setItem(
            "supplierId",
            String(supplierId)
          );

        }


        console.log(
          "Supplier login successful"
        );


        /* -----------------------------------------------
           Navigate to Supplier Dashboard
        ------------------------------------------------ */

        navigate(
          "/supplier/dashboard",
          {
            replace: true
          }
        );

        return;

      }


      /* =================================================
         MANAGER
      ================================================= */

      if (role === "MANAGER") {

        localStorage.setItem(
          "manager",
          JSON.stringify(account)
        );


        const managerId =
          account.managerId ||
          account.manager_id ||
          account.id;


        if (managerId) {

          localStorage.setItem(
            "managerId",
            String(managerId)
          );

        }


        console.log(
          "Manager login successful"
        );


        navigate(
          "/manager/dashboard",
          {
            replace: true
          }
        );

        return;

      }


      /* =================================================
         USER
      ================================================= */

      if (role === "USER") {

        localStorage.setItem(
          "user",
          JSON.stringify(account)
        );


        const userId =
          account.userId ||
          account.user_id ||
          account.id;


        if (userId) {

          localStorage.setItem(
            "userId",
            String(userId)
          );

        }


        console.log(
          "User login successful"
        );


        navigate(
          "/user/dashboard",
          {
            replace: true
          }
        );

        return;

      }

    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      /* =================================================
         ERROR MESSAGE
      ================================================= */

      let message =
        "Login failed. Check your credentials.";


      if (err.response) {

        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Response:",
          err.response.data
        );


        if (
          typeof err.response.data === "string"
        ) {

          message =
            err.response.data;

        } else if (
          err.response.data?.message
        ) {

          message =
            err.response.data.message;

        } else if (
          err.response.data?.error
        ) {

          message =
            err.response.data.error;

        }

      } else if (err.message) {

        message =
          err.message;

      }


      setError(message);

    } finally {

      setLoading(false);

    }

  }


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="auth-page">


      {/* =================================================
          LEFT SHOWCASE
      ================================================= */}

      <section className="auth-showcase">

        <div className="auth-showcase-content">


          {/* BRAND */}

          <div className="auth-brand">

            <div className="brand-icon">
              P
            </div>

            ProCura

          </div>


          {/* COPY */}

          <div className="auth-copy">

            <div className="auth-pill">

              <CheckCircle2
                size={14}
              />

              Intelligent procurement workspace

            </div>


            <h1>

              Purchase better.

              <br />

              <span>
                Approve faster.
              </span>

            </h1>


            <p>

              One connected procurement workspace
              for requests, approvals, products,
              payments and spend visibility.

            </p>

          </div>


          {/* FEATURES */}

          <div className="auth-feature-grid">


            {/* FEATURE 1 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">

                <ShoppingBag
                  size={18}
                />

              </div>


              <div>

                <strong>
                  Guided buying
                </strong>

                <span>
                  Find approved products quickly.
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">

                <ShieldCheck
                  size={18}
                />

              </div>


              <div>

                <strong>
                  Controlled approvals
                </strong>

                <span>
                  Every request follows workflow.
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">

                <BarChart3
                  size={18}
                />

              </div>


              <div>

                <strong>
                  Spend intelligence
                </strong>

                <span>
                  Keep procurement measurable.
                </span>

              </div>

            </div>


          </div>

        </div>

      </section>


      {/* =================================================
          RIGHT LOGIN AREA
      ================================================= */}

      <section className="auth-form-area">


        <form
          className="auth-form"
          onSubmit={submit}
        >


          {/* MOBILE BRAND */}

          <div className="mobile-auth-brand">
            PROCURA
          </div>


          {/* EYEBROW */}

          <span className="eyebrow">
            WELCOME BACK
          </span>


          {/* HEADING */}

          <h2>
            Sign in to your workspace
          </h2>


          <p className="auth-description">

            Enter your credentials to continue.

          </p>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="error-box">

              {error}

            </div>

          )}


          {/* =================================================
              EMAIL
          ================================================= */}

          <label>
            Work email
          </label>


          <div className="auth-input">

            <Mail
              size={17}
            />


            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <label>
            Password
          </label>


          <div className="auth-input password-input">

            <LockKeyhole
              size={17}
            />


            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />


            {/* EYE BUTTON */}

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (

                <EyeOff
                  size={18}
                />

              ) : (

                <Eye
                  size={18}
                />

              )}

            </button>

          </div>


          {/* =================================================
              ROLE
          ================================================= */}

          <label>
            Continue as
          </label>


          <div className="role-selector">


            {/* USER */}

            <button
              type="button"
              className={
                role === "USER"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRole("USER")
              }
            >

              <span>
                User
              </span>

              <small>
                Request products
              </small>

            </button>


            {/* MANAGER */}

            <button
              type="button"
              className={
                role === "MANAGER"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRole("MANAGER")
              }
            >

              <span>
                Manager
              </span>

              <small>
                Approve and pay
              </small>

            </button>


            {/* SUPPLIER */}

            <button
              type="button"
              className={
                role === "SUPPLIER"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRole("SUPPLIER")
              }
            >

              <span>
                Supplier
              </span>

              <small>
                Manage products
              </small>

            </button>


          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign in"}


            {!loading && (

              <ArrowRight
                size={17}
              />

            )}

          </button>


          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="auth-bottom-text">

            Don't have an account?

            {" "}

            <Link to="/register">

              Create account

            </Link>

          </p>


        </form>

      </section>


    </div>

  );

}
