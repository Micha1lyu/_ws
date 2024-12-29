export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #fce4ec; /* Pink background */
        color: #333;
        padding: 20px;
      }
      h1 { font-size: 24px; }
      p { font-size: 16px; }
      input, textarea {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
      }
      button {
        padding: 10px 20px;
        background-color: #e91e63;
        color: white;
        border: none;
        cursor: pointer;
      }
      ul { list-style: none; padding: 0; }
      li { margin: 10px 0; }
    </style>
  </head>
  <body>
    ${content}
  </body>
  </html>`;
}

export function signupUi() {
  return layout("Sign Up", `
    <h1>Create an Account</h1>
    <form method="post">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input type="email" name="email" placeholder="Email" required><br>
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <a href="/login" style="color: black; text-decoration: underline; font-style: italic;">Log in here</a>.</p>
  `);
}

export function loginUi() {
  return layout("Log In", `
    <h1>Log In</h1>
    <form method="post">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Log In</button>
    </form>
    <p>Don't have an account? <a href="/signup" style="color: black; text-decoration: underline; font-style: italic;">Create one here</a>.</p>
  `);
}

export function success(message) {
  return layout("Success", `<h1>${message}</h1><p><a href="/login" style="color: black; text-decoration: underline; font-style: italic;">Go to Login</a></p>`);
}

export function fail(message) {
  return layout("Failure", `<h1>${message}</h1><p><a href="javascript:history.back()">Go Back</a></p>`);
}

export function list(posts, user) {
  const postItems = posts.map(
    (post) =>
      `<li>
        <h2>${post.title} by <span style="font-weight: bold; color: black;">${post.username}</span></h2>
        <p><a href="/post/${post.id}" style="color: black; text-decoration: underline; font-style: italic;">Read Post</a></p>
      </li>`
  ).join("");

  const userOptions = user
    ? `
      <p>Welcome, ${user.username}!</p>
      <p>
        <a href="/post/new" style="color: black; text-decoration: underline; font-style: italic;">Create a Post</a> |
        <a href="/logout" style="color: black; text-decoration: underline; font-style: italic;">Logout</a>
      </p>`
    : `<p><a href="/login" style="color: black; text-decoration: underline; font-style: italic;">Log in</a> to create a post.</p>`;

  return layout(
    "Posts",
    `
    <h1>All Posts</h1>
    ${userOptions}
    <ul>${postItems}</ul>`
  );
}

export function listUserPosts(posts, username, currentUser) {
  const postItems = posts.map(
    (post) => `<li><h2>${post.title} by ${post.username}</h2><p>${post.body}</p></li>`
  ).join("");
  return layout(
    `${username}'s Posts`,
    `
    <h1>Posts by ${username}</h1>
    <ul>${postItems}</ul>`
  );
}

export function newPost() {
  return layout("New Post", `
    <h1>Create a New Post</h1>
    <form method="post" action="/post">
      <input type="text" name="title" placeholder="Title" required><br>
      <textarea name="body" placeholder="Content" required></textarea><br>
      <button type="submit">Create</button>
    </form>
  `);
}

export function show(post) {
  return layout(post.title, `
    <h1>${post.title}</h1>
    <h3>by <span style="font-weight: bold; color: black;">${post.username}</span></h3>
    <p>${post.body}</p>
    <p><a href="/" style="color: black; text-decoration: underline; font-style: italic;">Back to Posts</a></p>
  `);
}
