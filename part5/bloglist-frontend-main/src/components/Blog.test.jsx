import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blogs title and author but not URL or likes", async () => {
  const blog = {
    title: "Testing is kinda a pain in the a**",
    author: "A man named Jerry",
    url: "mockupurl.com",
    likes: 1,
  };

  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      onLike={mockHandler}
      onError={mockHandler}
      canDelete={false}
    />
  );

  const title = screen.getByText("Testing is kinda a pain in the a**", {
    exact: false,
  });
  const author = screen.getByText("A man named Jerry", { exact: false });

  const url = screen.queryByText("mockupurl.com");

  const likes = screen.queryByText(1);

  expect(title).toBeDefined();
  expect(author).toBeDefined();

  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test("URL and likes are not shown until button has been clicked", async () => {
  const blog = {
    title: "Testing is kinda a pain in the a**",
    author: "A man named Jerry",
    url: "mockupurl.com",
    likes: 1,
    user: {
        name: "Frank"
    }
  };

  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      onLike={mockHandler}
      onError={mockHandler}
      canDelete={false}
    />
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const url = screen.queryByText("mockupurl.com");

  const likes = screen.queryByText(1);

  expect(likes).toBeDefined();
  expect(url).toBeDefined();
});

test("like button receives two calls", async () => {
    const blog = {
      title: "Testing is kinda a pain in the a**",
      author: "A man named Jerry",
      url: "mockupurl.com",
      likes: 1,
      user: {
          name: "Frank"
      }
    };
  
    const mockHandler = vi.fn();
  
    const {container} = render(
      <Blog
        blog={blog}
        onLike={mockHandler}
        onError={mockHandler}
        canDelete={false}
      />
    );
  
    const user = userEvent.setup();

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = container.querySelector('.likeButton')
    screen.debug(likeButton)
    await user.click(likeButton);
    await user.click(likeButton);
  
    expect(mockHandler.mock.calls).toHaveLength(2)
});
  