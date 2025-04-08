import { useState, useEffect } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import loginService from "../services/login";

const CreateBlog = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({});

  const handleNewBlog = async (event) => {
    event.preventDefault();

    createBlog(newBlog);
  };

  return (
    <div>
      <h2>Create new</h2>
      <form className="form" onSubmit={handleNewBlog}>
        <div>
          Title:
          <input
            data-testid="title"
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
            data-testid="author"
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
            data-testid="url"
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>
        <button className="submitButton" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
