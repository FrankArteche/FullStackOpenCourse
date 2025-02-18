import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Toggable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });  

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      await blogService.create(blogObject).then((response) => {
        setBlogs(blogs.concat(response));
      });
      setNotification({
        type: "success",
        message: `A new Blog called ${blogObject.title} by ${blogObject.author} has been added`,
      });
      setTimeout(() => {
        setNotification({
          type: "",
          message: "",
        });
      }, 5000);
    } catch (error) {
      console.log(error);

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

  const handleLikeButton = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const loginForm = () => (
    <>
      <h1>Login to application</h1>
      {notification.message.length > 0 && (
        <div className={notification.type == "success" ? "success" : "error"}>
          {notification.message}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const handleError = (error) => {
    setNotification({
      type: "error",
      message: `An error occurred:  ${error.response.data.error}`,
    });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    window.location.reload();
  };  

  const blogsRenderer = () => (
    <>
      <h2>blogs</h2>
      {notification.message.length > 0 && (
        <div className={notification.type == "success" ? "success" : "error"}>
          {notification.message}
        </div>
      )}

      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog setNotification={setNotification} createBlog={addBlog}/>
      </Togglable>
      {blogs
        .sort((a, b) => {
          if (a.likes < b.likes) {
            return 1;
          }
          if (a.likes > b.likes) {
            return -1;
          }
          return 0;
        })
        .map((blog) => {
          let isSameCreator = blog.user.username == user.username

          
          return (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLikeButton}
            onError={handleError}
            canDelete={isSameCreator}
          />
        )
        }
      )
        }
    </>
  );

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return <div>{user === null ? loginForm() : blogsRenderer()}</div>;
};

export default App;
