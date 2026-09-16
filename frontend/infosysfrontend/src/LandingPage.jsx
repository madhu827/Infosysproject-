import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <nav className="landing-navbar">

        <div className="landing-logo">

          <span>
            PROCURA
          </span>

        </div>


        <div className="landing-nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <Link
            to="/login"
            className="nav-login-btn"
          >
            Login
          </Link>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-content">

          <p className="hero-small-title">
            SMART PROCUREMENT PLATFORM
          </p>


          <h1>

            Smart Procurement.

            <br />

            <span>
              Simplified.
            </span>

          </h1>


          <p className="hero-description">

            Manage your complete procurement process from
            product requests and approvals to suppliers and
            payments — all in one powerful platform.

          </p>


          <div className="hero-buttons">

            <Link
              to="/login"
              className="primary-btn"
            >
              Get Started
            </Link>


            <a
              href="#about"
              className="secondary-btn"
            >
              Learn More
            </a>

          </div>

        </div>


        {/* ================= HERO VISUAL ================= */}

        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">

              <span>
                PROCURA
              </span>


              <span className="preview-status">
                ● System Active
              </span>

            </div>


            <div className="preview-content">

              <div className="preview-card">

                <span>
                  Purchase Requests
                </span>

                <strong>
                  128
                </strong>

              </div>


              <div className="preview-card">

                <span>
                  Approved
                </span>

                <strong>
                  96
                </strong>

              </div>


              <div className="preview-card">

                <span>
                  Suppliers
                </span>

                <strong>
                  24
                </strong>

              </div>


              <div className="preview-card">

                <span>
                  Payments
                </span>

                <strong>
                  ₹2.4L
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT SECTION ================= */}

      <section
        id="about"
        className="about-section"
      >

        <div className="section-heading">

          <p>
            ABOUT PROCURA
          </p>


          <h2>
            Procurement Made Simple
          </h2>


          <span></span>

        </div>


        <div className="about-content">

          <div className="about-text">

            <h3>
              One Platform. Complete Procurement Control.
            </h3>


            <p>

              PROCURA is a smart procurement and purchase order
              management platform designed to simplify the entire
              procurement lifecycle.

            </p>


            <p>

              From raising purchase requests to manager approvals,
              supplier coordination and payment processing, PROCURA
              brings everything together in one centralized system.

            </p>

          </div>


          <div className="about-highlight">


            <div className="highlight-box">

              <h3>
                Easy
              </h3>

              <p>
                Simple procurement management
              </p>

            </div>


            <div className="highlight-box">

              <h3>
                Secure
              </h3>

              <p>
                Role-based access and protection
              </p>

            </div>


            <div className="highlight-box">

              <h3>
                Efficient
              </h3>

              <p>
                Faster approvals and processing
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= GET STARTED ================= */}

      <section className="cta-section">

        <div className="cta-content">

          <p>
            READY TO GET STARTED?
          </p>


          <h2>
            Simplify Your Procurement Process
          </h2>


          <p>

            Access PROCURA and manage your procurement
            operations from one centralized platform.

          </p>


          <Link
            to="/login"
            className="cta-login-btn"
          >
            Login to PROCURA
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">

        <div className="footer-logo">
          PROCURA
        </div>


        <p>
          Smart Procurement & Purchase Order Management System
        </p>


        <div className="footer-line"></div>


        <span>
          © 2026 PROCURA. All Rights Reserved.
        </span>

      </footer>


    </div>
  );
};


export default LandingPage;