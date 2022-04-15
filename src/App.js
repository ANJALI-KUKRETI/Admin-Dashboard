import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Form from "./components/Form";
import { Routes, Route, NavLink } from "react-router-dom";
import CategoryBlock from "./components/CategoryBlock";
import BlogsBlock from "./components/BlogsBlock";
import Header from "./components/Header";

function App() {
  const [category, setCategory] = useState("");
  const modal = useSelector((state) => state.modal.modal);
  const getCategory = (cat) => {
    setCategory(cat);
  };
  return (
    <div className="App">
      {modal && <Form category={category} />}
      <Header />
      <div className="main">
        <div className="categories-and-blogs">
          <div className="categories ">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Categories
            </NavLink>
          </div>

          <div className="blogs">
            <NavLink
              to="/blogs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Blogs
            </NavLink>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={<CategoryBlock getCategory={getCategory} />}
          />
          <Route path="blogs" element={<BlogsBlock />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
