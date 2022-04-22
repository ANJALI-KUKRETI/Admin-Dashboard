import React, { useEffect } from "react";
import addBlog from "../assets/AddBlog.png";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../assets/FIlter.png";
import { v4 as uuidv4 } from "uuid";
import {
  showBlogModal,
  showEditBlogModal,
  showFilterModal,
} from "../reducers/modalSlice";
import "./BlogsBlock.css";
import { deleteBlog, getPreStoredBlogs } from "../reducers/blogsSlice";

const BlogsBlock = () => {
  const dispatch = useDispatch();
  const initials = useSelector((state) => state.blogs.initialBlogs);
  const status = useSelector((state) => state.blogs.status);
  const error = useSelector((state) => state.categories.error);
  const showModalHandler = () => {
    dispatch(showBlogModal());
  };
  const showFilterModalHandler = () => {
    dispatch(showFilterModal());
  };
  useEffect(() => {
    dispatch(getPreStoredBlogs());
  }, [dispatch]);

  const deleteBlogHandler = (id) => {
    dispatch(deleteBlog(id));
  };

  const showEditBlogModalHandler = (initial) => {
    dispatch(showEditBlogModal(initial));
  };

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  }

  return (
    <div className="block">
      <div className="addBlogs">
        <div className="btnsB">
          <div></div>
          <div className="btnsOnRight">
            <div className="filterBtn" onClick={showFilterModalHandler}>
              <div> Filters..</div>
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
        {initials.length === 0 && status === "idle" && (
          <div style={{ textAlign: "center" }}>No Blogs Found!</div>
        )}
        {status === "idle" && error && (
          <div style={{ textAlign: "center", color: "red" }}>{error}</div>
        )}
        {status === "loading" && (
          <div style={{ textAlign: "center" }}>Loading...</div>
        )}

        <div className="blogData">
          {status === "idle" &&
            initials.map((initial) => (
              <div className="dataB" key={uuidv4()}>
                <div className="blogImage">
                  <img src={initial.titleImage} alt="dem" />
                </div>
                <div className="blogTitle">{truncate(initial.title, 15)}</div>
                <div className="blogTime">{initial.date}</div>
                <div className="blogView">200</div>
                <div className="blogAuthor">{initial.author}</div>
                <div className="blogAction">
                  <div className="btns">
                    <button
                      className="edit"
                      onClick={() => showEditBlogModalHandler(initial)}
                    >
                      Edit
                    </button>
                    <button
                      className="disable"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteBlogHandler(initial.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsBlock;
