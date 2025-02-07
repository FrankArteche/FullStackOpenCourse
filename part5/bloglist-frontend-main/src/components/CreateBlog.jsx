import { useState, useEffect } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import loginService from "../services/login";

const CreateBlog = ({
  setNotification,
  createBlog
}) => {

  const [newBlog, setNewBlog] = useState({});

  const handleNewBlog = async (event) => {
    event.preventDefault();

    createBlog(newBlog)
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
