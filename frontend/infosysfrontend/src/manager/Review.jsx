import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Star,
  MessageSquare,
  Package,
  CalendarDays,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import "../css/manager/Review.css";

const API_BASE_URL = "http://localhost:8081";

const Review = () => {
  const navigate = useNavigate();

  // ============================================================
  // GET MANAGER ID FROM LOCAL STORAGE
  // ============================================================

  const getManagerId = () => {
    const storedManagerId = localStorage.getItem("managerId");

    if (storedManagerId) {
      return storedManagerId;
    }

    const managerData = localStorage.getItem("manager");

    if (managerData) {
      try {
        const manager = JSON.parse(managerData);

        return (
          manager.managerId ||
          manager.id ||
          manager.manager_id ||
          null
        );
      } catch (error) {
        console.error(
          "Unable to parse manager data:",
          error
        );
      }
    }

    return null;
  };

  const managerId = getManagerId();

  // ============================================================
  // STATE
  // ============================================================

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  // ============================================================
  // FETCH ALL PRODUCT RATINGS
  // ============================================================

  const fetchReviews = async () => {
    if (!managerId) {
      setError(
        "Manager ID is not available. Please login again."
      );

      setLoading(false);
      setIsRefreshing(false);

      return;
    }

    try {
      setError("");

      console.log("Manager ID:", managerId);

      // ========================================================
      // GET ALL REVIEWS FOR MANAGER
      // ========================================================

      const response = await axios.get(
        `${API_BASE_URL}/product-rating/status/${managerId}`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "All Product Rating Response:",
        response.data
      );

      // ========================================================
      // HANDLE BACKEND RESPONSE
      // ========================================================

      let responseData = response.data;

      // If backend directly returns array
      if (Array.isArray(responseData)) {
        setReviews(responseData);
        return;
      }

      // If backend returns:
      // {
      //    data: [...]
      // }

      if (
        responseData &&
        Array.isArray(responseData.data)
      ) {
        setReviews(responseData.data);
        return;
      }

      // If backend returns a single object
      // convert it into an array
      if (
        responseData &&
        typeof responseData === "object"
      ) {
        setReviews([responseData]);
        return;
      }

      // No data
      setReviews([]);

    } catch (err) {
      console.error(
        "Error retrieving product ratings:",
        err
      );

      if (err.response?.status === 404) {
        setError(
          "No reviews have been submitted yet."
        );
      } else if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You are not authorized to view these reviews."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to retrieve the reviews. Please try again."
        );
      }

      setReviews([]);

    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  useEffect(() => {
    fetchReviews();
  }, [managerId]);

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading(true);

    fetchReviews();
  };

  // ============================================================
  // GET RATING
  // ============================================================

  const getRating = (review) => {
    if (!review) {
      return 0;
    }

    return Number(
      review.rating ??
        review.stars ??
        review.ratingValue ??
        0
    );
  };

  // ============================================================
  // GET COMMENT
  // ============================================================

  const getComment = (review) => {
    if (!review) {
      return "No comment provided.";
    }

    return (
      review.comment ??
      review.reviewComment ??
      review.feedback ??
      "No comment provided."
    );
  };

  // ============================================================
  // GET REQUEST ID
  // ============================================================

  const getRequestId = (review) => {
    if (!review) {
      return null;
    }

    return (
      review.requestId ??
      review.request?.requestId ??
      review.request?.id ??
      null
    );
  };

  // ============================================================
  // GET PRODUCT NAME
  // ============================================================

  const getProductName = (review) => {
    if (!review) {
      return "Product Review";
    }

    return (
      review.productName ||
      review.product?.productName ||
      review.product?.name ||
      review.request?.productName ||
      review.request?.product?.productName ||
      review.request?.product?.name ||
      "Product Review"
    );
  };

  // ============================================================
  // GET REVIEW DATE
  // ============================================================

  const getReviewDate = (review) => {
    if (!review) {
      return null;
    }

    return (
      review.createdAt ??
      review.reviewDate ??
      review.date ??
      review.updatedAt ??
      null
    );
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================================
  // GET RATING LABEL
  // ============================================================

  const getRatingLabel = (rating) => {
    switch (Number(rating)) {
      case 5:
        return "Excellent";

      case 4:
        return "Very Good";

      case 3:
        return "Good";

      case 2:
        return "Needs Improvement";

      case 1:
        return "Poor";

      default:
        return "Not Rated";
    }
  };

  // ============================================================
  // RENDER STARS
  // ============================================================

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div
        className="review-stars"
        aria-label={`${numericRating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Star
            key={starNumber}
            size={28}
            strokeWidth={1.8}
            className={
              starNumber <= numericRating
                ? "review-star filled"
                : "review-star empty"
            }
          />
        ))}
      </div>
    );
  };

  // ============================================================
  // CALCULATE AVERAGE RATING
  // ============================================================

  const getAverageRating = () => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => {
        return sum + getRating(review);
      },
      0
    );

    return (total / reviews.length).toFixed(1);
  };

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="review-page">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="review-navbar">

        <div className="review-navbar-left">

          <button
            className="review-back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="review-brand">

            <div className="review-brand-logo">
              P
            </div>

            <div>
              <h2>PROCURA</h2>

              <span>
                Smart Procurement
              </span>
            </div>

          </div>

        </div>

        

      </header>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="review-container">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <section className="review-page-header">

          <div>

            <p className="review-breadcrumb">
              User Dashboard / Reviews
            </p>

            <h1>
              My Reviews
            </h1>

            <p className="review-page-description">
              View all the feedback you submitted for
              your purchase requests.
            </p>

          </div>

          <button
            className="review-refresh-button"
            onClick={handleRefresh}
            disabled={
              loading || isRefreshing
            }
          >

            <RefreshCw
              size={17}
              className={
                isRefreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            Refresh

          </button>

        </section>

        {/* ====================================================
            SUMMARY CARD
        ==================================================== */}

        {!loading &&
          !error &&
          reviews.length > 0 && (
            <section className="review-request-card">

              <div className="review-request-icon">
                <Star size={23} />
              </div>

              <div className="review-request-info">

                <span>
                  Total Reviews
                </span>

                <strong>
                  {reviews.length}
                </strong>

              </div>

              <div className="review-request-info">

                <span>
                  Average Rating
                </span>

                <strong>
                  {getAverageRating()} / 5
                </strong>

              </div>

              <div className="review-request-status">

                <CheckCircle2 size={17} />

                Reviews Submitted

              </div>

            </section>
          )}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="review-state-card">

            <div className="review-loader"></div>

            <h3>
              Loading your reviews
            </h3>

            <p>
              Please wait while we retrieve all
              your review details.
            </p>

          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="review-state-card error-state">

            <div className="review-error-icon">
              <AlertCircle size={30} />
            </div>

            <h3>
              Reviews unavailable
            </h3>

            <p>
              {error}
            </p>

            <button
              className="review-primary-button"
              onClick={handleRefresh}
            >

              <RefreshCw size={17} />

              Try Again

            </button>

          </div>
        )}

        {/* ====================================================
            ALL REVIEWS
        ==================================================== */}

        {!loading &&
          !error &&
          reviews.length > 0 && (

            <section className="review-content">

              {reviews.map(
                (review, index) => {

                  const rating =
                    getRating(review);

                  const currentRequestId =
                    getRequestId(review);

                  const productName =
                    getProductName(review);

                  const comment =
                    getComment(review);

                  const reviewDate =
                    getReviewDate(review);

                  return (

                    <article
                      className="review-details-card"
                      key={
                        review.ratingId ??
                        review.id ??
                        currentRequestId ??
                        index
                      }
                    >

                      {/* ======================================
                          REVIEW HEADER
                      ====================================== */}

                      <div className="review-details-header">

                        <div>

                          <p className="review-section-label">
                            PRODUCT FEEDBACK
                          </p>

                          <h2>
                            {productName}
                          </h2>

                        </div>

                        <div className="review-submitted-badge">

                          <CheckCircle2
                            size={16}
                          />

                          Submitted

                        </div>

                      </div>

                      <div className="review-detail-divider"></div>

                      {/* ======================================
                          RATING
                      ====================================== */}

                      <div className="review-rating-section">

                        <div className="review-rating-number">

                          {rating}

                          <span>
                            /5
                          </span>

                        </div>

                        {renderStars(rating)}

                        <p className="review-rating-label">
                          {getRatingLabel(rating)}
                        </p>

                      </div>

                      {/* ======================================
                          META INFORMATION
                      ====================================== */}

                      <div className="review-meta-row">

                        <div className="review-meta-item">

                          <Package
                            size={19}
                          />

                          <div>

                            <span>
                              Request ID
                            </span>

                            <strong>
                              {currentRequestId
                                ? `#${currentRequestId}`
                                : "Not available"}
                            </strong>

                          </div>

                        </div>

                        <div className="review-meta-item">

                          <CalendarDays
                            size={19}
                          />

                          <div>

                            <span>
                              Review Date
                            </span>

                            <strong>
                              {formatDate(
                                reviewDate
                              )}
                            </strong>

                          </div>

                        </div>

                        <div className="review-meta-item">

                          <Star
                            size={19}
                          />

                          <div>

                            <span>
                              Rating
                            </span>

                            <strong>
                              {rating} / 5
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* ======================================
                          COMMENT
                      ====================================== */}

                      <div className="review-comment-section">

                        <div className="review-comment-title">

                          <MessageSquare
                            size={19}
                          />

                          <h3>
                            Your Comment
                          </h3>

                        </div>

                        <div className="review-comment-box">

                          <p>
                            {comment}
                          </p>

                        </div>

                      </div>

                      {/* ======================================
                          EXTRA DATA
                      ====================================== */}

                      {review.ratingId && (
                        <div className="review-meta-row">

                          <div className="review-meta-item">

                            <CheckCircle2
                              size={19}
                            />

                            <div>

                              <span>
                                Rating ID
                              </span>

                              <strong>
                                #{review.ratingId}
                              </strong>

                            </div>

                          </div>

                        </div>
                      )}

                    </article>

                  );
                }
              )}

            </section>
          )}

        {/* ====================================================
            NO REVIEWS
        ==================================================== */}

        {!loading &&
          !error &&
          reviews.length === 0 && (

            <div className="review-state-card">

              <div className="review-empty-icon">

                <MessageSquare
                  size={30}
                />

              </div>

              <h3>
                No reviews found
              </h3>

              <p>
                You have not submitted any reviews yet.
              </p>

            </div>
          )}

        {/* ====================================================
            THANK YOU
        ==================================================== */}

        {!loading &&
          !error &&
          reviews.length > 0 && (

            <div className="review-thank-you">

              <Star size={20} />

              <p>
                Your feedback helps us improve the
                procurement experience.
              </p>

            </div>
          )}

      </main>

    </div>
  );
};

export default Review;