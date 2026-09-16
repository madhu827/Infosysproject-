
import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Package,
    User,
    Building2,
    Hash,
    IndianRupee,
    RefreshCw,
    AlertCircle,
    ShieldCheck,
    Loader2,
    CreditCard,
    Truck,
    MapPin,
    PackageCheck
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import api from "../api/client";

import "../css/supplier/Tracking.css";


/* ============================================================
   PROCUREX
   SUPPLIER PAYMENT TRANSACTION DETAILS

   TRACKING FLOW

       NOT STARTED
           |
           v
       DISPATCHED
           |
           v
       IN TRANSIT
           |
           v
       NEARER TO YOU
           |
           v
       DELIVERED


   TRACKING API

   DISPATCHED:
   PUT /raiserequest/tracking/{requestId}?orderstatus=DISPATCHED&location=...

   IN TRANSIT:
   PUT /raiserequest/tracking/{requestId}?orderstatus=IN_TRANSIT&location=...

   NEARER:
   PUT /raiserequest/tracking/{requestId}?orderstatus=NEAR_YOU&location=...

   DELIVERED:
   PUT /raiserequest/tracking/{requestId}?orderstatus=DELIVERED&location=...

   IMPORTANT:
   - No request body is sent.
   - Tracking state is also saved in localStorage.
   - Therefore refresh will NOT remove the selected action.
============================================================ */


/* ============================================================
   LOCAL STORAGE KEY
============================================================ */

const TRACKING_STORAGE_KEY =
    "procurex_supplier_tracking_statuses";


/* ============================================================
   GET FIRST AVAILABLE VALUE
============================================================ */

const getValue = (...values) => {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }

    }

    return null;
};


/* ============================================================
   NUMBER
============================================================ */

const toNumber = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

};


/* ============================================================
   NORMALIZE STATUS
============================================================ */

const normalizeStatus = (value) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

};


/* ============================================================
   CSV PARSER
============================================================ */

const parseCSV = (csvText) => {

    if (
        !csvText ||
        !csvText.trim()
    ) {
        return [];
    }


    const rows = [];

    let currentRow = [];

    let currentValue = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < csvText.length;
        i++
    ) {

        const character =
            csvText[i];

        const nextCharacter =
            csvText[i + 1];


        /* ====================================================
           DOUBLE QUOTE
        ==================================================== */

        if (
            character === '"'
        ) {

            if (
                insideQuotes &&
                nextCharacter === '"'
            ) {

                currentValue += '"';

                i++;

            }

            else {

                insideQuotes =
                    !insideQuotes;

            }

            continue;

        }


        /* ====================================================
           COMMA
        ==================================================== */

        if (
            character === "," &&
            !insideQuotes
        ) {

            currentRow.push(
                currentValue
            );

            currentValue = "";

            continue;

        }


        /* ====================================================
           NEW LINE
        ==================================================== */

        if (
            (
                character === "\n" ||
                character === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                character === "\r" &&
                nextCharacter === "\n"
            ) {

                i++;

            }


            currentRow.push(
                currentValue
            );

            currentValue = "";


            if (
                currentRow.some(
                    (value) =>
                        String(value).trim() !== ""
                )
            ) {

                rows.push(
                    currentRow
                );

            }


            currentRow = [];

            continue;

        }


        currentValue += character;

    }


    /* ========================================================
       LAST ROW
    ======================================================== */

    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue
        );


        if (
            currentRow.some(
                (value) =>
                    String(value).trim() !== ""
            )
        ) {

            rows.push(
                currentRow
            );

        }

    }


    if (
        rows.length === 0
    ) {

        return [];

    }


    /* ========================================================
       HEADER
    ======================================================== */

    const headers =
        rows[0].map(
            (header) =>
                String(header)
                    .trim()
                    .toLowerCase()
                    .replace(/^\uFEFF/, "")
        );


    /* ========================================================
       CSV TO OBJECT
    ======================================================== */

    return rows
        .slice(1)
        .map((row) => {

            const object = {};


            headers.forEach(
                (header, index) => {

                    object[header] =
                        row[index] !== undefined
                            ? String(
                                row[index]
                            ).trim()
                            : "";

                }
            );


            return object;

        });

};


