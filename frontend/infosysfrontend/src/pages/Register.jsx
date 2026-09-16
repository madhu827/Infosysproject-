
import React, { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    UserRound,
    Mail,
    LockKeyhole,
    Phone,
    BriefcaseBusiness,
    ArrowRight,
    Eye,
    EyeOff,
    Building2,
    Hash,
    MapPin,
    ShieldCheck,
    Package
} from "lucide-react";

import api from "../api/client";
import "../css/pages/Register.css";


/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {

    // USER
    userName: "",
    user_phoneno: "",
    email: "",
    user_password: "",
    designation: "",
    department: "",

    // MANAGER
    managerName: "",
    password: "",

    // SUPPLIER
    suppliername: "",
    phone: "",
    address: "",
    productType: "",
    gstNumber: ""
};


/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
    name,
    type = "text",
    placeholder,
    icon: Icon,
    formData,
    handleChange,
    errors
}) => {
    return (
        <div className="form-group">

            <label>{placeholder}</label>

            <div className="input-wrapper">

                {Icon && <Icon size={18} />}

                <input
                    type={type}
                    name={name}
                    value={formData[name] ?? ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete="off"
                />

            </div>

            {errors[name] && (
                <span className="field-error">
                    {errors[name]}
                </span>
            )}

        </div>
    );
};


/* =========================================================
   PASSWORD FIELD
========================================================= */

const PasswordField = ({
    name,
    label = "Password",
    formData,
    handleChange,
    errors,
    showPassword,
    setShowPassword
}) => {

    return (
        <div className="form-group">

            <label>{label}</label>

            <div className="input-wrapper">

                <LockKeyhole size={18} />

                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={formData[name] ?? ""}
                    onChange={handleChange}
                    placeholder={label}
                    autoComplete="new-password"
                />

                <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                        setShowPassword(previous => !previous)
                    }
                >

                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}

                </button>

            </div>

            {errors[name] && (
                <span className="field-error">
                    {errors[name]}
                </span>
            )}

        </div>
    );
};


/* =========================================================
   DEPARTMENT FIELD
========================================================= */

const DepartmentField = ({
    formData,
    handleChange,
    errors
}) => {

    return (
        <div className="form-group">

            <label>Department</label>

            <div className="input-wrapper">

                <BriefcaseBusiness size={18} />

                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter Department Name"
                    autoComplete="off"
                />

            </div>

            {errors.department && (
                <span className="field-error">
                    {errors.department}
                </span>
            )}

        </div>
    );
};


/* =========================================================
   REGISTER COMPONENT
========================================================= */

