import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import blogService from "../services/blogs";
import { notificationChange } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";

const SingleBlog = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [blog, setBlog] = useState({});

  const getBlog = () => {
    if (id === undefined) return;
    axios.get(`/api/blogs/${id}`).then((response) => {
      setBlog(response.data);
      axios.get(`/api/users/${response.data.user}`).then((userResponse) => {
        setBlog((prev) => ({ ...prev, user: userResponse.data }));
      });
    });
  };
  const handleLikeButton = () => {
    blogService
      .update({ ...blog, likes: blog.likes + 1 })
      .then((updatedBlog) => {
        getBlog();
      })
      .catch((error) => handleError(error));
  };

  const handleError = (error) => {
    console.log(error);

    dispatch(
      notificationChange({
        type: "error",
        message: `An error occurred:  ${error.response.data.error}`,
      }),
    );
  };
  useEffect(() => {
    getBlog();
  }, []);

  return (
    <>
      <h2>{blog.title}</h2>
      <h3>{blog.author}</h3>
      <a href={blog.url}>{blog.url}</a>
      <p>likes {blog.likes}</p>{" "}
      <button className="likeButton" onClick={handleLikeButton}>
        like
      </button>
      <p>added by {blog.user?.name || blog.user?.username}</p>
    </>
  );
};

export default SingleBlog;
