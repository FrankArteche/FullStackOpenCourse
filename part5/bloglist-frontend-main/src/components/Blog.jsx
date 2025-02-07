import { useState } from "react";

const Blog = ({ blog }) => {
  const [viewDetails, setViewDetails] = useState(false);

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
              <div>likes {blog.likes} <button>like</button></div>
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
