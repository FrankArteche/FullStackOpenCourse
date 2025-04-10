import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog, user }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const canDelete =
    blog.user.username === user?.username || blog.user === user?.id;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!isDeleted) {
    return (
      <div style={blogStyle} data-testid="blogCard">
        <div>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
          <div style={{ display: "flex" }}></div>
        </div>
      </div>
    );
  }
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
export default Blog;
