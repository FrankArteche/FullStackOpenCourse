import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onError, canDelete }) => {
  const [viewDetails, setViewDetails] = useState(false);

  const handleLikeButton = () => {
    blogService
      .update({ ...blog, likes: blog.likes + 1 })
      .then((updatedBlog) => {
        console.log("Blog actualizado:", updatedBlog);
        onLike(updatedBlog);
      })
      .catch((error) => onError(error));
  };  

  const handleDelete = () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      blogService.deleteBlog(blog)
    } 
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <div style={{ display: "flex" }}>
          {viewDetails && (
            <div style={{ display: "grid" }}>
              <div>{blog.url}</div>
              <div>
                likes {blog.likes}{" "}
                <button className="likeButton" onClick={handleLikeButton}>like</button>
              </div>
              <div>{blog.user.name}</div>
              {canDelete && (
                <button onClick={handleDelete} style={{ background: "#7b7bff", borderRadius: "5px" }}>
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <button onClick={() => setViewDetails(!viewDetails)}>
          {viewDetails ? "hide" : "view"}
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
}
export default Blog;
