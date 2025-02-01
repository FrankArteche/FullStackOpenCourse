import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newBlog, setNewBlog] = useState({});
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {};

    blogService.create(blogObject).then((response) => {
      setBlogs(blogs.concat(response));
      setNewBlog("");
    });
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
      <CreateBlog
        setNewBlog={setNewBlog}
        newBlog={newBlog}
        setNotification={setNotification}
        setBlogs={setBlogs}
        blogs={blogs}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
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