export default function Register() {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [role, setRole] = useState("USER");

    const [formData, setFormData] =
        useState(initialFormData);

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [serverError, setServerError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

        setErrors(previous => ({
            ...previous,
            [name]: ""
        }));

        setServerError("");
        setSuccessMessage("");
    };


    /* =====================================================
       ROLE CHANGE
    ===================================================== */

    const handleRoleChange = (newRole) => {

        setRole(newRole);

        setFormData({
            ...initialFormData
        });

        setErrors({});
        setServerError("");
        setSuccessMessage("");
        setShowPassword(false);
    };


    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {

        const newErrors = {};


        /* =================================================
           USER VALIDATION
        ================================================= */

        if (role === "USER") {

            if (!formData.userName.trim()) {

                newErrors.userName =
                    "User name is required";
            }


            if (!formData.email.trim()) {

                newErrors.email =
                    "Email is required";

            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email.trim()
                )
            ) {

                newErrors.email =
                    "Enter a valid email";
            }


            if (!formData.user_password) {

                newErrors.user_password =
                    "Password is required";

            } else if (
                formData.user_password.length < 4
            ) {

                newErrors.user_password =
                    "Password must contain at least 4 characters";
            }


            if (!formData.user_phoneno.trim()) {

                newErrors.user_phoneno =
                    "Phone number is required";

            } else if (
                !/^[6-9]\d{9}$/.test(
                    formData.user_phoneno.trim()
                )
            ) {

                newErrors.user_phoneno =
                    "Enter a valid 10-digit phone number";
            }


            if (!formData.designation.trim()) {

                newErrors.designation =
                    "Designation is required";
            }


            if (!formData.department.trim()) {

                newErrors.department =
                    "Department name is required";
            }
        }


        /* =================================================
           MANAGER VALIDATION
        ================================================= */

        if (role === "MANAGER") {

            if (!formData.managerName.trim()) {

                newErrors.managerName =
                    "Manager name is required";
            }


            if (!formData.email.trim()) {

                newErrors.email =
                    "Email is required";

            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email.trim()
                )
            ) {

                newErrors.email =
                    "Enter a valid email";
            }


            if (!formData.password) {

                newErrors.password =
                    "Password is required";

            } else if (
                formData.password.length < 4
            ) {

                newErrors.password =
                    "Password must contain at least 4 characters";
            }


            if (!formData.department.trim()) {

                newErrors.department =
                    "Department name is required";
            }
        }


        /* =================================================
           SUPPLIER VALIDATION
           
           IMPORTANT:
           Backend DTO expects:
           suppliername
           phone
           address
           productType
           email
           password
           gstNumber
        ================================================= */

        if (role === "SUPPLIER") {

            if (!formData.suppliername.trim()) {

                newErrors.suppliername =
                    "Supplier name is required";
            }


            if (!formData.phone.trim()) {

                newErrors.phone =
                    "Phone number is required";

            } else if (
                !/^[6-9]\d{9}$/.test(
                    formData.phone.trim()
                )
            ) {

                newErrors.phone =
                    "Enter a valid 10-digit phone number";
            }


            if (!formData.address.trim()) {

                newErrors.address =
                    "Address is required";
            }


            if (!formData.productType.trim()) {

                newErrors.productType =
                    "Product type is required";
            }


            if (!formData.email.trim()) {

                newErrors.email =
                    "Email is required";

            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email.trim()
                )
            ) {

                newErrors.email =
                    "Enter a valid email";
            }


            if (!formData.password) {

                newErrors.password =
                    "Password is required";

            } else if (
                formData.password.length < 4
            ) {

                newErrors.password =
                    "Password must contain at least 4 characters";
            }


            if (!formData.gstNumber.trim()) {

                newErrors.gstNumber =
                    "GST number is required";
            }
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /* =====================================================
       CREATE REQUEST BODY
    ===================================================== */

    const createRequestBody = () => {


        /* =================================================
           USER
        ================================================= */

        if (role === "USER") {

            return {

                userName:
                    formData.userName.trim(),

                user_phoneno:
                    formData.user_phoneno.trim(),

                email:
                    formData.email.trim(),

                user_password:
                    formData.user_password,

                designation:
                    formData.designation.trim(),

                department:
                    formData.department.trim()
            };
        }


        /* =================================================
           MANAGER
        ================================================= */

        if (role === "MANAGER") {

            return {

                managerName:
                    formData.managerName.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password,

                department:
                    formData.department.trim()
            };
        }


        /* =================================================
           SUPPLIER
           
           FIX:
           suppliername is used instead of name
        ================================================= */

        if (role === "SUPPLIER") {

            return {

                suppliername:
                    formData.suppliername.trim(),

                phone:
                    formData.phone.trim(),

                address:
                    formData.address.trim(),

                productType:
                    formData.productType.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password,

                gstNumber:
                    formData.gstNumber.trim()
            };
        }


        return null;
    };


    /* =====================================================
       REGISTER ENDPOINT
    ===================================================== */

    const getRegisterEndpoint = () => {

        if (role === "USER") {

            return "/user/register";
        }

        if (role === "MANAGER") {

            return "/manager/register";
        }

        if (role === "SUPPLIER") {

            return "/supplier/register";
        }

        return null;
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setServerError("");
        setSuccessMessage("");


        /* =================================================
           VALIDATE
        ================================================= */

        const isValid = validateForm();

        if (!isValid) {

            console.log(
                "Registration validation failed"
            );

            return;
        }


        setLoading(true);


        try {

            const requestBody =
                createRequestBody();

            const endpoint =
                getRegisterEndpoint();


            if (!endpoint) {

                setServerError(
                    "Invalid registration role."
                );

                return;
            }


            console.log(
                "================================"
            );

            console.log(
                "REGISTER ROLE:",
                role
            );

            console.log(
                "REGISTER ENDPOINT:",
                endpoint
            );

            console.log(
                "REQUEST BODY:",
                requestBody
            );

            console.log(
                "================================"
            );


            /* =================================================
               API REQUEST
            ================================================= */

            const response =
                await api.post(
                    endpoint,
                    requestBody
                );


            console.log(
                "Registration response:",
                response.data
            );


            setSuccessMessage(
                `${role} registered successfully! Redirecting to login...`
            );


            /* =================================================
               REDIRECT
            ================================================= */

            setTimeout(() => {

                navigate("/login");

            }, 2000);


        } catch (error) {

            console.error(
                "Registration Error:",
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


            if (error.response) {

                const status =
                    error.response.status;

                const data =
                    error.response.data;


                /* =================================================
                   VALIDATION ERROR
                ================================================= */

                if (status === 400) {

                    if (data?.errors) {

                        if (
                            typeof data.errors === "object"
                        ) {

                            setServerError(
                                Object.values(
                                    data.errors
                                ).join(", ")
                            );

                        } else {

                            setServerError(
                                String(data.errors)
                            );
                        }

                    } else if (data?.message) {

                        setServerError(
                            data.message
                        );

                    } else if (
                        typeof data === "string"
                    ) {

                        setServerError(data);

                    } else {

                        setServerError(
                            "Please check the entered details."
                        );
                    }
                }


                /* =================================================
                   FORBIDDEN
                ================================================= */

                else if (status === 403) {

                    setServerError(
                        "Access denied. Please check the backend security configuration."
                    );
                }


                /* =================================================
                   UNAUTHORIZED
                ================================================= */

                else if (status === 401) {

                    setServerError(
                        "Authentication required."
                    );
                }


                /* =================================================
                   NOT FOUND
                ================================================= */

                else if (status === 404) {

                    setServerError(
                        `Registration endpoint not found: ${endpoint}`
                    );
                }


                /* =================================================
                   SERVER ERROR
                ================================================= */

                else if (status === 500) {

                    setServerError(
                        "Server error. Check the Spring Boot console."
                    );
                }


                else {

                    setServerError(
                        "Registration failed. Please check your details."
                    );
                }

            } else {

                setServerError(
                    "Unable to connect to the server. Please check whether Spring Boot is running."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       RETURN
    ===================================================== */

    return (

        <div className="register-page">

            <div className="register-container">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="register-left">

                    <div className="brand">

                        <div className="brand-logo">
                            P
                        </div>

                        <div>

                            <h2>
                                PROCURA
                            </h2>

                            <span>
                                Procurement Management
                            </span>

                        </div>

                    </div>


                    <div className="left-content">

                        <h1>
                            Create your account
                        </h1>

                        <p>
                            Register as a user, manager
                            or supplier and start using
                            the PROCURA procurement
                            management system.
                        </p>


                        <div className="feature">

                            <ShieldCheck size={22} />

                            <div>

                                <strong>
                                    Secure Registration
                                </strong>

                                <p>
                                    Your account information
                                    is securely managed.
                                </p>

                            </div>

                        </div>


                        <div className="feature">

                            <BriefcaseBusiness size={22} />

                            <div>

                                <strong>
                                    Role Based Access
                                </strong>

                                <p>
                                    Different account types
                                    have different permissions.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="register-right">

                    <div className="register-form-container">


                        {/* HEADER */}

                        <div className="form-header">

                            <h1>
                                Register
                            </h1>

                            <p>
                                Select your account type
                            </p>

                        </div>


                        {/* =================================================
                            ROLE SELECTOR
                        ================================================= */}

                        <div className="role-section">

                            <label>
                                Account Type
                            </label>

                            <div className="role-options">


                                {/* USER */}

                                <button
                                    type="button"
                                    className={
                                        role === "USER"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                    onClick={() =>
                                        handleRoleChange("USER")
                                    }
                                >

                                    <UserRound size={25} />

                                    <div>

                                        <strong>
                                            User
                                        </strong>

                                        <span>
                                            Request products
                                        </span>

                                    </div>

                                </button>


                                {/* MANAGER */}

                                <button
                                    type="button"
                                    className={
                                        role === "MANAGER"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                    onClick={() =>
                                        handleRoleChange("MANAGER")
                                    }
                                >

                                    <BriefcaseBusiness
                                        size={25}
                                    />

                                    <div>

                                        <strong>
                                            Manager
                                        </strong>

                                        <span>
                                            Manage procurement
                                        </span>

                                    </div>

                                </button>


                                {/* SUPPLIER */}

                                <button
                                    type="button"
                                    className={
                                        role === "SUPPLIER"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                    onClick={() =>
                                        handleRoleChange("SUPPLIER")
                                    }
                                >

                                    <Building2 size={25} />

                                    <div>

                                        <strong>
                                            Supplier
                                        </strong>

                                        <span>
                                            Supply products
                                        </span>

                                    </div>

                                </button>

                            </div>

                        </div>


                        {/* SERVER ERROR */}

                        {serverError && (

                            <div className="server-error">
                                {serverError}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {successMessage && (

                            <div className="success-message">
                                {successMessage}
                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form onSubmit={handleSubmit}>


                            {/* =================================================
                                USER
                            ================================================= */}

                            {role === "USER" && (

                                <>

                                    <InputField
                                        name="userName"
                                        placeholder="User Name"
                                        icon={UserRound}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <InputField
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        icon={Mail}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <InputField
                                        name="user_phoneno"
                                        type="tel"
                                        placeholder="Phone Number"
                                        icon={Phone}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <InputField
                                        name="designation"
                                        placeholder="Designation"
                                        icon={BriefcaseBusiness}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <DepartmentField
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <PasswordField
                                        name="user_password"
                                        label="Password"
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword}
                                    />

                                </>
                            )}


                            {/* =================================================
                                MANAGER
                            ================================================= */}

                            {role === "MANAGER" && (

                                <>

                                    <InputField
                                        name="managerName"
                                        placeholder="Manager Name"
                                        icon={UserRound}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <InputField
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        icon={Mail}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <DepartmentField
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    <PasswordField
                                        name="password"
                                        label="Password"
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword}
                                    />

                                </>
                            )}


                            {/* =================================================
                                SUPPLIER
                                
                                FIXED:
                                suppliername is now used everywhere
                            ================================================= */}

                            {role === "SUPPLIER" && (

                                <>

                                    {/* SUPPLIER NAME */}

                                    <InputField
                                        name="suppliername"
                                        placeholder="Supplier Name"
                                        icon={UserRound}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    {/* EMAIL */}

                                    <InputField
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        icon={Mail}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    {/* PHONE */}

                                    <InputField
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        icon={Phone}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    {/* GST NUMBER */}

                                    <InputField
                                        name="gstNumber"
                                        placeholder="GST Number"
                                        icon={Hash}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    {/* PRODUCT TYPE */}

                                    <InputField
                                        name="productType"
                                        placeholder="Product Type"
                                        icon={Package}
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                    />


                                    {/* ADDRESS */}

                                    <div className="form-group">

                                        <label>
                                            Address
                                        </label>

                                        <div className="input-wrapper">

                                            <MapPin size={18} />

                                            <textarea
                                                name="address"
                                                value={
                                                    formData.address
                                                }
                                                onChange={handleChange}
                                                placeholder="Supplier Address"
                                                rows="3"
                                            />

                                        </div>

                                        {errors.address && (

                                            <span className="field-error">

                                                {errors.address}

                                            </span>
                                        )}

                                    </div>


                                    {/* PASSWORD */}

                                    <PasswordField
                                        name="password"
                                        label="Password"
                                        formData={formData}
                                        handleChange={handleChange}
                                        errors={errors}
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword}
                                    />

                                </>
                            )}


                            {/* =================================================
                                CREATE BUTTON
                            ================================================= */}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Creating Account..."
                                    : `Create ${role} Account`
                                }

                                {!loading && (
                                    <ArrowRight size={19} />
                                )}

                            </button>

                        </form>


                        {/* LOGIN */}

                        <div className="login-link">

                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
