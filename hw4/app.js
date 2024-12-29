import { Application, Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import * as render from "./render.js";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const router = new Router();

router.get("/", list)
  .get("/signup", signupUi)
  .post("/signup", signup)
  .get("/login", loginUi)
  .post("/login", login)
  .get("/logout", logout)
  .get("/post/new", add)
  .get("/post/:id", show)
  .post("/post", create)
  .get("/list/:user", listUserPosts);

const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

function sqlcmd(sql, args = []) {
  console.log("SQL:", sql, "ARGS:", args);
  return db.query(sql, args);
}

function fetchPosts(sql, args = []) {
  return sqlcmd(sql, args).map(([id, username, title, body]) => ({ id, username, title, body }));
}

function fetchUsers(sql, args = []) {
  return sqlcmd(sql, args).map(([id, username, password, email]) => ({ id, username, password, email }));
}

async function parseForm(ctx) {
  const body = ctx.request.body({ type: "form" });
  return Object.fromEntries(await body.value);
}

async function signupUi(ctx) {
  ctx.response.body = render.signupUi();
}

async function signup(ctx) {
  const form = await parseForm(ctx);
  const existingUsers = fetchUsers("SELECT * FROM users WHERE username = ?", [form.username]);
  if (existingUsers.length > 0) {
    ctx.response.body = render.fail("Username already exists. Please try again.");
  } else {
    sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [
      form.username,
      form.password,
      form.email,
    ]);
    ctx.response.body = render.success("Account created successfully! You can now log in.");
  }
}

async function loginUi(ctx) {
  ctx.response.body = render.loginUi();
}

async function login(ctx) {
  const form = await parseForm(ctx);
  const user = fetchUsers("SELECT * FROM users WHERE username = ? AND password = ?", [
    form.username,
    form.password,
  ])[0];
  if (user) {
    await ctx.state.session.set("user", user);
    ctx.response.redirect("/");
  } else {
    ctx.response.body = render.fail("Invalid username or password.");
  }
}

async function logout(ctx) {
  await ctx.state.session.set("user", null);
  ctx.response.redirect("/");
}

async function list(ctx) {
  const posts = fetchPosts("SELECT * FROM posts");
  const user = await ctx.state.session.get("user");
  ctx.response.body = render.list(posts, user);
}

async function listUserPosts(ctx) {
  const user = ctx.params.user;
  const posts = fetchPosts("SELECT * FROM posts WHERE username = ?", [user]);
  const currentUser = await ctx.state.session.get("user");
  ctx.response.body = render.listUserPosts(posts, user, currentUser);
}

async function add(ctx) {
  const user = await ctx.state.session.get("user");
  if (user) {
    ctx.response.body = render.newPost();
  } else {
    ctx.response.body = render.fail("You must be logged in to create a post.");
  }
}

async function show(ctx) {
  const id = ctx.params.id;
  const post = sqlcmd("SELECT * FROM posts WHERE id = ?", [id]).map(([id, username, title, body]) => ({
    id,
    username,
    title,
    body,
  }))[0];

  if (post) {
    ctx.response.body = render.show(post);
  } else {
    ctx.response.status = 404;
    ctx.response.body = render.fail("Post not found.");
  }
}

async function create(ctx) {
  const user = await ctx.state.session.get("user");
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const form = await parseForm(ctx);
  sqlcmd("INSERT INTO posts (username, title, body) VALUES (?, ?, ?)", [user.username, form.title, form.body]);
  ctx.response.redirect("/");
}

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
