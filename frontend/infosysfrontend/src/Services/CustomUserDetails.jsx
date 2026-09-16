import React, { useState } from "react";
import axios from "axios";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const BASE_URL = "http://localhost:8081";


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setError("");

            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                {
                    email: email,
                    password: password
                }
            );


            console.log("Login response:");
            console.log(response.data);


            // Store login information

            localStorage.setItem(
                "userEmail",
                response.data.email
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            localStorage.setItem(
                "userType",
                response.data.userType
            );


            // Role-based navigation

            if (
                response.data.role === "MANAGER"
            ) {

                window.location.href =
                    "/manager/dashboard";

            } else {

                window.location.href =
                    "/user/dashboard";

            }


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Invalid email or password"
            );

        }

    };


    return (

        <div>

            <h1>Login</h1>


            {error && (

                <p style={{ color: "red" }}>
                    {error}
                </p>

            )}


            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />


                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );
}