import React, { useState } from "react";
import axios from "axios";

export default function ManagerLogin() {

    const BASE_URL = "http://localhost:8081";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // MANAGER LOGIN
    // POST /manager/login
    // ==========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const response = await axios.post(
                `${BASE_URL}/manager/login`,
                {
                    email: email,
                    password: password
                }
            );

            console.log(response.data);

            alert(response.data);

            // Store manager login information

            localStorage.setItem(
                "managerEmail",
                email
            );

            localStorage.setItem(
                "role",
                "MANAGER"
            );

            // Navigate to manager dashboard

            window.location.href =
                "/manager/dashboard";

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Manager login failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h1 className="text-2xl font-bold mb-2">

                    Manager Login

                </h1>

                <p className="text-gray-500 mb-6">

                    Login to your manager account

                </p>


                {/* ERROR */}

                {error && (

                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">

                        {error}

                    </div>

                )}


                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">

                            Email

                        </label>

                        <input

                            type="email"

                            value={email}

                            onChange={(e) =>
                                setEmail(e.target.value)
                            }

                            placeholder="manager@gmail.com"

                            className="w-full border rounded-lg px-4 py-3"

                            required

                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="mb-6">

                        <label className="block mb-2 font-medium">

                            Password

                        </label>

                        <input

                            type="password"

                            value={password}

                            onChange={(e) =>
                                setPassword(e.target.value)
                            }

                            placeholder="Enter password"

                            className="w-full border rounded-lg px-4 py-3"

                            required

                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"

                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

            </div>

        </div>

    );
}