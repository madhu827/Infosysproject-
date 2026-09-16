import React, {
  useState
} from "react";

import {
  FolderTree,
  Plus,
  Tag,
  MoreHorizontal,
  Package
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import "../css/manager/Categories.css";

const initialCategories = [

  {
    name: "IT Equipment",
    count: 86,
    color: "blue"
  },

  {
    name: "Office Furniture",
    count: 42,
    color: "purple"
  },

  {
    name: "Networking",
    count: 31,
    color: "green"
  },

  {
    name: "Stationery",
    count: 67,
    color: "orange"
  },

  {
    name: "Infrastructure",
    count: 24,
    color: "red"
  }

];

export default function Category() {

  const [
    categories,
    setCategories
  ] = useState(
    initialCategories
  );

  const [
    name,
    setName
  ] = useState("");

  function addCategory(e) {

    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setCategories([

      ...categories,

      {
        name:
          name.trim(),

        count:
          0,

        color:
          "blue"
      }

    ]);

    setName("");

  }

  return (

    <DashboardLayout>

      <div className="hero-heading">

        <div>

          <span className="eyebrow">
            CATALOG
          </span>

          <h1>
            Categories
          </h1>

          <p>
            Organize your procurement catalog.
          </p>

        </div>

      </div>

      <div className="category-layout">

        <section className="panel category-create">

          <div className="category-create-icon">
            <FolderTree size={22}/>
          </div>

          <span className="eyebrow">
            NEW CATEGORY
          </span>

          <h3>
            Create category
          </h3>

          <p>
            Add categories to make products easier to discover.
          </p>

          <form
            onSubmit={addCategory}
          >

            <input
              className="form-input"
              value={name}
              onChange={e =>
                setName(
                  e.target.value
                )
              }
              placeholder=
                "Category name"
            />

            <button
              className="primary-button full"
            >

              <Plus size={16}/>

              Add category

            </button>

          </form>

        </section>

        <section className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Catalog categories
              </h3>

              <p>
                {categories.length} active categories
              </p>

            </div>

          </div>

          <div className="categories-grid">

            {categories.map(
              category => (

                <div
                  className="category-card"
                  key={category.name}
                >

                  <div
                    className={`category-icon ${category.color}`}
                  >
                    <Tag size={17}/>
                  </div>

                  <div className="category-content">

                    <strong>
                      {category.name}
                    </strong>

                    <span>

                      <Package size={12}/>

                      {category.count}
                      {" "}
                      products

                    </span>

                  </div>

                  <button className="category-menu">
                    <MoreHorizontal size={17}/>
                  </button>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </DashboardLayout>

  );

}