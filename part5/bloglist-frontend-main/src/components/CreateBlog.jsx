import { useState, useEffect } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import loginService from "../services/login";

const CreateBlog = ({
  setNewBlog,
  newBlog,
  setNotification,
  setBlogs,
  blogs,
}) => {
  const handleNewBlog = async (event) => {
    event.preventDefault();

    try {
      let updatedBlogs = [...blogs.concat(newBlog)];

      await blogService.create(newBlog);
      setBlogs(updatedBlogs);
      setNotification({
        type: "success",
        message: `A new Blog called ${newBlog.title} by ${newBlog.author} has been added`,
      });
      setTimeout(() => {
        setNotification({
          type: "",
          message: "",
        });
      }, 5000);
    } catch (error) {
      setNotification({
        type: "error",
        message: `An error occurred:  ${error.response.data.error}`,
      });      
      setTimeout(() => {
        setNotification({
          type: "",
          message: "",
        });
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newBlog.title}
            name="Title"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </div>
        <div>
          Author
          <input
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </div>
        <div>
          URL
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBlog;
