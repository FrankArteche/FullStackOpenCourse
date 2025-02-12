import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, onLike }) => {
  const [viewDetails, setViewDetails] = useState(false);

  const handleLikeButton = () => {
    blogService
      .update({ ...blog, likes: blog.likes + 1 })
      .then((updatedBlog) => {
        console.log('Blog actualizado:', updatedBlog);

        onLike(updatedBlog);
      });
  };

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
                <button onClick={handleLikeButton}>like</button>
              </div>
              <div>{blog.user.name}</div>
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

export default Blog;
