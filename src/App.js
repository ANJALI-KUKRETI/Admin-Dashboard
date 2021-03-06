import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Form from "./components/Form";
import { Routes, Route, NavLink } from "react-router-dom";
import CategoryBlock from "./components/CategoryBlock";
import BlogsBlock from "./components/BlogsBlock";
import Header from "./components/Header";
import BlogForm from "./components/BlogForm";
import FilterModal from "./components/FilterModal";

function App() {
  const modal = useSelector((state) => state.modal.modal);
  const blogModal = useSelector((state) => state.modal.blogModal);
  const filterModal = useSelector((state) => state.modal.filterModal);

  return (
    <div className="App">
      {modal && <Form />}
      {blogModal && <BlogForm />}
      {filterModal && <FilterModal />}
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
          <Route path="/" element={<CategoryBlock />} />
          <Route path="blogs" element={<BlogsBlock />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
