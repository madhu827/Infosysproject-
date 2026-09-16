import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  UserPlus,
  Pencil,
  Trash2,
  Search,
  X
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Users() {

  const BASE_URL = "http://localhost:8081";

  // ==========================================
  // STATES
  // ==========================================

  const [users, setUsers] = useState([]);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [designation, setDesignation] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // GET ALL USERS
  //
  // GET http://localhost:8081/user
  // ==========================================

  const getAllUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}/user`
      );

      setUsers(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // REGISTER USER
  //
  // POST http://localhost:8081/user/register
  // ==========================================

  const registerUser = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const user = {

        user_name: userName,

        user_password: password,

        email: email,

        user_phoneno: phoneNo,

        designation: designation,

        department: departmentId
          ? {
              departmentId:
                Number(departmentId)
            }
          : null

      };


      await axios.post(

        `${BASE_URL}/user/register`,

        user

      );


      alert(
        "User registered successfully"
      );


      clearForm();

      getAllUsers();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to register user"

      );

    }

  };


  // ==========================================
  // DELETE USER
  //
  // DELETE http://localhost:8081/user/{id}
  // ==========================================

  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      setError("");

      await axios.delete(

        `${BASE_URL}/user/${id}`

      );


      alert(
        "User deleted successfully"
      );


      getAllUsers();

    } catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to delete user"

      );

    }

  };


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {

    setUserName("");

    setEmail("");

    setPassword("");

    setPhoneNo("");

    setDesignation("");

    setDepartmentId("");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers =
    users.filter((user) => {

      const name =
        user.user_name
          ?.toLowerCase() || "";

      const userEmail =
        user.email
          ?.toLowerCase() || "";

      const userDesignation =
        user.designation
          ?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();


      return (

        name.includes(searchText) ||

        userEmail.includes(searchText) ||

        userDesignation.includes(searchText)

      );

    });


  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {

    getAllUsers();

  }, []);


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      <div className="p-6">


        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold">

            User Management

          </h1>

          <p className="text-gray-500">

            Manage registered users

          </p>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-5">

            {error}

          </div>

        )}


        {/* ======================================
            REGISTER USER
        ====================================== */}

        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-5">

            Register New User

          </h2>


          <form onSubmit={registerUser}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* USER NAME */}

              <div>

                <label className="block mb-2 font-medium">

                  User Name

                </label>

                <input

                  type="text"

                  value={userName}

                  onChange={(e) =>
                    setUserName(
                      e.target.value
                    )
                  }

                  placeholder="Enter user name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="block mb-2 font-medium">

                  Email

                </label>

                <input

                  type="email"

                  value={email}

                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }

                  placeholder="Enter email"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PASSWORD */}

              <div>

                <label className="block mb-2 font-medium">

                  Password

                </label>

                <input

                  type="password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  placeholder="Enter password"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* PHONE */}

              <div>

                <label className="block mb-2 font-medium">

                  Phone Number

                </label>

                <input

                  type="text"

                  value={phoneNo}

                  onChange={(e) =>
                    setPhoneNo(
                      e.target.value
                    )
                  }

                  placeholder="Enter phone number"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* DESIGNATION */}

              <div>

                <label className="block mb-2 font-medium">

                  Designation

                </label>

                <input

                  type="text"

                  value={designation}

                  onChange={(e) =>
                    setDesignation(
                      e.target.value
                    )
                  }

                  placeholder="Enter designation"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* DEPARTMENT */}

              <div>

                <label className="block mb-2 font-medium">

                  Department ID

                </label>

                <input

                  type="number"

                  value={departmentId}

                  onChange={(e) =>
                    setDepartmentId(
                      e.target.value
                    )
                  }

                  placeholder="Enter department ID"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


            </div>


            {/* SUBMIT */}

            <div className="mt-6">

              <button

                type="submit"

                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"

              >

                <UserPlus size={18} />

                Register User

              </button>

            </div>

          </form>

        </div>


        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="relative">

            <Search

              size={20}

              className="absolute left-3 top-3 text-gray-400"

            />

            <input

              type="text"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              placeholder="Search user by name, email or designation..."

              className="w-full border rounded-lg pl-10 pr-4 py-3"

            />

          </div>

        </div>


        {/* ======================================
            USERS TABLE
        ====================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">

              Loading users...

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No users found.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      ID
                    </th>

                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-left">
                      Phone
                    </th>

                    <th className="p-4 text-left">
                      Designation
                    </th>

                    <th className="p-4 text-left">
                      Department
                    </th>

                    <th className="p-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(

                    (user) => (

                      <tr

                        key={user.user_id}

                        className="border-t hover:bg-gray-50"

                      >

                        <td className="p-4">

                          {user.user_id}

                        </td>


                        <td className="p-4 font-medium">

                          {user.user_name}

                        </td>


                        <td className="p-4">

                          {user.email}

                        </td>


                        <td className="p-4">

                          {user.user_phoneno}

                        </td>


                        <td className="p-4">

                          {user.designation}

                        </td>


                        <td className="p-4">

                          {user.department
                            ?.department_name ||
                            user.department
                              ?.departmentId ||
                            "N/A"}

                        </td>


                        <td className="p-4">

                          <div className="flex justify-center">


                            {/* DELETE */}

                            <button

                              onClick={() =>
                                deleteUser(
                                  user.user_id
                                )
                              }

                              className="text-red-600 p-2 hover:bg-red-50 rounded-lg"

                            >

                              <Trash2 size={18} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );
}