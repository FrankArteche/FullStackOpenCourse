import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Toggable";
import { initializeBlogs } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { notificationChange } from "./reducers/notificationReducer";
import { createBlog, likeBlog } from "./reducers/blogReducer";
import { setUser as setUserRedux, logoutUser } from "./reducers/userReducer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios.get("/api/users").then((response) => {
      setUsers(response.data);
    });
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <h2>Users</h2>
      <div>
        Blogs created
        {users.map((user) => {
          console.log(user);

          return (
            <div key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
              <p>{user.blogs.length}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", blogs: [] });

  const getUser = () => {
    axios.get(`/api/users/${id}`).then((response) => {
      setUser(response.data);
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </>
  );
};

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // const [notification, setNotification] = useState({
  //   type: "",
  //   message: "",
  // });

  const notification = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(initializeBlogs());
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
      dispatch(setUserRedux(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(
        notificationChange({
          type: "error",
          message: `An error occurred:  ${error.response.data.error}`,
        }),
      );
      setTimeout(() => {
        dispatch(
          notificationChange({
            type: "",
            message: "",
          }),
        );
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      await blogService.create(blogObject).then((response) => {
        dispatch(createBlog(response));
        // setBlogs((prevBlogs) => prevBlogs.concat(response));
      });
      dispatch(
        notificationChange({
          type: "success",
          message: `A new Blog called ${blogObject.title} by ${blogObject.author} has been added`,
        }),
      );
      setTimeout(() => {
        dispatch(
          notificationChange({
            type: "",
            message: "",
          }),
        );
      }, 5000);
    } catch (error) {
      console.log(error);
      dispatch(
        notificationChange({
          type: "error",
          message: `An error occurred:  ${error.response.data.error}`,
        }),
      );
      setTimeout(() => {
        dispatch(
          notificationChange({
            type: "",
            message: "",
          }),
        );
      }, 5000);
    }
  };

  const handleLikeButton = (updatedBlog) => {
    dispatch(likeBlog(updatedBlog.id));
    // setBlogs(
    //   blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
    // );
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
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
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
    console.log(error);

    dispatch(
      notificationChange({
        type: "error",
        message: `An error occurred:  ${error.response.data.error}`,
      }),
    );
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    window.location.reload();
    dispatch(logoutUser());
  };

  const blogsRenderer = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog createBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => {
          return (
            <Blog
              key={blog.id}
              blog={blog}
              onLike={handleLikeButton}
              onError={handleError}
              user={user}
            />
          );
        })}
    </>
  );

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      dispatch(setUserRedux(user));
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <h2>blogs</h2>
      {notification.message.length > 0 && (
        <div className={notification.type == "success" ? "success" : "error"}>
          {notification.message}
        </div>
      )}

      {user && (
        <div>
          {user?.username} logged in
          <button onClick={handleLogout}>logout</button>
        </div>
      )}
      {!user && loginForm()}
      <Router>
        <Routes>
          <Route path="/" element={blogsRenderer()} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<SingleUser />} />
        </Routes>
      </Router>
      {/* {user === null ? loginForm() : blogsRenderer()} */}
    </div>
  );
};

export default App;
