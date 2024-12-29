import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
const open = new Date().toLocaleString();

db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, title TEXT, body TEXT, time DATETIME DEFAULT CURRENT_TIMESTAMP)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)");

const router = new Router();

router
  .get('/', userList)
  .get('/:user/', list)
  .get('/:user/post/new', add)
  .get('/:user/post/:id', show)
  .get('/register', register)
  .post('/register/new_user', register_user)
  .post('/:user/post/', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) 
{
  let list1 = []

  for (const [id, user, title, body, time] of db.query(sql)) 
  {
    list1.push({id, user, title, body, time});
  }

  return list1;
}

async function userList(ctx)
{
  let users = query("SELECT user FROM users");
  ctx.response.body = await render.userList(users);
}

async function list(ctx) 
{
  const p_user = ctx.params.user.trim();
  let posts = query(`SELECT id, user, title, body, time FROM posts WHERE user = '${p_user}'`);
  let post_count = query(`SELECT COUNT(*) as postCount FROM posts WHERE user = '${p_user}'`);
  ctx.response.body = await render.list(posts, post_count,p_user);
  
}

async function add(ctx) 
{
  const p_user = ctx.params.user.trim();
  ctx.response.body = await render.newPost(p_user);
}

async function show(ctx) 
{
  const pid = ctx.params.id;
  console.log("pid=" , pid);
  let posts = query(`SELECT id, user, title, body, time FROM posts WHERE id= ${pid}`)
  let post = posts[0]
  console.log('show:post=', posts)
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

async function register(ctx)
{
  ctx.response.body = await render.user_register(); 
}

async function register_user(ctx) 
{
  const body = ctx.request.body;

  if (body.type() === "form")
  {
    const pairs = await body.form()
    const user = {}

    for (const [key, value] of pairs) 
    {
      user[key] = value
    }

    console.log("new user:", user);

    db.query("INSERT INTO users (user) VALUES (?)", [user.register_user]);

    ctx.response.redirect(`/${user.register_user}/`);
  } 
  else 
  {
    ctx.response.status = 400;
    ctx.response.body = "Expected form data.";
  }
}


async function create(ctx) 
{
  const body = ctx.request.body;
  const p_user = ctx.params.user;
  const create_time = new Date().toLocaleString();
  if (body.type() === "form") 
  {
    const pairs = await body.form()
    const post = {}

    for (const [key, value] of pairs) 
    {
      post[key] = value
    }

    console.log('create:post=', post)
    db.query("INSERT INTO posts (user, title, body, time) VALUES (?, ?, ?, ?)", [p_user, post.title, post.body, create_time]);
    ctx.response.redirect(`/${p_user}/`);
  }
}

console.log(`Server run at http://127.0.0.1:8000`)
await app.listen({ port:8000 });
