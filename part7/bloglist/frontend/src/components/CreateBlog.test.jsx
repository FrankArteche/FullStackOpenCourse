import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlog from "./CreateBlog";

test("Form calls the event handler it receives", async () => {
  const mockHandler = vi.fn();

  const { container } = render(<CreateBlog createBlog={mockHandler} />);
  const user = userEvent.setup();

  const submitButton = container.querySelector(".submitButton");
  await user.click(submitButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
