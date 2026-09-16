import React, { useState } from "react";
import axios from "axios";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Email() {

    const BASE_URL = "http://localhost:8081";

    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // SEND EMAIL
    //
    // POST
    // http://localhost:8081/email/send
    // ==========================================

    const sendEmail = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            setLoading(true);

            const response = await axios.post(
                `${BASE_URL}/email/send`,
                {
                    to: to,
                    subject: subject,
                    body: body
                }
            );

            setMessage(
                response.data
            );

            setTo("");
            setSubject("");
            setBody("");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Failed to send email"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <DashboardLayout>

            <div className="p-6">

                <div className="max-w-3xl mx-auto">

                    <div className="bg-white rounded-xl shadow p-6">

                        <h1 className="text-2xl font-bold mb-2">

                            Send Email

                        </h1>

                        <p className="text-gray-500 mb-6">

                            Send an email through the backend

                        </p>


                        {/* SUCCESS */}

                        {message && (

                            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">

                                {message}

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">

                                {error}

                            </div>

                        )}


                        <form onSubmit={sendEmail}>


                            {/* TO */}

                            <div className="mb-4">

                                <label className="block font-medium mb-2">

                                    To

                                </label>

                                <input

                                    type="email"

                                    value={to}

                                    onChange={(e) =>
                                        setTo(e.target.value)
                                    }

                                    placeholder="recipient@gmail.com"

                                    className="w-full border rounded-lg px-4 py-3"

                                    required

                                />

                            </div>


                            {/* SUBJECT */}

                            <div className="mb-4">

                                <label className="block font-medium mb-2">

                                    Subject

                                </label>

                                <input

                                    type="text"

                                    value={subject}

                                    onChange={(e) =>
                                        setSubject(e.target.value)
                                    }

                                    placeholder="Enter email subject"

                                    className="w-full border rounded-lg px-4 py-3"

                                    required

                                />

                            </div>


                            {/* BODY */}

                            <div className="mb-6">

                                <label className="block font-medium mb-2">

                                    Message

                                </label>

                                <textarea

                                    value={body}

                                    onChange={(e) =>
                                        setBody(e.target.value)
                                    }

                                    placeholder="Enter your message"

                                    rows="7"

                                    className="w-full border rounded-lg px-4 py-3"

                                    required

                                />

                            </div>


                            {/* BUTTON */}

                            <button

                                type="submit"

                                disabled={loading}

                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"

                            >

                                {loading
                                    ? "Sending..."
                                    : "Send Email"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}