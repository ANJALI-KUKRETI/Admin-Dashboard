import React from "react";
import addBlog from "../assets/AddBlog.png";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../assets/FIlter.png";
import DemoBlog from "../assets/DemoBlog.png";
import { showBlogModal } from "../reducers/modalSlice";
import "./BlogsBlock.css";

const BlogsBlock = () => {
  const dispatch = useDispatch();
  const showModalHandler = () => {
    dispatch(showBlogModal());
  };
  return (
    <div className="block">
      <div className="addBlogs">
        <div className="btnsB">
          <div></div>
          <div className="btnsOnRight">
            <div className="filterBtn">
              <div> Filters..</div>{" "}
              <div>
                <img src={Filter} alt="fil" />
              </div>
            </div>
            <div className="blogBtn" onClick={showModalHandler}>
              <img src={addBlog} alt="btn" />
            </div>
          </div>
        </div>
        <div className="blogHeaders">
          <div className="blogH">Blog</div>
          <div className="titleH">Title</div>
          <div className="timeH">Time</div>
          <div className="viewH">View</div>
          <div className="authorH">Author</div>
          <div className="actionH">Action</div>
        </div>
        <div className="blogData">
          <div className="dataB">
            <div className="blogImage">
              <img src={DemoBlog} alt="dem" />
            </div>
            <div className="blogTitle">StoreHouse24..</div>
            <div className="blogTime">19 Mar 2022</div>
            <div className="blogView">200</div>
            <div className="blogAuthor">Priyanka</div>
            <div className="blogAction">
              <div className="btns">
                <button className="edit">Edit</button>
                <button className="disable">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsBlock;