/* ============================================================
   LOAD TRACKING STATUSES FROM LOCAL STORAGE
============================================================ */

const loadStoredTrackingStatuses = () => {

    try {

        const stored =
            localStorage.getItem(
                TRACKING_STORAGE_KEY
            );


        if (!stored) {

            return {};

        }


        const parsed =
            JSON.parse(stored);


        if (
            parsed &&
            typeof parsed === "object"
        ) {

            return parsed;

        }


        return {};

    }

    catch (error) {

        console.error(
            "Unable to restore tracking statuses:",
            error
        );

        return {};

    }

};


/* ============================================================
   SAVE TRACKING STATUSES TO LOCAL STORAGE
============================================================ */

const saveTrackingStatuses = (
    statuses
) => {

    try {

        localStorage.setItem(
            TRACKING_STORAGE_KEY,
            JSON.stringify(statuses)
        );

    }

    catch (error) {

        console.error(
            "Unable to save tracking statuses:",
            error
        );

    }

};


/* ============================================================
   COMPONENT
============================================================ */

export default function Tracking() {

    const navigate =
        useNavigate();


    /* ========================================================
       SUPPLIER ID
    ======================================================== */

    const [
        supplierId,
        setSupplierId
    ] = useState(
        localStorage.getItem(
            "supplierId"
        )
    );


    /* ========================================================
       PAYMENTS
    ======================================================== */

    const [
        payments,
        setPayments
    ] = useState([]);


    /* ========================================================
       TRACKING STATUS

       Every request starts as NOT_STARTED.

       Example:

       {
           "10": "DISPATCHED",
           "11": "IN_TRANSIT",
           "12": "DELIVERED"
       }
    ======================================================== */

    const [
        trackingStatuses,
        setTrackingStatuses
    ] = useState(
        loadStoredTrackingStatuses
    );


    /* ========================================================
       PROCESSING ACTION
    ======================================================== */

    const [
        processingAction,
        setProcessingAction
    ] = useState(null);


    /* ========================================================
       LOADING
    ======================================================== */

    const [
        loading,
        setLoading
    ] = useState(false);


    /* ========================================================
       ERROR
    ======================================================== */

    const [
        error,
        setError
    ] = useState("");


    /* ========================================================
       SUCCESS
    ======================================================== */

    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


    /* ========================================================
       LOAD PAYMENT TRANSACTIONS
    ======================================================== */

    const loadTrackingData =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    setSuccessMessage("");


                    /* ========================================
                       GET SUPPLIER ID
                    ======================================== */

                    const storedSupplierId =
                        localStorage.getItem(
                            "supplierId"
                        );


                    if (
                        !storedSupplierId ||
                        storedSupplierId === "null" ||
                        storedSupplierId === "undefined"
                    ) {

                        setError(
                            "Supplier ID not found. Please login again."
                        );

                        setPayments([]);

                        return;

                    }


                    setSupplierId(
                        storedSupplierId
                    );


                    /* ========================================
                       PAYMENT HISTORY API
                    ======================================== */

                    const response =
                        await api.get(
                            `/csv/payment-history/${storedSupplierId}`,
                            {
                                responseType: "text",
                                withCredentials: true
                            }
                        );


                    console.log(
                        "PAYMENT HISTORY CSV:",
                        response.data
                    );


                    /* ========================================
                       PARSE CSV
                    ======================================== */

                    const parsedPayments =
                        parseCSV(
                            response.data
                        );


                    console.log(
                        "PARSED PAYMENTS:",
                        parsedPayments
                    );


                    setPayments(
                        parsedPayments
                    );


                    /* ========================================
                       LOAD EXISTING LOCAL STORAGE
                    ======================================== */

                    const storedStatuses =
                        loadStoredTrackingStatuses();


                    /* ========================================
                       RESTORE TRACKING STATUS
                    ======================================== */

                    const restoredTrackingStatuses = {
                        ...storedStatuses
                    };


                    parsedPayments.forEach(
                        (transaction) => {

                            /* ==================================
                               REQUEST ID
                            ================================== */

                            const requestId =
                                getValue(
                                    transaction.request_id,
                                    transaction.purchase_request_id,
                                    transaction.purchaserequest_id,
                                    transaction.requestid
                                );


                            if (!requestId) {

                                return;

                            }


                            const cleanRequestId =
                                String(
                                    requestId
                                ).trim();


                            /* ==================================
                               CSV TRACKING STATUS
                            ================================== */

                            const csvTrackingStatus =
                                normalizeStatus(
                                    getValue(
                                        transaction.tracking_status,
                                        transaction.delivery_status,
                                        transaction.order_status
                                    )
                                );


                            /* ==================================
                               IF CSV HAS TRACKING STATUS
                            ================================== */

                            if (
                                csvTrackingStatus ===
                                "DISPATCHED"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "DISPATCHED";

                            }

                            else if (
                                csvTrackingStatus ===
                                "IN_TRANSIT"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "IN_TRANSIT";

                            }

                            else if (
                                csvTrackingStatus ===
                                "NEARER"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "NEARER";

                            }

                            else if (
                                csvTrackingStatus ===
                                "NEAR_YOU"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "NEARER";

                            }

                            else if (
                                csvTrackingStatus ===
                                "NEARER_TO_YOU"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "NEARER";

                            }

                            else if (
                                csvTrackingStatus ===
                                "DELIVERED"
                            ) {

                                restoredTrackingStatuses[
                                    cleanRequestId
                                ] =
                                    "DELIVERED";

                            }

                            /*
                             * IMPORTANT:
                             *
                             * If CSV does not have a tracking
                             * status, DO NOT overwrite the
                             * localStorage status.
                             *
                             * This is what makes refresh work.
                             */

                        }
                    );


                    /* ========================================
                       SAVE MERGED STATUS
                    ======================================== */

                    setTrackingStatuses(
                        restoredTrackingStatuses
                    );


                    saveTrackingStatuses(
                        restoredTrackingStatuses
                    );


                    /* ========================================
                       NO DATA
                    ======================================== */

                    if (
                        parsedPayments.length === 0
                    ) {

                        setError(
                            "No payment transactions were found for this supplier."
                        );

                    }

                }

                catch (err) {

                    console.error(
                        "Unable to retrieve supplier payment history:",
                        err
                    );


                    console.error(
                        "HTTP STATUS:",
                        err?.response?.status
                    );


                    console.error(
                        "BACKEND RESPONSE:",
                        err?.response?.data
                    );


                    let backendMessage = "";


                    if (
                        typeof err?.response?.data ===
                        "string"
                    ) {

                        backendMessage =
                            err.response.data;

                    }

                    else {

                        backendMessage =
                            err?.response?.data?.message ||
                            err?.response?.data?.error ||
                            "";

                    }


                    if (
                        err?.response?.status ===
                        404
                    ) {

                        setError(
                            backendMessage ||
                            "Payment history endpoint was not found."
                        );

                    }

                    else if (
                        err?.response?.status === 401 ||
                        err?.response?.status === 403
                    ) {

                        setError(
                            backendMessage ||
                            "You are not authorized to view payment transactions."
                        );

                    }

                    else {

                        setError(
                            backendMessage ||
                            "Unable to retrieve supplier payment transactions."
                        );

                    }


                    setPayments([]);

                }

                finally {

                    setLoading(false);

                }

            },
            []
        );


    /* ========================================================
       LOAD PAGE
    ======================================================== */

    useEffect(() => {

        loadTrackingData();

    }, [
        loadTrackingData
    ]);


    /* ========================================================
       FORMAT CURRENCY
    ======================================================== */

    const formatCurrency =
        (value) => {

            return Number(
                value || 0
            ).toLocaleString(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2
                }
            );

        };


    /* ========================================================
       BACK
    ======================================================== */

    const handleBack =
        () => {

            navigate(
                "/supplier/dashboard"
            );

        };


    /* ========================================================
       REFRESH
    ======================================================== */

    const handleRefresh =
        async () => {

            await loadTrackingData();

        };


    /* ========================================================
       GET TRACKING STATUS

       IMPORTANT:

       If no status exists, return NOT_STARTED.
    ======================================================== */

    const getTrackingStatus =
        (requestId) => {

            const cleanRequestId =
                String(
                    requestId ?? ""
                ).trim();


            return (
                trackingStatuses[
                    cleanRequestId
                ] ||
                "NOT_STARTED"
            );

        };


    /* ========================================================
       GET DISPLAY TEXT
    ======================================================== */

    const getTrackingStatusText =
        (status) => {

            if (
                status === "DISPATCHED"
            ) {

                return "Dispatched";

            }


            if (
                status === "IN_TRANSIT"
            ) {

                return "In Transit";

            }


            if (
                status === "NEARER"
            ) {

                return "Nearer to You";

            }


            if (
                status === "DELIVERED"
            ) {

                return "Delivered";

            }


            return "Not Started";

        };


    /* ========================================================
       TRACKING STATUS API
    ======================================================== */

    const handleTrackingStatus =
        async (
            requestId,
            status
        ) => {

            /* ====================================================
               CLEAN REQUEST ID
            ==================================================== */

            const cleanRequestId =
                String(
                    requestId ?? ""
                ).trim();


            /* ====================================================
               VALIDATE REQUEST ID
            ==================================================== */

            if (
                !cleanRequestId ||
                cleanRequestId === "Not available" ||
                cleanRequestId === "null" ||
                cleanRequestId === "undefined"
            ) {

                setError(
                    "Request ID is not available for this transaction."
                );

                return;

            }


            /* ====================================================
               CONVERT REQUEST ID TO NUMBER
            ==================================================== */

            const numericRequestId =
                Number(
                    cleanRequestId
                );


            /* ====================================================
               VALIDATE REQUEST ID
            ==================================================== */

            if (
                !Number.isInteger(
                    numericRequestId
                ) ||
                numericRequestId <= 0
            ) {

                setError(
                    `Invalid Request ID: ${cleanRequestId}`
                );

                return;

            }


            /* ====================================================
               VALIDATE STATUS
            ==================================================== */

            const allowedStatuses = [
                "DISPATCHED",
                "IN_TRANSIT",
                "NEARER",
                "DELIVERED"
            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                setError(
                    "Invalid tracking status."
                );

                return;

            }


            try {

                setProcessingAction(
                    `${numericRequestId}-${status}`
                );

                setError("");

                setSuccessMessage("");


                /* =================================================
                   DIFFERENT API URL FOR EACH STATUS
                ================================================= */

                let trackingUrl;


                /* =================================================
                   DISPATCHED
                ================================================= */

                if (
                    status ===
                    "DISPATCHED"
                ) {

                    trackingUrl =
                        `/raiserequest/tracking/${numericRequestId}?orderstatus=DISPATCHED&location=Vizianagaram Warehouse`;

                }


                /* =================================================
                   IN TRANSIT
                ================================================= */

                else if (
                    status ===
                    "IN_TRANSIT"
                ) {

                    trackingUrl =
                        `/raiserequest/tracking/${numericRequestId}?orderstatus=IN_TRANSIT&location=Vizianagaram Warehouse`;

                }


                /* =================================================
                   NEARER TO YOU
                ================================================= */

                else if (
                    status ===
                    "NEARER"
                ) {

                    trackingUrl =
                        `/raiserequest/tracking/${numericRequestId}?orderstatus=NEAR_YOU&location=Vizag Warehouse`;

                }


                /* =================================================
                   DELIVERED
                ================================================= */

                else if (
                    status ===
                    "DELIVERED"
                ) {

                    trackingUrl =
                        `/raiserequest/tracking/${numericRequestId}?orderstatus=DELIVERED&location=madhuravada`;

                }


                /* =================================================
                   DEBUG
                ================================================= */

                console.log(
                    "=========================================="
                );

                console.log(
                    "SUPPLIER TRACKING API"
                );

                console.log(
                    "METHOD: PUT"
                );

                console.log(
                    "REQUEST ID:",
                    numericRequestId
                );

                console.log(
                    "TRACKING STATUS:",
                    status
                );

                console.log(
                    "API URL:",
                    trackingUrl
                );

                console.log(
                    "REQUEST BODY: NONE"
                );

                console.log(
                    "=========================================="
                );


                /* =================================================
                   API CALL

                   NO REQUEST BODY
                ================================================= */

                const response =
                    await api.put(
                        trackingUrl,
                        undefined,
                        {
                            withCredentials: true
                        }
                    );


                console.log(
                    "TRACKING API RESPONSE:",
                    response.data
                );


                /* =================================================
                   UPDATE TRACKING STATE

                   IMPORTANT:

                   KEY = REQUEST ID

                   NOT PAYMENT ID.

                   This makes the state stable even if payment
                   data is reloaded.
                ================================================= */

                setTrackingStatuses(
                    (previous) => {

                        const updated = {
                            ...previous,

                            [String(
                                numericRequestId
                            )]:
                                status
                        };


                        /* ========================================
                           SAVE TO LOCAL STORAGE
                        ======================================== */

                        saveTrackingStatuses(
                            updated
                        );


                        return updated;

                    }
                );


                /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

                const statusText =
                    getTrackingStatusText(
                        status
                    );


                setSuccessMessage(
                    `Request #${numericRequestId} is now ${statusText}.`
                );

            }

            catch (err) {

                console.error(
                    "=========================================="
                );

                console.error(
                    "TRACKING API FAILED"
                );

                console.error(
                    "STATUS:",
                    err?.response?.status
                );

                console.error(
                    "RESPONSE:",
                    err?.response?.data
                );

                console.error(
                    "=========================================="
                );


                let backendMessage = "";


                if (
                    typeof err?.response?.data ===
                    "string"
                ) {

                    backendMessage =
                        err.response.data;

                }

                else {

                    backendMessage =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "";

                }


                setError(
                    backendMessage ||
                    `Unable to update request #${numericRequestId} to ${status}.`
                );

            }

            finally {

                setProcessingAction(
                    null
                );

            }

        };


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <div className="supplier-tracking-page">


            {/* ==================================================
                TOP BAR
            ================================================== */}

            <header className="tracking-topbar">

                <div className="tracking-brand">

                    <div className="tracking-brand-mark">
                        P
                    </div>


                    <div>

                        <strong>
                            PROCUREX
                        </strong>

                        <span>
                            SUPPLIER PORTAL
                        </span>

                    </div>

                </div>


                <div className="tracking-secure">

                    <ShieldCheck
                        size={15}
                    />

                    Secure Supplier Portal

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="tracking-main">


                {/* ==================================================
                    BACK
                ================================================== */}

                <button
                    type="button"
                    className="tracking-back"
                    onClick={handleBack}
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to dashboard

                </button>


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <section className="tracking-heading">

                    <div>

                        <span className="tracking-eyebrow">
                            TRANSACTION DETAILS
                        </span>


                        <h1>
                            Payment transactions
                        </h1>


                        <p>
                            View all payment transactions
                            associated with your supplier
                            account.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={loading}
                    >

                        {loading ? (

                            <Loader2
                                size={16}
                                className="spin"
                            />

                        ) : (

                            <RefreshCw
                                size={16}
                            />

                        )}


                        {loading
                            ? "Loading..."
                            : "Refresh"
                        }

                    </button>

                </section>


                {/* ==================================================
                    SUPPLIER INFORMATION
                ================================================== */}

                <section className="tracking-information">

                    <div className="information-icon">

                        <User
                            size={20}
                        />

                    </div>


                    <div>

                        <strong>
                            Supplier ID
                        </strong>


                        <p>
                            {supplierId}
                        </p>

                    </div>

                </section>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (

                    <div className="tracking-information">

                        <div className="information-icon">

                            <Loader2
                                size={20}
                                className="spin"
                            />

                        </div>


                        <div>

                            <strong>
                                Loading transactions
                            </strong>


                            <p>
                                Retrieving all payment
                                transactions.
                            </p>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {successMessage && (

                    <div className="tracking-success">

                        <CheckCircle2
                            size={18}
                        />

                        <span>
                            {successMessage}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="tracking-error">

                        <AlertCircle
                            size={18}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    PAYMENT DETAILS
                ================================================== */}

                {!loading &&
                    payments.length > 0 && (

                    <section className="tracking-card payment-details-card">


                        {/* ==================================================
                            CARD HEADER
                        ================================================== */}

                        <div className="card-heading">

                            <div>

                                <span>
                                    PAYMENT INFORMATION
                                </span>


                                <h2>
                                    Transaction details
                                </h2>

                            </div>


                            <div className="summary-shield">

                                <CreditCard
                                    size={17}
                                />

                            </div>

                        </div>


                        {/* ==================================================
                            TRANSACTION COUNT
                        ================================================== */}

                        <div className="transaction-count">

                            <div className="transaction-count-icon">

                                <CreditCard
                                    size={18}
                                />

                            </div>


                            <div>

                                <span>
                                    TOTAL TRANSACTIONS
                                </span>


                                <strong>
                                    {payments.length}
                                </strong>

                            </div>

                        </div>


                        {/* ==================================================
                            TRANSACTIONS
                        ================================================== */}

                        <div className="transactions-list">

                            {payments.map(
                                (transaction, index) => {


                                    /* ========================================
                                       PAYMENT ID
                                    ======================================== */

                                    const paymentId =
                                        getValue(
                                            transaction.payment_id,
                                            transaction.paymentid,
                                            transaction.id,
                                            "Not available"
                                        );


                                    /* ========================================
                                       REQUEST ID
                                    ======================================== */

                                    const requestId =
                                        getValue(
                                            transaction.request_id,
                                            transaction.purchase_request_id,
                                            transaction.purchaserequest_id,
                                            transaction.requestid,
                                            "Not available"
                                        );


                                    /* ========================================
                                       PRODUCT
                                    ======================================== */

                                    const productName =
                                        getValue(
                                            transaction.product_name,
                                            transaction.product,
                                            "Product"
                                        );


                                    /* ========================================
                                       QUANTITY
                                    ======================================== */

                                    const quantity =
                                        getValue(
                                            transaction.quantity,
                                            "0"
                                        );


                                    /* ========================================
                                       AMOUNT
                                    ======================================== */

                                    const amount =
                                        toNumber(
                                            transaction.amount
                                        );


                                    /* ========================================
                                       PAYMENT METHOD
                                    ======================================== */

                                    const paymentMethod =
                                        getValue(
                                            transaction.payment_method,
                                            "Not available"
                                        );


                                    /* ========================================
                                       PAYMENT STATUS
                                    ======================================== */

                                    const paymentStatus =
                                        normalizeStatus(
                                            getValue(
                                                transaction.payment_status,
                                                "PENDING"
                                            )
                                        ) ||
                                        "PENDING";


                                    const isCompleted =
                                        paymentStatus === "PAYED" ||
                                        paymentStatus === "PAID" ||
                                        paymentStatus === "VERIFIED";


                                    /* ========================================
                                       TRACKING STATUS

                                       IMPORTANT:
                                       Uses REQUEST ID.
                                    ======================================== */

                                    const trackingStatus =
                                        getTrackingStatus(
                                            requestId
                                        );


                                    return (

                                        <div
                                            className="transaction-item"
                                            key={
                                                paymentId !==
                                                "Not available"
                                                    ? paymentId
                                                    : index
                                            }
                                        >


                                            {/* ==================================
                                                TRANSACTION HEADER
                                            ================================== */}

                                            <div className="transaction-header">

                                                <div className="transaction-number">

                                                    <span>
                                                        TRANSACTION
                                                    </span>


                                                    <strong>
                                                        #{index + 1}
                                                    </strong>

                                                </div>


                                                <div
                                                    className={
                                                        isCompleted
                                                            ? "transaction-status transaction-status-paid"
                                                            : "transaction-status transaction-status-pending"
                                                    }
                                                >

                                                    {isCompleted ? (

                                                        <CheckCircle2
                                                            size={14}
                                                        />

                                                    ) : (

                                                        <Clock3
                                                            size={14}
                                                        />

                                                    )}


                                                    {paymentStatus}

                                                </div>

                                            </div>


                                            {/* ==================================
                                                TRANSACTION GRID
                                            ================================== */}

                                            <div className="transaction-grid">


                                                {/* PAYMENT ID */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <Hash
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Payment ID
                                                        </span>


                                                        <strong>
                                                            {paymentId}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* REQUEST ID */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <Hash
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Request ID
                                                        </span>


                                                        <strong>
                                                            {requestId}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* PRODUCT */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <Package
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Product
                                                        </span>


                                                        <strong>
                                                            {productName}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* QUANTITY */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <Package
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Quantity
                                                        </span>


                                                        <strong>
                                                            {quantity}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* PAYMENT METHOD */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <CreditCard
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Payment method
                                                        </span>


                                                        <strong>
                                                            {paymentMethod}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* PAYMENT STATUS */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <CheckCircle2
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Payment status
                                                        </span>


                                                        <strong>
                                                            {paymentStatus}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* AMOUNT */}

                                                <div className="transaction-field transaction-amount">

                                                    <div className="transaction-field-icon">

                                                        <IndianRupee
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Amount paid
                                                        </span>


                                                        <strong>
                                                            {formatCurrency(
                                                                amount
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* SUPPLIER */}

                                                <div className="transaction-field">

                                                    <div className="transaction-field-icon">

                                                        <Building2
                                                            size={15}
                                                        />

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Supplier ID
                                                        </span>


                                                        <strong>
                                                            {supplierId}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ==================================================
                                                DELIVERY TRACKING
                                            ================================================== */}

                                            <div className="payment-tracking-section">


                                                {/* ==========================================
                                                    TRACKING HEADER
                                                ========================================== */}

                                                <div className="payment-tracking-header">

                                                    <div>

                                                        <span>
                                                            DELIVERY TRACKING
                                                        </span>


                                                        <strong>
                                                            Request #{requestId}
                                                        </strong>

                                                    </div>


                                                    {/* ======================================
                                                        CURRENT STATUS
                                                    ====================================== */}

                                                    <div
                                                        className={
                                                            trackingStatus === "NOT_STARTED"
                                                                ? "tracking-current-status tracking-not-started"
                                                                : "tracking-current-status"
                                                        }
                                                    >

                                                        {trackingStatus ===
                                                            "DISPATCHED" && (
                                                            <>

                                                                <Truck
                                                                    size={15}
                                                                />

                                                                Dispatched

                                                            </>
                                                        )}


                                                        {trackingStatus ===
                                                            "IN_TRANSIT" && (
                                                            <>

                                                                <Truck
                                                                    size={15}
                                                                />

                                                                In Transit

                                                            </>
                                                        )}


                                                        {trackingStatus ===
                                                            "NEARER" && (
                                                            <>

                                                                <MapPin
                                                                    size={15}
                                                                />

                                                                Nearer to You

                                                            </>
                                                        )}


                                                        {trackingStatus ===
                                                            "DELIVERED" && (
                                                            <>

                                                                <PackageCheck
                                                                    size={15}
                                                                />

                                                                Delivered

                                                            </>
                                                        )}


                                                        {trackingStatus ===
                                                            "NOT_STARTED" && (
                                                            <>

                                                                <Clock3
                                                                    size={15}
                                                                />

                                                                Not Started

                                                            </>
                                                        )}

                                                    </div>

                                                </div>


                                                {/* ==========================================
                                                    TRACKING BUTTONS
                                                ========================================== */}

                                                <div className="payment-tracking-buttons">


                                                    {/* ====================================
                                                        DISPATCHED
                                                    ==================================== */}

                                                    <button
                                                        type="button"
                                                        className={
                                                            trackingStatus ===
                                                            "DISPATCHED"
                                                                ? "tracking-action-button tracking-dispatch active"
                                                                : "tracking-action-button tracking-dispatch"
                                                        }
                                                        onClick={() =>
                                                            handleTrackingStatus(
                                                                requestId,
                                                                "DISPATCHED"
                                                            )
                                                        }
                                                        disabled={
                                                            processingAction !== null
                                                        }
                                                    >

                                                        {processingAction ===
                                                            `${Number(requestId)}-DISPATCHED`
                                                            ? (

                                                            <Loader2
                                                                size={17}
                                                                className="spin"
                                                            />

                                                        )
                                                            : (

                                                            <Truck
                                                                size={17}
                                                            />

                                                        )}


                                                        <span>
                                                            Dispatched
                                                        </span>

                                                    </button>


                                                    {/* ====================================
                                                        IN TRANSIT
                                                    ==================================== */}

                                                    <button
                                                        type="button"
                                                        className={
                                                            trackingStatus ===
                                                            "IN_TRANSIT"
                                                                ? "tracking-action-button tracking-transit active"
                                                                : "tracking-action-button tracking-transit"
                                                        }
                                                        onClick={() =>
                                                            handleTrackingStatus(
                                                                requestId,
                                                                "IN_TRANSIT"
                                                            )
                                                        }
                                                        disabled={
                                                            processingAction !== null
                                                        }
                                                    >

                                                        {processingAction ===
                                                            `${Number(requestId)}-IN_TRANSIT`
                                                            ? (

                                                            <Loader2
                                                                size={17}
                                                                className="spin"
                                                            />

                                                        )
                                                            : (

                                                            <Truck
                                                                size={17}
                                                            />

                                                        )}


                                                        <span>
                                                            In Transit
                                                        </span>

                                                    </button>


                                                    {/* ====================================
                                                        NEARER TO YOU
                                                    ==================================== */}

                                                    <button
                                                        type="button"
                                                        className={
                                                            trackingStatus ===
                                                            "NEARER"
                                                                ? "tracking-action-button tracking-nearer active"
                                                                : "tracking-action-button tracking-nearer"
                                                        }
                                                        onClick={() =>
                                                            handleTrackingStatus(
                                                                requestId,
                                                                "NEARER"
                                                            )
                                                        }
                                                        disabled={
                                                            processingAction !== null
                                                        }
                                                    >

                                                        {processingAction ===
                                                            `${Number(requestId)}-NEARER`
                                                            ? (

                                                            <Loader2
                                                                size={17}
                                                                className="spin"
                                                            />

                                                        )
                                                            : (

                                                            <MapPin
                                                                size={17}
                                                            />

                                                        )}


                                                        <span>
                                                            Nearer to You
                                                        </span>

                                                    </button>


                                                    {/* ====================================
                                                        DELIVERED
                                                    ==================================== */}

                                                    <button
                                                        type="button"
                                                        className={
                                                            trackingStatus ===
                                                            "DELIVERED"
                                                                ? "tracking-action-button tracking-delivered active"
                                                                : "tracking-action-button tracking-delivered"
                                                        }
                                                        onClick={() =>
                                                            handleTrackingStatus(
                                                                requestId,
                                                                "DELIVERED"
                                                            )
                                                        }
                                                        disabled={
                                                            processingAction !== null
                                                        }
                                                    >

                                                        {processingAction ===
                                                            `${Number(requestId)}-DELIVERED`
                                                            ? (

                                                            <Loader2
                                                                size={17}
                                                                className="spin"
                                                            />

                                                        )
                                                            : (

                                                            <PackageCheck
                                                                size={17}
                                                            />

                                                        )}


                                                        <span>
                                                            Delivered
                                                        </span>

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}


                {/* ==================================================
                    PAYMENT COUNT
                ================================================== */}

                {!loading &&
                    payments.length > 0 && (

                    <section className="tracking-information">

                        <div className="information-icon">

                            <CreditCard
                                size={20}
                            />

                        </div>


                        <div>

                            <strong>
                                Payment history retrieved
                            </strong>


                            <p>

                                Total payment records
                                returned for supplier{" "}

                                <strong>
                                    {supplierId}
                                </strong>

                                :{" "}

                                <strong>
                                    {payments.length}
                                </strong>

                            </p>

                        </div>

                    </section>

                )}


                {/* ==================================================
                    NO PAYMENT
                ================================================== */}

                {!loading &&
                    payments.length === 0 &&
                    !error && (

                    <section className="tracking-information">

                        <div className="information-icon">

                            <ShieldCheck
                                size={20}
                            />

                        </div>


                        <div>

                            <strong>
                                No transactions found
                            </strong>


                            <p>
                                No payment transactions
                                are currently available
                                for this supplier.
                            </p>

                        </div>

                    </section>

                )}


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer className="tracking-footer">

                    <span>
                        © 2026 PROCUREX
                    </span>


                    <span>
                        Supplier Procurement Portal
                    </span>


                    <div>

                        <span>

                            <ShieldCheck
                                size={12}
                            />

                            Secure

                        </span>


                        <span>

                            <CheckCircle2
                                size={12}
                            />

                            Verified

                        </span>

                    </div>

                </footer>

            </main>

        </div>

    );

}
