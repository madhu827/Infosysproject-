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

export default function Categories() {

  const BASE_URL = "http://localhost:8081";

  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");

  const [departmentId, setDepartmentId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ==========================================
  // GET ALL CATEGORIES
  // URL:
  // http://localhost:8081/category
  // ==========================================

  const getAllCategories = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/category`
      );

      setCategories(response.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load categories");

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // GET CATEGORIES BY DEPARTMENT
  // URL:
  // http://localhost:8081/category/{departmentId}
  // ==========================================

  const getCategoriesByDepartment = async () => {

    if (!departmentId) {

      getAllCategories();

      return;

    }

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/category/${departmentId}`
      );

      setCategories(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load categories for department"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CREATE CATEGORY
  // URL:
  // POST http://localhost:8081/category
  // ==========================================

  const createCategory = async (e) => {

    e.preventDefault();

    try {

      const category = {

        category_name: categoryName,

        department: {

          departmentId: Number(departmentId)

        }

      };

      await axios.post(
        `${BASE_URL}/category`,
        category
      );

      alert("Category created successfully");

      setCategoryName("");

      setDepartmentId("");

      getAllCategories();

    } catch (error) {

      console.error(error);

      setError("Failed to create category");

    }

  };


  // ==========================================
  // UPDATE CATEGORY
  // URL:
  // PUT http://localhost:8081/category/{id}
  // ==========================================

  const updateCategory = async (e) => {

    e.preventDefault();

    try {

      const category = {

        category_name: categoryName,

        department: {

          departmentId: Number(departmentId)

        }

      };

      await axios.put(
        `${BASE_URL}/category/${editingId}`,
        category
      );

      alert("Category updated successfully");

      setEditingId(null);

      setCategoryName("");

      setDepartmentId("");

      getAllCategories();

    } catch (error) {

      console.error(error);

      setError("Failed to update category");

    }

  };


  // ==========================================
  // DELETE CATEGORY
  // URL:
  // DELETE http://localhost:8081/category/{id}
  // ==========================================

  const deleteCategory = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {

      return;

    }

    try {

      await axios.delete(
        `${BASE_URL}/category/${id}`
      );

      alert("Category deleted successfully");

      getAllCategories();

    } catch (error) {

      console.error(error);

      setError("Failed to delete category");

    }

  };


  // ==========================================
  // EDIT
  // ==========================================

  const editCategory = (category) => {

    setEditingId(category.category_id);

    setCategoryName(category.category_name);

    setDepartmentId(
      category.department?.departmentId || ""
    );

  };


  // ==========================================
  // CANCEL
  // ==========================================

  const cancelEdit = () => {

    setEditingId(null);

    setCategoryName("");

    setDepartmentId("");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCategories =
    categories.filter((category) =>
      category.category_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );


  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {

    getAllCategories();

  }, []);


  // ==========================================
  // REACT UI
  // ==========================================

  return (

    <DashboardLayout>

      <div className="p-6">

        {/* HEADER */}

        <div className="flex justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">

              Category Management

            </h1>

            <p className="text-gray-500">

              Manage your product categories

            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">

            {error}

          </div>

        )}


        {/* FORM */}

        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-4">

            {editingId
              ? "Update Category"
              : "Add Category"}

          </h2>


          <form
            onSubmit={
              editingId
                ? updateCategory
                : createCategory
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              {/* CATEGORY NAME */}

              <div>

                <label className="block mb-2">

                  Category Name

                </label>

                <input

                  type="text"

                  value={categoryName}

                  onChange={(e) =>
                    setCategoryName(e.target.value)
                  }

                  placeholder="Enter category name"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* DEPARTMENT ID */}

              <div>

                <label className="block mb-2">

                  Department ID

                </label>

                <input

                  type="number"

                  value={departmentId}

                  onChange={(e) =>
                    setDepartmentId(e.target.value)
                  }

                  placeholder="Enter department ID"

                  className="w-full border rounded-lg px-4 py-3"

                  required

                />

              </div>


              {/* BUTTON */}

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


        {/* SEARCH */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="flex gap-3">

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input

                type="text"

                placeholder="Search category..."

                value={search}

                onChange={(e) =>
                  setSearch(e.target.value)
                }

                className="w-full border rounded-lg pl-10 pr-4 py-3"

              />

            </div>


            <input

              type="number"

              placeholder="Department ID"

              value={departmentId}

              onChange={(e) =>
                setDepartmentId(e.target.value)
              }

              className="border rounded-lg px-4 py-3"

            />


            <button

              onClick={getCategoriesByDepartment}

              className="bg-gray-800 text-white px-5 rounded-lg"

            >

              Filter

            </button>


            <button

              onClick={getAllCategories}

              className="bg-gray-200 px-5 rounded-lg"

            >

              Reset

            </button>

          </div>

        </div>


        {/* TABLE */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">

              Loading...

            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Category
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

                {filteredCategories.map(
                  (category) => (

                    <tr
                      key={category.category_id}
                      className="border-t"
                    >

                      <td className="p-4">

                        {category.category_id}

                      </td>


                      <td className="p-4 font-medium">

                        {category.category_name}

                      </td>


                      <td className="p-4">

                        {category.department?.departmentId}

                      </td>


                      <td className="p-4">

                        <div className="flex justify-center gap-3">

                          <button

                            onClick={() =>
                              editCategory(category)
                            }

                            className="text-blue-600 p-2"

                          >

                            <Pencil size={18} />

                          </button>


                          <button

                            onClick={() =>
                              deleteCategory(
                                category.category_id
                              )
                            }

                            className="text-red-600 p-2"

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