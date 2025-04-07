const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const user = request.user
  if (!user.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const existingUser = await User.findById(user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: existingUser.id ? existingUser.id : existingUser._id,
  });

  const savedBlog = await blog.save();

  if (!existingUser.blogs) {
    existingUser.blogs = []; // Ensure blogs array exists
  }
  existingUser.blogs = existingUser.blogs.concat(savedBlog._id);

  await existingUser.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;

    if (!request.token) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = request.user    

    const blogCreator = await User.findById(user.id);
    const blogToDelete = await Blog.findById(id);

    if (!blogToDelete) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blogCreator._id.toString() !== blogToDelete.user.toString()) {
      return response.status(401).json({ error: "Only the user who created the blog can delete it." });
    }

    await Blog.deleteOne({ _id: id });

    response.status(204).end();
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    response.status(500).json({ error: "Something went wrong", details: error.message });
  }
});


blogsRouter.put("/:id", async (request, response) => {
  const { user, likes, author, title, url } = request.body;  

  const formattedBlog = {
    user: user.id,
    likes: likes,
    author: author,
    title: title,
    url: url
  }

  const authUser = request.user  

  if (!authUser.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // const authUser = request.user  

  // if (authUser.name != user.name){
  //   return response.status(401).json({ error: 'Only the authors of a post can edit them' })
  // }

  try {
    let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, formattedBlog, {
      new: true,
    });
    response.status(200).json(updatedBlog)
  } catch (error) {
    response.send(400).end();
  }
});

module.exports = blogsRouter;
