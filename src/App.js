import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Form from "./components/Form";
import CategoryBlock from "./components/CategoryBlock";
// import Form from "./components/Form";
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
          <div className="categories active">Categories</div>
          <div className="blogs">Blogs</div>
        </div>
        <CategoryBlock getCategory={getCategory} />
      </div>
    </div>
  );
}

export default App;
