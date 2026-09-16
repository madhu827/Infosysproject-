import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Departments() {

  // ==========================================
  // BACKEND URL
  // ==========================================

  const BASE_URL = "http://localhost:8081";


  // ==========================================
  // STATES
  // ==========================================

  const [departments, setDepartments] = useState([]);

  const [departmentName, setDepartmentName] = useState("");

  const [departmentManager, setDepartmentManager] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ==========================================
  // GET ALL DEPARTMENTS
  //
  // GET
  // http://localhost:8081/department
  // ==========================================

  const getAllDepartments = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await axios.get(
        `${BASE_URL}/department`
      );

      setDepartments(response.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load departments");

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // GET DEPARTMENT BY ID
  //
  // GET
  // http://localhost:8081/department/{id}
  // ==========================================

  const getDepartmentById = async (id) => {

    try {

      setError("");

      const response = await axios.get(
        `${BASE_URL}/department/${id}`
      );

      console.log(
        "Department:",
        response.data
      );

    } catch (error) {

      console.error(error);

      setError("Department not found");

    }
  };


  // ==========================================
  // CREATE DEPARTMENT
  //
  // POST
  // http://localhost:8081/department
  // ==========================================

  const createDepartment = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const department = {

        department_name: departmentName,

        department_manager: departmentManager

      };


      await axios.post(

        `${BASE_URL}/department`,

        department

      );


      alert(
        "Department created successfully"
      );


      // Clear form

      setDepartmentName("");

      setDepartmentManager("");


      // Reload departments

      getAllDepartments();

    } catch (error) {

      console.error(error);

      setError(
        "Failed to create department"
      );

    }
  };


  // ==========================================
  // UPDATE DEPARTMENT
  //
  // PUT
  // http://localhost:8081/department/{id}
  // ==========================================

  const updateDepartment = async (e) => {

    e.preventDefault();

    try {

      setError("");

      const department = {

        department_name: departmentName,

        department_manager: departmentManager

      };


      await axios.put(

        `${BASE_URL}/department/${editingId}`,

        department

      );


      alert(
        "Department updated successfully"
      );


      // Clear edit mode

      setEditingId(null);

      setDepartmentName("");

      setDepartmentManager("");


      // Reload

      getAllDepartments();

    } catch (error) {

      console.error(error);

      setError(
        "Failed to update department"
      );

    }
  };


  // ==========================================
  // DELETE DEPARTMENT
  //
  // DELETE
  // http://localhost:8081/department/{id}
  // ==========================================

  const deleteDepartment = async (id) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this department?"

    );


    if (!confirmDelete) {

      return;

    }


    try {

      setError("");

      await axios.delete(

        `${BASE_URL}/department/${id}`

      );


      alert(
        "Department deleted successfully"
      );


      getAllDepartments();

    } catch (error) {

      console.error(error);

      setError(
        "Failed to delete department"
      );

    }
  };


  // ==========================================
  // EDIT DEPARTMENT
  // ==========================================

  const editDepartment = (department) => {

    setEditingId(
      department.departmentId
    );


    setDepartmentName(
      department.department_name
    );


    setDepartmentManager(
      department.department_manager || ""
    );

  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {

    setEditingId(null);

    setDepartmentName("");

    setDepartmentManager("");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDepartments =
    departments.filter((department) =>

      department.department_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );


  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    getAllDepartments();

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

        <div className="flex justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">

              Department Management

            </h1>


            <p className="text-gray-500">

              Manage your organization departments

            </p>

          </div>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">

            {error}

          </div>

        )}


        {/* ======================================
            ADD / UPDATE FORM
        ====================================== */}

        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-4">

            {editingId

              ? "Update Department"

              : "Add Department"

            }

          </h2>


          <form

            onSubmit={

              editingId

                ? updateDepartment

                : createDepartment

            }

          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              {/* DEPARTMENT NAME */}

              <div>

                <label className="block mb-2 font-medium">

                  Department Name

                </label>


                <input

                  type="text"

                  value={departmentName}

                  onChange={(e) =>

                    setDepartmentName(
                      e.target.value
                    )

                  }

                  placeholder="Enter department name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* DEPARTMENT MANAGER */}

              <div>

                <label className="block mb-2 font-medium">

                  Department Manager

                </label>


                <input

                  type="text"

                  value={departmentManager}

                  onChange={(e) =>

                    setDepartmentManager(
                      e.target.value
                    )

                  }

                  placeholder="Enter manager name"

                  className="w-full border rounded-lg px-4 py-3"

                />

              </div>


              {/* BUTTONS */}

              <div className="flex items-end gap-2">


                <button

                  type="submit"

                  className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"

                >

                  {editingId ? (

                    <>

                      <Pencil size={18} />

                      Update

                    </>

                  ) : (

                    <>

                      <Plus size={18} />

                      Add

                    </>

                  )}

                </button>


                {editingId && (

                  <button

                    type="button"

                    onClick={cancelEdit}

                    className="bg-gray-300 px-5 py-3 rounded-lg flex items-center gap-2"

                  >

                    <X size={18} />

                    Cancel

                  </button>

                )}

              </div>

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

              placeholder="Search departments..."

              value={search}

              onChange={(e) =>

                setSearch(
                  e.target.value
                )

              }

              className="w-full border rounded-lg pl-10 pr-4 py-3"

            />

          </div>

        </div>


        {/* ======================================
            TABLE
        ====================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">


          {loading ? (

            <div className="p-10 text-center">

              Loading departments...

            </div>

          ) : filteredDepartments.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              No departments found.

            </div>

          ) : (

            <table className="w-full">


              {/* TABLE HEADER */}

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">

                    ID

                  </th>


                  <th className="p-4 text-left">

                    Department Name

                  </th>


                  <th className="p-4 text-left">

                    Manager

                  </th>


                  <th className="p-4 text-center">

                    Actions

                  </th>

                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody>

                {filteredDepartments.map(

                  (department) => (

                    <tr

                      key={
                        department.departmentId
                      }

                      className="border-t hover:bg-gray-50"

                    >


                      {/* ID */}

                      <td className="p-4">

                        {
                          department.departmentId
                        }

                      </td>


                      {/* NAME */}

                      <td className="p-4 font-medium">

                        {
                          department.department_name
                        }

                      </td>


                      {/* MANAGER */}

                      <td className="p-4">

                        {
                          department.department_manager
                            || "N/A"
                        }

                      </td>


                      {/* ACTIONS */}

                      <td className="p-4">

                        <div className="flex justify-center gap-3">


                          {/* EDIT */}

                          <button

                            onClick={() =>

                              editDepartment(
                                department
                              )

                            }

                            className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"

                          >

                            <Pencil size={18} />

                          </button>


                          {/* DELETE */}

                          <button

                            onClick={() =>

                              deleteDepartment(
                                department.departmentId
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

          )}

        </div>

      </div>

    </DashboardLayout>

  );

}