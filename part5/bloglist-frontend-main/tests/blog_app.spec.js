const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:5173/api/testing/reset");
    await request.post("http://localhost:5173/api/users", {
      data: {
        name: "Franco Arteche",
        username: "Frankito",
        password: "1234",
      },
    });
    await request.post("http://localhost:5173/api/users", {
      data: {
        name: "fakeuser",
        username: "testuser",
        password: "pass",
      },
    });

    await page.goto("http://localhost:5173/");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "Frankito", "1234");

      await expect(page.getByText("blogs")).toBeVisible();
      await expect(page.getByText("Frankito logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "Frankito", "1234");

      await expect(page.getByText("blogs")).not.toBeVisible();
      await expect(page.getByText("Frankito logged in")).not.toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "Frankito", "1234");
      });

      test("a new blog can be created", async ({ page }) => {
        const newBlog = {
          title: "The Farm Rebellion",
          author: "Orwell",
          url: "www.asd.com",
        };

        await createBlog(page, newBlog);

        await expect(page.getByText("The Farm Rebellion Orwell")).toBeVisible();
      });

      describe("When new blog is created", () => {
        beforeEach(async ({ page }) => {
          const newBlog = {
            title: "The Farm Rebellion",
            author: "Orwell",
            url: "www.asd.com",
          };
          await createBlog(page, newBlog);
        });

        test("a blog can be liked", async ({ page }) => {
          await page.getByRole("button", { name: "view" }).click();

          await page.getByRole("button", { name: "like" }).click();

          await expect(page.getByText("likes 1")).toBeVisible();
        });

        test("a blog created by logged user can be deleted", async ({
          page,
        }) => {
          await page.getByRole("button", { name: "view" }).click();

          const blog = page.getByText("The Farm Rebellion Orwell");
          await expect(blog).toBeVisible();

          page.on("dialog", async (dialog) => {
            expect(dialog.message()).toContain("Remove blog");
            await dialog.accept();
          });

          await page.getByRole("button", { name: "Remove" }).click();

          await expect(blog).not.toBeVisible();
        });

        test("a blog created by another user cant be deleted", async ({
          page,
        }) => {
          await page.getByRole("button", { name: "logout" }).click();

          await loginWith(page, "testuser", "pass");

          await page.getByRole("button", { name: "view" }).click();

          await expect(
            page.getByRole("button", { name: "Remove" })
          ).toHaveCount(0);
        });

        test("the blogs are arranged in order according to likes", async ({
          page,
        }) => {
          const anotherBlog = {
            title: "More than a feeling",
            author: "Boston",
            url: "www.thisisasongactually.com",
          };
          console.log(page.content)

          await createBlog(page, anotherBlog);
          console.log(page.content)

          const firstBlog = await page.getByText("The Farm Rebellion Orwell");
          await expect(firstBlog).toBeVisible(); 

          const firstBlogLocator = firstBlog.locator("..");
          await firstBlogLocator.getByRole("button", { name: "view" }).click();

          const secondBlog = await page.getByText("More than a feeling Boston");
          await expect(secondBlog).toBeVisible();
          const secondBlogLocator = secondBlog.locator("..");
          await secondBlogLocator.getByRole("button", { name: "view" }).click();

          await secondBlogLocator.getByRole("button", { name: "like" }).click();
          await page.waitForTimeout(1000);

          const listOfBlogs = await page.getByTestId("blogCard");
          const firstBlogInTheList = await listOfBlogs
            .nth(0)
            .getByText("More than a feeling Boston");
          await expect(firstBlogInTheList).toBeVisible();
          await expect(firstBlog).toBeVisible();
        });
      });
    });
  });
});
